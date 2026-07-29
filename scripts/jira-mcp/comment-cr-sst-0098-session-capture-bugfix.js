const fs = require('fs');
const path = require('path');
const {
  connectAtlassian,
  parseToolData,
  requireApprovedFlag,
  requireConnectFlag,
  resolveCloudId,
  sanitize,
} = require('./lib/atlassian-mcp');

const ROOT = process.cwd();
const ISSUE_KEY = 'SST-30';
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'requests', 'CR-SST-0098');
const COMMENT_FILE = path.join(OUTPUT_DIR, 'jira-sst-30-session-capture-bugfix-comment.md');

async function main() {
  requireConnectFlag();
  requireApprovedFlag();

  const { client } = await connectAtlassian();
  try {
    const cloudId = await resolveCloudId(client);
    const before = await getIssue(client, cloudId);
    const commentBody = fs.readFileSync(COMMENT_FILE, 'utf8');
    const commentResult = await addComment(client, cloudId, commentBody);
    const after = await getIssue(client, cloudId);
    const summary = {
      requestId: 'CR-SST-0098',
      issueKey: ISSUE_KEY,
      mode: 'approved-write',
      action: 'session-capture-bugfix-comment',
      before,
      after,
      commentResult: sanitizeJson(commentResult),
      externalWrite: true,
    };
    const output = writeEvidence(summary);

    console.log(`OK: Issue: ${ISSUE_KEY}`);
    console.log(`OK: Status: ${before.status} -> ${after.status}`);
    console.log(`OK: Evidence written: ${rel(output)}`);
  } finally {
    client.close();
  }
}

async function getIssue(client, cloudId) {
  const result = await client.callTool('getJiraIssue', {
    cloudId,
    issueIdOrKey: ISSUE_KEY,
    fields: ['summary', 'status', 'resolution', 'assignee', 'updated', 'labels'],
    responseContentFormat: 'markdown',
  });
  const data = parseToolData(result);
  const text = typeof data === 'string' ? data : JSON.stringify(data);
  const fields = data && typeof data === 'object' && data.fields ? data.fields : {};
  return {
    summary: fields.summary || firstMarkdownValue(text, 'Summary') || firstJsonLikeValue(text, 'summary') || 'no-detectado',
    status: fields.status?.name || firstMarkdownValue(text, 'Status') || firstJsonLikeValue(text, 'name') || 'no-detectado',
    resolution: fields.resolution?.name || firstMarkdownValue(text, 'Resolution') || 'no-detectado',
    updated: fields.updated || firstMarkdownValue(text, 'Updated') || 'no-detectado',
    labels: Array.isArray(fields.labels) ? fields.labels.map(String) : extractLabels(text),
  };
}

async function addComment(client, cloudId, commentBody) {
  const result = await client.callTool('addCommentToJiraIssue', {
    cloudId,
    issueIdOrKey: ISSUE_KEY,
    commentBody,
    contentFormat: 'markdown',
    responseContentFormat: 'markdown',
  });
  return parseToolData(result);
}

function writeEvidence(summary) {
  const jsonOutput = path.join(OUTPUT_DIR, 'jira-sst-30-session-capture-bugfix-comment-result.json');
  const output = path.join(OUTPUT_DIR, 'jira-sst-30-session-capture-bugfix-comment-summary.md');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');

  const lines = [
    '# SST-30 Jira Session Capture Bugfix Comment',
    '',
    '## Estado',
    '',
    `- Fecha: ${today()}`,
    '- Request: `CR-SST-0098`',
    `- Issue key: \`${ISSUE_KEY}\``,
    '- Escritura Jira: si, comentario solamente',
    '',
    '## Resultado',
    '',
    `- Estado previo: ${sanitize(summary.before.status)}`,
    `- Estado posterior: ${sanitize(summary.after.status)}`,
    '- Comentario agregado: si',
    '- Transicion ejecutada: no',
    '',
    '## Evidencia',
    '',
    `- Resultado JSON sanitizado: \`${rel(jsonOutput)}\``,
  ];
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

function extractLabels(text) {
  const match = text.match(/"labels"\s*:\s*\[([^\]]*)\]/i);
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]);
}

function sanitizeJson(value) {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return sanitize(value);
  if (Array.isArray(value)) return value.map((item) => sanitizeJson(item));
  if (typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeJson(item)]));
  return value;
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

main().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
});
