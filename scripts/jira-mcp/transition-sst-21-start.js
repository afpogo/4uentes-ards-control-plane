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
const ISSUE_KEY = 'SST-21';

async function main() {
  requireConnectFlag();
  requireApprovedFlag();
  const args = parseArgs(process.argv.slice(2), {
    valueOptions: ['request-id', 'output-dir', 'preferred-transition'],
  });
  requireEvidenceArgs(args);

  const { config, client } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    const cloudId = await resolveCloudId(client);
    const before = await getIssue(client, cloudId);
    const transitions = await getTransitions(client, cloudId);
    const selectedTransition = selectTransition(transitions, args['preferred-transition'] || 'En curso');
    if (!selectedTransition && !isActive(before.status, before.statusCategory)) {
      throw new Error(`No se encontro transicion activa para ${ISSUE_KEY}.`);
    }

    const description = renderDescription();
    const comment = renderComment(effectiveConfig, before, selectedTransition);
    const labels = reconcileLabels(before.labels);

    const editResult = await editIssue(client, cloudId, { description, labels });
    const transitionResult = isActive(before.status, before.statusCategory)
      ? null
      : await transitionIssue(client, cloudId, selectedTransition);
    const commentResult = await addComment(client, cloudId, comment);
    const after = await getIssue(client, cloudId);

    const summary = {
      requestId: effectiveConfig.evidence.requestId,
      issueKey: ISSUE_KEY,
      mode: 'approved-write',
      before,
      after,
      selectedTransition,
      transitions,
      labels,
      editResult: sanitizeJson(editResult),
      transitionResult: sanitizeJson(transitionResult),
      commentResult: sanitizeJson(commentResult),
      externalWrite: true,
    };

    const output = writeEvidence(effectiveConfig, summary);
    console.log(`OK: Issue: ${ISSUE_KEY}`);
    console.log('OK: Mode: approved-write');
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
  const fields = data && typeof data === 'object' && data.fields ? data.fields : {};
  return {
    summary: fields.summary || firstMarkdownValue(text, 'Summary') || 'no-detectado',
    status: fields.status && fields.status.name ? fields.status.name : firstMarkdownValue(text, 'Status') || 'no-detectado',
    statusCategory:
      fields.status && fields.status.statusCategory && fields.status.statusCategory.name
        ? fields.status.statusCategory.name
        : statusCategoryValue(text) || 'no-detectado',
    resolution: fields.resolution && fields.resolution.name ? fields.resolution.name : firstMarkdownValue(text, 'Resolution') || 'no-detectado',
    assignee: fields.assignee && fields.assignee.displayName ? fields.assignee.displayName : firstMarkdownValue(text, 'Assignee') || 'no-asignado',
    updated: fields.updated || firstMarkdownValue(text, 'Updated') || 'no-detectado',
    labels: Array.isArray(fields.labels) ? fields.labels.map(String) : extractLabels(text),
    raw: sanitize(text),
  };
}

async function getTransitions(client, cloudId) {
  const result = await client.callTool('getTransitionsForJiraIssue', {
    cloudId,
    issueIdOrKey: ISSUE_KEY,
  });
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
    'Subtask under `SST-4` for the next governed execution slice.',
    '',
    '* CR: `CR-SST-0073`',
    '* Scope: `sst-bend` governed tags search, explicit value creation, and resource binding API.',
    '* Source request: `requests/planned/CR-SST-0073-sst-tags-search-and-resource-binding-api.yaml`',
    '* Goal: expose `GET /tags/definitions`, `GET /tags/values`, `POST /tags/values`, and `PUT /tags/resources/:resourceType/:resourceId` on top of the global persistence model delivered in `CR-SST-0072`.',
    '* Risk: high due to public backend API contract, attach/detach semantics, and future BFF/frontend adoption.',
    '',
    'Execution guardrails:',
    '',
    '* Keep this CR inside `sst-bend` only.',
    '* Do not modify `4uentes-auth`, `sst-fend`, or `sst-extension` in this CR.',
    '* Do not change existing public dictionary/article response shapes unless explicitly required by the contract.',
    '* Preserve `dictionary-tags` validated-live behavior while introducing governed tag API surfaces.',
    '',
    'Canonical control-plane refs:',
    '',
    '* docs/requests/sst-tags-governance-contract.md',
    '* state/features/sst-tags-governance.current.yaml',
    '* requests/planned/CR-SST-0073-sst-tags-search-and-resource-binding-api.yaml',
  ].join('\n');
}

