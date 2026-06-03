const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SERVICE_DIR = path.join(ROOT, 'catalog', 'services');
const SOLUTION_DIR = path.join(ROOT, 'solutions');
const ALLOWED_ARDS_KINDS = new Set([
  'backend-api',
  'backend-bff',
  'frontend-web',
  'frontend-extension',
  'infra-gitops',
  'shared-auth-provider',
]);
const ALLOWED_ORCHESTRATOR_LINK_STATUSES = new Set([
  'pending-child-adoption',
  'adopted',
  'blocked',
  'not-applicable',
]);
const ABSOLUTE_PATH_RE = /(^|['":\s])([A-Za-z]:\\|\/Users\/|~[\\/])/;

const results = [];

function report(level, message) {
  results.push({ level, message });
  console.log(`${level}: ${message}`);
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

function listUnder(text, section) {
  const lines = text.split(/\r?\n/);
  const values = [];
  let inSection = false;
  for (const line of lines) {
    if (line.startsWith(`${section}:`)) {
      inSection = true;
      continue;
    }
    if (inSection && /^[A-Za-z0-9_-]+:/.test(line)) break;
    if (inSection) {
      const match = line.match(/^\s+-\s+(.+)\s*$/);
      if (match) values.push(strip(match[1]));
    }
  }
  return values;
}

function solutionServiceRefs(text) {
  const refs = new Set();
  const lines = text.split(/\r?\n/);
  let inServices = false;
  for (const line of lines) {
    if (line.startsWith('services:')) {
      inServices = true;
      continue;
    }
    if (inServices && /^[A-Za-z0-9_-]+:/.test(line)) break;
    if (inServices) {
      const match = line.match(/^\s{4}-\s+(.+)\s*$/);
      if (match) refs.add(strip(match[1]));
    }
  }
  return [...refs];
}

function strip(value) {
  return value.replace(/^['"]|['"]$/g, '').trim();
}

function failIfAbsolute(files, label) {
  for (const file of files) {
    const text = read(file);
    if (ABSOLUTE_PATH_RE.test(text)) {
      report('FAIL', `${label} contains an absolute local path: ${path.relative(ROOT, file)}`);
    }
  }
}

function repoPathExists(repoPath) {
  return fs.existsSync(path.join(ROOT, repoPath.replace(/\//g, path.sep)));
}

const serviceFiles = listYamlFiles(SERVICE_DIR);
const solutionFiles = listYamlFiles(SOLUTION_DIR);

if (serviceFiles.length === 0) report('FAIL', 'catalog/services/*.yaml exists and has at least one service');
else report('OK', `Found ${serviceFiles.length} service files`);

if (solutionFiles.length === 0) report('FAIL', 'solutions/*.yaml exists and has at least one solution');
else report('OK', `Found ${solutionFiles.length} solution files`);

failIfAbsolute(serviceFiles, 'catalog/services');
failIfAbsolute(solutionFiles, 'solutions');

const services = new Map();

for (const file of serviceFiles) {
  const rel = path.relative(ROOT, file);
  const text = read(file);
  const serviceId = topLevel(text, 'service_id');
  const canonical = topLevel(text, 'canonical_identity');
  const type = topLevel(text, 'kind');
  const status = topLevel(text, 'status');
  const repoRemote = nested(text, 'repo', 'remote');
  const ardsKind = nested(text, 'ards', 'kind');
  const legacyAliases = listUnder(text, 'legacy_aliases');
  const linkRequired = nested(text, 'orchestrator_link_contract', 'required');
  const linkStatus = nested(text, 'orchestrator_link_contract', 'status');
  const linkRuleRef = nested(text, 'orchestrator_link_contract', 'rule_ref');
  const linkTemplateRef = nested(text, 'orchestrator_link_contract', 'template_ref');
  const linkMetadataKey = nested(text, 'orchestrator_link_contract', 'metadata_key');
  const linkStateMap = nested(text, 'orchestrator_link_contract', 'capability_state_map');

  if (!serviceId) report('FAIL', `${rel} missing service_id`);
  if (!type) report('FAIL', `${rel} missing kind`);
  if (!status) report('FAIL', `${rel} missing status`);
  if (!repoRemote) report('FAIL', `${rel} missing repo.remote or explicit TODO`);
  if (!ardsKind) report('FAIL', `${rel} missing ards.kind`);
  else if (!ALLOWED_ARDS_KINDS.has(ardsKind)) report('FAIL', `${rel} has invalid ards.kind: ${ardsKind}`);

  if (serviceId === 'node-auth' || canonical === 'node-auth') {
    report('FAIL', `${rel} uses node-auth as canonical identity`);
  }

  if (legacyAliases.includes('node-auth') && serviceId !== '4uentes-auth') {
    report('WARN', `${rel} mentions node-auth alias outside 4uentes-auth`);
  }

  if (!linkRequired) report('FAIL', `${rel} missing orchestrator_link_contract.required`);
  else if (linkRequired !== 'true') report('FAIL', `${rel} orchestrator_link_contract.required must be true`);

  if (!linkStatus) report('FAIL', `${rel} missing orchestrator_link_contract.status`);
  else if (!ALLOWED_ORCHESTRATOR_LINK_STATUSES.has(linkStatus)) {
    report('FAIL', `${rel} has invalid orchestrator_link_contract.status: ${linkStatus}`);
  }

  if (!linkRuleRef) report('FAIL', `${rel} missing orchestrator_link_contract.rule_ref`);
  else if (!repoPathExists(linkRuleRef)) report('FAIL', `${rel} references missing orchestrator link rule: ${linkRuleRef}`);

  if (!linkTemplateRef) report('FAIL', `${rel} missing orchestrator_link_contract.template_ref`);
  else if (!repoPathExists(linkTemplateRef)) report('FAIL', `${rel} references missing orchestrator link template: ${linkTemplateRef}`);

  if (!linkMetadataKey) report('FAIL', `${rel} missing orchestrator_link_contract.metadata_key`);
  else if (linkMetadataKey !== 'orchestrator_link') report('FAIL', `${rel} orchestrator metadata_key must be orchestrator_link`);

  if (!linkStateMap) report('FAIL', `${rel} missing orchestrator_link_contract.capability_state_map`);
  else if (!repoPathExists(linkStateMap)) report('FAIL', `${rel} references missing capability state map: ${linkStateMap}`);

  if (serviceId) services.set(serviceId, { file, text, type, status, ardsKind, legacyAliases });
}

for (const file of solutionFiles) {
  const refs = solutionServiceRefs(read(file));
  for (const ref of refs) {
    if (!services.has(ref)) {
      report('FAIL', `${path.relative(ROOT, file)} references missing service: ${ref}`);
    }
  }
}

const auth = services.get('4uentes-auth');
if (!auth) {
  report('FAIL', '4uentes-auth service exists');
} else {
  if (auth.ardsKind !== 'shared-auth-provider' && auth.type !== 'shared-auth-provider') {
    report('FAIL', '4uentes-auth must be shared-auth-provider or shared service');
  } else {
    report('OK', '4uentes-auth is modeled as shared-auth-provider/shared service');
  }
  if (!auth.legacyAliases.includes('node-auth')) {
    report('WARN', '4uentes-auth does not record node-auth as legacy alias');
  }
}

const extension = services.get('sst-extension');
if (!extension) {
  report('FAIL', 'sst-extension service exists');
} else if (extension.status !== 'optional-active') {
  const optionalInSolution = solutionFiles.some((file) => {
    const text = read(file);
    return /optional:\s*\n(?:\s{4}-\s+.*\n)*\s{4}-\s+sst-extension/m.test(text);
  });
  if (!optionalInSolution) report('FAIL', 'sst-extension must be optional-active or listed in services.optional');
  else report('OK', 'sst-extension is listed in services.optional');
} else {
  report('OK', 'sst-extension is optional-active');
}

const infra = services.get('sst-4uentes-infra');
if (!infra) {
  report('FAIL', 'sst-4uentes-infra service exists');
} else if (infra.ardsKind !== 'infra-gitops') {
  report('FAIL', 'sst-4uentes-infra must have ards.kind infra-gitops');
} else {
  report('OK', 'sst-4uentes-infra is modeled as infra-gitops');
}

const failures = results.filter((result) => result.level === 'FAIL');
const warnings = results.filter((result) => result.level === 'WARN');

console.log('');
console.log(`Summary: ${results.filter((r) => r.level === 'OK').length} OK, ${warnings.length} WARN, ${failures.length} FAIL`);

if (failures.length > 0) process.exit(1);
