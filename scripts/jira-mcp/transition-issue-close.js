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
const TOOL_NAMES = [
  'getJiraIssue',
  'getTransitionsForJiraIssue',
  'addCommentToJiraIssue',
  'editJiraIssue',
  'transitionJiraIssue',
];

async function main() {
  requireConnectFlag();
  const args = parseArgs(process.argv.slice(2), {
    valueOptions: ['request-id', 'output-dir', 'issue-key', 'preferred-transition', 'description-file', 'comment-file', 'evidence-prefix'],
  });
  requireEvidenceArgs(args);
  const issueKey = stringArg(args, 'issue-key', null);
  if (!issueKey) throw new Error('Falta --issue-key <KEY>.');

  const approved = process.argv.includes('--approved');
  const labelsOnly = process.argv.includes('--labels-only');
  const { config, client, tools } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    const cloudId = await resolveCloudId(client);
    const selectedTools = tools.filter((tool) => TOOL_NAMES.includes(tool.name));
    writeToolSchemaEvidence(effectiveConfig, selectedTools);
    requireTools(selectedTools);

    const before = await getIssue(client, cloudId, issueKey);
    const transitions = await getTransitions(client, cloudId, issueKey);
    const selectedTransition = selectTransition(transitions, stringArg(args, 'preferred-transition', null));
    const alreadyTerminal = isTerminalStatus(before.status, before.statusCategory);

    const plannedDescription = readOptionalFile(args, 'description-file') || renderSst10Description();
    const plannedComment = readOptionalFile(args, 'comment-file') || renderSst10ClosureComment(effectiveConfig, before, selectedTransition, alreadyTerminal);
    const plannedLabels = reconcileClosureLabels(before.labels);

    if (approved && !labelsOnly && !alreadyTerminal && !selectedTransition) {
      throw new Error(
        `No terminal transition available for ${issueKey}. Available transitions: ${transitions
          .map((transition) => `${transition.name} (${transition.id})`)
          .join(', ')}`,
      );
    }

    let editResult = null;
    let transitionResult = null;
    let commentResult = null;
    let action = 'dry-run';
    let after = before;

    if (approved) {
      if (labelsOnly) {
        editResult = await editIssueFields(client, cloudId, issueKey, { labels: plannedLabels });
        action = 'labels-updated';
      } else {
        editResult = await editIssueFields(client, cloudId, issueKey, {
          description: plannedDescription,
          labels: plannedLabels,
        });
        if (!alreadyTerminal) {
          transitionResult = await transitionIssue(client, cloudId, issueKey, selectedTransition);
          action = 'updated-and-transitioned';
        } else {
          action = 'updated-already-terminal';
        }
        commentResult = await addClosureComment(client, cloudId, issueKey, plannedComment);
      }
      after = await getIssue(client, cloudId, issueKey);
    }

    const summary = {
      requestId: effectiveConfig.evidence.requestId,
      issueKey,
      approved,
      action,
      before,
      after,
      selectedTransition,
      transitions,
      plannedLabels,
      plannedDescription: sanitize(plannedDescription),
      plannedComment: sanitize(plannedComment),
      editResult: editResult ? sanitizeJson(editResult) : null,
      transitionResult: transitionResult ? sanitizeJson(transitionResult) : null,
      commentResult: commentResult ? sanitizeJson(commentResult) : null,
      externalWrite: approved,
    };

    const evidencePrefix = stringArg(args, 'evidence-prefix', 'jira-issue-transition');
    const output = writeExecutionEvidence(effectiveConfig, summary, evidencePrefix);
    console.log(`OK: Issue: ${issueKey}`);
    console.log(`OK: Mode: ${approved ? 'approved-write' : 'dry-run'}`);
    console.log(`OK: Action: ${action}`);
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
  const result = await client.callTool('getTransitionsForJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
  });
  const data = parseToolData(result);
  return normalizeTransitions(data);
}

async function editIssueFields(client, cloudId, issueKey, fields) {
  const result = await client.callTool('editJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    fields,
    contentFormat: 'markdown',
    responseContentFormat: 'markdown',
  });
  return parseToolData(result);
}

async function transitionIssue(client, cloudId, issueKey, transition) {
  const result = await client.callTool('transitionJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    transition: { id: transition.id },
  });
  return parseToolData(result);
}

async function addClosureComment(client, cloudId, issueKey, commentBody) {
  const result = await client.callTool('addCommentToJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    commentBody,
    contentFormat: 'markdown',
    responseContentFormat: 'markdown',
  });
  return parseToolData(result);
}