function renderComment(config, before, selectedTransition) {
  return [
    `CR-SST start execution: ${config.evidence.requestId}`,
    '',
    '`SST-21` is being transitioned to active work under `CR-SST-0073`.',
    '',
    'Scope:',
    '',
    '- Backend-only implementation in `sst-bend`.',
    '- Governed tag definitions and values read/search endpoints.',
    '- Explicit `TagValue` creation with duplicate conflict semantics.',
    '- Resource bind/unbind by `resourceType + resourceId` with `tags: []` clearing semantics.',
    '',
    'Out of scope:',
    '',
    '- BFF facade in `4uentes-auth`.',
    '- UI selector work in `sst-fend`.',
    '- Dictionary final adoption and SST-4 closure.',
    '',
    'Evidence refs:',
    '',
    '- requests/planned/CR-SST-0073-sst-tags-search-and-resource-binding-api.yaml',
    '- docs/requests/sst-tags-governance-contract.md',
    '- state/features/sst-tags-governance.current.yaml',
    '',
    `Before status: ${before.status}`,
    `Transition: ${selectedTransition ? `${selectedTransition.name} (${selectedTransition.id})` : 'not required'}`,
  ].join('\n');
}

function selectTransition(transitions, preferred) {
  const normalized = normalize(preferred);
  return (
    transitions.find((item) => normalize(item.name) === normalized) ||
    transitions.find((item) => /en curso|progress|doing|in work/.test(normalize(`${item.name} ${item.toStatus} ${item.toStatusCategory}`))) ||
    null
  );
}

function reconcileLabels(labels) {
  const stale = new Set(['not-done']);
  const next = labels.filter((label) => !stale.has(label));
  for (const label of ['active-work', 'cr-sst-0073']) {
    if (!next.includes(label)) next.push(label);
  }
  return next.sort();
}

function isActive(status, statusCategory) {
  return /en curso|progress|doing|in work/i.test(`${status} ${statusCategory}`);
}

function writeEvidence(config, summary) {
  const jsonOutput = outputPath(config, 'jira-sst-21-start-transition-result.json');
  const output = outputPath(config, 'jira-sst-21-start-transition-summary.md');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');

  const lines = [];
  lines.push('# SST-21 Jira Start Transition Execution');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Issue key: ${ISSUE_KEY}`);
  lines.push('- Modo: approved-write');
  lines.push('- Escritura Jira: si');
  lines.push('');
  lines.push('## Resultado');
  lines.push('');
  lines.push(`- Estado previo: ${sanitize(summary.before.status)}`);
  lines.push(`- Categoria previa: ${sanitize(summary.before.statusCategory)}`);
  lines.push(`- Estado posterior: ${sanitize(summary.after.status)}`);
  lines.push(`- Categoria posterior: ${sanitize(summary.after.statusCategory)}`);
  lines.push(`- Transicion seleccionada: ${summary.selectedTransition ? `${sanitize(summary.selectedTransition.name)} (${sanitize(summary.selectedTransition.id)})` : 'ninguna'}`);
  lines.push(`- Labels posteriores: ${summary.after.labels.map((label) => sanitize(label)).join(', ') || 'ninguno'}`);
  lines.push('- Descripcion actualizada: si');
  lines.push('- Comentario agregado: si');
  lines.push('');
  lines.push('## Evidencia');
  lines.push('');
  lines.push(`- Resultado JSON sanitizado: \`${rel(jsonOutput)}\``);
  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
  return output;
}

function firstMarkdownValue(text, label) {
  const match = text.match(new RegExp(`\\*\\*${label}:\\*\\s*(.+)`, 'i'));
  return match ? match[1].trim() : null;
}

function statusCategoryValue(text) {
  const match = text.match(/"statusCategory"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/i);
  return match ? match[1].trim() : null;
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
  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeJson(item)]));
  }
  return value;
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
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

main().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
});
