const fs = require('fs');
const path = require('path');
const { applyEvidenceArgs, parseArgs, requireEvidenceArgs } = require('./lib/cli-args');
const { loadConfig } = require('./lib/config');

const ROOT = process.cwd();
const REGISTRY_FILE = path.join(ROOT, 'state', 'jira-backlog-registry.yaml');
const ALLOWED_STATUSES = new Set(['deferred', 'candidate', 'selected', 'assigned', 'planned', 'in-progress', 'done', 'superseded']);
const PRIORITY_RANK = {
  high: 1,
  medium: 2,
  'low-medium': 3,
  low: 4,
};

function main() {
  const args = parseArgs(process.argv.slice(2), { valueOptions: ['request-id', 'output-dir'] });
  requireEvidenceArgs(args);
  const config = applyEvidenceArgs(loadConfig(), args);
  const registry = readRegistry();
  const findings = validateRegistry(registry);
  const review = buildReview(config, registry, findings);
  const outputs = writeEvidence(config, review);

  console.log(`OK: Request: ${config.evidence.requestId}`);
  console.log(`OK: Registry: ${rel(REGISTRY_FILE)}`);
  console.log(`OK: Backlog items: ${registry.items.length}`);
  console.log(`OK: Assigned CR-SST items: ${registry.items.filter((item) => item.assigned_cr_sst).length}`);
  console.log(`OK: Findings: ${findings.length}`);
  console.log(`OK: Jira writes: 0`);
  console.log(`OK: Evidence written: ${rel(outputs.summary)}`);

  if (findings.some((finding) => finding.severity === 'error')) {
    process.exitCode = 1;
  }
}

function readRegistry() {
  if (!fs.existsSync(REGISTRY_FILE)) {
    throw new Error(`No existe ${rel(REGISTRY_FILE)}.`);
  }
  const text = fs.readFileSync(REGISTRY_FILE, 'utf8');
  return {
    text,
    schema_version: topLevel(text, 'schema_version'),
    kind: topLevel(text, 'kind'),
    status: topLevel(text, 'status'),
    updated_at: topLevel(text, 'updated_at'),
    items: parseBacklogItems(text),
  };
}

function validateRegistry(registry) {
  const findings = [];
  if (registry.schema_version !== '1.0') add(findings, 'error', 'schema_version', 'schema_version must be 1.0.');
  if (registry.kind !== 'jira_control_plane_backlog_registry') add(findings, 'error', 'kind', 'kind must be jira_control_plane_backlog_registry.');
  if (registry.status !== 'active') add(findings, 'error', 'status', 'registry status must be active.');
  if (registry.items.length === 0) add(findings, 'error', 'items', 'registry must contain backlog items.');

  const ids = new Set();
  for (const item of registry.items) {
    const scope = item.backlog_id || 'unknown';
    if (!/^SST-BL-JIRA-\d{3}$/.test(item.backlog_id || '')) {
      add(findings, 'error', scope, 'backlog_id must match SST-BL-JIRA-###.');
    }
    if (ids.has(item.backlog_id)) add(findings, 'error', scope, 'backlog_id must be unique.');
    ids.add(item.backlog_id);

    if (!item.title) add(findings, 'error', scope, 'title is required.');
    if (!PRIORITY_RANK[item.priority]) add(findings, 'error', scope, `priority is invalid: ${item.priority || 'missing'}.`);
    if (!ALLOWED_STATUSES.has(item.status)) add(findings, 'error', scope, `status is invalid: ${item.status || 'missing'}.`);

    if (item.status === 'deferred' && item.assigned_cr_sst) {
      add(findings, 'error', scope, 'deferred items must not have assigned_cr_sst.');
    }
    if (item.assigned_cr_sst && !/^CR-SST-\d{4}$/.test(item.assigned_cr_sst)) {
      add(findings, 'error', scope, 'assigned_cr_sst must match CR-SST-#### or be null.');
    }
    if (item.jira_issue_key && !/^SST-\d+$/.test(item.jira_issue_key)) {
      add(findings, 'error', scope, 'jira_issue_key must match SST-# or be null.');
    }
  }

  return findings;
}

