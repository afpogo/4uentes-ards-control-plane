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
const { applyEvidenceArgs, parseArgs, requireEvidenceArgs } = require('./lib/cli-args');

const ROOT = process.cwd();

async function main() {
  requireConnectFlag();
  requireApprovedFlag();
  const args = parseArgs(process.argv.slice(2), {
    valueOptions: ['request-id', 'output-dir', 'issue-key', 'comment-file', 'evidence-prefix'],
  });
  requireEvidenceArgs(args);

  const issueKey = stringArg(args, 'issue-key', null);
  if (!issueKey) throw new Error('Falta --issue-key <KEY>.');

  const commentFile = stringArg(args, 'comment-file', null);
  if (!commentFile) throw new Error('Falta --comment-file <path>.');
  const commentBody = readRequiredFile(commentFile);

  const evidencePrefix = stringArg(args, 'evidence-prefix', `jira-${issueKey.toLowerCase()}-comment`);
  const { config, client } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    const cloudId = await resolveCloudId(client);
    const before = await getIssue(client, cloudId, issueKey);
    const commentResult = await addComment(client, cloudId, issueKey, commentBody);
    const after = await getIssue(client, cloudId, issueKey);
    const summary = {
      issueKey,
      before,
      after,
      commentResult: sanitizeJson(commentResult),
      commentBody: sanitize(commentBody),
      externalWrite: true,
    };
    const output = writeEvidence(effectiveConfig, evidencePrefix, summary);

    console.log(`OK: Issue: ${issueKey}`);
    console.log(`OK: Status: ${before.status} -> ${after.status}`);
    console.log(`OK: Evidence written: ${rel(output)}`);
  } finally {
    client.close();
  }
}

async function getIssue(client, cloudId, issueKey) {
  const result = await client.callTool('getJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    fields: ['summary', 'status', 'resolution', 'assignee', 'updated', 'labels'],
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
    raw: sanitize(text),
  };
}

async function addComment(client, cloudId, issueKey, commentBody) {
  const result = await client.callTool('addCommentToJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    commentBody,
    contentFormat: 'markdown',
    responseContentFormat: 'markdown',
  });
  return parseToolData(result);
}

function writeEvidence(config, evidencePrefix, summary) {
  const jsonOutput = outputPath(config, `${evidencePrefix}-result.json`);
  const output = outputPath(config, `${evidencePrefix}-summary.md`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');

  const lines = [];
  lines.push('# Jira Issue Comment Execution');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${sanitize(config.evidence.requestId)}`);
  lines.push(`- Issue key: ${sanitize(summary.issueKey)}`);
  lines.push('- Escritura Jira: si, limitada a comment');
  lines.push('');
  lines.push('## Resultado');
  lines.push('');
  lines.push(`- Estado previo: ${sanitize(summary.before.status)}`);
  lines.push(`- Estado posterior: ${sanitize(summary.after.status)}`);
  lines.push(`- Comentario agregado: ${summary.commentResult ? 'si' : 'no'}`);
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

function readRequiredFile(file) {
  const resolved = path.resolve(ROOT, file);
  if (!fs.existsSync(resolved)) throw new Error(`No existe comment-file: ${file}`);
  const text = fs.readFileSync(resolved, 'utf8');
  if (!text.trim()) throw new Error(`comment-file esta vacio: ${file}`);
  return text;
}

function outputPath(config, name) {
  return path.join(ROOT, config.evidence.outputDir, name);
}

function sanitizeJson(value) {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return sanitize(value);
  if (Array.isArray(value)) return value.map((item) => sanitizeJson(item));
  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeJson(item)]));
  }
  return value;
}

function rel(value) {
  return path.relative(ROOT, value).replace(/\\/g, '/');
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function stringArg(args, key, fallback) {
  return args[key] ? String(args[key]) : fallback;
}

main().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
});
