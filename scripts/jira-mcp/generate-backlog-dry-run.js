const fs = require('fs');
const path = require('path');
const { applyEvidenceArgs, parseArgs, requireEvidenceArgs } = require('./lib/cli-args');
const { loadConfig } = require('./lib/config');

const ROOT = process.cwd();
const REGISTRY_FILE = path.join(ROOT, 'state', 'jira-backlog-registry.yaml');

function main() {
  const args = parseArgs(process.argv.slice(2), { valueOptions: ['request-id', 'output-dir'] });
  requireEvidenceArgs(args);
  const config = applyEvidenceArgs(loadConfig(), args);
  const registry = readRegistry();
  const payloads = registry.items.map((item) => buildPayload(config, item));
  const outputs = writeEvidence(config, registry, payloads);

  console.log(`OK: Request: ${config.evidence.requestId}`);
  console.log(`OK: Backlog items: ${payloads.length}`);
  console.log(`OK: Jira writes: 0`);
  console.log(`OK: Evidence written: ${rel(outputs.summary)}`);
}

function readRegistry() {
  if (!fs.existsSync(REGISTRY_FILE)) throw new Error(`No existe ${rel(REGISTRY_FILE)}.`);
  const text = fs.readFileSync(REGISTRY_FILE, 'utf8');
  return {
    ref: rel(REGISTRY_FILE),
    items: parseBacklogItems(text),
  };
}

function buildPayload(config, item) {
  const assignedCr = item.assigned_cr_sst || null;
  const labels = [
    'control-plane',
    'jira-mcp',
    'backlog',
    item.status,
    assignedCr ? 'cr-assigned' : 'no-cr-assigned',
  ];
  if (assignedCr) labels.push(assignedCr);

  return {
    backlogId: item.backlog_id,
    projectKey: config.jira.projectKey,
    boardName: config.jira.boardName,
    issueType: config.jira.issueType,
    summary: summaryFor(item, assignedCr),
    priority: priorityFor(item.priority),
    labels,
    description: descriptionFor(item, assignedCr),
    externalWrite: false,
  };
}

function summaryFor(item, assignedCr) {
  const crPart = assignedCr ? `[${assignedCr}]` : '';
  return `[SST][backlog][${item.backlog_id}]${crPart} ${item.title}`;
}

function descriptionFor(item, assignedCr) {
  return [
    'Backlog id:',
    `- ${item.backlog_id}`,
    '',
    'Assigned CR-SST:',
    `- ${assignedCr || 'ninguno'}`,
    '',
    'Backlog status:',
    `- ${item.status}`,
    '',
    'Priority:',
    `- ${item.priority}`,
    '',
    'E2E route:',
    `- ${item.e2e_route}`,
    '',
    'Activation rule:',
    `- ${item.activation_rule}`,
    '',
    'Evidence required:',
    ...bulletOrNone(item.evidence_required),
    '',
    'Control-plane source:',
    `- ${rel(REGISTRY_FILE)}`,
    '',
    'Close criteria:',
    '- The backlog item is activated only by assigning a real CR-SST from the control-plane.',
    '- Jira visibility does not reserve or assign CR-SST numbers.',
  ].join('\n');
}

function priorityFor(priority) {
  if (priority === 'medium') return 'Medium';
  if (priority === 'low-medium') return 'Low-Medium';
  if (priority === 'low') return 'Low';
  return 'Medium';
}

function writeEvidence(config, registry, payloads) {
  const outputDir = path.join(ROOT, config.evidence.outputDir);
  fs.mkdirSync(outputDir, { recursive: true });
  const json = path.join(outputDir, 'backlog-ticket-payload-dry-run.json');
  const summary = path.join(outputDir, 'backlog-ticket-payload-dry-run.md');
  fs.writeFileSync(json, JSON.stringify({ requestId: config.evidence.requestId, registryRef: registry.ref, externalWrite: false, payloads }, null, 2), 'utf8');
  fs.writeFileSync(summary, renderSummary(config, registry, payloads), 'utf8');
  return { json, summary };
}

function renderSummary(config, registry, payloads) {
  const lines = [];
  lines.push('# Backlog Ticket Payload Dry Run');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Registry: \`${registry.ref}\``);
  lines.push(`- Payloads: ${payloads.length}`);
  lines.push('- Escritura Jira: no');
  lines.push('');
  lines.push('## Payloads');
  lines.push('');
  for (const payload of payloads) {
    lines.push(`### ${payload.backlogId}`);
    lines.push('');
    lines.push(`- Summary: \`${payload.summary}\``);
    lines.push(`- Project: \`${payload.projectKey}\``);
    lines.push(`- Issue type: \`${payload.issueType}\``);
    lines.push(`- Priority: \`${payload.priority}\``);
    lines.push(`- Labels: ${payload.labels.map((label) => `\`${label}\``).join(', ')}`);
    lines.push('');
  }
  lines.push('## Decision');
  lines.push('');
  lines.push('Este artifact solo genera payloads propuestos. No crea tickets Jira ni modifica el registry.');
  return `${lines.join('\n')}\n`;
}

function parseBacklogItems(text) {
  const items = [];
  let current = null;
  let currentListKey = null;
  let inItems = false;

  for (const line of text.split(/\r?\n/)) {
    if (line === 'items:') {
      inItems = true;
      continue;
    }
    if (!inItems) continue;
    if (/^[A-Za-z0-9_-]+:/.test(line)) break;

    const first = line.match(/^\s{2}-\s+([A-Za-z0-9_-]+):\s*(.*)$/);
    if (first) {
      current = {};
      currentListKey = null;
      items.push(current);
      current[first[1]] = normalize(first[2]);
      continue;
    }

    if (!current) continue;
    const next = line.match(/^\s{4}([A-Za-z0-9_-]+):\s*(.*)$/);
    if (next) {
      currentListKey = null;
      const value = normalize(next[2]);
      if (value === '') {
        current[next[1]] = [];
        currentListKey = next[1];
      } else {
        current[next[1]] = value;
      }
      continue;
    }

    const listValue = line.match(/^\s{6}-\s+(.+)$/);
    if (listValue && currentListKey) {
      current[currentListKey].push(normalize(listValue[1]));
    }
  }

  return items;
}

function bulletOrNone(items) {
  if (!items || items.length === 0) return ['- ninguno'];
  return items.map((item) => `- ${item}`);
}

function normalize(value) {
  const trimmed = String(value || '').trim();
  if (trimmed === 'null') return null;
  return trimmed.replace(/^['"]|['"]$/g, '').trim();
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

try {
  main();
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
}