function renderSst10Description() {
  return [
    'Estado actual: validated-live.',
    '',
    'Resultado:',
    '- SST Dictionary Tags quedo validado en runtime local bajo CR-SST-0064.',
    '- Backend, BFF y frontend pasaron validacion local-live.',
    '- dictionary-tags avanzo de validated-local a validated-live en el control-plane.',
    '',
    'Evidencia principal:',
    '- requests/done/CR-SST-0064-dictionary-tags-validated-live-closure.yaml',
    '- evidence/requests/CR-SST-0064/runtime-validation-results.md',
    '- evidence/requests/CR-SST-0064/qa-manual-dictionary-management-created-entry.png',
    '- state/features/dictionary-tags.current.yaml',
    '',
    'Validaciones ejecutadas:',
    '- sst-bend: npm.cmd run test:diccionario -> PASS 10/10',
    '- sst-bend: npm.cmd run test:diccionario:stage2 -> PASS 9/9',
    '- sst-bend: npm.cmd run test:diccionario:stage3 -> PASS 11/11',
    '- sst-bend: npm.cmd run qa:diccionario:stage3 -> PASS',
    '- sst-bend: npm.cmd run check -> PASS',
    '- 4uentes-auth: npm.cmd run check -> PASS',
    '- BFF /api/diccionario/* smoke -> PASS',
    '- sst-fend: npm.cmd run check -> PASS, 24 suites / 142 tests',
    '- Chrome DevTools /dictionary manual QA -> PASS',
    '- 4uentes-orchestor: npm.cmd run check -> PASS, 0 fails',
    '',
    'Gaps aceptados fuera de este cierre:',
    '- TagDefinition public CRUD/governance queda para request futuro.',
    '- sst-extension account-context queda como follow-up no bloqueante.',
    '- Encryption-at-rest, offline model, translations y aliases quedan fuera de este validated-live closure.',
    '',
    'Fuente canonica:',
    '- El control-plane ARDS/SDD conserva la fuente canonica. Jira es superficie operativa de visibilidad.',
  ].join('\n');
}

function renderSst10ClosureComment(config, before, selectedTransition, alreadyTerminal) {
  return [
    `CR-SST closure execution: ${config.evidence.requestId}`,
    '',
    'SST-10 / dictionary-tags fue reconciliado contra evidencia local del control-plane.',
    '',
    'Estado soportado por evidencia: validated-live.',
    'Request de cierre: CR-SST-0064.',
    'Evidencia: evidence/requests/CR-SST-0064/runtime-validation-results.md.',
    '',
    'Validaciones clave:',
    '- sst-bend dictionary tests stage 1/2/3: PASS.',
    '- sst-bend live QA stage3: PASS.',
    '- 4uentes-auth BFF /api/diccionario/* smoke: PASS.',
    '- sst-fend /dictionary QA manual y checks: PASS.',
    '- control-plane npm.cmd run check: PASS, 0 fails.',
    '',
    `Before status: ${before.status}`,
    alreadyTerminal ? 'Transition: not required, issue already terminal.' : `Transition: ${selectedTransition ? `${selectedTransition.name} (${selectedTransition.id})` : 'no terminal transition detected'}`,
    '',
    'Gaps aceptados fuera del cierre: TagDefinition public CRUD, sst-extension account-context, encryption/offline/translations/aliases.',
  ].join('\n');
}

function selectTransition(transitions, preferredTransition) {
  if (!transitions.length) return null;
  const preferred = normalize(preferredTransition);
  if (preferred) {
    const explicit = transitions.find((item) => normalize(item.name) === preferred || normalize(item.name).includes(preferred));
    if (explicit) return explicit;
  }
  const exactOrder = ['listo', 'done', 'resuelto', 'cerrado', 'closed', 'resolved', 'complete', 'completado', 'finalizado'];
  for (const wanted of exactOrder) {
    const match = transitions.find((item) => normalize(item.name) === wanted || normalize(item.toStatus) === wanted);
    if (match) return match;
  }
  return transitions.find((item) => /listo|done|resuelt|cerrad|closed|resolved|complete|complet|finaliz/.test(normalize(`${item.name} ${item.toStatus} ${item.toStatusCategory}`))) || null;
}

