const fs = require('fs');
const path = require('path');
const {
  connectAtlassian,
  extractIssueKeys,
  parseToolData,
  requireApprovedFlag,
  requireConnectFlag,
  resolveCloudId,
  sanitize,
} = require('./lib/atlassian-mcp');
const { applyEvidenceArgs, parseArgs, requireEvidenceArgs } = require('./lib/cli-args');

const ROOT = process.cwd();
const REGISTRY_FILE = path.join(ROOT, 'state', 'jira-backlog-registry.yaml');
const PAYLOAD_FILE = 'backlog-ticket-payload-dry-run.json';

async function main() {
  requireConnectFlag();
  requireApprovedFlag();
  const args = parseArgs(process.argv.slice(2), { valueOptions: ['request-id', 'output-dir'] });
  requireEvidenceArgs(args);
  const { config, client } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    const cloudId = await resolveCloudId(client);
    const plan = readPayloadPlan(effectiveConfig);
    const registry = readRegistry();
    const candidates = selectCreateCandidates(plan, registry);
    const results = [];

    for (const candidate of candidates) {
      const payload = candidate.payload;
      try {
        const result = await client.callTool('createJiraIssue', {
          cloudId,
          projectKey: payload.projectKey,
          issueTypeName: payload.issueType,
          summary: payload.summary,
          description: payload.description,
          additional_fields: {
            labels: payload.labels,
          },
          contentFormat: 'markdown',
          responseContentFormat: 'markdown',
        });
        const data = parseToolData(result);
        const issueKeys = extractIssueKeys(data, effectiveConfig.jira.projectKey);
        if (!issueKeys[0]) {
          results.push({
            backlogId: payload.backlogId,
            action: 'created-key-not-detected',
            issueKey: null,
            summary: payload.summary,
          });
          break;
        }
        results.push({
          backlogId: payload.backlogId,
          action: 'created',
          issueKey: issueKeys[0],
          summary: payload.summary,
        });
      } catch (error) {
        results.push({
          backlogId: payload.backlogId,
          action: 'failed',
          issueKey: null,
          summary: payload.summary,
          error: error.message,
        });
        break;
      }
    }

    const skipped = buildSkipped(plan, registry, candidates, results);
    const updatedRegistry = updateRegistryIssueKeys(registry.text, results);
    fs.writeFileSync(REGISTRY_FILE, updatedRegistry, 'utf8');
    const output = writeEvidence(effectiveConfig, plan, results, skipped);

    console.log(`OK: Created backlog issues: ${results.filter((item) => item.action === 'created').length}`);
    console.log(`OK: Created without detected key: ${results.filter((item) => item.action === 'created-key-not-detected').length}`);
    console.log(`OK: Failed backlog issues: ${results.filter((item) => item.action === 'failed').length}`);
    console.log(`OK: Skipped backlog items: ${skipped.length}`);
    console.log(`OK: Registry updated: ${rel(REGISTRY_FILE)}`);
    console.log(`OK: Evidence written: ${rel(output)}`);
  } finally {
    client.close();
  }
}

function readPayloadPlan(config) {
  const file = path.join(ROOT, config.evidence.outputDir, PAYLOAD_FILE);
  if (!fs.existsSync(file)) {
    throw new Error(`No existe ${PAYLOAD_FILE} en ${config.evidence.outputDir}. Ejecuta jira:mcp:backlog-dry-run primero.`);
  }
  const plan = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (plan.requestId !== config.evidence.requestId) {
    throw new Error(`El payload pertenece a ${plan.requestId}, pero el request activo es ${config.evidence.requestId}.`);
  }
  if (plan.externalWrite !== false) {
    throw new Error('El payload dry-run debe declarar externalWrite=false.');
  }
  if (!Array.isArray(plan.payloads) || plan.payloads.length === 0) {
    throw new Error('El payload dry-run no contiene payloads.');
  }

  const seen = new Set();
  for (const payload of plan.payloads) {
    validatePayload(config, payload);
    if (seen.has(payload.backlogId)) throw new Error(`Backlog duplicado en payload: ${payload.backlogId}.`);
    seen.add(payload.backlogId);
  }
  return plan;
}

