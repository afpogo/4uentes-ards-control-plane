const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const bindingsPath = path.join(ROOT, 'environments', 'local', 'bindings.local.yaml');
const optional = process.argv.includes('--optional');
const results = [];

function report(level, message) {
  results.push({ level, message });
  console.log(`${level}: ${message}`);
}

if (!fs.existsSync(bindingsPath)) {
  report('WARN', 'environments/local/bindings.local.yaml not found');
  if (optional) process.exit(0);
  process.exit(1);
}

const text = fs.readFileSync(bindingsPath, 'utf8');
const bindings = parseBindings(text);

if (bindings.length === 0) {
  report('FAIL', 'bindings.local.yaml has no bindings');
}

const catalog = loadCatalog();

for (const binding of bindings) {
  if (!binding.id) {
    report('FAIL', 'binding missing id');
    continue;
  }

  if (!binding.path || binding.path === 'TODO') {
    report('WARN', `${binding.id} has no local path`);
    continue;
  }

  const localPath = resolveEnv(binding.path);
  if (!fs.existsSync(localPath)) {
    report('FAIL', `${binding.id} path does not exist: ${localPath}`);
    continue;
  }

  report('OK', `${binding.id} path exists`);

  for (const artifact of binding.requiredArtifacts) {
    const artifactPath = path.join(localPath, artifact);
    if (fs.existsSync(artifactPath)) report('OK', `${binding.id} has ${artifact}`);
    else report('FAIL', `${binding.id} missing ${artifact}`);
  }

  const expectedRemote = catalog.get(binding.id);
  if (expectedRemote) {
    try {
      const observedRemote = execSync('git remote get-url origin', {
        cwd: localPath,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (observedRemote === expectedRemote) report('OK', `${binding.id} remote matches catalog`);
      else report('WARN', `${binding.id} remote differs from catalog: ${observedRemote}`);
    } catch (_err) {
      report('WARN', `${binding.id} remote could not be observed`);
    }
  }
}

const failures = results.filter((result) => result.level === 'FAIL');
const warnings = results.filter((result) => result.level === 'WARN');
console.log('');
console.log(`Summary: ${results.filter((r) => r.level === 'OK').length} OK, ${warnings.length} WARN, ${failures.length} FAIL`);

if (failures.length > 0) process.exit(1);

function parseBindings(source) {
  const lines = source.split(/\r?\n/);
  const bindings = [];
  let current = null;
  let inRequiredArtifacts = false;

  for (const line of lines) {
    const idMatch = line.match(/^\s{2}-\s+id:\s+["']?([^"']+)["']?\s*$/);
    if (idMatch) {
      current = { id: idMatch[1], requiredArtifacts: [] };
      bindings.push(current);
      inRequiredArtifacts = false;
      continue;
    }
    if (!current) continue;

    const pathMatch = line.match(/^\s{4}path:\s+["']?([^"']+)["']?\s*$/);
    if (pathMatch) {
      current.path = pathMatch[1];
      continue;
    }

    if (/^\s{4}required_artifacts:\s*$/.test(line)) {
      inRequiredArtifacts = true;
      continue;
    }

    if (inRequiredArtifacts) {
      const artifactMatch = line.match(/^\s{6}-\s+["']?([^"']+)["']?\s*$/);
      if (artifactMatch) {
        current.requiredArtifacts.push(artifactMatch[1]);
        continue;
      }
      if (/^\s{4}\S/.test(line) || /^\s{2}-\s+/.test(line)) inRequiredArtifacts = false;
    }
  }

  return bindings;
}

function resolveEnv(value) {
  const envMatch = value.match(/^\$\{([^}]+)\}$/);
  if (envMatch) return process.env[envMatch[1]] || value;
  return value;
}

function loadCatalog() {
  const map = new Map();
  const serviceDir = path.join(ROOT, 'catalog', 'services');
  if (!fs.existsSync(serviceDir)) return map;
  for (const file of fs.readdirSync(serviceDir)) {
    if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;
    const serviceText = fs.readFileSync(path.join(serviceDir, file), 'utf8');
    const id = matchTop(serviceText, 'service_id');
    const remote = matchNested(serviceText, 'repo', 'remote');
    if (id && remote && remote !== 'TODO') map.set(id, remote);
  }
  return map;
}

function matchTop(source, key) {
  const match = source.match(new RegExp(`^${key}:\\s*(.+)\\s*$`, 'm'));
  return match ? strip(match[1]) : null;
}

function matchNested(source, section, key) {
  const lines = source.split(/\r?\n/);
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

function strip(value) {
  return value.replace(/^['"]|['"]$/g, '').trim();
}
