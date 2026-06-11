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
const ONLY_ISSUE_KEY = 'SST-8';
const TOOL_NAMES = [
  'getJiraIssue',
  'getTransitionsForJiraIssue',
  'addCommentToJiraIssue',
  'transitionJiraIssue',
];

async function main() {
  requireConnectFlag();
  const args = parseArgs(process.argv.slice(2), {
    valueOptions: ['request-id', 'output-dir', 'issue-key', 'preferred-transition'],
  });
  requireEvidenceArgs(args);

  const issueKey = stringArg(args, 'issue-key', ONLY_ISSUE_KEY);
  if (issueKey !== ONLY_ISSUE_KEY) {
    throw new Error(`Este script esta limitado a ${ONLY_ISSUE_KEY}; recibido ${issueKey}.`);
  }

  const approved = process.argv.includes('--approved');
  console.log('TRACE: connecting Atlassian MCP');
  const { config, client, tools } = await connectAtlassian();
  console.log('TRACE: Atlassian MCP connected');
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    console.log('TRACE: resolving cloud resource');
    const cloudId = await resolveCloudId(client);
    const selectedTools = tools.filter((tool) => TOOL_NAMES.includes(tool.name));
    console.log('TRACE: writing tool schema evidence');
    writeToolSchemaEvidence(effectiveConfig, selectedTools);

    requireTools(selectedTools);

    console.log('TRACE: reading issue before transition');
    const before = await getIssue(client, cloudId, issueKey);
    console.log('TRACE: reading available transitions');
    const transitions = await getTransitions(client, cloudId, issueKey);
    const selectedTransition = selectTransition(transitions, stringArg(args, 'preferred-transition', null));
    const alreadyTerminal = isTerminalStatus(before.status, before.statusCategory);

    let transitionResult = null;
    let commentResult = null;
    let after = before;
    let action = 'dry-run';

    if (approved) {
      if (!alreadyTerminal) {
        if (!selectedTransition) {
          throw new Error(`No se encontro una transicion terminal para ${issueKey}.`);
        }
        transitionResult = await transitionIssue(client, cloudId, issueKey, selectedTransition);
        action = 'transitioned';
      } else {
        action = 'already-terminal';
      }

      after = await getIssue(client, cloudId, issueKey);
      commentResult = await addClosureComment(client, cloudId, issueKey, effectiveConfig, before, after, selectedTransition, action);
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
      transitionResult: transitionResult ? sanitizeJson(transitionResult) : null,
      commentResult: commentResult ? sanitizeJson(commentResult) : null,
      externalWrite: approved,
    };

    const output = writeExecutionEvidence(effectiveConfig, summary);
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
    fields: ['summary', 'status', 'resolution', 'assignee', 'updated'],
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

async function transitionIssue(client, cloudId, issueKey, transition) {
  const result = await client.callTool('transitionJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    transition: {
      id: transition.id,
    },
  });
  return parseToolData(result);
}

async function addClosureComment(client, cloudId, issueKey, config, before, after, selectedTransition, action) {
  const commentBody = [
    `CR-SST closure execution: ${config.evidence.requestId}`,
    '',
    `Action: ${action}`,
    `Evidence: ${config.evidence.outputDir.replace(/\\/g, '/')}/jira-sst-8-transition-summary.md`,
    `Before status: ${before.status}`,
    `After status: ${after.status}`,
    selectedTransition ? `Transition: ${selectedTransition.name} (${selectedTransition.id})` : 'Transition: not required',
    '',
    'Validated basis: CR-SST-0008, CR-SST-0052, CR-SST-0053 and CR-SST-0056 evidence in the ARDS/SDD control plane.',
  ].join('\n');

  const result = await client.callTool('addCommentToJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    commentBody,
    contentFormat: 'markdown',
    responseContentFormat: 'markdown',
  });
  return parseToolData(result);
}

function selectTransition(transitions, preferredTransition) {
  if (!transitions.length) return null;
  const preferred = normalize(preferredTransition);
  if (preferred) {
    const explicit = transitions.find((item) => normalize(item.name) === preferred || normalize(item.name).includes(preferred));
    if (explicit) return explicit;
  }

  const exactOrder = ['done', 'resuelto', 'cerrado', 'closed', 'resolved', 'complete', 'completado', 'finalizado'];
  for (const wanted of exactOrder) {
    const match = transitions.find((item) => normalize(item.name) === wanted || normalize(item.toStatus) === wanted);
    if (match) return match;
  }

  return transitions.find((item) => /done|resuelt|cerrad|closed|resolved|complete|complet|finaliz/.test(normalize(`${item.name} ${item.toStatus} ${item.toStatusCategory}`))) || null;
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

function writeExecutionEvidence(config, summary) {
  const jsonOutput = outputPath(config, 'jira-sst-8-transition-result.json');
  const output = outputPath(config, 'jira-sst-8-transition-summary.md');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');

  const lines = [];
  lines.push('# SST-8 Jira Close Transition Execution');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Issue key: ${summary.issueKey}`);
  lines.push(`- Modo: ${summary.approved ? 'approved-write' : 'dry-run'}`);
  lines.push(`- Escritura Jira: ${summary.externalWrite ? 'si' : 'no'}`);
  lines.push(`- Accion: ${summary.action}`);
  lines.push('');
  lines.push('## Resultado');
  lines.push('');
  lines.push(`- Estado previo: ${sanitize(summary.before.status)}`);
  lines.push(`- Categoria previa: ${sanitize(summary.before.statusCategory)}`);
  lines.push(`- Estado posterior: ${sanitize(summary.after.status)}`);
  lines.push(`- Categoria posterior: ${sanitize(summary.after.statusCategory)}`);
  lines.push(`- Resolucion posterior: ${sanitize(summary.after.resolution)}`);
  lines.push(`- Transicion seleccionada: ${summary.selectedTransition ? `${sanitize(summary.selectedTransition.name)} (${sanitize(summary.selectedTransition.id)})` : 'ninguna'}`);
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
  lines.push('- Resultado JSON sanitizado: `jira-sst-8-transition-result.json`');
  lines.push('- Schema MCP observado: `jira-tool-schema-summary.md`');
  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
  return output;
}

function sanitizeJson(value) {
  return JSON.parse(sanitize(JSON.stringify(value)));
}

function isTerminalStatus(status, statusCategory) {
  return /done|resuelt|cerrad|closed|resolved|complete|complet|finaliz/.test(normalize(`${status} ${statusCategory}`));
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

function stringArg(args, name, fallback) {
  const value = args[name];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function outputPath(config, fileName) {
  return path.join(ROOT, config.evidence.outputDir, fileName);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

main().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
});