function validatePayload(config, payload) {
  const required = ['backlogId', 'projectKey', 'issueType', 'summary', 'description'];
  for (const key of required) {
    if (!payload[key] || typeof payload[key] !== 'string') {
      throw new Error(`Payload invalido: falta ${key}.`);
    }
  }
  if (!/^SST-BL-JIRA-\d{3}$/.test(payload.backlogId)) {
    throw new Error(`Backlog id invalido: ${payload.backlogId}.`);
  }
  if (payload.projectKey !== config.jira.projectKey) {
    throw new Error(`Project key inesperado para ${payload.backlogId}: ${payload.projectKey}.`);
  }
  if (payload.issueType !== config.jira.issueType) {
    throw new Error(`Issue type inesperado para ${payload.backlogId}: ${payload.issueType}.`);
  }
  if (!payload.summary.includes(`[${payload.backlogId}]`)) {
    throw new Error(`Summary sin backlog id para ${payload.backlogId}.`);
  }
  if (!Array.isArray(payload.labels) || !payload.labels.includes('backlog')) {
    throw new Error(`Labels invalidos para ${payload.backlogId}.`);
  }
  if (payload.externalWrite !== false) {
    throw new Error(`Payload ${payload.backlogId} debe declarar externalWrite=false.`);
  }
}

function readRegistry() {
  if (!fs.existsSync(REGISTRY_FILE)) throw new Error(`No existe ${rel(REGISTRY_FILE)}.`);
  const text = fs.readFileSync(REGISTRY_FILE, 'utf8');
  return {
    text,
    items: parseRegistryItems(text),
  };
}

function selectCreateCandidates(plan, registry) {
  const byId = new Map(registry.items.map((item) => [item.backlogId, item]));
  return plan.payloads
    .map((payload) => {
      const item = byId.get(payload.backlogId);
      if (!item) throw new Error(`El registry no contiene ${payload.backlogId}.`);
      return { payload, item };
    })
    .filter((candidate) => !candidate.item.jiraIssueKey);
}

function buildSkipped(plan, registry, candidates, results) {
  const candidateIds = new Set(candidates.map((candidate) => candidate.payload.backlogId));
  const attemptedIds = new Set(results.map((result) => result.backlogId));
  const byId = new Map(registry.items.map((item) => [item.backlogId, item]));
  return plan.payloads
    .filter((payload) => !attemptedIds.has(payload.backlogId))
    .map((payload) => ({
      backlogId: payload.backlogId,
      reason: byId.get(payload.backlogId) && byId.get(payload.backlogId).jiraIssueKey
        ? 'already-has-jira-issue-key'
        : candidateIds.has(payload.backlogId) ? 'not-attempted-after-failure' : 'not-selected',
      jiraIssueKey: byId.get(payload.backlogId) ? byId.get(payload.backlogId).jiraIssueKey : null,
      summary: payload.summary,
    }));
}

function updateRegistryIssueKeys(text, results) {
  let output = text;
  for (const result of results.filter((item) => item.action === 'created')) {
    if (!result.issueKey) continue;
    const escapedBacklog = escapeRegExp(result.backlogId);
    const blockRegex = new RegExp(`(\\n\\s{2}-\\s+backlog_id:\\s+"${escapedBacklog}"[\\s\\S]*?\\n\\s{4}jira_issue_key:\\s+)null`);
    output = output.replace(blockRegex, `$1"${result.issueKey}"`);
  }
  return output;
}