function buildReview(config, registry, findings) {
  const ordered = [...registry.items].sort((left, right) => {
    const priority = PRIORITY_RANK[left.priority] - PRIORITY_RANK[right.priority];
    if (priority !== 0) return priority;
    return left.backlog_id.localeCompare(right.backlog_id);
  });

  return {
    schema_version: '1.0',
    kind: 'jira_backlog_registry_review',
    request_id: config.evidence.requestId,
    registry_ref: rel(REGISTRY_FILE),
    external_write: false,
    automatic_local_transition: false,
    summary: {
      backlog_items: registry.items.length,
      assigned_cr_sst_items: registry.items.filter((item) => item.assigned_cr_sst).length,
      jira_linked_items: registry.items.filter((item) => item.jira_issue_key).length,
      findings: findings.length,
      next_by_priority: ordered.map((item) => ({
        backlog_id: item.backlog_id,
        title: item.title,
        priority: item.priority,
        status: item.status,
        assigned_cr_sst: item.assigned_cr_sst || null,
      })),
    },
    findings,
  };
}

function writeEvidence(config, review) {
  const outputDir = path.join(ROOT, config.evidence.outputDir);
  fs.mkdirSync(outputDir, { recursive: true });
  const json = path.join(outputDir, 'backlog-registry-review.json');
  const summary = path.join(outputDir, 'backlog-registry-review.md');
  fs.writeFileSync(json, JSON.stringify(review, null, 2), 'utf8');
  fs.writeFileSync(summary, renderSummary(config, review), 'utf8');
  return { json, summary };
}

function renderSummary(config, review) {
  const lines = [];
  lines.push('# Backlog Registry Review');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Registry: \`${review.registry_ref}\``);
  lines.push(`- Backlog items: ${review.summary.backlog_items}`);
  lines.push(`- Items con assigned_cr_sst: ${review.summary.assigned_cr_sst_items}`);
  lines.push(`- Items con jira_issue_key: ${review.summary.jira_linked_items}`);
  lines.push(`- Findings: ${review.summary.findings}`);
  lines.push('- Escritura Jira: no');
  lines.push('- Transiciones locales automaticas: 0');
  lines.push('');
  lines.push('## Orden Por Prioridad');
  lines.push('');
  for (const item of review.summary.next_by_priority) {
    lines.push(`- ${item.backlog_id}: ${item.priority}, ${item.status}, assigned_cr_sst=${item.assigned_cr_sst || 'null'} - ${item.title}`);
  }
  lines.push('');
  lines.push('## Findings');
  lines.push('');
  if (review.findings.length === 0) {
    lines.push('- ninguno');
  } else {
    review.findings.forEach((finding) => {
      lines.push(`- ${finding.severity.toUpperCase()} ${finding.scope}: ${finding.message}`);
    });
  }
  lines.push('');
  lines.push('## Decision');
  lines.push('');
  lines.push('Este artifact revisa el backlog local. No reserva CR-SST, no escribe Jira y no modifica feature_state.');
  return `${lines.join('\n')}\n`;
}

function parseBacklogItems(text) {
  const items = [];
  let current = null;
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
      items.push(current);
      current[first[1]] = normalize(first[2]);
      continue;
    }

    if (!current) continue;
    const next = line.match(/^\s{4}([A-Za-z0-9_-]+):\s*(.*)$/);
    if (next) current[next[1]] = normalize(next[2]);
  }

  return items;
}

function topLevel(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*(.+)\\s*$`, 'm'));
  return match ? normalize(match[1]) : null;
}

function normalize(value) {
  const trimmed = String(value || '').trim();
  if (trimmed === 'null') return null;
  return trimmed.replace(/^['"]|['"]$/g, '').trim();
}

function add(findings, severity, scope, message) {
  findings.push({ severity, scope, message });
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

