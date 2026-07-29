const fs = require('fs');
const os = require('os');
const path = require('path');
const { McpStdioClient } = require('../jira-mcp/lib/mcp-stdio-client');

const ROOT = process.cwd();
const DEFAULT_TIMEOUT_MS = 120000;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const targets = discoverTargets({ includePlaceholders: args.includePlaceholders });
  const selected = filterTargets(targets, args.only);

  if (args.list || !args.connect) {
    printTargets(selected);
    if (!args.connect) return;
  }

  if (selected.length === 0) {
    console.log('No MCP remote targets found.');
    return;
  }

  let failed = 0;
  for (const target of selected) {
    try {
      await connectTarget(target, args);
    } catch (error) {
      failed += 1;
      console.error(`FAIL ${target.name}: ${redact(error.message)}`);
      if (!args.continueOnError) break;
    }
  }

  if (failed > 0) process.exit(1);
}

function discoverTargets(options = {}) {
  const all = [
    ...discoverCodexTargets(),
    ...discoverVsCodeTargets(),
  ];
  const deduped = dedupeTargets(all);
  return options.includePlaceholders
    ? deduped
    : deduped.filter((target) => !hasPlaceholder(target.url));
}

function discoverCodexTargets() {
  const configPath = path.join(os.homedir(), '.codex', 'config.toml');
  if (!fs.existsSync(configPath)) return [];
  const text = fs.readFileSync(configPath, 'utf8');
  const blocks = parseTomlServerBlocks(text);
  return blocks
    .map((block) => {
      const args = parseTomlArray(block.body, 'args');
      const remoteIndex = args.findIndex((item) => /(^|[\\/])mcp-remote(@|$)/.test(item) || item === 'mcp-remote@latest');
      const url = args.find((item) => /^https?:\/\//i.test(item));
      if (remoteIndex === -1 || !url) return null;
      return {
        name: `codex:${block.name}`,
        source: rel(configPath),
        url,
        command: commandForPlatform('npx'),
        args: ['--yes', 'mcp-remote@latest', url],
      };
    })
    .filter(Boolean);
}

function discoverVsCodeTargets() {
  const configPath = path.join(process.env.APPDATA || '', 'Code', 'User', 'mcp.json');
  if (!configPath || !fs.existsSync(configPath)) return [];
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const servers = config.servers || {};
  return Object.entries(servers)
    .map(([name, server]) => {
      if (server.type !== 'http' || !server.url) return null;
      return {
        name: `vscode:${name}`,
        source: rel(configPath),
        url: server.url,
        command: commandForPlatform('npx'),
        args: ['--yes', 'mcp-remote@latest', server.url],
      };
    })
    .filter(Boolean);
}

function parseTomlServerBlocks(text) {
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let current = null;

  for (const line of lines) {
    const header = line.match(/^\[mcp_servers\.([^\].]+)\]\s*$/);
    const nestedHeader = line.match(/^\[mcp_servers\.([^\].]+)\./);
    if (header) {
      if (current) blocks.push(current);
      current = { name: header[1], body: '' };
      continue;
    }
    if (nestedHeader) {
      if (current) blocks.push(current);
      current = null;
      continue;
    }
    if (/^\[/.test(line)) {
      if (current) blocks.push(current);
      current = null;
      continue;
    }
    if (current) current.body += `${line}\n`;
  }

  if (current) blocks.push(current);
  return blocks;
}

function parseTomlArray(body, key) {
  const match = body.match(new RegExp(`^${key}\\s*=\\s*\\[(.*)\\]`, 'm'));
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]*)"|'([^']*)'/g)].map((item) => item[1] || item[2] || '');
}

function dedupeTargets(targets) {
  const seen = new Set();
  const result = [];
  for (const target of targets) {
    const key = `${target.name}|${target.source}|${target.url}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(target);
  }
  return result;
}

function filterTargets(targets, only) {
  if (!only) return targets;
  const needle = only.toLowerCase();
  return targets.filter((target) =>
    target.name.toLowerCase().includes(needle) || target.url.toLowerCase().includes(needle)
  );
}

function printTargets(targets) {
  if (targets.length === 0) {
    console.log('No MCP remote targets found.');
    return;
  }
  for (const target of targets) {
    console.log(`${target.name}`);
    console.log(`  url: ${target.url}`);
    console.log(`  source: ${target.source}`);
  }
}

async function connectTarget(target, args) {
  console.log(`CONNECT ${target.name}`);
  console.log(`  url: ${target.url}`);
  const client = new McpStdioClient({
    command: target.command,
    args: target.args,
    timeoutMs: Number(args.timeoutMs || DEFAULT_TIMEOUT_MS),
  });

  try {
    await client.connect();
    const tools = await client.listTools();
    console.log(`OK ${target.name}: tools=${tools.length}`);
  } finally {
    client.close();
  }
}

function parseArgs(argv) {
  const result = {
    connect: false,
    list: false,
    continueOnError: false,
    includePlaceholders: false,
    only: null,
    timeoutMs: DEFAULT_TIMEOUT_MS,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === '--connect') result.connect = true;
    else if (item === '--list') result.list = true;
    else if (item === '--continue-on-error') result.continueOnError = true;
    else if (item === '--include-placeholders') result.includePlaceholders = true;
    else if (item === '--only') {
      index += 1;
      result.only = argv[index] || null;
    } else if (item === '--timeout-ms') {
      index += 1;
      result.timeoutMs = Number(argv[index] || DEFAULT_TIMEOUT_MS);
    } else {
      throw new Error(`Unknown argument: ${item}`);
    }
  }

  return result;
}

function commandForPlatform(command) {
  return process.platform === 'win32' ? `${command}.cmd` : command;
}

function hasPlaceholder(value) {
  return /\{[^}]+\}|\$\{[^}]+\}/.test(String(value || ''));
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function redact(value) {
  return String(value || '')
    .replace(/code_challenge=[^&\s]+/g, 'code_challenge=[redacted]')
    .replace(/state=[^&\s]+/g, 'state=[redacted]')
    .replace(/client_id=[^&\s]+/g, 'client_id=[redacted]')
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, 'Bearer [redacted]')
    .replace(/token[=:]\s*[A-Za-z0-9._-]+/gi, 'token=[redacted]');
}

main().catch((error) => {
  console.error(`FAIL: ${redact(error.message)}`);
  process.exit(1);
});
