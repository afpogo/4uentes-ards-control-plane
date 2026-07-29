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

  const preferredTransition = stringArg(args, 'preferred-transition', null);
  if (!preferredTransition) throw new Error('Falta --preferred-transition <name-or-id>.');

  const commentBody = readOptionalFile(args, 'comment-file');
  const evidencePrefix = stringArg(args, 'evidence-prefix', `jira-${issueKey.toLowerCase()}-status-transition`);

  const { config, client } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    const cloudId = await resolveCloudId(client);
    const before = await getIssue(client, cloudId, issueKey);
    const transitions = await getTransitions(client, cloudId, issueKey);
    const selectedTransition = selectTransition(transitions, preferredTransition);

    if (!selectedTransition) {
      throw new Error(`No se encontro transicion ${preferredTransition} para ${issueKey}.`);
    }

    const transitionResult = await transitionIssue(client, cloudId, issueKey, selectedTransition);
    const commentResult = commentBody
      ? await addComment(client, cloudId, issueKey, commentBody)
      : null;
    const after = await getIssue(client, cloudId, issueKey);

    const summary = {
      issueKey,
      before,
      after,
      transitions,
      selectedTransition,
      transitionResult: sanitizeJson(transitionResult),
      commentResult: commentResult ? sanitizeJson(commentResult) : null,
      commentBody: commentBody ? sanitize(commentBody) : null,
      externalWrite: true,
    };

    const output = writeEvidence(effectiveConfig, evidencePrefix, summary);
    console.log(`OK: Issue: ${issueKey}`);
    console.log(`OK: Before status: ${before.status}`);
    console.log(`OK: After status: ${after.status}`);
    console.log(`OK: Transition: ${selectedTransition.name} (${selectedTransition.id})`);
    console.log(`OK: Evidence written: ${rel(output)}`);
  } finally {
    client.close();
  }
}

async function getIssue(client, cloudId, issueKey) {
  const result = await client.callTool('getJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    fields: ['summary', 'status', 'resolution', 'assignee', 'updated', 'labels'],
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
  const source = Array.isArray(data) ? data : data && Array.isArray(data.transitions) ? data.transitions : [];
  return source
    .map((item) => ({
      id: String(item.id || item.transitionId || ''),
      name: String(item.name || item.transitionName || ''),
      toStatus: item.to ? String(item.to.name || item.to.status || '') : String(item.toStatus || ''),
      toStatusCategory:
        item.to && item.to.statusCategory
          ? String(item.to.statusCategory.name || item.to.statusCategory.key || '')
          : String(item.toStatusCategory || ''),
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

function selectTransition(transitions, preferredTransition) {
  const preferred = normalize(preferredTransition);
  return (
    transitions.find((item) => normalize(item.id) === preferred) ||
    transitions.find((item) => normalize(item.name) === preferred) ||
    transitions.find((item) => normalize(item.toStatus) === preferred) ||
    transitions.find((item) => normalize(item.name).includes(preferred)) ||
    transitions.find((item) => normalize(item.toStatus).includes(preferred)) ||
    null
  );
}

function writeEvidence(config, evidencePrefix, summary) {
  const jsonOutput = outputPath(config, `${evidencePrefix}-result.json`);
  const output = outputPath(config, `${evidencePrefix}-summary.md`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');

  const lines = [];
  lines.push('# Jira Issue Status Transition Execution');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${sanitize(config.evidence.requestId)}`);
  lines.push(`- Issue key: ${sanitize(summary.issueKey)}`);
  lines.push('- Escritura Jira: si, limitada a transition + optional comment');
  lines.push('');
  lines.push('## Resultado');
  lines.push('');
  lines.push(`- Estado previo: ${sanitize(summary.before.status)}`);
  lines.push(`- Categoria previa: ${sanitize(summary.before.statusCategory)}`);
  lines.push(`- Estado posterior: ${sanitize(summary.after.status)}`);
  lines.push(`- Categoria posterior: ${sanitize(summary.after.statusCategory)}`);
  lines.push(`- Resolucion posterior: ${sanitize(summary.after.resolution)}`);
  lines.push(`- Transicion seleccionada: ${sanitize(summary.selectedTransition.name)} (${sanitize(summary.selectedTransition.id)})`);
  lines.push(`- Labels posteriores: ${summary.after.labels.map((label) => sanitize(label)).join(', ') || 'ninguno'}`);
  lines.push(`- Comentario agregado: ${summary.commentResult ? 'si' : 'no'}`);
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

function readOptionalFile(args, key) {
  const file = stringArg(args, key, null);
  if (!file) return null;
  const resolved = path.resolve(ROOT, file);
  if (!fs.existsSync(resolved)) throw new Error(`No existe ${key}: ${file}`);
  const text = fs.readFileSync(resolved, 'utf8');
  if (!text.trim()) throw new Error(`${key} esta vacio: ${file}`);
  return text;
}

function outputPath(config, name) {
  return path.join(ROOT, config.evidence.outputDir, name);
}

function rel(value) {
  return path.relative(ROOT, value).replace(/\\/g, '/');
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function stringArg(args, key, fallback) {
  return args[key] ? String(args[key]) : fallback;
}

function sanitizeJson(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeJson);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, sanitizeJson(entry)])
    );
  }

  return typeof value === 'string' ? sanitize(value) : value;
}

main().catch((error) => {
  console.error(`ERROR: ${sanitize(error.stack || error.message || String(error))}`);
  process.exit(1);
});
