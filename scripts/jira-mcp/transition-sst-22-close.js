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
const ISSUE_KEY = 'SST-22';

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
    const selection = selectTransition(transitions, args['preferred-transition'] || 'Listo');
    const alreadyTerminal = isTerminal(before.status, before.statusCategory);
    const comment = renderComment(effectiveConfig, before, selection, alreadyTerminal);
    const description = renderDescription(selection);
    const labels = reconcileLabels(before.labels, selection.mode, alreadyTerminal);

    if (!alreadyTerminal && !selection.transition) {
      throw new Error(`No se encontro una transicion util para ${ISSUE_KEY}.`);
    }

    const editResult = await editIssue(client, cloudId, { description, labels });
    const transitionResult = alreadyTerminal ? null : await transitionIssue(client, cloudId, selection.transition);
    const commentResult = await addComment(client, cloudId, comment);
    const after = await getIssue(client, cloudId);

    const summary = {
      requestId: effectiveConfig.evidence.requestId,
      issueKey: ISSUE_KEY,
      mode: 'approved-write',
      transitionMode: alreadyTerminal ? 'already-terminal' : selection.mode,
      before,
      after,
      selectedTransition: selection.transition,
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
    console.log(`OK: Transition mode: ${summary.transitionMode}`);
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
    status: fields.status?.name || firstMarkdownValue(text, 'Status') || 'no-detectado',
    statusCategory: fields.status?.statusCategory?.name || statusCategoryValue(text) || 'no-detectado',
    resolution: fields.resolution?.name || firstMarkdownValue(text, 'Resolution') || 'no-detectado',
    assignee: fields.assignee?.displayName || firstMarkdownValue(text, 'Assignee') || 'no-asignado',
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

function renderDescription(selection) {
  const transitionNote =
    selection.mode === 'terminal'
      ? 'El workflow permite cierre directo desde `En curso`; se solicita transicion terminal en este mismo paso.'
      : 'Si el workflow no ofrece cierre directo desde `En curso`, se usa `En revisión` como estado puente con el mismo comentario técnico de cierre.';

  return [
    'Proceso de sincronizacion:',
    '',
    '* CR-SST-0074',
    '',
    'Estado actual: fachada BFF autenticada para SST Tags Governance validada tecnicamente con JWT real.',
    '',
    'Resultado:',
    '',
    '* `4uentes-auth` expone y preserva la fachada `GET /api/tags/definitions`.',
    '* `4uentes-auth` preserva `401` cuando falta bearer en el boundary de autenticacion.',
    '* `4uentes-auth` preserva `409` en duplicate create semantics de `POST /api/tags/values`.',
    '* `4uentes-auth` preserva `403` cuando un owner JWT real usa `x-active-account-id` inconsistente y fuera de scope.',
    '* El cierre tecnico final no dependio de un usuario `member` real ni requirio cambios de runtime.',
    '',
    'Criterio de cierre tecnico cumplido:',
    '',
    '* Smoke baseline `200` sobre la fachada BFF ejecutado con JWT real.',
    '* Smoke negativo `403` ejecutado con owner JWT real mas `x-active-account-id` ajeno.',
    '* Boundaries `200`, `401`, `403` y `409` preservados sin drift funcional.',
    '* Evidencia local actualizada y `4uentes-orchestor: npm.cmd run check` en PASS.',
    '',
    'Evidencia principal:',
    '',
    '* evidence/requests/CR-SST-0074/validation-results.md',
    '* evidence/requests/CR-SST-0074/execution-start-notes.md',
    '* evidence/requests/CR-SST-0074/jira-sst-22-start-transition-summary.md',
    '',
    'Validaciones ejecutadas:',
    '',
    '* `POST http://localhost:4000/api/auth/login`: PASS.',
    '* `GET http://localhost:3005/4uentes/v1/me` con JWT real: PASS, role `owner`.',
    '* `GET http://localhost:4000/api/tags/definitions?resourceType=articulo&limit=5`: PASS, `200`.',
    '* `POST http://localhost:4000/api/tags/values` con `x-active-account-id` fuera de scope: PASS, `403`.',
    '* `4uentes-orchestor: npm.cmd run check`: PASS.',
    '',
    'Limites explicitados:',
    '',
    '* El request local `CR-SST-0074` permanece `in_progress` hasta reconciliacion posterior del lifecycle del control-plane.',
    '* Este paso transiciona Jira; no mueve aun el request local a `done`.',
    '',
    'Nota de workflow:',
    '',
    `* ${transitionNote}`,
    '',
    'Fuente canonica:',
    '',
    '* El control-plane ARDS/SDD conserva la fuente canonica. Jira es superficie operativa de visibilidad.',
  ].join('\n');
}

function renderComment(config, before, selection, alreadyTerminal) {
  const transitionLine = alreadyTerminal
    ? 'Transition: not required, issue already terminal.'
    : selection.transition
      ? `Transition: ${selection.transition.name} (${selection.transition.id}) [mode=${selection.mode}]`
      : 'Transition: not available.';

  return [
    `CR-SST cierre tecnico: ${config.evidence.requestId}`,
    '',
    '`SST-22` queda listo para cierre operativo contra la evidencia local de `CR-SST-0074`.',
    '',
    'Resumen:',
    '',
    '- La fachada BFF de governed tags en `4uentes-auth` fue validada con JWT real de `node-auth`.',
    '- `GET /api/tags/definitions` preservo `200`.',
    '- `GET /api/tags/definitions` sin bearer preservo `401` en el auth boundary del BF.',
    '- `POST /api/tags/values` preservo `409` en duplicate create semantics.',
    '- `POST /api/tags/values` preservo `403` cuando se uso owner JWT real con `x-active-account-id` inconsistente y fuera de scope.',
    '',
    'Validaciones clave:',
    '',
    '- `POST /api/auth/login`: PASS.',
    '- `GET /4uentes/v1/me` con JWT real: PASS, cuenta activa owner resuelta.',
    '- `GET /api/tags/definitions?resourceType=articulo&limit=5`: PASS 200.',
    '- `POST /api/tags/values` con `x-active-account-id` ajeno: PASS 403.',
    '- `4uentes-orchestor: npm.cmd run check`: PASS.',
    '',
    'Evidencia:',
    '',
    '- `evidence/requests/CR-SST-0074/validation-results.md`',
    '- `evidence/requests/CR-SST-0074/execution-start-notes.md`',
    '',
    `Before status: ${before.status}`,
    transitionLine,
    '',
    'Nota: el lifecycle local del request sigue fuera de este paso; aqui solo se reconcilia la superficie Jira.',
  ].join('\n');
}

function selectTransition(transitions, preferred) {
  const normalized = normalize(preferred);
  const explicit = transitions.find((item) => normalize(item.name) === normalized || normalize(item.toStatus) === normalized);
  if (explicit) return { mode: 'terminal', transition: explicit };

  const terminal = transitions.find((item) =>
    /listo|done|resuelt|cerrad|closed|resolved|complete|complet|finaliz/.test(
      normalize(`${item.name} ${item.toStatus} ${item.toStatusCategory}`),
    ),
  );
  if (terminal) return { mode: 'terminal', transition: terminal };

  const review = transitions.find((item) =>
    /review|revisi/.test(normalize(`${item.name} ${item.toStatus} ${item.toStatusCategory}`)),
  );
  if (review) return { mode: 'review-fallback', transition: review };

  return { mode: 'none', transition: null };
}

function reconcileLabels(labels, mode, alreadyTerminal) {
  const stale = new Set(['active-work', 'in-review', 'not-done']);
  const next = labels.filter((label) => !stale.has(label));

  if (alreadyTerminal || mode === 'terminal') {
    for (const label of ['done', 'validated-live']) {
      if (!next.includes(label)) next.push(label);
    }
  } else if (mode === 'review-fallback') {
    for (const label of ['in-review', 'validated-live']) {
      if (!next.includes(label)) next.push(label);
    }
  }

  return next.sort();
}

function isTerminal(status, statusCategory) {
  return /done|listo|finalizada|finalizado|cerrado|cerrada|closed|resolved|complete|completado/i.test(
    `${status} ${statusCategory}`,
  );
}

function writeEvidence(config, summary) {
  const jsonOutput = outputPath(config, 'jira-sst-22-transition-result.json');
  const output = outputPath(config, 'jira-sst-22-transition-summary.md');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');

  const lines = [];
  lines.push('# SST-22 Jira Transition Execution');
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
  lines.push(`- Modo de transicion: ${sanitize(summary.transitionMode)}`);
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
