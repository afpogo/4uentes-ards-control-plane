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
  const args = parseArgs(process.argv.slice(2), { valueOptions: ['request-id', 'output-dir', 'issue-key'] });
  requireEvidenceArgs(args);
  const issueKey = args['issue-key'] ? String(args['issue-key']) : null;
  if (!issueKey) throw new Error('Falta --issue-key <KEY>.');

  const { config, client, tools } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    const cloudId = await resolveCloudId(client);
    const issue = await getIssue(client, cloudId, issueKey);
    const transitions = await getTransitions(client, cloudId, issueKey, tools);
    const output = writeEvidence(effectiveConfig, { issueKey, issue, transitions });

    console.log(`OK: Issue: ${issueKey}`);
    console.log(`OK: Status: ${issue.status}`);
    console.log(`OK: Category: ${issue.statusCategory}`);
    console.log(`OK: Labels: ${issue.labels.join(', ') || 'none'}`);
    console.log(`OK: Evidence written: ${rel(output)}`);
  } finally {
    client.close();
  }
}

async function getIssue(client, cloudId, issueKey) {
  const result = await client.callTool('getJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    fields: ['summary', 'status', 'resolution', 'assignee', 'updated', 'description', 'labels'],
    responseContentFormat: 'markdown',
  });
  const data = parseToolData(result);
  const text = typeof data === 'string' ? data : JSON.stringify(data);
  return {
    summary: firstMarkdownValue(text, 'Summary') || firstJsonLikeValue(text, 'summary') || 'no-detectado',
    status: firstMarkdownValue(text, 'Status') || firstJsonLikeValue(text, 'name') || 'no-detectado',
    statusCategory: statusCategoryValue(text) || 'no-detectado',
    resolution: firstMarkdownValue(text, 'Resolution') || firstJsonLikeValue(text, 'resolution') || 'no-detectado',
    assignee: firstMarkdownValue(text, 'Assignee') || firstJsonLikeValue(text, 'displayName') || 'no-asignado',
    updated: firstMarkdownValue(text, 'Updated') || firstJsonLikeValue(text, 'updated') || 'no-detectado',
    labels: extractLabels(data, text),
    description: descriptionValue(data, text),
    raw: sanitize(text),
  };
}

async function getTransitions(client, cloudId, issueKey, tools) {
  if (!tools.some((tool) => tool.name === 'getTransitionsForJiraIssue')) return [];
  const result = await client.callTool('getTransitionsForJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
  });
  const data = parseToolData(result);
  const source = Array.isArray(data) ? data : data && Array.isArray(data.transitions) ? data.transitions : [];
  return source.map((item) => ({
    id: String(item.id || ''),
    name: String(item.name || ''),
    toStatus: item.to ? String(item.to.name || '') : '',
    toStatusCategory: item.to && item.to.statusCategory ? String(item.to.statusCategory.name || item.to.statusCategory.key || '') : '',
  }));
}

function writeEvidence(config, summary) {
  const output = path.join(ROOT, config.evidence.outputDir, `jira-issue-${summary.issueKey}-observation.md`);
  const jsonOutput = path.join(ROOT, config.evidence.outputDir, `jira-issue-${summary.issueKey}-observation.json`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');

  const lines = [];
  lines.push(`# Jira Issue Observation: ${sanitize(summary.issueKey)}`);
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push('- Escritura Jira: no');
  lines.push('');
  lines.push('## Issue');
  lines.push('');
  lines.push(`- Summary: ${sanitize(summary.issue.summary)}`);
  lines.push(`- Status: ${sanitize(summary.issue.status)}`);
  lines.push(`- Status category: ${sanitize(summary.issue.statusCategory)}`);
  lines.push(`- Resolution: ${sanitize(summary.issue.resolution)}`);
  lines.push(`- Assignee: ${sanitize(summary.issue.assignee)}`);
  lines.push(`- Updated: ${sanitize(summary.issue.updated)}`);
  lines.push(`- Labels: ${summary.issue.labels.map((label) => sanitize(label)).join(', ') || 'ninguno'}`);
  lines.push('');
  lines.push('## Transiciones Disponibles');
  lines.push('');
  if (summary.transitions.length === 0) {
    lines.push('- ninguna observada');
  } else {
    for (const transition of summary.transitions) {
      lines.push(`- ${sanitize(transition.name)} (${sanitize(transition.id)}) -> ${sanitize(transition.toStatus || 'sin destino detectado')}`);
    }
  }
  lines.push('');
  lines.push('## Descripcion Sanitizada');
  lines.push('');
  lines.push('```text');
  lines.push(sanitize(summary.issue.description || ''));
  lines.push('```');
  lines.push('');
  lines.push('## Evidencia');
  lines.push('');
  lines.push(`- JSON sanitizado: \`${rel(jsonOutput)}\``);
  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
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

function statusCategoryValue(text) {
  const match = text.match(/"statusCategory"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/i);
  return match ? match[1].trim() : firstJsonLikeValue(text, 'statusCategory');
}

function extractLabels(data, text) {
  if (data && data.fields && Array.isArray(data.fields.labels)) return data.fields.labels.map(String);
  const match = text.match(/"labels"\s*:\s*\[([^\]]*)\]/i);
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]);
}

function descriptionValue(data, text) {
  if (data && data.fields && typeof data.fields.description === 'string') return data.fields.description;
  const match = text.match(/"description"\s*:\s*"((?:\\"|[^"])*)"/i);
  return match ? match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') : '';
}

function sanitizeJson(value) {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return sanitize(value);
  if (Array.isArray(value)) return value.map((item) => sanitizeJson(item));
  if (typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeJson(item)]));
  return value;
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
