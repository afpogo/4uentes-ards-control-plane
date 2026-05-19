const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SERVICE_DIR = path.join(ROOT, 'catalog', 'services');
const SOLUTION_DIR = path.join(ROOT, 'solutions');
const INBOX_DIR = path.join(ROOT, 'requests', 'inbox');
const PLANNED_DIR = path.join(ROOT, 'requests', 'planned');
const ALLOWED_STATUSES = new Set(['inbox']);

const results = [];

function report(level, message) {
  results.push({ level, message });
  console.log(`${level}: ${message}`);
}

function usage() {
  console.error('Usage: node scripts/plan-change.js requests/inbox/<request>.yaml');
}

const requestArg = process.argv[2];
if (!requestArg || requestArg === '--help' || requestArg === '-h') {
  usage();
  process.exit(requestArg ? 0 : 1);
}

const requestPath = path.resolve(ROOT, requestArg);
const inboxRoot = path.resolve(INBOX_DIR);
if (!requestPath.startsWith(inboxRoot + path.sep)) {
  report('FAIL', 'Request must be under requests/inbox/');
  finish();
}

if (!fs.existsSync(requestPath)) {
  report('FAIL', `Request file not found: ${path.relative(ROOT, requestPath)}`);
  finish();
}

if (!fs.existsSync(PLANNED_DIR)) {
  report('FAIL', 'requests/planned/ does not exist');
  finish();
}

const services = loadCatalog();
const solutions = loadSolutions();
const request = parseRequest(read(requestPath));
const requestFileName = path.basename(requestPath);
const plannedPath = path.join(PLANNED_DIR, requestFileName);

if (!request.id) report('FAIL', 'Request missing id');
if (!request.title) report('FAIL', 'Request missing title');
if (!request.status) report('FAIL', 'Request missing status');
else if (!ALLOWED_STATUSES.has(request.status)) report('FAIL', `Request status must be inbox, got ${request.status}`);
if (!request.initialScope.solution && request.initialScope.services.length === 0) {
  report('FAIL', 'Request must declare initial_scope.solution or initial_scope.services');
}
if (fs.existsSync(plannedPath)) {
  report('FAIL', `Planned request already exists: ${path.relative(ROOT, plannedPath)}`);
}

const solution = request.initialScope.solution ? solutions.get(request.initialScope.solution) : null;
if (request.initialScope.solution && !solution) {
  report('FAIL', `Solution not found: ${request.initialScope.solution}`);
}

for (const serviceId of request.initialScope.services) {
  if (!services.has(serviceId)) report('FAIL', `Requested service not found: ${serviceId}`);
}

if (hasFailures()) finish();

const affected = resolveAffectedServices(request, solution, services);
const missingAffected = affected.filter((item) => !services.has(item.serviceId));
for (const item of missingAffected) {
  report('FAIL', `Affected service is not in catalog: ${item.serviceId}`);
}

if (hasFailures()) finish();

const affectedServices = affected.map((item) => {
  const service = services.get(item.serviceId);
  return {
    serviceId: item.serviceId,
    via: item.via,
    serviceKind: service.kind,
    ardsKind: service.ardsKind,
    status: service.status,
    checkCommand: service.checkCommand,
    workingTree: service.workingTree,
    bindingEvidence: service.bindingEvidence,
    serviceFile: service.file,
  };
});

const requiredContext = buildRequiredContext(request, solution, affectedServices);
const requiredChecks = buildRequiredChecks(affectedServices);
const risk = classifyRisk(affectedServices, requiredChecks);
const planned = renderPlannedRequest({
  sourceRequest: path.relative(ROOT, requestPath).replace(/\\/g, '/'),
  request,
  solution,
  affectedServices,
  requiredContext,
  requiredChecks,
  risk,
});

fs.writeFileSync(plannedPath, planned, 'utf8');
report('OK', `Planned request written: ${path.relative(ROOT, plannedPath)}`);
report('OK', `Affected services: ${affectedServices.map((item) => item.serviceId).join(', ')}`);
report('OK', `Risk: ${risk.level} (${risk.score})`);
finish();