function normalizeTransitions(data) {
  const source = Array.isArray(data) ? data : data && Array.isArray(data.transitions) ? data.transitions : [];
  return source
    .map((item) => ({
      id: String(item.id || item.transitionId || ''),
      name: String(item.name || item.transitionName || ''),
      toStatus: item.to ? String(item.to.name || item.to.status || '') : String(item.toStatus || ''),
      toStatusCategory: item.to && item.to.statusCategory ? String(item.to.statusCategory.name || item.to.statusCategory.key || '') : String(item.toStatusCategory || ''),
    }))
    .filter((item) => item.id && item.name);
}

function requireTools(selectedTools) {
  const names = new Set(selectedTools.map((tool) => tool.name));
  for (const name of TOOL_NAMES) {
    if (!names.has(name)) throw new Error(`No esta disponible la herramienta Jira MCP requerida: ${name}.`);
  }
}

function writeToolSchemaEvidence(config, selectedTools) {
  const output = outputPath(config, 'jira-tool-schema-summary.md');
  const lines = [];
  lines.push('# Jira Tool Schema Summary');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push('- Escritura Jira: no');
  lines.push(`- Herramientas requeridas observadas: ${selectedTools.length}/${TOOL_NAMES.length}`);
  lines.push('');
  lines.push('## Herramientas');
  lines.push('');
  for (const tool of selectedTools) {
    lines.push(`### ${sanitize(tool.name)}`);
    lines.push('');
    lines.push('```json');
    lines.push(sanitize(JSON.stringify(tool.inputSchema || {}, null, 2)));
    lines.push('```');
    lines.push('');
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
}

function writeExecutionEvidence(config, summary, evidencePrefix) {
  const jsonOutput = outputPath(config, `${evidencePrefix}-result.json`);
  const output = outputPath(config, `${evidencePrefix}-summary.md`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');

  const lines = [];
  lines.push('# Jira Issue Transition Execution');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Issue key: ${sanitize(summary.issueKey)}`);
  lines.push(`- Modo: ${summary.approved ? 'approved-write' : 'dry-run'}`);
  lines.push(`- Escritura Jira: ${summary.externalWrite ? 'si' : 'no'}`);
  lines.push(`- Accion: ${sanitize(summary.action)}`);
  lines.push('');
  lines.push('## Resultado');
  lines.push('');
  lines.push(`- Estado previo: ${sanitize(summary.before.status)}`);
  lines.push(`- Categoria previa: ${sanitize(summary.before.statusCategory)}`);
  lines.push(`- Estado posterior: ${sanitize(summary.after.status)}`);
  lines.push(`- Categoria posterior: ${sanitize(summary.after.statusCategory)}`);
  lines.push(`- Resolucion posterior: ${sanitize(summary.after.resolution)}`);
  lines.push(`- Transicion seleccionada: ${summary.selectedTransition ? `${sanitize(summary.selectedTransition.name)} (${sanitize(summary.selectedTransition.id)})` : 'ninguna'}`);
  lines.push(`- Labels previos: ${summary.before.labels.map((label) => sanitize(label)).join(', ') || 'ninguno'}`);
  lines.push(`- Labels posteriores: ${summary.after.labels.map((label) => sanitize(label)).join(', ') || 'ninguno'}`);
  lines.push(`- Fields actualizados: ${summary.editResult ? 'si' : 'no'}`);
  lines.push(`- Comentario agregado: ${summary.commentResult ? 'si' : 'no'}`);
  lines.push('');
  lines.push('## Transiciones Disponibles');
  lines.push('');
  for (const transition of summary.transitions) {
    lines.push(`- ${sanitize(transition.name)} (${sanitize(transition.id)}) -> ${sanitize(transition.toStatus || 'sin destino detectado')}`);
  }
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

function reconcileClosureLabels(labels) {
  const stale = new Set(['not-done', 'validated-local']);
  const next = labels.filter((label) => !stale.has(label));
  for (const label of ['done', 'validated-live']) {
    if (!next.includes(label)) next.push(label);
  }
  return next.sort();
}

function isTerminalStatus(status, statusCategory) {
  return /done|listo|finalizada|finalizado|cerrado|cerrada|closed|resolved|complete|completado/i.test(`${status} ${statusCategory}`);
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function stringArg(args, key, fallback) {
  return args[key] ? String(args[key]) : fallback;
}

function readOptionalFile(args, key) {
  const file = stringArg(args, key, null);
  if (!file) return null;
  const resolved = path.resolve(ROOT, file);
  if (!fs.existsSync(resolved)) throw new Error(`No existe ${key}: ${file}`);
  const text = fs.readFileSync(resolved, 'utf8');
  if (!text.trim()) throw new Error(`${key} esta vacio: ${file}`);
  return text;
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
