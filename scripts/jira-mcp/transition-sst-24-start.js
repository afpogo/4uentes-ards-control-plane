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
const ISSUE_KEY = 'SST-24';

async function main() {
  requireConnectFlag();
  const args = parseArgs(process.argv.slice(2), { valueOptions: ['request-id', 'output-dir'] });
  requireEvidenceArgs(args);
  const approved = process.argv.includes('--approved');
  const { config, client } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    const cloudId = await resolveCloudId(client);
    const before = await getIssue(client, cloudId);
    const transitions = await getTransitions(client, cloudId);
    const selectedTransition = selectStartTransition(transitions);
    const labels = reconcileStartLabels(before.labels);
    const description = renderDescription();
    const comment = renderComment(before, selectedTransition);

    if (approved && !selectedTransition && !isInProgress(before.status, before.statusCategory)) {
      throw new Error(`No active transition available for ${ISSUE_KEY}.`);
    }

    let editResult = null;
    let transitionResult = null;
    let commentResult = null;
    let after = before;
    let action = 'dry-run';

    if (approved) {
      editResult = await editIssue(client, cloudId, { description, labels });
      if (!isInProgress(before.status, before.statusCategory) && selectedTransition) {
        transitionResult = await transitionIssue(client, cloudId, selectedTransition);
        action = 'updated-and-transitioned';
      } else {
        action = 'updated-already-active';
      }
      commentResult = await addComment(client, cloudId, comment);
      after = await getIssue(client, cloudId);
    }

    const summary = {
      requestId: effectiveConfig.evidence.requestId,
      issueKey: ISSUE_KEY,
      approved,
      action,
      before,
      after,
      transitions,
      selectedTransition,
      plannedLabels: labels,
      plannedDescription: sanitize(description),
      plannedComment: sanitize(comment),
      editResult: editResult ? sanitizeJson(editResult) : null,
      transitionResult: transitionResult ? sanitizeJson(transitionResult) : null,
      commentResult: commentResult ? sanitizeJson(commentResult) : null,
      externalWrite: approved,
    };

    const output = writeEvidence(effectiveConfig, summary);
    console.log(`OK: Issue: ${ISSUE_KEY}`);
    console.log(`OK: Mode: ${approved ? 'approved-write' : 'dry-run'}`);
    console.log(`OK: Action: ${action}`);
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

async function editIssue(client, cloudId, fields) {
  const result = await client.callTool('editJiraIssue', {
    cloudId,
    issueIdOrKey: ISSUE_KEY,
    fields,
    contentFormat: 'markdown',
    responseContentFormat: 'markdown',
  });
  return parseToolData(result);
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

function renderDescription() {
  return [
    'Subtask under `SST-4` for the final governed tags closure slice.',
    '',
    '* CR: `CR-SST-0076`',
    '* Scope: dictionary adoption and global governance closure.',
    '* Source request: `requests/planned/CR-SST-0076-dictionary-adoption-and-governed-closure.yaml`.',
    '* Goal: adopt or reconcile Diccionario against the global tags model and prepare SST-4 closure evidence.',
    '* Dependencies closed: `CR-SST-0072`, `CR-SST-0073`, `CR-SST-0074`, `CR-SST-0075`.',
    '',
    'Execution guardrails:',
    '',
    '* Preserve `dictionary-tags` validated-live behavior.',
    '* Do not regress legacy dictionary readers while reconciling global tag governance.',
    '* Keep `learning-content` and `bitacora` explicitly future/reserved scopes.',
    '* Close `SST-4` only after evidence supports the global governed tags closure.',
    '',
    'Canonical control-plane refs:',
    '',
    '* `docs/requests/sst-tags-governance-contract.md`',
    '* `state/features/sst-tags-governance.current.yaml`',
    '* `state/features/dictionary-tags.current.yaml`',
    '* `requests/planned/CR-SST-0076-dictionary-adoption-and-governed-closure.yaml`',
  ].join('\n');
}

function renderComment(before, selectedTransition) {
  return [
    'CR-SST-0076 start execution.',
    '',
    '`SST-24` is the final subtask for `SST-4` governed tags closure.',
    '',
    'Start scope:',
    '- Reconcile Diccionario against the global tags model.',
    '- Preserve existing `dictionary-tags` validated-live behavior.',
    '- Produce closure evidence for `SST-4`.',
    '- Keep `learning-content` and `bitacora` as future reserved scopes.',
    '',
    'Inputs already closed:',
    '- `CR-SST-0072`: global persistence and dual-write.',
    '- `CR-SST-0073`: backend tags API.',
    '- `CR-SST-0074`: BFF facade.',
    '- `CR-SST-0075`: article governed selector UI.',
    '',
    `Before status: ${before.status}.`,
    `Transition: ${selectedTransition ? `${selectedTransition.name} (${selectedTransition.id})` : 'already active or no transition selected'}.`,
  ].join('\n');
}

function selectStartTransition(transitions) {
  return transitions.find((item) => item.id === '21') ||
    transitions.find((item) => /curso|progress|start/i.test(`${item.name} ${item.toStatus} ${item.toStatusCategory}`)) ||
    null;
}

function reconcileStartLabels(labels) {
  const stale = new Set(['done', 'not-done']);
  const next = labels.filter((label) => !stale.has(label));
  for (const label of ['active-work']) {
    if (!next.includes(label)) next.push(label);
  }
  return next.sort();
}

function writeEvidence(config, summary) {
  const jsonOutput = path.join(ROOT, config.evidence.outputDir, 'jira-sst-24-start-transition-result.json');
  const output = path.join(ROOT, config.evidence.outputDir, 'jira-sst-24-start-transition-summary.md');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');

  const lines = [];
  lines.push('# SST-24 Jira Start Transition Execution');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Issue key: ${ISSUE_KEY}`);
  lines.push(`- Modo: ${summary.approved ? 'approved-write' : 'dry-run'}`);
  lines.push(`- Escritura Jira: ${summary.externalWrite ? 'si' : 'no'}`);
  lines.push('');
  lines.push('## Resultado');
  lines.push('');
  lines.push(`- Estado previo: ${sanitize(summary.before.status)}`);
  lines.push(`- Categoria previa: ${sanitize(summary.before.statusCategory)}`);
  lines.push(`- Estado posterior: ${sanitize(summary.after.status)}`);
  lines.push(`- Categoria posterior: ${sanitize(summary.after.statusCategory)}`);
  lines.push(`- Transicion seleccionada: ${summary.selectedTransition ? `${sanitize(summary.selectedTransition.name)} (${sanitize(summary.selectedTransition.id)})` : 'ninguna'}`);
  lines.push(`- Labels posteriores: ${summary.after.labels.map((label) => sanitize(label)).join(', ') || 'ninguno'}`);
  lines.push(`- Descripcion actualizada: ${summary.editResult ? 'si' : 'no'}`);
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
