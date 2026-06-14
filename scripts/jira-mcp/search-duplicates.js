const fs = require('fs');
const path = require('path');
const {
  connectAtlassian,
  extractIssueKeys,
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
    const payloads = buildIssuePayloads(readNonDoneFeatureStates(), effectiveConfig);
    const results = [];

    for (const payload of payloads) {
      const jql = `project = ${effectiveConfig.jira.projectKey} AND text ~ "${payload.stateId}"`;
      const result = await client.callTool('searchJiraIssuesUsingJql', {
        cloudId,
        jql,
        maxResults: 10,
        fields: ['summary', 'status', 'issuetype', 'created'],
        responseContentFormat: 'markdown',
      });
      const data = parseToolData(result);
      const issueKeys = extractIssueKeys(data, effectiveConfig.jira.projectKey);
      results.push({
        stateId: payload.stateId,
        summary: payload.summary,
        jql,
        issueKeys,
        duplicate: issueKeys.length > 0,
      });
    }

    const output = writeEvidence(effectiveConfig, results);
    console.log(`OK: Duplicate search items: ${results.length}`);
    console.log(`OK: Duplicates found: ${results.filter((item) => item.duplicate).length}`);
    console.log(`OK: Evidence written: ${rel(output)}`);
  } finally {
    client.close();
  }
}

function writeEvidence(config, results) {
  const output = path.join(ROOT, config.evidence.outputDir, 'duplicate-search-summary.md');
  const jsonOutput = path.join(ROOT, config.evidence.outputDir, 'duplicate-search-results.json');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(results, null, 2), 'utf8');

  const lines = [];
  lines.push('# Resumen De Busqueda De Duplicados Jira');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Project key: \`${config.jira.projectKey}\``);
  lines.push(`- Items buscados: ${results.length}`);
  lines.push(`- Duplicados encontrados: ${results.filter((item) => item.duplicate).length}`);
  lines.push('- Escritura Jira: no');
  lines.push('');
  lines.push('## Resultados');
  lines.push('');
  for (const result of results) {
    lines.push(`### ${sanitize(result.stateId)}`);
    lines.push('');
    lines.push(`- Duplicate: ${result.duplicate ? 'si' : 'no'}`);
    lines.push(`- JQL: \`${sanitize(result.jql)}\``);
    lines.push(`- Issue keys: ${result.issueKeys.length ? result.issueKeys.map((key) => `\`${sanitize(key)}\``).join(', ') : 'ninguna'}`);
    lines.push('');
  }
  fs.writeFileSync(output, `${lines.join('\n')}`, 'utf8');
  return output;
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
