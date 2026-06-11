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

async function main() {
  requireConnectFlag();
  const args = parseArgs(process.argv.slice(2), { valueOptions: ['request-id', 'output-dir'] });
  requireEvidenceArgs(args);
  const { config, client } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    const cloudId = await resolveCloudId(client);
    const issueTypesResult = await client.callTool('getJiraProjectIssueTypesMetadata', {
      cloudId,
      projectIdOrKey: effectiveConfig.jira.projectKey,
      maxResults: 200,
    });
    const issueTypesData = parseToolData(issueTypesResult);
    const issueTypes = collectIssueTypes(issueTypesData);
    const selected = issueTypes.find((item) => item.name === effectiveConfig.jira.issueType);

    let fields = [];
    if (selected && selected.id) {
      const fieldsResult = await client.callTool('getJiraIssueTypeMetaWithFields', {
        cloudId,
        projectIdOrKey: effectiveConfig.jira.projectKey,
        issueTypeId: selected.id,
        maxResults: 200,
      });
      fields = collectFields(parseToolData(fieldsResult));
    }

    const output = writeEvidence(effectiveConfig, issueTypes, selected, fields);
    console.log(`OK: Project key: ${effectiveConfig.jira.projectKey}`);
    console.log(`OK: Issue type expected: ${effectiveConfig.jira.issueType}`);
    console.log(`OK: Issue type found: ${selected ? 'yes' : 'no'}`);
    console.log(`OK: Evidence written: ${rel(output)}`);
    if (!selected) process.exitCode = 1;
  } finally {
    client.close();
  }
}

function collectIssueTypes(data) {
  const candidates = [];
  visit(data, (value) => {
    if (value && typeof value === 'object' && value.id && value.name) {
      candidates.push({ id: String(value.id), name: String(value.name) });
    }
  });
  return uniqueBy(candidates, (item) => `${item.id}:${item.name}`);
}

function collectFields(data) {
  const fields = [];
  visit(data, (value) => {
    if (value && typeof value === 'object' && value.key && value.name) {
      fields.push({
        key: String(value.key),
        name: String(value.name),
        required: Boolean(value.required),
      });
    }
  });
  return uniqueBy(fields, (item) => item.key).sort((a, b) => a.key.localeCompare(b.key));
}

function visit(value, fn) {
  fn(value);
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((item) => visit(item, fn));
    return;
  }
  Object.values(value).forEach((item) => visit(item, fn));
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function writeEvidence(config, issueTypes, selected, fields) {
  const output = path.join(ROOT, config.evidence.outputDir, 'jira-required-fields-summary.md');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const requiredFields = fields.filter((field) => field.required);
  const lines = [];
  lines.push('# Resumen De Metadata Jira');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push('- Fecha: 2026-06-07');
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Project key: \`${config.jira.projectKey}\``);
  lines.push(`- Issue type esperado: \`${config.jira.issueType}\``);
  lines.push(`- Issue type encontrado: ${selected ? 'si' : 'no'}`);
  if (selected) lines.push(`- Issue type id: \`${sanitize(selected.id)}\``);
  lines.push('- Escritura Jira: no');
  lines.push('');
  lines.push('## Issue Types Visibles');
  lines.push('');
  issueTypes.forEach((item) => lines.push(`- \`${sanitize(item.name)}\` id: \`${sanitize(item.id)}\``));
  lines.push('');
  lines.push('## Campos Requeridos');
  lines.push('');
  if (requiredFields.length === 0) lines.push('- ninguno detectado por metadata');
  else requiredFields.forEach((field) => lines.push(`- \`${sanitize(field.key)}\`: ${sanitize(field.name)}`));
  lines.push('');
  lines.push('## Campos Observados');
  lines.push('');
  fields.forEach((field) => lines.push(`- \`${sanitize(field.key)}\`: ${sanitize(field.name)} required=${field.required ? 'si' : 'no'}`));
  lines.push('');
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
