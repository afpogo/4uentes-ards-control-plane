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
  const args = parseArgs(process.argv.slice(2), { valueOptions: ['request-id', 'output-dir', 'issue-key'] });
  requireEvidenceArgs(args);
  const issueKey = args['issue-key'] ? String(args['issue-key']) : null;
  if (!issueKey) throw new Error('Falta --issue-key <KEY>.');

  const { config, client } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    const cloudId = await resolveCloudId(client);
    const result = await client.callTool('getJiraIssue', {
      cloudId,
      issueIdOrKey: issueKey,
      fields: ['summary', 'status', 'description', 'subtasks', 'labels'],
      responseContentFormat: 'markdown',
    });
    const data = parseToolData(result);
    const summary = summarizeParentIssue(issueKey, data);
    const output = writeEvidence(effectiveConfig, summary);

    console.log(`OK: Parent issue: ${issueKey}`);
    console.log(`OK: Status: ${summary.status}`);
    console.log(`OK: Subtasks observed: ${summary.subtasks.length}`);
    console.log(`OK: Evidence written: ${rel(output)}`);
  } finally {
    client.close();
  }
}

function summarizeParentIssue(issueKey, data) {
  const fields = data && data.fields ? data.fields : {};
  const status = fields.status || {};
  const subtasks = Array.isArray(fields.subtasks)
    ? fields.subtasks.map((item) => {
        const childFields = item.fields || {};
        const childStatus = childFields.status || {};
        return {
          key: String(item.key || ''),
          summary: String(childFields.summary || ''),
          status: String(childStatus.name || 'no-detectado'),
          statusCategory: childStatus.statusCategory
            ? String(childStatus.statusCategory.name || childStatus.statusCategory.key || 'no-detectado')
            : 'no-detectado',
        };
      })
    : [];

  return {
    issueKey,
    summary: String(fields.summary || 'no-detectado'),
    status: String(status.name || 'no-detectado'),
    statusCategory: status.statusCategory
      ? String(status.statusCategory.name || status.statusCategory.key || 'no-detectado')
      : 'no-detectado',
    labels: Array.isArray(fields.labels) ? fields.labels.map(String) : [],
    description: String(fields.description || ''),
    subtasks,
    raw: sanitize(JSON.stringify(data)),
  };
}

function writeEvidence(config, summary) {
  const output = path.join(ROOT, config.evidence.outputDir, `jira-parent-${summary.issueKey}-observation.md`);
  const jsonOutput = path.join(ROOT, config.evidence.outputDir, `jira-parent-${summary.issueKey}-observation.json`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(summary, null, 2), 'utf8');

  const lines = [];
  lines.push(`# Observacion De Parent Jira: ${sanitize(summary.issueKey)}`);
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push('- Escritura Jira: no');
  lines.push('');
  lines.push('## Parent');
  lines.push('');
  lines.push(`- Summary: ${sanitize(summary.summary)}`);
  lines.push(`- Status: ${sanitize(summary.status)}`);
  lines.push(`- Status category: ${sanitize(summary.statusCategory)}`);
  lines.push(`- Labels: ${summary.labels.map((label) => sanitize(label)).join(', ') || 'ninguno'}`);
  lines.push(`- Subtasks observadas: ${summary.subtasks.length}`);
  lines.push('');
  lines.push('## Subtasks');
  lines.push('');
  if (summary.subtasks.length === 0) {
    lines.push('- ninguna observada');
  } else {
    for (const subtask of summary.subtasks) {
      lines.push(`- \`${sanitize(subtask.key)}\` ${sanitize(subtask.summary)} -> ${sanitize(subtask.status)} (${sanitize(subtask.statusCategory)})`);
    }
  }
  lines.push('');
  lines.push('## Descripcion Sanitizada');
  lines.push('');
  lines.push('```text');
  lines.push(sanitize(summary.description));
  lines.push('```');
  lines.push('');
  lines.push('## Evidencia');
  lines.push('');
  lines.push(`- JSON sanitizado: \`${rel(jsonOutput)}\``);
  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
  return output;
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
