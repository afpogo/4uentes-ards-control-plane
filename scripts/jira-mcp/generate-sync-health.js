const fs = require('fs');
const path = require('path');
const { applyEvidenceArgs, parseArgs, requireEvidenceArgs } = require('./lib/cli-args');
const { loadConfig } = require('./lib/config');
const { readFeatureStates } = require('./lib/feature-state-reader');
const { buildIssuePayloads } = require('./lib/jira-payloads');

const ROOT = process.cwd();
const REQUIRED_LABELS = ['ards-sdd', 'control-plane', 'feature-state', 'not-done'];

function main() {
  const args = parseArgs(process.argv.slice(2), {
    valueOptions: ['request-id', 'input-dir', 'output-dir', 'reconciliation-dir', 'observation-dir'],
  });
  requireEvidenceArgs(args);

  const inputDir = stringArg(args, 'input-dir', null);
  if (!inputDir) {
    throw new Error('El argumento --input-dir es obligatorio para generar sync-health.');
  }

  const config = applyEvidenceArgs(loadConfig(), args);
  const states = readFeatureStates();
  const nonDoneStates = states.filter((state) => state.status !== 'done');
  const payloads = buildIssuePayloads(nonDoneStates, config);
  const proposals = readProposals(inputDir);
  const observationDir = stringArg(args, 'observation-dir', proposals.source_observation_dir || null);
  const observations = observationDir ? readObservations(observationDir) : [];
  const reconciliationDir = stringArg(args, 'reconciliation-dir', observationDir);
  const reconciliation = reconciliationDir ? readReconciliation(reconciliationDir) : emptyReconciliation();
  const health = buildSyncHealth(config, inputDir, observationDir, reconciliationDir, nonDoneStates, payloads, proposals, observations, reconciliation);
  const outputs = writeEvidence(config, health);

  console.log(`OK: Request: ${config.evidence.requestId}`);
  console.log(`OK: Input dir: ${inputDir}`);
  console.log(`OK: Feature states checked: ${health.summary.feature_states_checked}`);
  console.log(`OK: Jira issues observed: ${health.summary.jira_issues_observed}`);
  console.log(`OK: IN_SYNC: ${health.summary.by_status.IN_SYNC || 0}`);
  console.log(`OK: STATUS_SIGNAL_PENDING: ${health.summary.by_status.STATUS_SIGNAL_PENDING || 0}`);
  console.log(`OK: Items requiring write approval: ${health.summary.by_status.WRITE_APPROVAL_REQUIRED || 0}`);
  console.log(`OK: Jira writes: 0`);
  console.log(`OK: Automatic local transitions: 0`);
  console.log(`OK: Evidence written: ${rel(outputs.summary)}`);
}

function readProposals(inputDir) {
  const file = path.join(ROOT, inputDir, 'jira-status-transition-proposals.json');
  if (!fs.existsSync(file)) {
    throw new Error(`No existe jira-status-transition-proposals.json en ${inputDir}. Ejecuta status-proposals primero.`);
  }
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(parsed.proposals)) {
    throw new Error('jira-status-transition-proposals.json no contiene proposals[].');
  }
  return parsed;
}

function readObservations(observationDir) {
  const file = path.join(ROOT, observationDir, 'jira-status-observation-results.json');
  if (!fs.existsSync(file)) return [];
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(parsed.observations) ? parsed.observations : [];
}

function readReconciliation(reconciliationDir) {
  const file = path.join(ROOT, reconciliationDir, 'jira-reconciliation-results.json');
  if (!fs.existsSync(file)) return emptyReconciliation();
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  return {
    found: true,
    issues: Array.isArray(parsed.issues) ? parsed.issues : [],
    reconciled: Array.isArray(parsed.reconciled) ? parsed.reconciled : [],
  };
}

function emptyReconciliation() {
  return {
    found: false,
    issues: [],
    reconciled: [],
  };
}

function buildSyncHealth(config, inputDir, observationDir, reconciliationDir, states, payloads, proposalBatch, observations, reconciliation) {
  const payloadByStateId = new Map(payloads.map((payload) => [payload.stateId, payload]));
  const proposalByStateId = new Map(proposalBatch.proposals.map((proposal) => [proposal.state_id, proposal]));
  const observationByStateId = new Map(observations.map((observation) => [observation.stateId, observation]));
  const reconciliationByStateId = new Map(reconciliation.reconciled.map((item) => [item.stateId, item]));
  const issueByKey = new Map(reconciliation.issues.map((issue) => [issue.issueKey, issue]));
  const items = states.map((state) => buildHealthItem(state, payloadByStateId.get(state.id), proposalByStateId.get(state.id), observationByStateId.get(state.id), reconciliationByStateId.get(state.id), issueByKey));
  const orphans = findOrphans(reconciliation, states);
  const byStatus = groupStatuses(items, orphans);

  return {
    schema_version: '1.0',
    kind: 'jira_sync_health_report',
    request_id: config.evidence.requestId,
    source_input_dir: inputDir.replace(/\\/g, '/'),
    source_observation_dir: observationDir ? observationDir.replace(/\\/g, '/') : null,
    source_reconciliation_dir: reconciliationDir ? reconciliationDir.replace(/\\/g, '/') : null,
    external_write: false,
    automatic_local_transition: false,
    summary: {
      feature_states_checked: states.length,
      jira_issues_observed: reconciliation.issues.length,
      proposals_observed: proposalBatch.proposals.length,
      observations_observed: observations.length,
      orphan_jira_items: orphans.length,
      by_status: byStatus,
    },
    items,
    orphan_jira_items: orphans,
  };
}

