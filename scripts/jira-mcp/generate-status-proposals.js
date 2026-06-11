const fs = require('fs');
const path = require('path');
const { applyEvidenceArgs, parseArgs, requireEvidenceArgs } = require('./lib/cli-args');
const { loadConfig } = require('./lib/config');
const { readFeatureStates } = require('./lib/feature-state-reader');

const ROOT = process.cwd();

function main() {
  const args = parseArgs(process.argv.slice(2), {
    valueOptions: ['request-id', 'input-dir', 'output-dir'],
  });
  requireEvidenceArgs(args);

  const inputDir = stringArg(args, 'input-dir', null);
  if (!inputDir) {
    throw new Error('El argumento --input-dir es obligatorio para generar propuestas de status.');
  }

  const config = applyEvidenceArgs(loadConfig(), args);
  const observations = readObservations(inputDir);
  const states = readFeatureStates();
  const proposals = buildProposals(config, inputDir, observations, states);
  const outputs = writeEvidence(config, inputDir, proposals);

  console.log(`OK: Request: ${config.evidence.requestId}`);
  console.log(`OK: Input dir: ${inputDir}`);
  console.log(`OK: Observations read: ${observations.length}`);
  console.log(`OK: Proposals generated: ${proposals.proposals.length}`);
  console.log(`OK: Automatic local transitions: 0`);
  console.log(`OK: Jira writes: 0`);
  console.log(`OK: Evidence written: ${rel(outputs.summary)}`);
}

function readObservations(inputDir) {
  const file = path.join(ROOT, inputDir, 'jira-status-observation-results.json');
  if (!fs.existsSync(file)) {
    throw new Error(`No existe jira-status-observation-results.json en ${inputDir}. Ejecuta status-observe primero.`);
  }

  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(parsed.observations)) {
    throw new Error('jira-status-observation-results.json no contiene observations[].');
  }
  return parsed.observations;
}

function buildProposals(config, inputDir, observations, states) {
  const stateById = new Map(states.map((state) => [state.id, state]));
  const signalCounts = countSignals(observations);
  const proposals = observations.map((observation) => buildProposal(config, inputDir, observation, stateById, signalCounts));
  const blocked = proposals.filter((proposal) => proposal.decision.status === 'blocked');

  return {
    schema_version: '1.0',
    kind: 'jira_status_transition_proposal_batch',
    request_id: config.evidence.requestId,
    source_observation_dir: inputDir.replace(/\\/g, '/'),
    external_write: false,
    automatic_local_transition: false,
    summary: {
      observations: observations.length,
      proposals: proposals.length,
      blocked: blocked.length,
      no_action: proposals.filter((proposal) => proposal.proposed_control_plane_action === 'no-op').length,
      record_signal: proposals.filter((proposal) => proposal.proposed_control_plane_action === 'record-signal').length,
      continue_request: proposals.filter((proposal) => proposal.proposed_control_plane_action === 'continue-request').length,
      open_request_candidate: proposals.filter((proposal) => proposal.proposed_control_plane_action === 'open-request-candidate').length,
      blocker_candidate: proposals.filter((proposal) => proposal.proposed_control_plane_action === 'record-blocker-candidate').length,
      done_evidence_review: proposals.filter((proposal) => proposal.proposed_control_plane_action === 'require-local-done-evidence-review').length,
    },
    proposals,
  };
}

function buildProposal(config, inputDir, observation, stateById, signalCounts) {
  const state = stateById.get(observation.stateId);
  const signalKey = stableSignalKey(observation);
  const noSecretMaterial = !containsSecretMaterial(observation);
  const knownIssueKey = /^SST-\d+$/.test(String(observation.issueKey || ''));
  const duplicateSignalUnique = signalCounts.get(signalKey) === 1;
  const guards = {
    control_plane_authoritative: true,
    known_state_id: Boolean(state),
    known_issue_key: knownIssueKey,
    duplicate_signal_checked: true,
    duplicate_signal_unique: duplicateSignalUnique,
    local_evidence_required: true,
    human_approval_required: true,
    no_secret_material: noSecretMaterial,
  };
  const blockedReasons = Object.entries(guards)
    .filter(([, value]) => value !== true)
    .map(([key]) => key);

  return {
    schema_version: '1.0',
    kind: 'jira_status_transition_proposal',
    request_id: config.evidence.requestId,
    source_observation_dir: inputDir.replace(/\\/g, '/'),
    state_id: observation.stateId || 'unknown',
    jira_issue_key: observation.issueKey || null,
    observed_event: observation.proposedEvent || 'UNKNOWN',
    observed_jira_status: observation.jiraStatus || 'unknown',
    observed_status_category: observation.statusCategory || 'unknown',
    observed_assignee: observation.assignee || 'unknown',
    observed_updated: observation.updated || 'unknown',
    current_feature_status: state ? state.status : 'unknown',
    current_feature_file: state ? state.file : null,
    proposed_control_plane_action: actionForObservation(observation, state),
    automatic_local_transition: false,
    external_jira_write: false,
    guards,
    blocked_reasons: blockedReasons,
    decision: {
      status: blockedReasons.length > 0 ? 'blocked' : 'pending',
      approver: 'TODO',
      note: 'Dry-run proposal only. No local state or Jira mutation was executed.',
    },
  };
}