function loadCatalog() {
  const catalog = new Map();
  for (const file of listYamlFiles(SERVICE_DIR)) {
    const text = read(file);
    const serviceId = topLevel(text, 'service_id');
    if (!serviceId) continue;
    catalog.set(serviceId, {
      serviceId,
      file: path.relative(ROOT, file).replace(/\\/g, '/'),
      canonicalIdentity: topLevel(text, 'canonical_identity'),
      kind: topLevel(text, 'kind'),
      status: topLevel(text, 'status'),
      repoRemote: nested(text, 'repo', 'remote'),
      ardsKind: nested(text, 'ards', 'kind'),
      checkCommand: nested(text, 'validation', 'check_command'),
      workingTree: nested(text, 'repo', 'working_tree_observed'),
      bindingEvidence: listBindingEvidence(text),
    });
  }
  report('OK', `Loaded ${catalog.size} services`);
  return catalog;
}

function loadSolutions() {
  const map = new Map();
  for (const file of listYamlFiles(SOLUTION_DIR)) {
    const text = read(file);
    const solutionId = topLevel(text, 'solution_id');
    if (!solutionId) continue;
    map.set(solutionId, {
      solutionId,
      file: path.relative(ROOT, file).replace(/\\/g, '/'),
      core: listInSolutionSection(text, 'core'),
      shared: listInSolutionSection(text, 'shared'),
      optional: listInSolutionSection(text, 'optional'),
      infrastructure: listInSolutionSection(text, 'infrastructure'),
    });
  }
  report('OK', `Loaded ${map.size} solutions`);
  return map;
}

function parseRequest(text) {
  return {
    id: topLevel(text, 'id') || topLevel(text, 'request_id'),
    title: topLevel(text, 'title'),
    status: topLevel(text, 'status'),
    requester: topLevel(text, 'requester') || topLevel(text, 'requested_by'),
    createdAt: topLevel(text, 'created_at'),
    initialScope: {
      solution: nested(text, 'initial_scope', 'solution') || nested(text, 'initial_scope', 'solution_id'),
      services: listNested(text, 'initial_scope', 'services') || listNested(text, 'initial_scope', 'service_ids'),
      includeOptionalServices: parseBoolean(nested(text, 'initial_scope', 'include_optional_services')),
    },
  };
}

function resolveAffectedServices(request, solution, services) {
  const seen = new Set();
  const affected = [];

  function add(serviceId, via) {
    if (!serviceId || seen.has(serviceId)) return;
    seen.add(serviceId);
    affected.push({ serviceId, via });
  }

  if (request.initialScope.services.length > 0) {
    for (const serviceId of request.initialScope.services) add(serviceId, 'initial_scope.services');
    return affected;
  }

  if (solution) {
    for (const serviceId of solution.core) add(serviceId, 'solution.core');
    for (const serviceId of solution.shared) add(serviceId, 'solution.shared');
    for (const serviceId of solution.infrastructure) add(serviceId, 'solution.infrastructure');
    if (request.initialScope.includeOptionalServices) {
      for (const serviceId of solution.optional) add(serviceId, 'solution.optional');
    }
  }

  return affected.filter((item) => services.has(item.serviceId));
}

function buildRequiredContext(request, solution, affectedServices) {
  const context = new Set();
  for (const service of affectedServices) {
    context.add(service.serviceFile);
    for (const evidence of service.bindingEvidence) {
      if (evidence.pathRecord) context.add(evidence.pathRecord);
    }
  }
  if (solution) context.add(solution.file);
  context.add('inventory/phase-0.md');
  context.add('inventory/phase-0-decision.md');
  context.add('AGENTS.md');
  return [...context];
}

function buildRequiredChecks(affectedServices) {
  return affectedServices.map((service) => {
    if (!service.checkCommand || service.checkCommand === 'TODO') {
      return { serviceId: service.serviceId, command: 'TODO', fallback: 'manual-review' };
    }
    return { serviceId: service.serviceId, command: service.checkCommand };
  });
}