function buildHealthItem(state, payload, proposal, observation, reconciliationItem, issueByKey) {
  const statuses = [];
  const reasons = [];
  const issueKey = selectedIssueKey(reconciliationItem, proposal, observation);
  const issue = issueKey ? issueByKey.get(issueKey) : null;

  if (!reconciliationItem || !reconciliationItem.selectedIssueKey) {
    statuses.push('MISSING_JIRA');
    reasons.push('No reconciled Jira issue was found for this feature state.');
  }

  if (reconciliationItem && duplicateExactCount(reconciliationItem) > 1) {
    statuses.push('DUPLICATE_JIRA');
    reasons.push('More than one candidate Jira issue was observed for this state id.');
  }

  if (reconciliationItem && reconciliationItem.updateNeeded) {
    statuses.push('DESCRIPTION_DRIFT');
    reasons.push('Reconciliation indicates the Jira description needs an update.');
  }

  if (issue && !hasRequiredLabels(issue, state.status)) {
    statuses.push('LABEL_DRIFT');
    reasons.push('Jira labels do not match the required base labels and feature status label.');
  }

  if (proposal && proposal.decision && proposal.decision.status === 'blocked') {
    statuses.push('WRITE_APPROVAL_REQUIRED');
    reasons.push('The status proposal is blocked and requires review before synchronization.');
  }

  if (proposal && proposal.proposed_control_plane_action && proposal.proposed_control_plane_action !== 'no-op') {
    statuses.push('STATUS_SIGNAL_PENDING');
    reasons.push(`Observed Jira signal proposes action ${proposal.proposed_control_plane_action}.`);
  }

  if (observation && isClosed(observation) && state.status !== 'done') {
    statuses.push('CLOSURE_CONFLICT');
    reasons.push('Jira appears closed while the feature state is not done.');
  }

  if (!observation) {
    statuses.push('STALE_OBSERVATION');
    reasons.push('No status observation evidence was found for this feature state.');
  }

  if (state.status === 'done' && observation && !isClosed(observation)) {
    statuses.push('LOCAL_DONE_PENDING_JIRA');
    reasons.push('Feature state is done while Jira does not appear closed.');
  }

  if (statuses.length === 0) {
    statuses.push('IN_SYNC');
    reasons.push('The feature state has one reconciled Jira issue, matching summary, current description markers, matching labels, and no pending status signal.');
  }

  return {
    state_id: state.id,
    feature_status: state.status,
    source_file: state.file,
    expected_summary: payload ? payload.summary : null,
    jira_issue_key: issueKey,
    jira_status: observation ? observation.jiraStatus : null,
    jira_status_category: observation ? observation.statusCategory : null,
    jira_assignee: observation ? observation.assignee : null,
    proposal_action: proposal ? proposal.proposed_control_plane_action : null,
    health_statuses: uniq(statuses),
    reasons: uniq(reasons),
    external_write_required: statuses.some((status) => ['DESCRIPTION_DRIFT', 'LABEL_DRIFT', 'LOCAL_DONE_PENDING_JIRA', 'WRITE_APPROVAL_REQUIRED'].includes(status)),
    local_transition_required: false,
  };
}

function findOrphans(reconciliation, states) {
  const knownStateIds = new Set(states.map((state) => state.id));
  const selectedKeys = new Set(reconciliation.reconciled.map((item) => item.selectedIssueKey).filter(Boolean));
  return reconciliation.issues
    .filter((issue) => !selectedKeys.has(issue.issueKey))
    .map((issue) => ({
      issue_key: issue.issueKey,
      health_statuses: ['ORPHAN_JIRA'],
      reason: knownStateIds.size > 0
        ? 'Issue was observed in Jira evidence but was not selected by reconciliation for any current non-done feature state.'
        : 'No local feature states were loaded.',
    }));
}