function actionForObservation(observation, state) {
  if (!state) return 'blocked-unknown-state';

  switch (observation.proposedEvent) {
    case 'JIRA_WORK_PENDING':
      return observation.assignee && observation.assignee !== 'no-asignado' ? 'record-signal' : 'no-op';
    case 'JIRA_WORK_STARTED':
      return state.requestIds && state.requestIds.length > 0 ? 'continue-request' : 'open-request-candidate';
    case 'JIRA_WORK_BLOCKED':
      return 'record-blocker-candidate';
    case 'JIRA_WORK_CLOSED_OBSERVED':
      return 'require-local-done-evidence-review';
    default:
      return 'blocked-unknown-event';
  }
}

function writeEvidence(config, inputDir, proposalBatch) {
  const outputDir = path.join(ROOT, config.evidence.outputDir);
  fs.mkdirSync(outputDir, { recursive: true });

  const json = path.join(outputDir, 'jira-status-transition-proposals.json');
  const summary = path.join(outputDir, 'jira-status-transition-proposals.md');
  fs.writeFileSync(json, JSON.stringify(proposalBatch, null, 2), 'utf8');
  fs.writeFileSync(summary, renderSummary(config, inputDir, proposalBatch), 'utf8');
  return { json, summary };
}

function renderSummary(config, inputDir, proposalBatch) {
  const lines = [];
  lines.push('# Jira Status Transition Proposals');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Input dir: \`${inputDir.replace(/\\/g, '/')}\``);
  lines.push(`- Observaciones leidas: ${proposalBatch.summary.observations}`);
  lines.push(`- Propuestas generadas: ${proposalBatch.summary.proposals}`);
  lines.push(`- Propuestas bloqueadas: ${proposalBatch.summary.blocked}`);
  lines.push('- Escritura Jira: no');
  lines.push('- Transiciones locales automaticas: 0');
  lines.push('');
  lines.push('## Resumen De Acciones');
  lines.push('');
  lines.push(`- no-op: ${proposalBatch.summary.no_action}`);
  lines.push(`- record-signal: ${proposalBatch.summary.record_signal}`);
  lines.push(`- continue-request: ${proposalBatch.summary.continue_request}`);
  lines.push(`- open-request-candidate: ${proposalBatch.summary.open_request_candidate}`);
  lines.push(`- record-blocker-candidate: ${proposalBatch.summary.blocker_candidate}`);
  lines.push(`- require-local-done-evidence-review: ${proposalBatch.summary.done_evidence_review}`);
  lines.push('');
  lines.push('## Propuestas');
  lines.push('');

  for (const proposal of proposalBatch.proposals) {
    lines.push(`### ${proposal.state_id}`);
    lines.push('');
    lines.push(`- Issue key: \`${proposal.jira_issue_key || 'unknown'}\``);
    lines.push(`- Observed event: \`${proposal.observed_event}\``);
    lines.push(`- Jira status: ${proposal.observed_jira_status}`);
    lines.push(`- Assignee: ${proposal.observed_assignee}`);
    lines.push(`- Current feature status: \`${proposal.current_feature_status}\``);
    lines.push(`- Proposed action: \`${proposal.proposed_control_plane_action}\``);
    lines.push(`- Decision: \`${proposal.decision.status}\``);
    if (proposal.blocked_reasons.length > 0) {
      lines.push(`- Blocked reasons: ${proposal.blocked_reasons.map((reason) => `\`${reason}\``).join(', ')}`);
    }
    lines.push('- Automatic local transition: no');
    lines.push('');
  }

  lines.push('## Decision');
  lines.push('');
  lines.push('Este artifact es un dry-run. No escribe en Jira, no modifica feature_state y no mueve requests CR-SST.');
  return `${lines.join('\n')}\n`;
}

function countSignals(observations) {
  const counts = new Map();
  for (const observation of observations) {
    const key = stableSignalKey(observation);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function stableSignalKey(observation) {
  return [
    observation.issueKey || 'unknown-issue',
    observation.proposedEvent || 'unknown-event',
    observation.updated || 'unknown-updated',
  ].join('|');
}

function containsSecretMaterial(value) {
  const text = JSON.stringify(value);
  return /(token|cookie|cloudId|authorization|bearer\s+[a-z0-9._-]+)/i.test(text);
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
