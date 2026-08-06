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
    const selectedTransition = selectTransition(transitions, args['preferred-transition'] || 'Listo');
    if (!selectedTransition && !isTerminal(before.status, before.statusCategory)) {
      throw new Error(`No se encontro transicion terminal para ${ISSUE_KEY}.`);
    }

    const description = renderDescription();
    const comment = renderComment(effectiveConfig, before, selectedTransition);
    const labels = reconcileLabels(before.labels);

    const editResult = await editIssue(client, cloudId, { description, labels });
    const transitionResult = isTerminal(before.status, before.statusCategory)
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
    'Proceso de sincronizacion:',
    '',
    '* CR-SST-0073',
    '',
    'Estado actual: backend governed tags API implemented locally and validated for transition closure.',
    '',
    'Resultado:',
    '',
    '* `sst-bend` publica `GET /4uentes/v1/tags/definitions`.',
    '* `sst-bend` publica `GET /4uentes/v1/tags/values`.',
    '* `sst-bend` publica `POST /4uentes/v1/tags/values` con creacion explicita y conflicto por duplicado.',
    '* `sst-bend` publica `PUT /4uentes/v1/tags/resources/:resourceType/:resourceId` con semantica replace/detach.',
    '* Diccionario y Articulos lectores legacy permanecen intactos en este corte.',
    '',
    'Criterio de cierre cumplido:',
    '',
    '* API producer-side gobernada disponible en backend.',
    '* Search/create/bind por recurso implementados sobre el modelo global.',
    '* Validaciones locales y evidencia ARDS/SDD registradas.',
    '* Coleccion `.http` reproducible agregada y endurecida para QA manual autenticado.',
    '',
    'Evidencia principal:',
    '',
    '* requests/done/CR-SST-0073-sst-tags-search-and-resource-binding-api.yaml',
    '* evidence/requests/CR-SST-0073/technical-closure-review.md',
    '* evidence/requests/CR-SST-0073/validation-results.md',
    '* evidence/requests/CR-SST-0073/closure-runtime-qa-notes.md',
    '* evidence/requests/CR-SST-0079/validation-results.md',
    '* state/features/sst-tags-governance.current.yaml',
    '',
    'Validaciones ejecutadas:',
    '',
    '* sst-bend: node scripts/test-tags-governance.js -> PASS 4/4.',
    '* sst-bend: npm.cmd run test:tag-engine -> PASS 7/7.',
    '* sst-bend: npm.cmd run test:diccionario:stage3 -> PASS 11/11.',
    '* sst-bend: npm.cmd run check -> PASS baseline local con skips protegidos cuando falta `SMOKE_JWT`.',
    '* 4uentes-orchestor: npm.cmd run check -> PASS.',
    '',
    'Limites explicitados:',
    '',
    '* BFF facade queda en CR-SST-0074.',
    '* Frontend selector gobernado queda en CR-SST-0075.',
    '* Adopcion de Diccionario y cierre global quedan en CR-SST-0076.',
    '',
    'Fuente canonica:',
    '',
    '* El control-plane ARDS/SDD conserva la fuente canonica. Jira es superficie operativa de visibilidad.',
  ].join('\n');
}

function renderComment(config, before, selectedTransition) {
  return [
    `CR-SST closure execution: ${config.evidence.requestId}`,
    '',
    '`SST-21` queda reconciliado contra la evidencia de `CR-SST-0073`.',
    '',
    'Resumen:',
    '',
    '- API backend gobernada implementada en `sst-bend`.',
    '- Search de values, create explicito y bind/detach por recurso disponibles.',
    '- Persistencia global previa de `CR-SST-0072` reutilizada sin romper readers legacy.',
    '- QA local y evidencia ARDS registradas para el cierre de este slice.',
    '',
    'Validaciones clave:',
    '',
    '- sst-bend test-tags-governance: PASS 4/4.',
    '- sst-bend test:tag-engine: PASS 7/7.',
    '- sst-bend test:diccionario:stage3: PASS 11/11.',
    '- sst-bend check: PASS baseline local.',
    '- 4uentes-orchestor check: PASS.',
    '',
    'Evidencia:',
    '',
    '- requests/done/CR-SST-0073-sst-tags-search-and-resource-binding-api.yaml',
    '- evidence/requests/CR-SST-0073/technical-closure-review.md',
    '- evidence/requests/CR-SST-0073/validation-results.md',
    '- evidence/requests/CR-SST-0073/closure-runtime-qa-notes.md',
    '- evidence/requests/CR-SST-0079/validation-results.md',
    '',
    `Before status: ${before.status}`,
    `Transition: ${selectedTransition ? `${selectedTransition.name} (${selectedTransition.id})` : 'not required'}`,
    '',
    'Gaps restantes siguen gobernados por CR-SST-0074 a CR-SST-0076.',
  ].join('\n');
}

function selectTransition(transitions, preferred) {
  const normalized = normalize(preferred);
  return (
    transitions.find((item) => normalize(item.name) === normalized) ||
    transitions.find((item) => /listo|done|cerrad|finaliz|complete|resolved/.test(normalize(`${item.name} ${item.toStatus} ${item.toStatusCategory}`))) ||
    null
  );
}

function reconcileLabels(labels) {
  const stale = new Set(['active-work', 'in-review']);
  const next = labels.filter((label) => !stale.has(label));
  for (const label of ['done', 'validated-local']) {
    if (!next.includes(label)) next.push(label);
  }
  return next.sort();
}

function isTerminal(status, statusCategory) {
  return /done|listo|finalizada|finalizado|cerrado|cerrada|closed|resolved|complete|completado/i.test(`${status} ${statusCategory}`);
}

function writeEvidence(config, summary) {
  const jsonOutput = outputPath(config, 'jira-sst-21-close-transition-result.json');
  const output = outputPath(config, 'jira-sst-21-close-transition-summary.md');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');

  const lines = [];
  lines.push('# SST-21 Jira Close Transition Execution');
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
  lines.push(`- Resolucion posterior: ${sanitize(summary.after.resolution)}`);
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
  const match = text.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`, 'i'));
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
