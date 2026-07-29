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
const ISSUE_KEY = 'SST-27';
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'initiatives', 'INIT-SST-0001');

async function main() {
  requireConnectFlag();
  requireApprovedFlag();

  const { client } = await connectAtlassian();
  try {
    const cloudId = await resolveCloudId(client);
    const before = await getIssue(client, cloudId);
    const transitions = await getTransitions(client, cloudId);
    const selectedTransition = selectStartTransition(transitions);
    if (!isInProgress(before.status, before.statusCategory) && !selectedTransition) {
      throw new Error(`No active transition available for ${ISSUE_KEY}.`);
    }

    let transitionResult = null;
    if (!isInProgress(before.status, before.statusCategory)) {
      transitionResult = await transitionIssue(client, cloudId, selectedTransition);
    }
    const commentResult = await addComment(client, cloudId, renderComment(before, selectedTransition));
    const after = await getIssue(client, cloudId);

    const summary = {
      issueKey: ISSUE_KEY,
      before,
      after,
      transitions,
      selectedTransition,
      transitionResult: transitionResult ? sanitizeJson(transitionResult) : null,
      commentResult: commentResult ? sanitizeJson(commentResult) : null,
      externalWrite: true,
    };
    const output = writeEvidence(summary);

    console.log(`OK: Issue: ${ISSUE_KEY}`);
    console.log(`OK: Before status: ${before.status}`);
    console.log(`OK: After status: ${after.status}`);
    console.log(`OK: Evidence written: ${rel(output)}`);
  } finally {
    client.close();
  }
}

async function getIssue(client, cloudId) {
  const result = await client.callTool('getJiraIssue', {
    cloudId,
    issueIdOrKey: ISSUE_KEY,
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

async function getTransitions(client, cloudId) {
  const result = await client.callTool('getTransitionsForJiraIssue', { cloudId, issueIdOrKey: ISSUE_KEY });
  const data = parseToolData(result);
  const source = Array.isArray(data) ? data : data && Array.isArray(data.transitions) ? data.transitions : [];
  return source
    .map((item) => ({
      id: String(item.id || ''),
      name: String(item.name || ''),
      toStatus: item.to ? String(item.to.name || '') : '',
      toStatusCategory: item.to && item.to.statusCategory ? String(item.to.statusCategory.name || item.to.statusCategory.key || '') : '',
    }))
    .filter((item) => item.id && item.name);
}

async function transitionIssue(client, cloudId, transition) {
  const result = await client.callTool('transitionJiraIssue', {
    cloudId,
    issueIdOrKey: ISSUE_KEY,
    transition: { id: transition.id },
  });
  return parseToolData(result);
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

function renderComment(before, selectedTransition) {
  return [
    'INIT-SST-0001 epic start.',
    '',
    '`SST-27` now tracks SST Tags Governance Continuity as the initiative-level Jira mirror.',
    '',
    'Scope:',
    '- Keep dictionary/article tags governance separated from the active learning-content track.',
    '- Keep `SST-4` and `SST-6` associated under this epic.',
    '- Continue CR-SST-0088/0089/0090/0091 through control-plane evidence before child repo mutation.',
    '',
    'Boundary:',
    '- Jira is an operational mirror.',
    '- ARDS/SDD remains the source of truth.',
    '- This transition does not authorize direct child-repo mutation.',
    '',
    `Before status: ${before.status}.`,
    `Transition: ${selectedTransition ? `${selectedTransition.name} (${selectedTransition.id})` : 'already active'}.`,
  ].join('\n');
}

function selectStartTransition(transitions) {
  return transitions.find((item) => item.id === '21') ||
    transitions.find((item) => /curso|progress|start/i.test(`${item.name} ${item.toStatus} ${item.toStatusCategory}`)) ||
    null;
}

function writeEvidence(summary) {
  const jsonOutput = path.join(OUTPUT_DIR, 'jira-sst-27-start-transition-result.json');
  const output = path.join(OUTPUT_DIR, 'jira-sst-27-start-transition-summary.md');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');

  const lines = [];
  lines.push('# SST-27 Jira Start Transition Execution');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push('- Initiative: `INIT-SST-0001`');
  lines.push(`- Issue key: ${ISSUE_KEY}`);
  lines.push('- Modo: approved-write');
  lines.push('- Escritura Jira: si, limitada a transition + comment');
  lines.push('');
  lines.push('## Resultado');
  lines.push('');
  lines.push(`- Estado previo: ${sanitize(summary.before.status)}`);
  lines.push(`- Categoria previa: ${sanitize(summary.before.statusCategory)}`);
  lines.push(`- Estado posterior: ${sanitize(summary.after.status)}`);
  lines.push(`- Categoria posterior: ${sanitize(summary.after.statusCategory)}`);
  lines.push(`- Transicion seleccionada: ${summary.selectedTransition ? `${sanitize(summary.selectedTransition.name)} (${sanitize(summary.selectedTransition.id)})` : 'ninguna'}`);
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

function isInProgress(status, statusCategory) {
  return /curso|progress/i.test(`${status} ${statusCategory}`);
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
