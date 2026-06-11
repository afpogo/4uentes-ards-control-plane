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

async function main() {
  requireConnectFlag();
  const args = parseArgs(process.argv.slice(2), { valueOptions: ['request-id', 'output-dir'] });
  requireEvidenceArgs(args);
  const { config, client } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    const cloudId = await resolveCloudId(client);
    const reconciliation = readReconciliation(effectiveConfig);
    const exactItems = reconciliation.reconciled.filter((item) => item.matchType === 'exact-summary' && item.selectedIssueKey);
    const observations = [];

    for (const item of exactItems) {
      const issue = await getIssue(client, cloudId, item.selectedIssueKey);
      observations.push({
        stateId: item.stateId,
        issueKey: item.selectedIssueKey,
        expectedSummary: item.expectedSummary,
        jiraStatus: issue.status,
        statusCategory: issue.statusCategory,
        assignee: issue.assignee,
        updated: issue.updated,
        proposedEvent: eventForStatus(issue.status, issue.statusCategory),
        localTransitionAutomatic: false,
      });
    }

    const output = writeEvidence(effectiveConfig, observations);
    console.log(`OK: Jira status observations: ${observations.length}`);
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

function readReconciliation(config) {
  const file = path.join(ROOT, config.evidence.outputDir, 'jira-reconciliation-results.json');
  if (!fs.existsSync(file)) {
    throw new Error(`No existe jira-reconciliation-results.json en ${config.evidence.outputDir}. Ejecuta reconcile primero.`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function eventForStatus(status, statusCategory) {
  const normalized = `${status} ${statusCategory}`.toLowerCase();
  if (/done|cerrado|closed|resolved|complete/.test(normalized)) return 'JIRA_WORK_CLOSED_OBSERVED';
  if (/block|bloque/.test(normalized)) return 'JIRA_WORK_BLOCKED';
  if (/progress|curso|doing/.test(normalized)) return 'JIRA_WORK_STARTED';
  return 'JIRA_WORK_PENDING';
}

function writeEvidence(config, observations) {
  const output = path.join(ROOT, config.evidence.outputDir, 'jira-status-observation-summary.md');
  const jsonOutput = path.join(ROOT, config.evidence.outputDir, 'jira-status-observation-results.json');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify({ observations }, null, 2), 'utf8');

  const lines = [];
  lines.push('# Jira Status Observation');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Project key: \`${config.jira.projectKey}\``);
  lines.push(`- Observaciones: ${observations.length}`);
  lines.push('- Escritura Jira: no');
  lines.push('- Transiciones locales automaticas: 0');
  lines.push('');
  lines.push('## Observaciones');
  lines.push('');

  for (const item of observations) {
    lines.push(`### ${sanitize(item.stateId)}`);
    lines.push('');
    lines.push(`- Issue key: \`${sanitize(item.issueKey)}\``);
    lines.push(`- Jira status: ${sanitize(item.jiraStatus)}`);
    lines.push(`- Status category: ${sanitize(item.statusCategory)}`);
    lines.push(`- Assignee: ${sanitize(item.assignee)}`);
    lines.push(`- Updated: ${sanitize(item.updated)}`);
    lines.push(`- Proposed event: \`${item.proposedEvent}\``);
    lines.push('- Local transition automatic: no');
    lines.push('');
  }

  lines.push('## Decision');
  lines.push('');
  lines.push('Estas observaciones son senales operativas. No actualizan feature_state ni request lifecycle por si solas.');
  fs.writeFileSync(output, `${lines.join('\n')}`, 'utf8');
  return output;
}

function firstMarkdownValue(text, label) {
  const match = text.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`, 'i'));
  return match ? match[1].trim() : null;
}

function firstJsonLikeValue(text, key) {
  const match = text.match(new RegExp(`"${key}"\\s*:\\s*(?:"([^"]+)"|\\{[^}]*"name"\\s*:\\s*"([^"]+)")`, 'i'));
  return match ? (match[1] || match[2] || '').trim() : null;
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