function classifyRisk(affectedServices, requiredChecks) {
  const drivers = [];
  let score = 0;

  if (affectedServices.length > 2) {
    score += 2;
    drivers.push({ id: 'MULTI_SERVICE_SCOPE', severity: 'high' });
  } else if (affectedServices.length === 2) {
    score += 1;
    drivers.push({ id: 'TWO_SERVICE_SCOPE', severity: 'medium' });
  }

  for (const service of affectedServices) {
    if (service.ardsKind === 'shared-auth-provider') {
      score += 2;
      drivers.push({ id: 'SHARED_AUTH_PROVIDER', serviceId: service.serviceId, severity: 'high' });
    }
    if (service.ardsKind === 'infra-gitops') {
      score += 2;
      drivers.push({ id: 'INFRA_GITOPS_SCOPE', serviceId: service.serviceId, severity: 'high' });
    }
    if (service.status !== 'active') {
      score += 1;
      drivers.push({ id: 'NON_ACTIVE_SERVICE_STATUS', serviceId: service.serviceId, severity: 'medium' });
    }
    if (service.workingTree && service.workingTree !== 'clean') {
      score += 1;
      drivers.push({ id: 'DIRTY_WORKING_TREE_OBSERVED', serviceId: service.serviceId, severity: 'medium' });
    }
  }

  for (const check of requiredChecks) {
    if (check.command === 'TODO') {
      score += 2;
      drivers.push({ id: 'MISSING_CHECK_COMMAND', serviceId: check.serviceId, severity: 'high' });
    }
  }

  const level = score >= 4 ? 'high' : score >= 2 ? 'medium' : 'low';
  return { level, score, drivers };
}

function renderPlannedRequest(data) {
  const affectedKinds = unique(data.affectedServices.map((item) => item.ardsKind));
  const lines = [];
  lines.push('schema_version: "1.0"');
  lines.push('phase: 2');
  lines.push(`id: ${quote(data.request.id)}`);
  lines.push(`title: ${quote(data.request.title)}`);
  lines.push('status: planned');
  lines.push(`source_request: ${quote(data.sourceRequest)}`);
  lines.push(`created_at: ${quote(data.request.createdAt || 'TODO')}`);
  lines.push(`requester: ${quote(data.request.requester || 'TODO')}`);
  lines.push('');
  lines.push('initial_scope:');
  lines.push(`  solution: ${quote(data.request.initialScope.solution || 'TODO')}`);
  if (data.request.initialScope.services.length === 0) {
    lines.push('  services: []');
  } else {
    lines.push('  services:');
    for (const serviceId of data.request.initialScope.services) lines.push(`    - ${serviceId}`);
  }
  lines.push(`  include_optional_services: ${data.request.initialScope.includeOptionalServices ? 'true' : 'false'}`);
  lines.push('');
  lines.push('impact_analysis:');
  lines.push('  required: true');
  lines.push('  affected_services:');
  for (const service of data.affectedServices) {
    lines.push(`    - service_id: ${service.serviceId}`);
    lines.push(`      via: ${service.via}`);
    lines.push(`      service_kind: ${service.serviceKind || 'TODO'}`);
    lines.push(`      ards_kind: ${service.ardsKind || 'TODO'}`);
    lines.push(`      status: ${service.status || 'TODO'}`);
  }
  lines.push('  affected_ards:');
  for (const kind of affectedKinds) lines.push(`    - ${kind}`);
  lines.push('  capabilities: []');
  lines.push('  risks:');
  for (const driver of data.risk.drivers) {
    lines.push(`    - id: ${driver.id}`);
    if (driver.serviceId) lines.push(`      service_id: ${driver.serviceId}`);
    lines.push(`      severity: ${driver.severity}`);
  }
  lines.push('');
  lines.push('required_context:');
  for (const item of data.requiredContext) lines.push(`  - ${item}`);
  lines.push('');
  lines.push('required_checks:');
  for (const check of data.requiredChecks) {
    lines.push(`  - service_id: ${check.serviceId}`);
    lines.push(`    command: ${quote(check.command)}`);
    if (check.fallback) lines.push(`    fallback: ${check.fallback}`);
  }
  lines.push('');
  lines.push('risk:');
  lines.push(`  level: ${data.risk.level}`);
  lines.push(`  score: ${data.risk.score}`);
  lines.push('  drivers:');
  for (const driver of data.risk.drivers) {
    lines.push(`    - id: ${driver.id}`);
    if (driver.serviceId) lines.push(`      service_id: ${driver.serviceId}`);
    lines.push(`      severity: ${driver.severity}`);
  }
  lines.push('');
  lines.push('execution:');
  lines.push('  requires_human_approval: true');
  lines.push('  allowed_window: manual');
  lines.push('  branch_strategy: one-branch-per-repo');
  lines.push('');
  lines.push('decision:');
  lines.push('  status: pending');
  lines.push('  approver: TODO');
  lines.push('');
  lines.push('planner_notes:');
  lines.push('  - Functional repositories were not modified.');
  lines.push('  - Functional repository checks were not executed.');
  lines.push('');
  return `${lines.join('\n')}`;
}

function listYamlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.yaml') || file.endsWith('.yml'))
    .map((file) => path.join(dir, file));
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function topLevel(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*(.+)\\s*$`, 'm'));
  return match ? strip(match[1]) : null;
}

function nested(text, section, key) {
  const lines = text.split(/\r?\n/);
  let inSection = false;
  for (const line of lines) {
    if (line.startsWith(`${section}:`)) {
      inSection = true;
      continue;
    }
    if (inSection && /^[A-Za-z0-9_-]+:/.test(line)) break;
    if (inSection) {
      const match = line.match(new RegExp(`^\\s{2}${key}:\\s*(.+)\\s*$`));
      if (match) return strip(match[1]);
    }
  }
  return null;
}

function listNested(text, section, key) {
  const lines = text.split(/\r?\n/);
  const values = [];
  let inSection = false;
  let inList = false;
  for (const line of lines) {
    if (line.startsWith(`${section}:`)) {
      inSection = true;
      continue;
    }
    if (inSection && /^[A-Za-z0-9_-]+:/.test(line)) break;
    if (inSection && line.match(new RegExp(`^\\s{2}${key}:\\s*\\[\\]\\s*$`))) return [];
    if (inSection && line.match(new RegExp(`^\\s{2}${key}:\\s*$`))) {
      inList = true;
      continue;
    }
    if (inList) {
      const match = line.match(/^\s{4}-\s+(.+)\s*$/);
      if (match) values.push(strip(match[1]));
      else if (/^\s{2}\S/.test(line)) break;
    }
  }
  return values;
}

function listInSolutionSection(text, section) {
  const lines = text.split(/\r?\n/);
  const values = [];
  let inServices = false;
  let inSection = false;
  for (const line of lines) {
    if (line.startsWith('services:')) {
      inServices = true;
      continue;
    }
    if (inServices && /^[A-Za-z0-9_-]+:/.test(line)) break;
    if (inServices && line.match(new RegExp(`^\\s{2}${section}:\\s*$`))) {
      inSection = true;
      continue;
    }
    if (inSection) {
      const match = line.match(/^\s{4}-\s+(.+)\s*$/);
      if (match) values.push(strip(match[1]));
      else if (/^\s{2}\S/.test(line)) break;
    }
  }
  return values;
}

function listBindingEvidence(text) {
  const lines = text.split(/\r?\n/);
  const bindings = [];
  let inSection = false;
  let current = null;
  for (const line of lines) {
    if (line.startsWith('local_binding_evidence:')) {
      inSection = true;
      continue;
    }
    if (inSection && /^[A-Za-z0-9_-]+:/.test(line)) break;
    if (!inSection) continue;
    const idMatch = line.match(/^\s{2}-\s+id:\s+(.+)\s*$/);
    if (idMatch) {
      current = { id: strip(idMatch[1]) };
      bindings.push(current);
      continue;
    }
    if (!current) continue;
    const pathRecordMatch = line.match(/^\s{4}path_record:\s+(.+)\s*$/);
    if (pathRecordMatch) current.pathRecord = strip(pathRecordMatch[1]);
  }
  return bindings;
}

function strip(value) {
  return value.replace(/^['"]|['"]$/g, '').trim();
}

function parseBoolean(value) {
  return value === 'true';
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function quote(value) {
  const normalized = String(value).replace(/"/g, '\\"');
  return `"${normalized}"`;
}

function hasFailures() {
  return results.some((result) => result.level === 'FAIL');
}

function finish() {
  const failures = results.filter((result) => result.level === 'FAIL');
  const warnings = results.filter((result) => result.level === 'WARN');
  console.log('');
  console.log(`Summary: ${results.filter((r) => r.level === 'OK').length} OK, ${warnings.length} WARN, ${failures.length} FAIL`);
  if (failures.length > 0) process.exit(1);
}
