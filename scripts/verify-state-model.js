const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const STATE_DIR = path.join(ROOT, 'state');
const STATE_INDEX = path.join(STATE_DIR, '00-index.yaml');
const CAPABILITY_LINKS = path.join(STATE_DIR, 'capability-links.yaml');
const SERVICE_DIR = path.join(ROOT, 'catalog', 'services');
const SOLUTION_DIR = path.join(ROOT, 'solutions');
const REQUEST_DIR = path.join(ROOT, 'requests');
const ABSOLUTE_PATH_RE = /(^|['":\s])([A-Za-z]:[\\/]|\/Users\/|~[\\/])/;

const ALLOWED_KINDS = new Set(['feature_state', 'bugfix_state']);
const ALLOWED_STATUSES = new Set([
  'unknown',
  'intake',
  'discovered',
  'ards-documented',
  'planned',
  'implementation-pending',
  'runtime-partial',
  'implemented-local',
  'validated-local',
  'validated-live',
  'ready-for-release',
  'released',
  'done',
  'blocked',
  'deferred',
  'rejected',
  'deprecated',
]);
const TERMINAL_STATUSES = new Set(['done', 'rejected', 'deprecated']);
const ALLOWED_BUGFIX_MARKERS = new Set([
  'reproduced',
  'root-caused',
  'fix-proposed',
  'fix-implemented-local',
  'regression-tested',
  'hotfixed',
]);
const ALLOWED_LINK_STATUSES = new Set(['linked', 'pending-child-adoption', 'orphan-observed', 'deprecated']);
const ALLOWED_WORK_ORIGINS = new Set(['orchestrator-request', 'child-repo', 'imported-evidence', 'manual-reconciliation']);
const REQUIRED_FIELDS = ['schema_version', 'kind', 'id', 'title', 'status', 'updated_at'];
const REQUIRED_CAPABILITY_LINK_FIELDS = [
  'capability_id',
  'producer_service',
  'producer_repo',
  'state_kind',
  'state_id',
  'state_file',
  'link_status',
  'source_ref',
];
const INTERNAL_PRODUCERS = new Set(['4uentes-orchestor']);

const results = [];

function report(level, message) {
  results.push({ level, message });
  console.log(`${level}: ${message}`);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function strip(value) {
  return value.replace(/^['"]|['"]$/g, '').trim();
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function toAbs(repoPath) {
  return path.join(ROOT, repoPath.replace(/\//g, path.sep));
}

function listYamlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.yaml') || file.endsWith('.yml'))
    .map((file) => path.join(dir, file));
}

function listFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFilesRecursive(full));
    else files.push(full);
  }
  return files;
}

function topLevel(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*(.+)\\s*$`, 'm'));
  return match ? strip(match[1]) : null;
}

function listUnder(text, section) {
  const inline = text.match(new RegExp(`^${section}:\\s*\\[(.*)\\]\\s*$`, 'm'));
  if (inline) {
    const body = inline[1].trim();
    if (!body) return [];
    return body.split(',').map((item) => strip(item.trim())).filter(Boolean);
  }

  const lines = text.split(/\r?\n/);
  const values = [];
  let inSection = false;
  let baseIndent = null;

  for (const line of lines) {
    if (line.startsWith(`${section}:`)) {
      inSection = true;
      baseIndent = 0;
      continue;
    }
    if (!inSection) continue;
    if (baseIndent === 0 && /^[A-Za-z0-9_-]+:/.test(line)) break;

    const match = line.match(/^\s+-\s+(.+)\s*$/);
    if (match) values.push(strip(match[1]));
  }

  return values;
}

function parseObjectList(text, section) {
  const lines = text.split(/\r?\n/);
  const records = [];
  let inSection = false;
  let current = null;

  for (const line of lines) {
    if (line.startsWith(`${section}:`)) {
      inSection = true;
      continue;
    }
    if (!inSection) continue;
    if (/^[A-Za-z0-9_-]+:/.test(line)) break;

    const firstKey = line.match(/^\s{2}-\s+([A-Za-z0-9_-]+):\s*(.+)\s*$/);
    if (firstKey) {
      current = {};
      records.push(current);
      current[firstKey[1]] = strip(firstKey[2]);
      continue;
    }

    if (!current) continue;
    const nextKey = line.match(/^\s{4}([A-Za-z0-9_-]+):\s*(.+)\s*$/);
    if (nextKey) current[nextKey[1]] = strip(nextKey[2]);
  }

  return records;
}

function loadIds(dir, key) {
  const ids = new Set();
  for (const file of listYamlFiles(dir)) {
    const id = topLevel(read(file), key);
    if (id) ids.add(id);
  }
  return ids;
}

function loadRequestIds() {
  const ids = new Set();
  for (const file of listFilesRecursive(REQUEST_DIR)) {
    if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;
    const id = topLevel(read(file), 'id');
    if (id) ids.add(id);
  }
  return ids;
}

function stateFilesOnDisk() {
  return [
    ...listYamlFiles(path.join(STATE_DIR, 'features')),
    ...listYamlFiles(path.join(STATE_DIR, 'bugfixes')),
  ];
}

if (!fs.existsSync(STATE_INDEX)) {
  report('FAIL', 'state/00-index.yaml exists');
} else {
  report('OK', 'state/00-index.yaml exists');
}

const services = loadIds(SERVICE_DIR, 'service_id');
const solutions = loadIds(SOLUTION_DIR, 'solution_id');
const requestIds = loadRequestIds();

if (services.size === 0) report('FAIL', 'catalog/services/*.yaml has service ids');
else report('OK', `Loaded ${services.size} service ids`);

if (solutions.size === 0) report('FAIL', 'solutions/*.yaml has solution ids');
else report('OK', `Loaded ${solutions.size} solution ids`);

const indexText = fs.existsSync(STATE_INDEX) ? read(STATE_INDEX) : '';
const indexedFiles = new Set([
  ...listUnder(indexText, 'features'),
  ...listUnder(indexText, 'bugfixes'),
]);
const diskFiles = new Set(stateFilesOnDisk().map(rel));
const stateMetaByFile = new Map();
const capabilityRefsByStateFile = new Map();

for (const file of diskFiles) {
  if (!indexedFiles.has(file)) report('FAIL', `state/00-index.yaml does not list ${file}`);
}

for (const file of indexedFiles) {
  if (!diskFiles.has(file)) report('FAIL', `state/00-index.yaml lists missing file ${file}`);
}

if (diskFiles.size > 0 && indexedFiles.size === diskFiles.size) {
  report('OK', `state/00-index.yaml lists ${indexedFiles.size} state files`);
}

for (const statePath of [...diskFiles].sort()) {
  const file = toAbs(statePath);
  const text = read(file);
  const failuresBefore = results.filter((result) => result.level === 'FAIL').length;

  if (ABSOLUTE_PATH_RE.test(text)) {
    report('FAIL', `${statePath} contains an absolute local path`);
  }

  for (const field of REQUIRED_FIELDS) {
    if (!topLevel(text, field)) report('FAIL', `${statePath} missing ${field}`);
  }

  const kind = topLevel(text, 'kind');
  const id = topLevel(text, 'id') || statePath;
  const status = topLevel(text, 'status');
  const solutionId = topLevel(text, 'solution_id');
  const affectedServices = listUnder(text, 'affected_services');
  const requestRefs = listUnder(text, 'request_ids');
  const specRefs = listUnder(text, 'spec_refs');
  const evidenceRefs = listUnder(text, 'evidence_refs');
  const validationRefs = listUnder(text, 'validation_refs');
  const capabilityRefs = listUnder(text, 'capability_refs');
  const markers = listUnder(text, 'markers');

  stateMetaByFile.set(statePath, { id, kind, text });
  capabilityRefsByStateFile.set(statePath, capabilityRefs);

  if (kind && !ALLOWED_KINDS.has(kind)) report('FAIL', `${statePath} has invalid kind: ${kind}`);
  if (status && !ALLOWED_STATUSES.has(status)) report('FAIL', `${statePath} has invalid status: ${status}`);

  if (affectedServices.length === 0) {
    report('FAIL', `${statePath} missing affected_services`);
  }
  for (const serviceId of affectedServices) {
    if (!services.has(serviceId)) report('FAIL', `${statePath} references missing service: ${serviceId}`);
  }

  if (solutionId && !solutions.has(solutionId)) {
    report('FAIL', `${statePath} references missing solution: ${solutionId}`);
  }

  if (kind === 'feature_state' && !solutionId) {
    report('FAIL', `${statePath} missing solution_id`);
  }

  for (const requestId of requestRefs) {
    if (!requestIds.has(requestId)) report('FAIL', `${statePath} references missing request id: ${requestId}`);
  }

  for (const refPath of [...specRefs, ...evidenceRefs, ...validationRefs]) {
    if (!fs.existsSync(toAbs(refPath))) report('FAIL', `${statePath} references missing path: ${refPath}`);
  }

  if (kind === 'bugfix_state') {
    if (requestRefs.length === 0) report('WARN', `${statePath} has no request_ids`);
    for (const marker of markers) {
      if (!ALLOWED_BUGFIX_MARKERS.has(marker)) report('FAIL', `${statePath} has invalid bugfix marker: ${marker}`);
    }
  }

  if (status === 'done' && evidenceRefs.length === 0 && validationRefs.length === 0) {
    report('FAIL', `${statePath} is done but has no evidence_refs or validation_refs`);
  }

  if (status && !TERMINAL_STATUSES.has(status) && evidenceRefs.length === 0) {
    report('WARN', `${statePath} has no evidence_refs for non-terminal status ${status}`);
  }

  const failuresAfter = results.filter((result) => result.level === 'FAIL').length;
  if (failuresAfter === failuresBefore) report('OK', `${id} state structure is valid`);
}

validateCapabilityLinks();

const failures = results.filter((result) => result.level === 'FAIL');
const warnings = results.filter((result) => result.level === 'WARN');

console.log('');
console.log(`Summary: ${results.filter((r) => r.level === 'OK').length} OK, ${warnings.length} WARN, ${failures.length} FAIL`);

if (failures.length > 0) process.exit(1);

function validateCapabilityLinks() {
  if (!fs.existsSync(CAPABILITY_LINKS)) {
    report('FAIL', 'state/capability-links.yaml exists');
    return;
  }

  const text = read(CAPABILITY_LINKS);
  const linkPath = rel(CAPABILITY_LINKS);
  if (ABSOLUTE_PATH_RE.test(text)) report('FAIL', `${linkPath} contains an absolute local path`);

  const links = parseObjectList(text, 'links');
  if (links.length === 0) {
    report('FAIL', 'state/capability-links.yaml has at least one link');
    return;
  }

  const linksByStateAndCapability = new Set();

  for (const link of links) {
    const capabilityId = link.capability_id || 'UNKNOWN';
    for (const field of REQUIRED_CAPABILITY_LINK_FIELDS) {
      if (!link[field]) report('FAIL', `${linkPath} link ${capabilityId} missing ${field}`);
    }

    if (link.producer_service && !services.has(link.producer_service) && !INTERNAL_PRODUCERS.has(link.producer_service)) {
      report('FAIL', `${linkPath} link ${capabilityId} references missing producer_service: ${link.producer_service}`);
    }

    if (link.state_kind && !ALLOWED_KINDS.has(link.state_kind)) {
      report('FAIL', `${linkPath} link ${capabilityId} has invalid state_kind: ${link.state_kind}`);
    }

    if (link.link_status && !ALLOWED_LINK_STATUSES.has(link.link_status)) {
      report('FAIL', `${linkPath} link ${capabilityId} has invalid link_status: ${link.link_status}`);
    }

    if (link.work_origin && !ALLOWED_WORK_ORIGINS.has(link.work_origin)) {
      report('FAIL', `${linkPath} link ${capabilityId} has invalid work_origin: ${link.work_origin}`);
    }

    if (link.state_file && !stateMetaByFile.has(link.state_file)) {
      report('FAIL', `${linkPath} link ${capabilityId} references missing state_file: ${link.state_file}`);
    }

    const stateMeta = stateMetaByFile.get(link.state_file);
    if (stateMeta) {
      if (link.state_id && link.state_id !== stateMeta.id) {
        report('FAIL', `${linkPath} link ${capabilityId} state_id does not match ${link.state_file}`);
      }
      if (link.state_kind && link.state_kind !== stateMeta.kind) {
        report('FAIL', `${linkPath} link ${capabilityId} state_kind does not match ${link.state_file}`);
      }
    }

    if (link.source_ref && !fs.existsSync(toAbs(link.source_ref))) {
      report('FAIL', `${linkPath} link ${capabilityId} references missing source_ref: ${link.source_ref}`);
    }

    if (link.state_file && link.capability_id) {
      linksByStateAndCapability.add(`${link.state_file}::${link.capability_id}`);
      const stateCapabilityRefs = capabilityRefsByStateFile.get(link.state_file) || [];
      if (!stateCapabilityRefs.includes(link.capability_id)) {
        report('FAIL', `${linkPath} link ${capabilityId} is not listed in ${link.state_file} capability_refs`);
      }
    }
  }

  for (const [stateFile, capabilityRefs] of capabilityRefsByStateFile.entries()) {
    for (const capabilityId of capabilityRefs) {
      if (!linksByStateAndCapability.has(`${stateFile}::${capabilityId}`)) {
        report('FAIL', `${stateFile} capability_ref ${capabilityId} has no state/capability-links.yaml entry`);
      }
    }
  }

  report('OK', `state/capability-links.yaml validates ${links.length} capability links`);
}
