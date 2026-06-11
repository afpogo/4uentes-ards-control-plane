const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

function writeDryRunEvidence(config, states, payloads) {
  const outputDir = path.join(ROOT, config.evidence.outputDir);
  fs.mkdirSync(outputDir, { recursive: true });

  const file = path.join(outputDir, 'ticket-payload-dry-run.md');
  fs.writeFileSync(file, renderDryRun(config, states, payloads), 'utf8');
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function renderDryRun(config, states, payloads) {
  const doneCount = countDoneFeatures();
  const lines = [];

  lines.push('# Dry Run De Payloads Jira');
  lines.push('');
  lines.push('## Alcance');
  lines.push('');
  lines.push('- Fecha: 2026-06-05');
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push('- Fuente: `state/features/*.current.yaml`');
  lines.push(`- Jira board: \`${config.jira.boardName}\``);
  lines.push(`- Jira project key: \`${config.jira.projectKey}\``);
  lines.push(`- Issue type asumido: \`${config.jira.issueType}\``);
  lines.push(`- Feature states totales: ${states.length + doneCount}`);
  lines.push(`- Feature states en \`done\`: ${doneCount}`);
  lines.push(`- Feature states no \`done\`: ${payloads.length}`);
  lines.push('- Escritura Jira: no ejecutada');
  lines.push('');
  lines.push('## Defaults');
  lines.push('');
  lines.push(`- Jira board: ${config.jira.boardName}`);
  lines.push(`- Project key: ${config.jira.projectKey}`);
  lines.push(`- Issue type: ${config.jira.issueType}`);
  lines.push('- Labels base:');
  lines.push('  - `ards-sdd`');
  lines.push('  - `control-plane`');
  lines.push('  - `feature-state`');
  lines.push('  - `not-done`');
  lines.push('');
  lines.push('## Orden');
  lines.push('');
  lines.push('El orden se basa en prioridad operativa:');
  lines.push('');
  lines.push('1. `runtime-partial`');
  lines.push('2. `implemented-local`');
  lines.push('3. `ards-documented`');
  lines.push('4. `validated-local`');
  lines.push('5. `validated-live`');
  lines.push('');
  lines.push('Dentro de cada estado, se priorizan items con mas gaps abiertos y mayor alcance de servicios.');

  payloads.forEach((payload, index) => {
    const state = payload.rawState;
    lines.push('');
    lines.push(`## Ticket ${index + 1}`);
    lines.push('');
    lines.push('Summary:');
    lines.push('');
    lines.push('```text');
    lines.push(payload.summary);
    lines.push('```');
    lines.push('');
    lines.push('Fields:');
    lines.push('');
    lines.push(`- \`project_key\`: \`${payload.projectKey}\``);
    lines.push(`- \`board_name\`: \`${payload.boardName}\``);
    lines.push(`- \`issue_type\`: \`${payload.issueType}\``);
    lines.push(`- \`state_id\`: \`${payload.stateId}\``);
    lines.push(`- \`status\`: \`${state.status}\``);
    lines.push(`- \`priority\`: \`${payload.priority}\``);
    lines.push(`- \`labels\`: ${payload.labels.map((label) => `\`${label}\``).join(', ')}`);
    lines.push(`- \`affected_services\`: ${inlineList(state.affectedServices)}`);
    lines.push(`- \`request_ids\`: ${inlineList(state.requestIds)}`);
    lines.push('');
    lines.push('Description:');
    lines.push('');
    lines.push('```text');
    lines.push(payload.description);
    lines.push('```');
  });

  lines.push('');
  lines.push('## Readiness Para Escritura Jira');
  lines.push('');
  lines.push('Este dry-run esta listo para revision humana, pero no esta listo para escritura Jira hasta que:');
  lines.push('');
  lines.push('- Jira MCP este configurado en el runtime;');
  lines.push(`- Jira board \`${config.jira.boardName}\` este confirmado;`);
  lines.push(`- Jira project key \`${config.jira.projectKey}\` este verificado por MCP;`);
  lines.push('- issue type y campos obligatorios esten confirmados por MCP;');
  lines.push('- duplicate search este ejecutado;');
  lines.push('- el usuario apruebe explicitamente la creacion.');
  lines.push('');

  return `${lines.join('\n')}`;
}

function countDoneFeatures() {
  const featureDir = path.join(ROOT, 'state', 'features');
  return fs
    .readdirSync(featureDir)
    .filter((file) => file.endsWith('.current.yaml'))
    .filter((file) => {
      const text = fs.readFileSync(path.join(featureDir, file), 'utf8');
      return /^status:\s*"done"\s*$/m.test(text);
    }).length;
}

function inlineList(items) {
  if (!items || items.length === 0) return '`ninguno`';
  return items.map((item) => `\`${item}\``).join(', ');
}

module.exports = {
  writeDryRunEvidence,
};
