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
    valueOptions: ['request-id', 'output-dir', 'issue-key', 'preferred-transition', 'comment-file', 'evidence-prefix'],
  });
  requireEvidenceArgs(args);

  const issueKey = stringArg(args, 'issue-key', null);
  if (!issueKey) throw new Error('Falta --issue-key <KEY>.');

  const commentFile = stringArg(args, 'comment-file', null);
  if (!commentFile) throw new Error('Falta --comment-file <path>.');
  const commentBody = fs.readFileSync(path.resolve(ROOT, commentFile), 'utf8');
  if (!commentBody.trim()) throw new Error('El comentario esta vacio.');

  const evidencePrefix = stringArg(args, 'evidence-prefix', `jira-${issueKey.toLowerCase()}-start-transition`);
  const { config, client } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    const cloudId = await resolveCloudId(client);
    const before = await getIssue(client, cloudId, issueKey);
    const transitions = await getTransitions(client, cloudId, issueKey);
    const selectedTransition = selectStartTransition(
      transitions,
      stringArg(args, 'preferred-transition', 'En curso')
    );

    if (!isActive(before.status, before.statusCategory) && !selectedTransition) {
      throw new Error(`No active transition available for ${issueKey}.`);
    }

    let transitionResult = null;
    if (!isActive(before.status, before.statusCategory)) {
      transitionResult = await transitionIssue(client, cloudId, issueKey, selectedTransition);
    }

    const commentResult = await addComment(client, cloudId, issueKey, commentBody);
    const after = await getIssue(client, cloudId, issueKey);
    const summary = {
      issueKey,
      before,
      after,
      transitions,
      selectedTransition,
      transitionResult: transitionResult ? sanitizeJson(transitionResult) : null,
      commentResult: commentResult ? sanitizeJson(commentResult) : null,
      commentBody: sanitize(commentBody),
      externalWrite: true,
    };
    const output = writeEvidence(effectiveConfig, evidencePrefix, summary);

    console.log(`OK: Issue: ${issueKey}`);
    console.log(`OK: Before status: ${before.status}`);
    console.log(`OK: After status: ${after.status}`);
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
    raw: sanitize(text),
  };
}

async function getTransitions(client, cloudId, issueKey) {
  const result = await client.callTool('getTransitionsForJiraIssue', { cloudId, issueIdOrKey: issueKey });
  const data = parseToolData(result);
  const source = Array.isArray(data) ? data : data && Array.isArray(data.transitions) ? data.transitions : [];
  return source
    .map((item) => ({
      id: String(item.id || item.transitionId || ''),
      name: String(item.name || item.transitionName || ''),
      toStatus: item.to ? String(item.to.name || '') : '',
      toStatusCategory:
        item.to && item.to.statusCategory
          ? String(item.to.statusCategory.name || item.to.statusCategory.key || '')
          : '',
    }))
    .filter((item) => item.id && item.name);
}

async function transitionIssue(client, cloudId, issueKey, transition) {
  const result = await client.callTool('transitionJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    transition: { id: transition.id },
  });
  return parseToolData(result);
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

function selectStartTransition(transitions, preferred) {
  if (!transitions.length) return null;
  const normalized = normalize(preferred);
  return (
    transitions.find((item) => item.id === '21') ||
    transitions.find((item) => normalize(item.name) === normalized || normalize(item.toStatus) === normalized) ||
    transitions.find((item) =>
      /en curso|progress|doing|in work|start/.test(normalize(`${item.name} ${item.toStatus} ${item.toStatusCategory}`))
    ) ||
    null
  );
}

function writeEvidence(config, evidencePrefix, summary) {
  const jsonOutput = outputPath(config, `${evidencePrefix}-result.json`);
  const output = outputPath(config, `${evidencePrefix}-summary.md`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');

  const lines = [];
  lines.push(`# ${sanitize(summary.issueKey)} Jira Start Transition Execution`);
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: \`${sanitize(config.evidence.requestId)}\``);
  lines.push(`- Issue key: \`${sanitize(summary.issueKey)}\``);
  lines.push('- Modo: approved-write');
  lines.push('- Escritura Jira: si, limitada a transition + comment');
  lines.push('');
  lines.push('## Resultado');
  lines.push('');
  lines.push(`- Estado previo: ${sanitize(summary.before.status)}`);
  lines.push(`- Categoria previa: ${sanitize(summary.before.statusCategory)}`);
  lines.push(`- Estado posterior: ${sanitize(summary.after.status)}`);
  lines.push(`- Categoria posterior: ${sanitize(summary.after.statusCategory)}`);
  lines.push(
    `- Transicion seleccionada: ${
      summary.selectedTransition
        ? `${sanitize(summary.selectedTransition.name)} (${sanitize(summary.selectedTransition.id)})`
        : 'ninguna; issue ya activo'
    }`
  );
  lines.push(`- Comentario agregado: ${summary.commentResult ? 'si' : 'no'}`);
  lines.push('');
  lines.push('## Evidencia');
  lines.push('');
  lines.push(`- Resultado JSON sanitizado: \`${rel(jsonOutput)}\``);
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

function isActive(status, statusCategory) {
  return /curso|progress|doing|in work/i.test(`${status} ${statusCategory}`);
}

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function sanitizeJson(value) {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return sanitize(value);
  if (Array.isArray(value)) return value.map((item) => sanitizeJson(item));
  if (typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeJson(item)]));
  return value;
}

function outputPath(config, fileName) {
  return path.join(ROOT, config.evidence.outputDir, fileName);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
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
