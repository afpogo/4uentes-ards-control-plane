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

async function main() {
  requireConnectFlag();
  requireApprovedFlag();
  const args = parseArgs(process.argv.slice(2), { valueOptions: ['request-id', 'output-dir'] });
  requireEvidenceArgs(args);
  const { config, client } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);
  requirePolicyEvidence(effectiveConfig);

  try {
    const cloudId = await resolveCloudId(client);
    const correctionPlan = readCorrectionPlan(effectiveConfig);
    const candidates = correctionPlan.actions.filter((item) => item.action === 'propose-issue-create' && item.proposedIssue);
    const results = [];

    for (const candidate of candidates) {
      const issue = candidate.proposedIssue;
      const result = await client.callTool('createJiraIssue', {
        cloudId,
        projectKey: issue.projectKey,
        issueTypeName: issue.issueType,
        summary: issue.summary,
        description: issue.description,
        additional_fields: {
          labels: issue.labels,
        },
        contentFormat: 'markdown',
        responseContentFormat: 'markdown',
      });
      const data = parseToolData(result);
      const issueKeys = extractIssueKeys(data, config.jira.projectKey);
      results.push({ stateId: candidate.stateId, action: 'created', issueKeys, summary: issue.summary });
    }

    const skipped = correctionPlan.actions.filter((item) => item.action !== 'propose-issue-create');
    const output = writeEvidence(effectiveConfig, correctionPlan, results, skipped);
    console.log(`OK: Created issues: ${results.filter((item) => item.action === 'created').length}`);
    console.log(`OK: Skipped non-create actions: ${skipped.length}`);
    console.log(`OK: Evidence written: ${rel(output)}`);
  } finally {
    client.close();
  }
}

function readCorrectionPlan(config) {
  const file = path.join(ROOT, config.evidence.outputDir, 'correction-plan-preview.json');
  if (!fs.existsSync(file)) {
    throw new Error(`No existe correction-plan-preview.json en ${config.evidence.outputDir}. Ejecuta jira:mcp:doctor primero.`);
  }
  const plan = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (plan.externalWrite !== false) {
    throw new Error('El correction plan debe ser read-only y declarar externalWrite=false.');
  }
  if (!Array.isArray(plan.actions)) {
    throw new Error('El correction plan no contiene actions.');
  }
  return plan;
}

function requirePolicyEvidence(config) {
  const file = path.join(ROOT, config.evidence.outputDir, 'jira-policy-check-summary.md');
  if (!fs.existsSync(file)) {
    throw new Error(`No existe jira-policy-check-summary.md en ${config.evidence.outputDir}. Ejecuta policy-check primero.`);
  }
  const text = fs.readFileSync(file, 'utf8');
  if (!/Resultado:\s+PASS/i.test(text)) {
    throw new Error('El policy-check previo no registra PASS.');
  }
}

function writeEvidence(config, correctionPlan, results, skipped) {
  const output = path.join(ROOT, config.evidence.outputDir, 'created-ticket-summary.md');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const lines = [];
  lines.push('# Resumen De Tickets Jira Creados');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push('- Fecha: 2026-06-06');
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Project key: \`${config.jira.projectKey}\``);
  lines.push(`- Issue type: \`${config.jira.issueType}\``);
  lines.push('- Source correction plan: `correction-plan-preview.json`');
  lines.push(`- Source reconciliation: ${correctionPlan.sourceReconciliation ? `\`${sanitize(correctionPlan.sourceReconciliation)}\`` : 'ninguna'}`);
  lines.push(`- Created: ${results.filter((item) => item.action === 'created').length}`);
  lines.push(`- Skipped non-create actions: ${skipped.length}`);
  lines.push('- Escritura Jira: si, limitada a `createJiraIssue`');
  lines.push('');
  lines.push('## Resultados');
  lines.push('');
  for (const result of results) {
    lines.push(`### ${sanitize(result.stateId)}`);
    lines.push('');
    lines.push(`- Action: ${sanitize(result.action)}`);
    lines.push(`- Issue keys: ${result.issueKeys.length ? result.issueKeys.map((key) => `\`${sanitize(key)}\``).join(', ') : 'no detectada en respuesta MCP'}`);
    if (result.summary) lines.push(`- Summary: ${sanitize(result.summary)}`);
    lines.push('');
  }
  fs.writeFileSync(output, `${lines.join('\n')}`, 'utf8');
  return output;
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

main().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
});
