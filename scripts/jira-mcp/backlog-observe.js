const fs = require('fs');
const path = require('path');
const {
  connectAtlassian,
  parseToolData,
  requireConnectFlag,
  resolveCloudId,
  sanitize,
} = require('./lib/atlassian-mcp');
const { applyEvidenceArgs, parseArgs, requireEvidenceArgs } = require('./lib/cli-args');

const ROOT = process.cwd();
const REGISTRY_FILE = path.join(ROOT, 'state', 'jira-backlog-registry.yaml');

async function main() {
  requireConnectFlag();
  const args = parseArgs(process.argv.slice(2), { valueOptions: ['request-id', 'output-dir'] });
  requireEvidenceArgs(args);
  const { config, client } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    const cloudId = await resolveCloudId(client);
    const items = readRegistryItems();
    const observations = [];

    for (const item of items.filter((entry) => entry.jira_issue_key)) {
      const issue = await getIssue(client, cloudId, item.jira_issue_key);
      observations.push({
        backlogId: item.backlog_id,
        issueKey: item.jira_issue_key,
        title: item.title,
        priority: item.priority,
        backlogStatus: item.status,
        assignedCrSst: item.assigned_cr_sst || null,
        jiraStatus: issue.status,
        statusCategory: issue.statusCategory,
        assignee: issue.assignee,
        updated: issue.updated,
        proposedEvent: eventForStatus(issue.status, issue.statusCategory),
        localTransitionAutomatic: false,
      });
    }

    const output = writeEvidence(effectiveConfig, observations);
    console.log(`OK: Backlog Jira observations: ${observations.length}`);
    console.log(`OK: Jira writes: 0`);
    console.log(`OK: Automatic local transitions: 0`);
    console.log(`OK: Evidence written: ${rel(output)}`);
  } finally {
    client.close();
  }
}

async function getIssue(client, cloudId, issueKey) {
  const result = await client.callTool('getJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    fields: ['summary', 'status', 'assignee', 'updated'],
    responseContentFormat: 'markdown',
  });
  const data = parseToolData(result);
  const text = typeof data === 'string' ? data : JSON.stringify(data);
  return {
    raw: sanitize(text),
    status: firstMarkdownValue(text, 'Status') || firstJsonLikeValue(text, 'name') || 'no-detectado',
    statusCategory: firstJsonLikeValue(text, 'statusCategory') || firstJsonLikeValue(text, 'key') || 'no-detectado',
    assignee: firstMarkdownValue(text, 'Assignee') || firstJsonLikeValue(text, 'displayName') || 'no-asignado',
    updated: firstMarkdownValue(text, 'Updated') || firstJsonLikeValue(text, 'updated') || 'no-detectado',
  };
}

function readRegistryItems() {
  if (!fs.existsSync(REGISTRY_FILE)) throw new Error(`No existe ${rel(REGISTRY_FILE)}.`);
  const text = fs.readFileSync(REGISTRY_FILE, 'utf8');
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

    const first = line.match(/^\s{2}-\s+backlog_id:\s*(.+)$/);
    if (first) {
      current = { backlog_id: normalize(first[1]) };
      items.push(current);
      continue;
    }
    if (!current) continue;
    const next = line.match(/^\s{4}([A-Za-z0-9_-]+):\s*(.*)$/);
    if (next) current[next[1]] = normalize(next[2]);
  }
  return items;
}

function writeEvidence(config, observations) {
  const output = path.join(ROOT, config.evidence.outputDir, 'jira-backlog-observation-summary.md');
  const jsonOutput = path.join(ROOT, config.evidence.outputDir, 'jira-backlog-observation-results.json');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify({ observations }, null, 2), 'utf8');

  const lines = [];
  lines.push('# Jira Backlog Observation');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Observaciones: ${observations.length}`);
  lines.push('- Escritura Jira: no');
  lines.push('- Transiciones locales automaticas: 0');
  lines.push('');
  lines.push('## Observaciones');
  lines.push('');
  for (const item of observations) {
    lines.push(`### ${sanitize(item.backlogId)}`);
    lines.push('');
    lines.push(`- Issue key: \`${sanitize(item.issueKey)}\``);
    lines.push(`- Jira status: ${sanitize(item.jiraStatus)}`);
    lines.push(`- Status category: ${sanitize(item.statusCategory)}`);
    lines.push(`- Assignee: ${sanitize(item.assignee)}`);
    lines.push(`- Updated: ${sanitize(item.updated)}`);
    lines.push(`- Priority: \`${sanitize(item.priority)}\``);
    lines.push(`- Backlog status: \`${sanitize(item.backlogStatus)}\``);
    lines.push(`- Assigned CR-SST: ${item.assignedCrSst ? `\`${sanitize(item.assignedCrSst)}\`` : 'ninguno'}`);
    lines.push(`- Proposed event: \`${item.proposedEvent}\``);
    lines.push('');
  }
  lines.push('## Decision');
  lines.push('');
  lines.push('Estas observaciones son read-only. No actualizan backlog registry, Jira ni request lifecycle.');
  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
  return output;
}

function eventForStatus(status, statusCategory) {
  const normalized = `${status} ${statusCategory}`.toLowerCase();
  if (/done|listo|finalizada|finalizado|cerrado|cerrada|closed|resolved|complete/.test(normalized)) return 'JIRA_WORK_CLOSED_OBSERVED';
  if (/block|bloque/.test(normalized)) return 'JIRA_WORK_BLOCKED';
  if (/progress|curso|doing/.test(normalized)) return 'JIRA_WORK_STARTED';
  return 'JIRA_WORK_PENDING';
}

function firstMarkdownValue(text, label) {
  const match = text.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`, 'i'));
  return match ? match[1].trim() : null;
}

function firstJsonLikeValue(text, key) {
  const match = text.match(new RegExp(`"${key}"\\s*:\\s*(?:"([^"]+)"|\\{[^}]*"name"\\s*:\\s*"([^"]+)")`, 'i'));
  return match ? (match[1] || match[2] || '').trim() : null;
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

main().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
});
