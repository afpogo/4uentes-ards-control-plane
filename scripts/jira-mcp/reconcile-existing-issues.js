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
const { loadConfig } = require('./lib/config');
const { readNonDoneFeatureStates } = require('./lib/feature-state-reader');
const { buildIssuePayloads } = require('./lib/jira-payloads');

const ROOT = process.cwd();

async function main() {
  requireConnectFlag();
  const args = parseArgs(process.argv.slice(2), { valueOptions: ['request-id', 'output-dir'] });
  requireEvidenceArgs(args);
  const { config, client } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    const cloudId = await resolveCloudId(client);
    const duplicateResults = readDuplicateResults(effectiveConfig);
    const payloads = buildIssuePayloads(readNonDoneFeatureStates(), effectiveConfig);
    const issueKeys = [...new Set(duplicateResults.flatMap((item) => item.issueKeys || []))].sort();
    const issues = [];

    for (const issueKey of issueKeys) {
      const issue = await getIssue(client, cloudId, issueKey);
      issues.push(issue);
    }

    const reconciled = duplicateResults.map((result) => reconcileState(result, payloads, issues));
    const output = writeEvidence(effectiveConfig, issues, reconciled);

    console.log(`OK: Jira issues inspected: ${issues.length}`);
    console.log(`OK: Feature states reconciled: ${reconciled.length}`);
    console.log(`OK: Exact summary matches: ${reconciled.filter((item) => item.matchType === 'exact-summary').length}`);
    console.log(`OK: Evidence written: ${rel(output)}`);
  } finally {
    client.close();
  }
}

async function getIssue(client, cloudId, issueKey) {
  const result = await client.callTool('getJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    fields: ['summary', 'status', 'issuetype', 'description', 'labels'],
    responseContentFormat: 'markdown',
  });
  const data = parseToolData(result);
  const text = typeof data === 'string' ? data : JSON.stringify(data);
  return {
    issueKey,
    raw: sanitize(text),
    summary: firstMarkdownValue(text, 'Summary') || firstJsonLikeValue(text, 'summary') || 'no-detectado',
    hasSyncProcess: /Proceso de sincronizacion/i.test(text),
    hasOriginProcesses: /Procesos origen/i.test(text),
    hasLegacyControlPlaneProcess: /Proceso control-plane/i.test(text),
  };
}

function reconcileState(result, payloads, issues) {
  const payload = payloads.find((item) => item.stateId === result.stateId);
  const candidates = issues.filter((issue) => result.issueKeys.includes(issue.issueKey));
  const exact = candidates.filter((issue) => issue.raw.includes(payload.summary));
  const selected = exact.length === 1 ? exact[0] : null;
  return {
    stateId: result.stateId,
    expectedSummary: payload.summary,
    issueKeys: result.issueKeys,
    selectedIssueKey: selected ? selected.issueKey : null,
    matchType: selected ? 'exact-summary' : 'ambiguous-or-no-exact-summary',
    updateNeeded: selected ? !selected.hasSyncProcess || !selected.hasOriginProcesses || selected.hasLegacyControlPlaneProcess : false,
  };
}

function readDuplicateResults(config) {
  const file = path.join(ROOT, config.evidence.outputDir, 'duplicate-search-results.json');
  if (!fs.existsSync(file)) {
    throw new Error(`No existe duplicate-search-results.json en ${config.evidence.outputDir}. Ejecuta duplicates primero.`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeEvidence(config, issues, reconciled) {
  const output = path.join(ROOT, config.evidence.outputDir, 'jira-reconciliation-summary.md');
  const jsonOutput = path.join(ROOT, config.evidence.outputDir, 'jira-reconciliation-results.json');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify({ issues, reconciled }, null, 2), 'utf8');

  const lines = [];
  lines.push('# Resumen De Reconciliacion Jira');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push('- Fecha: 2026-06-06');
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Project key: \`${config.jira.projectKey}\``);
  lines.push(`- Issues inspeccionados: ${issues.length}`);
  lines.push(`- Feature states reconciliados: ${reconciled.length}`);
  lines.push(`- Matches exactos por summary: ${reconciled.filter((item) => item.matchType === 'exact-summary').length}`);
  lines.push(`- Updates candidatos: ${reconciled.filter((item) => item.updateNeeded).length}`);
  lines.push('- Escritura Jira: no');
  lines.push('');
  lines.push('## Issues Observados');
  lines.push('');
  for (const issue of issues) {
    lines.push(`- \`${issue.issueKey}\`: sync_process=${issue.hasSyncProcess ? 'si' : 'no'}, origin_processes=${issue.hasOriginProcesses ? 'si' : 'no'}, legacy_control_plane_process=${issue.hasLegacyControlPlaneProcess ? 'si' : 'no'}`);
  }
  lines.push('');
  lines.push('## Reconciliacion Por State');
  lines.push('');
  for (const item of reconciled) {
    lines.push(`### ${sanitize(item.stateId)}`);
    lines.push('');
    lines.push(`- Issue keys candidatos: ${item.issueKeys.map((key) => `\`${sanitize(key)}\``).join(', ')}`);
    lines.push(`- Issue seleccionado: ${item.selectedIssueKey ? `\`${sanitize(item.selectedIssueKey)}\`` : 'ninguno'}`);
    lines.push(`- Match type: ${item.matchType}`);
    lines.push(`- Update needed: ${item.updateNeeded ? 'si' : 'no'}`);
    lines.push('');
  }
  fs.writeFileSync(output, `${lines.join('\n')}`, 'utf8');
  return output;
}

function firstMarkdownValue(text, label) {
  const match = text.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`, 'i'));
  return match ? match[1].trim() : null;
}

function firstJsonLikeValue(text, key) {
  const match = text.match(new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`, 'i'));
  return match ? match[1].trim() : null;
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

main().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
});
