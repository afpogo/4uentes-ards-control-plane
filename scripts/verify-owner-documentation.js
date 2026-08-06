const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REQUEST_DIRS = [
  path.join(ROOT, 'requests', 'planned'),
  path.join(ROOT, 'requests', 'done'),
];

const VALID_STATUSES = new Set(['planned', 'satisfied', 'exception']);
const OWNER_DOC_PATH_RE = /-\s+"?((?:docs|specs)\/[^"\n]+|(?:docs|specs)\\[^"\n]+)"?/;
const EVIDENCE_PATH_RE = /-\s+"?(evidence\/requests\/[^"\n]+)"?/;
const CONTROL_PLANE_CHECK_RE = /npm(?:\.cmd)?\s+run\s+(?:check|check:owner-docs)/;

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

function strip(value) {
  return value.replace(/^['"]|['"]$/g, '').trim();
}

function topLevel(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*(.+)\\s*$`, 'm'));
  return match ? strip(match[1]) : null;
}

function sectionBlock(text, key) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => new RegExp(`^\\s*${key}:\\s*$`).test(line));
  if (start < 0) return '';

  const startIndent = lines[start].match(/^\s*/)[0].length;
  const block = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === '') {
      block.push(line);
      continue;
    }

    const currentIndent = line.match(/^\s*/)[0].length;
    if (currentIndent <= startIndent && /^[A-Za-z0-9_-]+:/.test(line.trim())) break;
    block.push(line);
  }
  return block.join('\n');
}

function valueInBlock(block, key) {
  const match = block.match(new RegExp(`^\\s+${key}:\\s*(.+)\\s*$`, 'm'));
  return match ? strip(match[1]) : null;
}

function listYamlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.yaml') || file.endsWith('.yml'))
    .map((file) => path.join(dir, file));
}

function extractMatches(block, regex) {
  return block
    .split(/\r?\n/)
    .map((line) => line.match(regex))
    .filter(Boolean)
    .map((match) => match[1].replace(/\\/g, '/'));
}

function existsRepoPath(repoPath) {
  return fs.existsSync(path.join(ROOT, repoPath.replace(/\//g, path.sep)));
}

function validatePackageWiring() {
  const packageFile = path.join(ROOT, 'package.json');
  if (!fs.existsSync(packageFile)) {
    report('FAIL', 'package.json is missing; owner documentation gate cannot verify control-plane check wiring');
    return;
  }

  const pkg = JSON.parse(read(packageFile));
  const scripts = pkg.scripts || {};

  if (scripts['check:owner-docs'] !== 'node scripts/verify-owner-documentation.js') {
    report('FAIL', 'package.json scripts.check:owner-docs must run node scripts/verify-owner-documentation.js');
  }

  if (!scripts.check || !scripts.check.includes('node scripts/verify-owner-documentation.js')) {
    report('FAIL', 'package.json scripts.check must include node scripts/verify-owner-documentation.js');
  }
}

function validateOwnerDocumentation(file) {
  const text = read(file);
  const requestId = topLevel(text, 'id') || rel(file);

  if (!/^\s*child_repo_mutation_allowed:\s*true\s*$/m.test(text)) return;

  if (!CONTROL_PLANE_CHECK_RE.test(text)) {
    report('FAIL', `${rel(file)} mutates a child repo but does not require control-plane npm run check or check:owner-docs`);
  }

  const block = sectionBlock(text, 'owner_documentation');
  if (!block) {
    report('FAIL', `${rel(file)} mutates a child repo but has no owner_documentation block`);
    return;
  }

  const required = valueInBlock(block, 'required');
  const status = valueInBlock(block, 'status');
  const ownerDocPaths = extractMatches(block, OWNER_DOC_PATH_RE);
  const evidenceRefs = extractMatches(block, EVIDENCE_PATH_RE);
  const exceptionRef = valueInBlock(block, 'exception_ref');

  if (required !== 'true') {
    report('FAIL', `${rel(file)} owner_documentation.required must be true`);
  }

  if (!status || !VALID_STATUSES.has(status)) {
    report('FAIL', `${rel(file)} owner_documentation.status must be one of: ${[...VALID_STATUSES].join(', ')}`);
  }

  if (status === 'planned') {
    if (ownerDocPaths.length === 0) {
      report('FAIL', `${rel(file)} owner_documentation planned status must list planned owner docs/specs under docs/ or specs/`);
    }
  }

  if (status === 'satisfied') {
    if (ownerDocPaths.length === 0) {
      report('FAIL', `${rel(file)} owner_documentation satisfied status must list owner docs/specs under docs/ or specs/`);
    }
    if (evidenceRefs.length === 0) {
      report('FAIL', `${rel(file)} owner_documentation satisfied status must list control-plane evidence_refs`);
    }
  }

  if (status === 'exception') {
    if (!exceptionRef) {
      report('FAIL', `${rel(file)} owner_documentation exception status must include exception_ref`);
    } else if (!existsRepoPath(exceptionRef)) {
      report('FAIL', `${rel(file)} owner_documentation exception_ref is missing: ${exceptionRef}`);
    }
  }

  for (const evidenceRef of evidenceRefs) {
    if (!existsRepoPath(evidenceRef)) {
      report('FAIL', `${rel(file)} owner_documentation evidence_ref is missing: ${evidenceRef}`);
    }
  }

  const failuresForRequest = results.filter((result) => result.level === 'FAIL' && result.message.includes(rel(file)));
  if (failuresForRequest.length === 0) {
    report('OK', `${requestId} owner_documentation gate is valid`);
  }
}

validatePackageWiring();

for (const dir of REQUEST_DIRS) {
  for (const file of listYamlFiles(dir)) {
    validateOwnerDocumentation(file);
  }
}

const failures = results.filter((result) => result.level === 'FAIL');
const warnings = results.filter((result) => result.level === 'WARN');

console.log('');
console.log(`Summary: ${results.filter((r) => r.level === 'OK').length} OK, ${warnings.length} WARN, ${failures.length} FAIL`);

if (failures.length > 0) process.exit(1);
