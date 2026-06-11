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
  const args = parseArgs(process.argv.slice(2), { valueOptions: ['request-id', 'output-dir'] });
  requireEvidenceArgs(args);
  const { config, client } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    const cloudId = await resolveCloudId(client);
    const correctionPlan = readCorrectionPlan(effectiveConfig);
    const candidates = correctionPlan.actions.filter((item) => item.action === 'propose-description-update' && item.issueKey);
    const results = [];

    for (const candidate of candidates) {
      const result = await client.callTool('editJiraIssue', {
        cloudId,
        issueIdOrKey: candidate.issueKey,
        fields: {
          description: candidate.proposedDescription,
        },
        contentFormat: 'markdown',
        responseContentFormat: 'markdown',
      });
      parseToolData(result);
      results.push({ stateId: candidate.stateId, action: 'updated-description', issueKey: candidate.issueKey });
    }

    const skipped = correctionPlan.actions.filter((item) => item.action !== 'propose-description-update' || !item.issueKey);
    const output = writeEvidence(effectiveConfig, correctionPlan, results, skipped);
    console.log(`OK: Jira issues updated: ${results.filter((item) => item.action === 'updated-description').length}`);
    console.log(`OK: Jira issues skipped: ${skipped.length}`);
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

function writeEvidence(config, correctionPlan, results, skipped) {
  const output = path.join(ROOT, config.evidence.outputDir, 'jira-update-summary.md');
  fs.mkdirSync(path.dirname(output), { recursive: true });

  const lines = [];
  lines.push('# Resumen De Actualizacion Jira');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push('- Fecha: 2026-06-06');
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Project key: \`${config.jira.projectKey}\``);
  lines.push('- Source correction plan: `correction-plan-preview.json`');
  lines.push(`- Source reconciliation: ${correctionPlan.sourceReconciliation ? `\`${sanitize(correctionPlan.sourceReconciliation)}\`` : 'ninguna'}`);
  lines.push(`- Issues actualizados: ${results.filter((item) => item.action === 'updated-description').length}`);
  lines.push(`- Issues saltados: ${skipped.length}`);
  lines.push('- Escritura Jira: si, limitada a `editJiraIssue` sobre `description`');
  lines.push('');
  lines.push('## Actualizados');
  lines.push('');
  if (results.length === 0) {
    lines.push('- ninguno');
  } else {
    for (const result of results) {
      lines.push(`- \`${sanitize(result.issueKey)}\`: ${sanitize(result.stateId)} -> ${sanitize(result.action)}`);
    }
  }
  lines.push('');
  lines.push('## Saltados');
  lines.push('');
  if (skipped.length === 0) {
    lines.push('- ninguno');
  } else {
    for (const item of skipped) {
      lines.push(`- ${sanitize(item.stateId)}: issue=${item.issueKey ? `\`${sanitize(item.issueKey)}\`` : 'ninguno'}, action=${sanitize(item.action)}`);
    }
  }

  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
  return output;
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

main().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
});
