const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const INITIATIVES_DIR = path.join(ROOT, 'initiatives');
const INDEX = path.join(INITIATIVES_DIR, '00-index.yaml');
const REQUEST_DIR = path.join(ROOT, 'requests');
const ABSOLUTE_PATH_RE = /(^|['":\s])([A-Za-z]:[\\/]|\/Users\/|~[\\/])/;
const ID_RE = /^INIT-[A-Z]+-[0-9]{4}$/;
const ALLOWED_STATUSES = new Set(['hypothesis', 'planned', 'active', 'blocked', 'done', 'deferred']);
const REQUIRED_FIELDS = [
  'schema_version',
  'kind',
  'id',
  'title',
  'status',
  'updated_at',
  'objective',
  'initial_hypothesis',
];

const results = [];

function report(level, message) {
  results.push({ level, message });
  console.log(`${level}: ${message}`);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function toAbs(repoPath) {
  return path.join(ROOT, repoPath.replace(/\//g, path.sep));
}

function strip(value) {
  return value.replace(/^['"]|['"]$/g, '').trim();
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

  for (const line of lines) {
    if (line.startsWith(`${section}:`)) {
      inSection = true;
      continue;
    }
    if (!inSection) continue;
    if (/^[A-Za-z0-9_-]+:/.test(line)) break;

    const match = line.match(/^\s+-\s+(.+)\s*$/);
    if (match) values.push(strip(match[1]));
  }

  return values;
}

function listYamlFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listYamlFilesRecursive(full));
    else if (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')) files.push(full);
  }
  return files;
}

function loadRequestIds() {
  const ids = new Set();
  for (const file of listYamlFilesRecursive(REQUEST_DIR)) {
    const id = topLevel(read(file), 'id');
    if (id) ids.add(id);
  }
  return ids;
}

if (!fs.existsSync(INDEX)) {
  report('FAIL', 'initiatives/00-index.yaml exists');
} else {
  report('OK', 'initiatives/00-index.yaml exists');
}

const indexText = fs.existsSync(INDEX) ? read(INDEX) : '';
const indexedFiles = new Set(listUnder(indexText, 'initiatives'));
const diskFiles = new Set(
  fs.existsSync(INITIATIVES_DIR)
    ? fs.readdirSync(INITIATIVES_DIR)
        .filter((file) => file.endsWith('.yaml') || file.endsWith('.yml'))
        .filter((file) => file !== '00-index.yaml')
        .map((file) => rel(path.join(INITIATIVES_DIR, file)))
    : []
);
const requestIds = loadRequestIds();

for (const file of diskFiles) {
  if (!indexedFiles.has(file)) report('FAIL', `initiatives/00-index.yaml does not list ${file}`);
}

for (const file of indexedFiles) {
  if (!diskFiles.has(file)) report('FAIL', `initiatives/00-index.yaml lists missing file ${file}`);
}

if (diskFiles.size > 0 && indexedFiles.size === diskFiles.size) {
  report('OK', `initiatives/00-index.yaml lists ${indexedFiles.size} initiative files`);
}

for (const initiativePath of [...diskFiles].sort()) {
  const file = toAbs(initiativePath);
  const text = read(file);
  const failuresBefore = results.filter((result) => result.level === 'FAIL').length;

  if (ABSOLUTE_PATH_RE.test(text)) report('FAIL', `${initiativePath} contains an absolute local path`);

  for (const field of REQUIRED_FIELDS) {
    if (!topLevel(text, field)) report('FAIL', `${initiativePath} missing ${field}`);
  }

  const kind = topLevel(text, 'kind');
  const id = topLevel(text, 'id') || initiativePath;
  const status = topLevel(text, 'status');
  const evidenceRefs = listUnder(text, 'source_evidence_refs');
  const modelRefs = listUnder(text, 'model_refs');
  const knownChangeRequests = listUnder(text, 'known_change_requests');

  if (kind && kind !== 'initiative') report('FAIL', `${initiativePath} has invalid kind: ${kind}`);
  if (id && !ID_RE.test(id)) report('FAIL', `${initiativePath} has invalid id: ${id}`);
  if (status && !ALLOWED_STATUSES.has(status)) report('FAIL', `${initiativePath} has invalid status: ${status}`);
  if (evidenceRefs.length === 0) report('FAIL', `${initiativePath} has no source_evidence_refs`);
  if (knownChangeRequests.length === 0) report('FAIL', `${initiativePath} has no known_change_requests`);

  for (const refPath of [...evidenceRefs, ...modelRefs]) {
    if (!fs.existsSync(toAbs(refPath))) report('FAIL', `${initiativePath} references missing path: ${refPath}`);
  }

  for (const requestId of knownChangeRequests) {
    if (!requestIds.has(requestId)) report('FAIL', `${initiativePath} references missing request id: ${requestId}`);
  }

  if (!text.includes('source_of_truth: false')) {
    report('FAIL', `${initiativePath} must keep Jira source_of_truth false`);
  }

  const failuresAfter = results.filter((result) => result.level === 'FAIL').length;
  if (failuresAfter === failuresBefore) report('OK', `${id} initiative structure is valid`);
}

const failures = results.filter((result) => result.level === 'FAIL');
const warnings = results.filter((result) => result.level === 'WARN');

console.log('');
console.log(`Summary: ${results.filter((r) => r.level === 'OK').length} OK, ${warnings.length} WARN, ${failures.length} FAIL`);

if (failures.length > 0) process.exit(1);