function selectedIssueKey(reconciliationItem, proposal, observation) {
  if (reconciliationItem && reconciliationItem.selectedIssueKey) return reconciliationItem.selectedIssueKey;
  if (proposal && proposal.jira_issue_key) return proposal.jira_issue_key;
  if (observation && observation.issueKey) return observation.issueKey;
  return null;
}

function duplicateExactCount(reconciliationItem) {
  if (!reconciliationItem || !Array.isArray(reconciliationItem.issueKeys)) return 0;
  return reconciliationItem.selectedIssueKey ? 1 : reconciliationItem.issueKeys.length;
}

function hasRequiredLabels(issue, status) {
  const labels = extractLabels(issue.raw);
  if (labels.length === 0) return false;
  return [...REQUIRED_LABELS, status].every((label) => labels.includes(label));
}

function extractLabels(raw) {
  if (!raw) return [];
  const match = String(raw).match(/"labels"\s*:\s*\[([^\]]*)\]/);
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]);
}

function isClosed(observation) {
  const text = `${observation.jiraStatus || ''} ${observation.statusCategory || ''} ${observation.proposedEvent || ''}`.toLowerCase();
  return /done|cerrado|closed|resolved|complete|jira_work_closed_observed/.test(text);
}

function groupStatuses(items, orphans) {
  const counts = {};
  for (const item of items) {
    for (const status of item.health_statuses) {
      counts[status] = (counts[status] || 0) + 1;
    }
  }
  for (const orphan of orphans) {
    for (const status of orphan.health_statuses) {
      counts[status] = (counts[status] || 0) + 1;
    }
  }
  return counts;
}

function writeEvidence(config, health) {
  const outputDir = path.join(ROOT, config.evidence.outputDir);
  fs.mkdirSync(outputDir, { recursive: true });
  const json = path.join(outputDir, 'jira-sync-health-results.json');
  const summary = path.join(outputDir, 'jira-sync-health-summary.md');
  fs.writeFileSync(json, JSON.stringify(health, null, 2), 'utf8');
  fs.writeFileSync(summary, renderSummary(config, health), 'utf8');
  return { json, summary };
}

function renderSummary(config, health) {
  const lines = [];
  lines.push('# Jira Sync Health');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Input dir: \`${health.source_input_dir}\``);
  lines.push(`- Observation dir: ${health.source_observation_dir ? `\`${health.source_observation_dir}\`` : 'ninguno'}`);
  lines.push(`- Reconciliation dir: ${health.source_reconciliation_dir ? `\`${health.source_reconciliation_dir}\`` : 'ninguno'}`);
  lines.push(`- Feature states revisados: ${health.summary.feature_states_checked}`);
  lines.push(`- Jira issues observados: ${health.summary.jira_issues_observed}`);
  lines.push(`- Propuestas observadas: ${health.summary.proposals_observed}`);
  lines.push('- Escritura Jira: no');
  lines.push('- Transiciones locales automaticas: 0');
  lines.push('');
  lines.push('## Resumen Por Estado');
  lines.push('');
  for (const [status, count] of Object.entries(health.summary.by_status).sort()) {
    lines.push(`- ${status}: ${count}`);
  }
  lines.push('');
  lines.push('## Items');
  lines.push('');
  for (const item of health.items) {
    lines.push(`### ${item.state_id}`);
    lines.push('');
    lines.push(`- Feature status: \`${item.feature_status}\``);
    lines.push(`- Jira issue: ${item.jira_issue_key ? `\`${item.jira_issue_key}\`` : 'ninguno'}`);
    lines.push(`- Jira status: ${item.jira_status || 'no-observado'}`);
    lines.push(`- Proposal action: ${item.proposal_action ? `\`${item.proposal_action}\`` : 'ninguna'}`);
    lines.push(`- Health: ${item.health_statuses.map((status) => `\`${status}\``).join(', ')}`);
    lines.push(`- External write required: ${item.external_write_required ? 'si' : 'no'}`);
    item.reasons.forEach((reason) => lines.push(`- Reason: ${reason}`));
    lines.push('');
  }
  if (health.orphan_jira_items.length > 0) {
    lines.push('## Orphan Jira Items');
    lines.push('');
    for (const item of health.orphan_jira_items) {
      lines.push(`- ${item.issue_key}: ${item.health_statuses.join(', ')} - ${item.reason}`);
    }
    lines.push('');
  }
  lines.push('## Decision');
  lines.push('');
  lines.push('Este artifact es un dry-run de salud de sincronizacion. No escribe en Jira, no modifica feature_state y no mueve requests CR-SST.');
  return `${lines.join('\n')}\n`;
}

function uniq(values) {
  return [...new Set(values)];
}

function stringArg(args, key, fallback) {
  const value = args[key];
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`El argumento --${key} requiere un valor de texto.`);
  }
  return value;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

try {
  main();
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
}
