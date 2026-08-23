const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REQUEST_PHASES = ['inbox', 'planned', 'queued', 'running', 'done', 'rejected'];
const TERMINAL_PHASES = new Set(['done', 'rejected']);
const REQUEST_ID_RE = /^CR-[A-Z0-9]+-[0-9]{4}$/;
const EXCEPTIONS_PATH = path.join(ROOT, 'specs', 'integration', 'request-identity-exceptions.json');

function normalize(value) {
  return value.replace(/\\/g, '/');
}

function strip(value) {
  return value.replace(/^["']|["']$/g, '').trim();
}

function topLevel(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*(.+)\\s*$`, 'm'));
  return match ? strip(match[1]) : null;
}

function listYamlFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listYamlFilesRecursive(full));
    else if (/\.ya?ml$/i.test(entry.name)) files.push(full);
  }
  return files;
}

function loadRecords(root = ROOT) {
  const records = [];
  for (const phase of REQUEST_PHASES) {
    const phaseDir = path.join(root, 'requests', phase);
    for (const file of listYamlFilesRecursive(phaseDir)) {
      const text = fs.readFileSync(file, 'utf8');
      const relativePath = normalize(path.relative(root, file));
      const stem = path.basename(file).replace(/\.ya?ml$/i, '');
      const id = topLevel(text, 'id');
      records.push({
        id,
        phase,
        path: relativePath,
        stem,
        slug: id && stem.startsWith(`${id}-`) ? stem.slice(id.length + 1) : null,
        sourceRequest: topLevel(text, 'source_request'),
        plannedRequest: topLevel(text, 'planned_request'),
      });
    }
  }
  return records;
}

function loadExceptions(file = EXCEPTIONS_PATH) {
  if (!fs.existsSync(file)) return new Map();
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  const exceptions = new Map();
  for (const item of parsed.exceptions || []) exceptions.set(item.id, item);
  return exceptions;
}

function familyFromReference(reference) {
  if (!reference) return null;
  const stem = path.basename(normalize(reference)).replace(/\.ya?ml$/i, '');
  const match = stem.match(/^(CR-[A-Z0-9]+-[0-9]{4})-(.+)$/);
  return match ? { id: match[1], slug: match[2] } : null;
}

function validateInventory(records, exceptions = new Map()) {
  const findings = [];
  const report = (level, message) => findings.push({ level, message });
  const byId = new Map();

  for (const record of records) {
    if (!record.id) {
      report('FAIL', `${record.path} is missing top-level id`);
      continue;
    }
    if (!REQUEST_ID_RE.test(record.id)) report('FAIL', `${record.path} has invalid request id: ${record.id}`);
    if (!record.slug) report('FAIL', `${record.path} filename does not start with ${record.id}-`);
    if (!byId.has(record.id)) byId.set(record.id, []);
    byId.get(record.id).push(record);

    for (const [field, reference, allowedPhases] of [
      ['source_request', record.sourceRequest, ['inbox', 'planned']],
      ['planned_request', record.plannedRequest, ['planned']],
    ]) {
      if (!reference) continue;
      if (reference === 'archived-by-done-lifecycle') continue;
      const family = familyFromReference(reference);
      const allowedPrefixes = allowedPhases.map((phase) => `requests/${phase}/`);
      if (!allowedPrefixes.some((prefix) => normalize(reference).startsWith(prefix))) {
        report('FAIL', `${record.path} ${field} must point under ${allowedPrefixes.join(' or ')}`);
      }
      if (!family || family.id !== record.id || family.slug !== record.slug) {
        report('FAIL', `${record.path} ${field} crosses request identity family: ${reference}`);
      }
    }
  }

  for (const [id, group] of byId) {
    const slugs = [...new Set(group.map((item) => item.slug).filter(Boolean))].sort();
    const paths = group.map((item) => item.path).sort();
    const phases = group.map((item) => item.phase);
    const duplicatePhase = phases.find((phase, index) => phases.indexOf(phase) !== index);
    const hasActiveAndTerminal = phases.includes('running') && phases.some((phase) => TERMINAL_PHASES.has(phase));
    const exception = exceptions.get(id);
    const isCollision = slugs.length > 1 || Boolean(duplicatePhase) || hasActiveAndTerminal;

    if (!isCollision) continue;

    if (exception) {
      const allowedPaths = [...(exception.allowed_paths || [])].map(normalize).sort();
      if (JSON.stringify(paths) === JSON.stringify(allowedPaths) && exception.status === 'frozen-historical-collision') {
        report('WARN', `${id} matches the frozen historical exception exactly; no new file is allowed`);
        continue;
      }
      report('FAIL', `${id} diverges from its frozen exception; observed paths: ${paths.join(', ')}`);
      continue;
    }

    if (slugs.length > 1) report('FAIL', `${id} is assigned to multiple slugs: ${slugs.join(', ')}`);
    if (duplicatePhase) report('FAIL', `${id} has more than one lifecycle file in phase ${duplicatePhase}`);
    if (hasActiveAndTerminal) report('FAIL', `${id} has running and terminal lifecycle files simultaneously`);
  }

  for (const [id] of exceptions) {
    if (!byId.has(id)) report('FAIL', `${id} frozen exception is stale because the request is absent`);
  }

  return findings;
}

function record(id, slug, phase, extra = {}) {
  return {
    id,
    slug,
    phase,
    stem: `${id}-${slug}`,
    path: `requests/${phase}/${id}-${slug}.yaml`,
    sourceRequest: null,
    plannedRequest: null,
    ...extra,
  };
}

function runSelfTest() {
  const cases = [
    {
      name: 'normal lifecycle passes',
      records: [record('CR-SST-9000', 'normal', 'inbox'), record('CR-SST-9000', 'normal', 'planned', { sourceRequest: 'requests/inbox/CR-SST-9000-normal.yaml' })],
      expectedFailures: 0,
    },
    {
      name: 'same id with two slugs fails',
      records: [record('CR-SST-9001', 'first', 'inbox'), record('CR-SST-9001', 'second', 'planned')],
      expectedFailures: 1,
    },
    {
      name: 'filename and id mismatch fails',
      records: [{ ...record('CR-SST-9002', 'valid', 'inbox'), slug: null, stem: 'CR-SST-9003-valid', path: 'requests/inbox/CR-SST-9003-valid.yaml' }],
      expectedFailures: 1,
    },
    {
      name: 'duplicate phase fails',
      records: [record('CR-SST-9004', 'same', 'planned'), record('CR-SST-9004', 'same', 'planned', { path: 'requests/planned/nested/CR-SST-9004-same.yaml' })],
      expectedFailures: 1,
    },
    {
      name: 'cross-family reference fails',
      records: [record('CR-SST-9005', 'same', 'planned', { sourceRequest: 'requests/inbox/CR-SST-9006-other.yaml' })],
      expectedFailures: 1,
    },
    {
      name: 'running and terminal fails',
      records: [record('CR-SST-9007', 'same', 'running'), record('CR-SST-9007', 'same', 'done')],
      expectedFailures: 1,
    },
  ];

  let failedCases = 0;
  for (const item of cases) {
    const failures = validateInventory(item.records).filter((finding) => finding.level === 'FAIL').length;
    if (failures === item.expectedFailures) console.log(`OK: ${item.name}`);
    else {
      failedCases += 1;
      console.log(`FAIL: ${item.name}; expected ${item.expectedFailures} failures, observed ${failures}`);
    }
  }
  console.log(`\nSummary: ${cases.length - failedCases} OK, 0 WARN, ${failedCases} FAIL`);
  if (failedCases > 0) process.exit(1);
}

function run() {
  if (process.argv.includes('--self-test')) return runSelfTest();
  const findings = validateInventory(loadRecords(), loadExceptions());
  for (const finding of findings) console.log(`${finding.level}: ${finding.message}`);
  const failures = findings.filter((finding) => finding.level === 'FAIL');
  const warnings = findings.filter((finding) => finding.level === 'WARN');
  const okCount = loadRecords().length;
  console.log(`\nSummary: ${okCount} lifecycle files scanned, ${warnings.length} WARN, ${failures.length} FAIL`);
  if (failures.length > 0) process.exit(1);
}

if (require.main === module) run();

module.exports = { loadRecords, validateInventory };
