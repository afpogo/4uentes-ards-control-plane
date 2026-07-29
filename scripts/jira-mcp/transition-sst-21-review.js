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
    const selectedTransition = selectTransition(transitions, args['preferred-transition'] || 'In Review');
    const alreadyReview = /review|revisi/i.test(`${before.status} ${before.statusCategory}`);
    if (!selectedTransition && !alreadyReview) {
      throw new Error(`No se encontro transicion review para ${ISSUE_KEY}.`);
    }

    const comment = renderComment(effectiveConfig, before, selectedTransition, alreadyReview);
    const labels = reconcileLabels(before.labels);
    const editResult = await editIssue(client, cloudId, { labels });
    const transitionResult = alreadyReview ? null : await transitionIssue(client, cloudId, selectedTransition);
    const commentResult = await addComment(client, cloudId, comment);
    const after = await getIssue(client, cloudId);

    const summary = {
      requestId: effectiveConfig.evidence.requestId,
      issueKey: ISSUE_KEY,
      mode: 'approved-write',
      before,
      after,
      selectedTransition,
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
    fields: ['summary', 'status', 'resolution', 'assignee', 'updated', 'labels'],
    responseContentFormat: 'markdown',
  });
  const data = parseToolData(result);
  const text = typeof data === 'string' ? data : JSON.stringify(data);
  const fields = data && typeof data === 'object' && data.fields ? data.fields : {};
  return {
    summary: fields.summary || firstMarkdownValue(text, 'Summary') || 'no-detectado',
    status: fields.status?.name || firstMarkdownValue(text, 'Status') || 'no-detectado',
    statusCategory: fields.status?.statusCategory?.name || statusCategoryValue(text) || 'no-detectado',
    resolution: fields.resolution?.name || firstMarkdownValue(text, 'Resolution') || 'no-detectado',
    assignee: fields.assignee?.displayName || firstMarkdownValue(text, 'Assignee') || 'no-asignado',
    updated: fields.updated || firstMarkdownValue(text, 'Updated') || 'no-detectado',
    labels: Array.isArray(fields.labels) ? fields.labels.map(String) : extractLabels(text),
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
      toStatusCategory: item.to?.statusCategory ? String(item.to.statusCategory.name || item.to.statusCategory.key || '') : '',
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

function renderComment(config, before, selectedTransition, alreadyReview) {
  return [
    `CR-SST technical review checkpoint: ${config.evidence.requestId}`,
    '',
    'Backend producer-side scope for SST Tags Governance was strengthened and validated.',
    '',
    'Completed:',
    '- Fixed global tags migration JSONB serialization for `tag_definitions`, `tag_values`, and `tag_occurrences`.',
    '- Re-ran `npm run migration:run` successfully on local Postgres.',
    '- Verified backfill parity: `tag_values=21` vs legacy `dictionary_tag_values=21`; `tag_occurrences=45` vs legacy `dictionary_tag_occurrences=45`; `tag_definitions=39`.',
    '- Verified required indexes for global tag definitions, values, and occurrences.',
    '- Aligned resource binding validation to currently supported resources: `articulo` and `diccionario`.',
    '- Verified unauthenticated protected route boundary returns 401 for definitions, values, and resource binding.',
    '',
    'Validation:',
    '- `node scripts/test-tags-governance.js`: PASS 4/4.',
    '- `npm run test:tag-engine`: PASS 7/7.',
    '- `npm run test:diccionario:stage3`: PASS 11/11.',
    '- `npm run check` in `sst-bend`: exit 0 with expected protected-smoke skips due missing `SMOKE_JWT`/`SMOKE_JWT_OWNER`.',
    '- `npm run check` in `4uentes-orchestor`: PASS.',
    '',
    'Remaining gap before final closure:',
    '- Authenticated endpoint smoke with owner JWT (`SMOKE_JWT_OWNER`) was not executed because the token is not available in the environment.',
    '',
    'Evidence:',
    '- `evidence/requests/CR-SST-0073/technical-closure-review.md`',
    '- `evidence/requests/CR-SST-0073/validation-results.md`',
    '',
    `Before status: ${before.status}`,
    alreadyReview ? 'Transition: not required, issue already in review.' : `Transition: ${selectedTransition ? `${selectedTransition.name} (${selectedTransition.id})` : 'not available'}`,
  ].join('\n');
}

function selectTransition(transitions, preferred) {
  const normalized = normalize(preferred);
  return (
    transitions.find((item) => normalize(item.name) === normalized) ||
    transitions.find((item) => /review|revisi/.test(normalize(`${item.name} ${item.toStatus} ${item.toStatusCategory}`))) ||
    null
  );
}

function reconcileLabels(labels) {
  const next = labels.filter((label) => label !== 'not-done');
  for (const label of ['in-review', 'cr-sst-0073']) {
    if (!next.includes(label)) next.push(label);
  }
  return next.sort();
}

function writeEvidence(config, summary) {
  const jsonOutput = outputPath(config, 'jira-sst-21-review-transition-result.json');
  const output = outputPath(config, 'jira-sst-21-review-transition-summary.md');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');

  const lines = [
    '# SST-21 Jira Review Transition Execution',
    '',
    '## Estado',
    '',
    `- Fecha: ${today()}`,
    `- Request: ${config.evidence.requestId}`,
    `- Issue key: ${ISSUE_KEY}`,
    '- Modo: approved-write',
    '- Escritura Jira: si',
    '',
    '## Resultado',
    '',
    `- Estado previo: ${sanitize(summary.before.status)}`,
    `- Estado posterior: ${sanitize(summary.after.status)}`,
    `- Transicion seleccionada: ${summary.selectedTransition ? `${sanitize(summary.selectedTransition.name)} (${sanitize(summary.selectedTransition.id)})` : 'ninguna'}`,
    `- Labels posteriores: ${summary.after.labels.map((label) => sanitize(label)).join(', ') || 'ninguno'}`,
    '- Comentario agregado: si',
    '',
    '## Evidencia',
    '',
    `- Resultado JSON sanitizado: \`${rel(jsonOutput)}\``,
  ];
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
  if (typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeJson(item)]));
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
