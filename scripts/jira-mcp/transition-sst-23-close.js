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
const ISSUE_KEY = 'SST-23';

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
    const selectedTransition = selectTerminalTransition(transitions);
    const alreadyTerminal = isTerminalStatus(before.status, before.statusCategory);
    const labels = reconcileClosureLabels(before.labels);
    const description = renderDescription();
    const comment = renderComment(before, selectedTransition, alreadyTerminal);

    if (approved && !alreadyTerminal && !selectedTransition) {
      throw new Error(`No terminal transition available for ${ISSUE_KEY}.`);
    }

    let editResult = null;
    let transitionResult = null;
    let commentResult = null;
    let after = before;
    let action = 'dry-run';

    if (approved) {
      editResult = await editIssue(client, cloudId, { description, labels });
      if (!alreadyTerminal) {
        transitionResult = await transitionIssue(client, cloudId, selectedTransition);
        action = 'updated-and-transitioned';
      } else {
        action = 'updated-already-terminal';
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
    'Estado actual: implemented-local / validated-local.',
    '',
    'Resultado:',
    '- CR-SST-0075 implemento el selector gobernado de tags en `sst-fend` para articulos.',
    '- El formulario reemplaza texto libre por busqueda/seleccion gobernada y creacion explicita de `TagValue`.',
    '- Los payloads de create/update de articulos envian `tags` estructurados.',
    '- El update con `tags: []` conserva la semantica de limpieza total.',
    '- La UI del selector fue ajustada a una superficie tipo carta/modal SST.',
    '',
    'Validaciones ejecutadas:',
    '- `sst-fend: npm.cmd run build` -> PASS.',
    '- `sst-fend: npm.cmd run css:types` -> PASS.',
    '- Smoke runtime con JWT real -> PASS: create tag, create articulo con tag, detail includeTags, update `tags: []`, delete articulo.',
    '- QA manual de creacion de tag en articulo -> PASS.',
    '- `4uentes-orchestor: npm.cmd run check` -> PASS, 0 fails.',
    '',
    'Evidencia principal:',
    '- `requests/planned/CR-SST-0075-fend-governed-article-tag-selector.yaml`.',
    '- `evidence/requests/CR-SST-0075/runtime-smoke-real-jwt-2026-06-21.md`.',
    '- `evidence/requests/CR-SST-0075/frontend-build-fix-exact-optional-types-2026-06-23.md`.',
    '- `evidence/requests/CR-SST-0075/frontend-manual-qa-fix-tag-create-ui-2026-06-23.md`.',
    '- `evidence/requests/CR-SST-0075/manual-qa-pass-article-governed-tags-2026-06-23.md`.',
    '',
    'Boundary:',
    '- El cambio queda acotado a `sst-fend`.',
    '- `sst-bend` y `4uentes-auth` permanecen como dependencias upstream ya cubiertas por CR-SST-0073 y CR-SST-0074.',
    '- La adopcion/cierre global de diccionario queda para CR-SST-0076.',
    '',
    'Fuente canonica:',
    '- El control-plane ARDS/SDD conserva la fuente canonica. Jira es superficie operativa de visibilidad.',
  ].join('\n');
}

function renderComment(before, selectedTransition, alreadyTerminal) {
  return [
    'CR-SST-0075 closure execution.',
    '',
    'Se cierra el slice frontend del selector gobernado de tags para articulos.',
    '',
    'Resumen:',
    '- Implementado selector gobernado en `sst-fend`.',
    '- Alta explicita de `TagValue` corregida contra contrato SST/BFF.',
    '- Payload estructurado `tags` validado en create/update.',
    '- Limpieza total validada con `tags: []`.',
    '- UI ajustada a superficie tipo carta/modal SST.',
    '',
    'Validaciones:',
    '- `sst-fend: npm.cmd run build` PASS.',
    '- Smoke runtime con JWT real PASS.',
    '- QA manual de creacion de tags en articulo PASS.',
    '- `4uentes-orchestor: npm.cmd run check` PASS.',
    '',
    `Before status: ${before.status}.`,
    alreadyTerminal ? 'Transition: not required, issue already terminal.' : `Transition: ${selectedTransition ? `${selectedTransition.name} (${selectedTransition.id})` : 'no terminal transition detected'}.`,
    '',
    'Siguiente CR: CR-SST-0076, Dictionary adoption and global closure.',
  ].join('\n');
}

function selectTerminalTransition(transitions) {
  return transitions.find((item) => item.id === '41') ||
    transitions.find((item) => /listo|finalizada|done|closed|resolved/i.test(`${item.name} ${item.toStatus} ${item.toStatusCategory}`)) ||
    null;
}

function reconcileClosureLabels(labels) {
  const stale = new Set(['active-work', 'not-done']);
  const next = labels.filter((label) => !stale.has(label));
  for (const label of ['done', 'validated-local']) {
    if (!next.includes(label)) next.push(label);
  }
  return next.sort();
}

function writeEvidence(config, summary) {
  const jsonOutput = path.join(ROOT, config.evidence.outputDir, 'jira-sst-23-close-transition-result.json');
  const output = path.join(ROOT, config.evidence.outputDir, 'jira-sst-23-close-transition-summary.md');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');

  const lines = [];
  lines.push('# SST-23 Jira Close Transition Execution');
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
  lines.push(`- Resolucion posterior: ${sanitize(summary.after.resolution)}`);
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

function isTerminalStatus(status, statusCategory) {
  return /done|listo|finalizada|finalizado|closed|resolved/i.test(`${status} ${statusCategory}`);
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