function parseRegistryItems(text) {
  const items = [];
  let current = null;
  let inItems = false;

  for (const line of text.split(/\r?\n/)) {
    if (line === 'items:') {
      inItems = true;
      continue;
    }
    if (!inItems) continue;
    if (/^[A-Za-z0-9_-]+:/.test(line)) break;

    const first = line.match(/^\s{2}-\s+backlog_id:\s*(.+)$/);
    if (first) {
      current = { backlogId: normalize(first[1]), jiraIssueKey: null };
      items.push(current);
      continue;
    }
    if (!current) continue;
    const jira = line.match(/^\s{4}jira_issue_key:\s*(.+)$/);
    if (jira) current.jiraIssueKey = normalize(jira[1]);
  }

  return items;
}

function writeEvidence(config, plan, results, skipped) {
  const output = path.join(ROOT, config.evidence.outputDir, 'backlog-create-summary.md');
  fs.mkdirSync(path.dirname(output), { recursive: true });

  const lines = [];
  lines.push('# Resumen De Creacion Backlog Jira');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Project key: \`${config.jira.projectKey}\``);
  lines.push(`- Issue type: \`${config.jira.issueType}\``);
  lines.push(`- Source payload: \`${PAYLOAD_FILE}\``);
  lines.push(`- Registry: \`${rel(REGISTRY_FILE)}\``);
  lines.push(`- Created: ${results.filter((item) => item.action === 'created').length}`);
  lines.push(`- Created without detected key: ${results.filter((item) => item.action === 'created-key-not-detected').length}`);
  lines.push(`- Failed: ${results.filter((item) => item.action === 'failed').length}`);
  lines.push(`- Skipped: ${skipped.length}`);
  lines.push('- Escritura Jira: si, limitada a `createJiraIssue`');
  lines.push('');
  lines.push('## Creados');
  lines.push('');
  const created = results.filter((item) => item.action === 'created');
  if (created.length === 0) {
    lines.push('- ninguno');
  } else {
    for (const result of created) {
      lines.push(`- ${sanitize(result.backlogId)}: issue=${result.issueKey ? `\`${sanitize(result.issueKey)}\`` : 'no detectada en respuesta MCP'}, summary=\`${sanitize(result.summary)}\``);
    }
  }
  lines.push('');
  lines.push('## Creados Sin Key Detectada');
  lines.push('');
  const createdWithoutKey = results.filter((item) => item.action === 'created-key-not-detected');
  if (createdWithoutKey.length === 0) {
    lines.push('- ninguno');
  } else {
    for (const item of createdWithoutKey) {
      lines.push(`- ${sanitize(item.backlogId)}: summary=\`${sanitize(item.summary)}\``);
    }
    lines.push('');
    lines.push('El comando se detuvo para evitar duplicados. Ejecutar reconciliacion Jira antes de reintentar.');
  }
  lines.push('');
  lines.push('## Fallidos');
  lines.push('');
  const failed = results.filter((item) => item.action === 'failed');
  if (failed.length === 0) {
    lines.push('- ninguno');
  } else {
    for (const item of failed) {
      lines.push(`- ${sanitize(item.backlogId)}: ${sanitize(item.error || 'error no especificado')}`);
    }
  }
  lines.push('');
  lines.push('## Saltados');
  lines.push('');
  if (skipped.length === 0) {
    lines.push('- ninguno');
  } else {
    for (const item of skipped) {
      lines.push(`- ${sanitize(item.backlogId)}: ${sanitize(item.reason)}, issue=${item.jiraIssueKey ? `\`${sanitize(item.jiraIssueKey)}\`` : 'ninguno'}`);
    }
  }
  lines.push('');
  lines.push('## Control');
  lines.push('');
  lines.push(`- Payload request id: \`${sanitize(plan.requestId)}\``);
  lines.push('- Registry update only records detected Jira issue keys.');
  lines.push('- `assigned_cr_sst` remains unchanged by this command.');

  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
  return output;
}

function normalize(value) {
  const trimmed = String(value || '').trim();
  if (trimmed === 'null') return null;
  return trimmed.replace(/^['"]|['"]$/g, '').trim();
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
});
