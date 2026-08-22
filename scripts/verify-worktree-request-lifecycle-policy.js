const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const POLICY_ID = 'worktree-request-lifecycle-policy';
const POLICY_PATH = 'docs/policies/worktree-request-lifecycle-policy.md';
const files = {
  policy: path.join(ROOT, POLICY_PATH),
  registry: path.join(ROOT, 'specs/integration/policies.yaml'),
  agents: path.join(ROOT, 'AGENTS.md'),
  readme: path.join(ROOT, 'docs/policies/README.md'),
  package: path.join(ROOT, 'package.json'),
  identityGate: path.join(ROOT, 'scripts/verify-request-identities.js'),
};

const findings = [];

function report(level, message) {
  findings.push({ level, message });
  console.log(`${level}: ${message}`);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

for (const [name, file] of Object.entries(files)) {
  if (!fs.existsSync(file)) report('FAIL', `${name} file is missing: ${path.relative(ROOT, file)}`);
}

if (fs.existsSync(files.policy)) {
  const policy = read(files.policy);
  const requiredSections = [
    '## Modelo de autoridad',
    '## Ciclo obligatorio',
    '## Contrato de recuperación',
    '## Retiro controlado',
    '## Failure behavior',
    '## Definition of Done',
  ];
  for (const section of requiredSections) {
    if (!policy.includes(section)) report('FAIL', `${POLICY_PATH} is missing section: ${section}`);
  }
  if (!policy.includes('requests/inbox/CR-')) report('FAIL', `${POLICY_PATH} must define inbox-first reservation`);
  if (!policy.includes('git worktree remove')) report('FAIL', `${POLICY_PATH} must define controlled worktree retirement`);
}

if (fs.existsSync(files.registry)) {
  const registry = read(files.registry);
  if (!registry.includes(`- id: "${POLICY_ID}"`)) report('FAIL', `${POLICY_ID} is missing from policy registry`);
  if (!registry.includes(`human_doc: "${POLICY_PATH}"`)) report('FAIL', `${POLICY_ID} registry entry does not bind its human doc`);
  if (!registry.includes('request-identity-gate-and-operational-review')) report('FAIL', `${POLICY_ID} registry entry does not declare enforcement mode`);
}

if (fs.existsSync(files.agents) && !read(files.agents).includes(`- \`${POLICY_ID}\``)) {
  report('FAIL', `AGENTS.md does not require discovery of ${POLICY_ID}`);
}

if (fs.existsSync(files.readme) && !read(files.readme).includes('worktree-request-lifecycle-policy.md')) {
  report('FAIL', `docs/policies/README.md does not list ${POLICY_ID}`);
}

if (fs.existsSync(files.package)) {
  const pkg = JSON.parse(read(files.package));
  const scripts = pkg.scripts || {};
  const command = 'node scripts/verify-worktree-request-lifecycle-policy.js';
  if (scripts['check:worktree-policy'] !== command) report('FAIL', 'package.json check:worktree-policy is not wired correctly');
  if (!scripts.check || !scripts.check.includes(command)) report('FAIL', 'package.json full check does not enforce worktree lifecycle policy');
}

const failures = findings.filter((finding) => finding.level === 'FAIL');
if (failures.length === 0) report('OK', `${POLICY_ID} is registered, discoverable and wired into the full gate`);

console.log('');
console.log(`Summary: ${findings.filter((finding) => finding.level === 'OK').length} OK, 0 WARN, ${failures.length} FAIL`);
if (failures.length > 0) process.exit(1);
