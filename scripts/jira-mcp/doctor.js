const fs = require('fs');
const path = require('path');
const { applyEvidenceArgs, parseArgs, requireEvidenceArgs } = require('./lib/cli-args');
const { loadConfig } = require('./lib/config');
const { readFeatureStates, readNonDoneFeatureStates } = require('./lib/feature-state-reader');
const { buildIssuePayloads } = require('./lib/jira-payloads');

const ROOT = process.cwd();
const MACHINE_FILE = path.join(ROOT, 'state', 'jira-backlog-sync-machine.yaml');
const PACKAGE_FILE = path.join(ROOT, 'package.json');
const EVIDENCE_REQUESTS_DIR = path.join(ROOT, 'evidence', 'requests');

function main() {
  const args = parseArgs(process.argv.slice(2), {
    valueOptions: ['request-id', 'output-dir', 'mode', 'reconciliation-dir'],
  });
  requireEvidenceArgs(args);

  const mode = args.mode || 'read-only';
  if (!['read-only', 'local'].includes(mode)) {
    throw new Error(`Modo no soportado: ${mode}. Modos permitidos: read-only, local.`);
  }

  const config = applyEvidenceArgs(loadConfig(), args);
  const outputDir = path.join(ROOT, config.evidence.outputDir);
  fs.mkdirSync(outputDir, { recursive: true });

  const allStates = readFeatureStates();
  const nonDoneStates = readNonDoneFeatureStates();
  const payloads = buildIssuePayloads(nonDoneStates, config);
  const commandSurface = readCommandSurface();
  const machine = readMachine();
  const lastRun = readLastMachineRun();
  const reconciliation = readReconciliation(args['reconciliation-dir']);
  const correctionPlan = buildCorrectionPlan(config, payloads, reconciliation);
  const lifecycle = readLifecycleSnapshot();
  const findings = buildFindings(commandSurface, machine, reconciliation, correctionPlan, lifecycle);

  const outputs = {
    doctorSummary: writeDoctorSummary(config, mode, allStates, nonDoneStates, commandSurface, machine, lastRun, reconciliation, correctionPlan, lifecycle, findings),
    machineRunState: writeMachineRunState(config, mode, machine, lastRun, correctionPlan, findings),
    correctionPlanPreview: writeCorrectionPlanPreview(config, correctionPlan),
    correctionPlanJson: writeCorrectionPlanJson(config, correctionPlan),
    subagentDeploymentEvidence: writeSubagentEvidence(config),
  };

  console.log(`OK: Request: ${config.evidence.requestId}`);
  console.log(`OK: Mode: ${mode}`);
  console.log(`OK: Feature states total: ${allStates.length}`);
  console.log(`OK: Feature states non-done: ${nonDoneStates.length}`);
  console.log(`OK: Correction actions proposed: ${correctionPlan.actions.filter((item) => item.action === 'propose-description-update').length}`);
  console.log(`OK: Create actions proposed: ${correctionPlan.actions.filter((item) => item.action === 'propose-issue-create').length}`);
  console.log(`OK: Correction actions blocked: ${correctionPlan.actions.filter((item) => item.action.startsWith('blocked')).length}`);
  console.log(`OK: External Jira write: no`);
  console.log(`OK: Doctor summary written: ${rel(outputs.doctorSummary)}`);
  console.log(`OK: Machine run state written: ${rel(outputs.machineRunState)}`);
  console.log(`OK: Correction preview written: ${rel(outputs.correctionPlanPreview)}`);
}

function readCommandSurface() {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_FILE, 'utf8'));
  const scripts = pkg.scripts || {};
  const entries = Object.entries(scripts)
    .filter(([name]) => name.startsWith('jira:mcp:'))
    .map(([name, command]) => ({
      name,
      command,
      category: commandCategory(name),
    }));

  return {
    total: entries.length,
    readOnly: entries.filter((item) => item.category === 'read-only'),
    write: entries.filter((item) => item.category === 'external-write'),
    legacy: entries.filter((item) => item.category === 'legacy-or-special'),
    entries,
  };
}

function commandCategory(name) {
  if (['jira:mcp:create', 'jira:mcp:update-existing'].includes(name)) return 'external-write';
  if (['jira:mcp:verify'].includes(name)) return 'legacy-or-special';
  return 'read-only';
}

function readMachine() {
  const text = fs.readFileSync(MACHINE_FILE, 'utf8');
  return {
    file: rel(MACHINE_FILE),
    status: topLevel(text, 'status') || 'unknown',
    updatedAt: topLevel(text, 'updated_at') || 'unknown',
    terminalStates: listUnder(text, 'terminal'),
    hasReadyForApproval: /ready-for-approval/.test(text),
    hasWritingJira: /writing-jira/.test(text),
    hasDoneTerminal: /terminal:\s*\r?\n\s+- done/m.test(text),
  };
}

function readLastMachineRun() {
  const candidates = listRequestEvidenceFiles('jira-sync-machine-read-only.md');
  if (candidates.length === 0) return null;
  const file = candidates[0];
  const text = fs.readFileSync(file, 'utf8');
  return {
    evidenceRef: rel(file),
    requestId: firstMatch(text, /- Request:\s+(CR-SST-\d{4})/),
    mode: firstMatch(text, /- Mode:\s+`([^`]+)`/),
    finalState: firstMatch(text, /- Estado final:\s+`([^`]+)`/),
    eventsApplied: firstMatch(text, /- Eventos aplicados:\s+([0-9]+)/),
    jiraMcp: firstMatch(text, /- Jira MCP:\s+(.+)/),
    jiraWrite: firstMatch(text, /- Escritura Jira:\s+(.+)/),
  };
}

function readReconciliation(explicitDir) {
  const file = explicitDir
    ? path.join(ROOT, explicitDir, 'jira-reconciliation-results.json')
    : listRequestEvidenceFiles('jira-reconciliation-results.json')[0];

  if (!file || !fs.existsSync(file)) {
    return {
      found: false,
      evidenceRef: null,
      issues: [],
      reconciled: [],
    };
  }

  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  return {
    found: true,
    evidenceRef: rel(file),
    issues: parsed.issues || [],
    reconciled: parsed.reconciled || [],
  };
}

function buildCorrectionPlan(config, payloads, reconciliation) {
  const actions = [];

  if (!reconciliation.found) {
    return {
      requestId: config.evidence.requestId,
      sourceReconciliation: null,
      externalWrite: false,
      summary: {
        proposedUpdates: 0,
        proposedCreates: 0,
        noAction: 0,
        blocked: payloads.length,
      },
      actions: payloads.map((payload) => ({
        stateId: payload.stateId,
        issueKey: null,
        action: 'blocked-no-reconciliation',
        reason: 'No reconciliation evidence was found.',
      })),
    };
  }

  for (const item of reconciliation.reconciled) {
    const payload = payloads.find((candidate) => candidate.stateId === item.stateId);
    if (!payload) {
      actions.push({
        stateId: item.stateId,
        issueKey: item.selectedIssueKey || null,
        action: 'blocked-no-payload',
        reason: 'The reconciled state has no generated Jira payload.',
      });
      continue;
    }

    if (!item.selectedIssueKey) {
      const exactIssueKeys = exactIssueKeysFor(item, payload, reconciliation.issues);
      if (exactIssueKeys.length === 0) {
        actions.push({
          stateId: item.stateId,
          issueKey: null,
          action: 'propose-issue-create',
          reason: 'No exact Jira issue summary was found; related issue keys are references, not duplicates.',
          expectedSummary: payload.summary,
          relatedIssueKeys: item.issueKeys || [],
          proposedIssue: {
            projectKey: payload.projectKey,
            issueType: payload.issueType,
            summary: payload.summary,
            labels: payload.labels,
            description: payload.description,
          },
        });
        continue;
      }

      actions.push({
        stateId: item.stateId,
        issueKey: null,
        action: 'blocked-ambiguous-exact-summary',
        reason: `Multiple exact summary candidates were found: ${exactIssueKeys.join(', ')}.`,
        expectedSummary: payload.summary,
        relatedIssueKeys: item.issueKeys || [],
      });
      continue;
    }

    if (!item.updateNeeded) {
      actions.push({
        stateId: item.stateId,
        issueKey: item.selectedIssueKey,
        action: 'no-action',
        reason: 'The selected issue does not need a description correction.',
      });
      continue;
    }

    actions.push({
      stateId: item.stateId,
      issueKey: item.selectedIssueKey,
      action: 'propose-description-update',
      reason: 'The selected issue needs the current sync/origin process fields.',
      expectedSummary: payload.summary,
      proposedDescription: payload.description,
    });
  }

  return {
    requestId: config.evidence.requestId,
    sourceReconciliation: reconciliation.evidenceRef,
    externalWrite: false,
    summary: {
      proposedUpdates: actions.filter((item) => item.action === 'propose-description-update').length,
      proposedCreates: actions.filter((item) => item.action === 'propose-issue-create').length,
      noAction: actions.filter((item) => item.action === 'no-action').length,
      blocked: actions.filter((item) => item.action.startsWith('blocked')).length,
    },
    actions,
  };
}

function exactIssueKeysFor(reconciliationItem, payload, issues) {
  const issueKeys = reconciliationItem.issueKeys || [];
  return issues
    .filter((issue) => issueKeys.includes(issue.issueKey))
    .filter((issue) => issue.raw && issue.raw.includes(payload.summary))
    .map((issue) => issue.issueKey);
}

function readLifecycleSnapshot() {
  const plannedDir = path.join(ROOT, 'requests', 'planned');
  const inboxDir = path.join(ROOT, 'requests', 'inbox');
  return {
    cr0034: lifecycleState(plannedDir, inboxDir, 'CR-SST-0034'),
    cr0035: lifecycleState(plannedDir, inboxDir, 'CR-SST-0035'),
    cr0036: lifecycleState(plannedDir, inboxDir, 'CR-SST-0036'),
    cr0037: lifecycleState(plannedDir, inboxDir, 'CR-SST-0037'),
    cr0038: lifecycleState(plannedDir, inboxDir, 'CR-SST-0038'),
  };
}

function lifecycleState(plannedDir, inboxDir, requestId) {
  const planned = findRequestFile(plannedDir, requestId);
  const inbox = findRequestFile(inboxDir, requestId);
  return {
    requestId,
    planned: planned ? rel(planned) : null,
    inbox: inbox ? rel(inbox) : null,
  };
}

function buildFindings(commandSurface, machine, reconciliation, correctionPlan, lifecycle) {
  const findings = [];

  if (commandSurface.write.length > 0) {
    findings.push({
      severity: 'warning',
      id: 'WRITE_COMMANDS_EXPOSED',
      message: 'External write commands are present and must remain behind explicit approval.',
    });
  }
  if (machine.status !== 'active') {
    findings.push({
      severity: 'info',
      id: 'MACHINE_NOT_ACTIVE',
      message: `Machine definition status is ${machine.status}.`,
    });
  }
  if (!reconciliation.found) {
    findings.push({
      severity: 'warning',
      id: 'NO_RECONCILIATION_EVIDENCE',
      message: 'No Jira reconciliation evidence was found for correction planning.',
    });
  }
  if (correctionPlan.summary.blocked > 0) {
    findings.push({
      severity: 'warning',
      id: 'CORRECTION_PLAN_HAS_BLOCKED_ITEMS',
      message: `${correctionPlan.summary.blocked} correction item(s) are blocked by missing or ambiguous reconciliation.`,
    });
  }
  for (const item of Object.values(lifecycle)) {
    if (item.inbox && item.planned) {
      findings.push({
        severity: 'info',
        id: 'REQUEST_EXISTS_IN_INBOX_AND_PLANNED',
        message: `${item.requestId} exists in both inbox and planned lifecycle folders.`,
      });
    }
  }

  return findings;
}

function writeDoctorSummary(config, mode, allStates, nonDoneStates, commandSurface, machine, lastRun, reconciliation, correctionPlan, lifecycle, findings) {
  const output = outputPath(config, 'doctor-summary.md');
  const doneCount = allStates.filter((state) => state.status === 'done').length;
  const statusCounts = groupCounts(nonDoneStates.map((state) => state.status));
  const lines = [];

  lines.push('# Jira Sync Doctor');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Mode: \`${mode}\``);
  lines.push('- Escritura Jira: no');
  lines.push(`- Jira project key: \`${config.jira.projectKey}\``);
  lines.push(`- Jira board: \`${config.jira.boardName}\``);
  lines.push('');
  lines.push('## Feature States');
  lines.push('');
  lines.push(`- Total: ${allStates.length}`);
  lines.push(`- Done: ${doneCount}`);
  lines.push(`- No done: ${nonDoneStates.length}`);
  for (const [status, count] of Object.entries(statusCounts)) {
    lines.push(`- ${status}: ${count}`);
  }
  lines.push('');
  lines.push('## Comandos Jira MCP');
  lines.push('');
  lines.push(`- Total package scripts: ${commandSurface.total}`);
  lines.push(`- Read-only/local: ${commandSurface.readOnly.length}`);
  lines.push(`- External write: ${commandSurface.write.length}`);
  lines.push(`- Legacy/special: ${commandSurface.legacy.length}`);
  lines.push('');
  lines.push('### External Write Commands');
  lines.push('');
  if (commandSurface.write.length === 0) lines.push('- ninguno');
  else commandSurface.write.forEach((item) => lines.push(`- \`${item.name}\`: \`${item.command}\``));
  lines.push('');
  lines.push('## Maquina');
  lines.push('');
  lines.push(`- Definition: \`${machine.file}\``);
  lines.push(`- Definition status: \`${machine.status}\``);
  lines.push(`- Updated at: \`${machine.updatedAt}\``);
  lines.push(`- Last observed run: ${lastRun ? `\`${lastRun.finalState}\` via ${lastRun.evidenceRef}` : 'ninguna'}`);
  lines.push('');
  lines.push('## Reconciliacion Jira');
  lines.push('');
  lines.push(`- Evidence found: ${reconciliation.found ? 'si' : 'no'}`);
  if (reconciliation.found) lines.push(`- Evidence ref: \`${reconciliation.evidenceRef}\``);
  lines.push(`- Issues observed: ${reconciliation.issues.length}`);
  lines.push(`- Feature states reconciled: ${reconciliation.reconciled.length}`);
  lines.push('');
  lines.push('## Correction Plan Preview');
  lines.push('');
  lines.push(`- Proposed description updates: ${correctionPlan.summary.proposedUpdates}`);
  lines.push(`- Proposed issue creates: ${correctionPlan.summary.proposedCreates}`);
  lines.push(`- No action: ${correctionPlan.summary.noAction}`);
  lines.push(`- Blocked: ${correctionPlan.summary.blocked}`);
  lines.push('- Applied to Jira: no');
  lines.push('');
  lines.push('## Lifecycle Snapshot');
  lines.push('');
  Object.values(lifecycle).forEach((item) => {
    lines.push(`- ${item.requestId}: inbox=${item.inbox ? 'si' : 'no'}, planned=${item.planned ? 'si' : 'no'}`);
  });
  lines.push('');
  lines.push('## Findings');
  lines.push('');
  if (findings.length === 0) lines.push('- ninguno');
  else findings.forEach((finding) => lines.push(`- ${finding.severity.toUpperCase()} ${finding.id}: ${finding.message}`));
  lines.push('');
  lines.push('## Decision');
  lines.push('');
  lines.push('El doctor queda limitado a diagnostico, verificacion y preview de correccion. Las escrituras Jira deben ejecutarse en una fase separada con aprobacion explicita.');

  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
  return output;
}

function writeMachineRunState(config, mode, machine, lastRun, correctionPlan, findings) {
  const output = outputPath(config, 'machine-run-state.yaml');
  const lines = [];

  lines.push('schema_version: "1.0"');
  lines.push('kind: "jira_sync_doctor_run_state"');
  lines.push(`request_id: "${config.evidence.requestId}"`);
  lines.push(`generated_at: "${today()}"`);
  lines.push(`mode: "${mode}"`);
  lines.push('source_of_truth: "control-plane"');
  lines.push('external_mirror: "jira"');
  lines.push(`machine_definition_status: "${machine.status}"`);
  lines.push(`machine_definition_ref: "${machine.file}"`);
  lines.push('last_observed_machine_run:');
  if (lastRun) {
    lines.push(`  evidence_ref: "${lastRun.evidenceRef}"`);
    lines.push(`  request_id: "${lastRun.requestId || 'unknown'}"`);
    lines.push(`  mode: "${lastRun.mode || 'unknown'}"`);
    lines.push(`  final_state: "${lastRun.finalState || 'unknown'}"`);
    lines.push(`  jira_write: "${lastRun.jiraWrite || 'unknown'}"`);
  } else {
    lines.push('  evidence_ref: null');
    lines.push('  final_state: "unknown"');
  }
  lines.push('doctor_run:');
  lines.push('  state: "doctor-read-only-complete"');
  lines.push(`  proposed_description_updates: ${correctionPlan.summary.proposedUpdates}`);
  lines.push(`  proposed_issue_creates: ${correctionPlan.summary.proposedCreates}`);
  lines.push(`  blocked_items: ${correctionPlan.summary.blocked}`);
  lines.push('guards:');
  lines.push('  external_write_allowed: false');
  lines.push('  reason: "Doctor runs do not create, edit, comment, transition, or close Jira issues."');
  lines.push('findings:');
  if (findings.length === 0) lines.push('  - "none"');
  else findings.forEach((finding) => lines.push(`  - "${finding.severity}:${finding.id}"`));

  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
  return output;
}

function writeCorrectionPlanPreview(config, correctionPlan) {
  const output = outputPath(config, 'correction-plan-preview.md');
  const lines = [];

  lines.push('# Correction Plan Preview');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Source reconciliation: ${correctionPlan.sourceReconciliation ? `\`${correctionPlan.sourceReconciliation}\`` : 'ninguna'}`);
  lines.push('- Escritura Jira: no');
  lines.push(`- Proposed description updates: ${correctionPlan.summary.proposedUpdates}`);
  lines.push(`- Proposed issue creates: ${correctionPlan.summary.proposedCreates}`);
  lines.push(`- No action: ${correctionPlan.summary.noAction}`);
  lines.push(`- Blocked: ${correctionPlan.summary.blocked}`);
  lines.push('');
  lines.push('## Actions');
  lines.push('');

  for (const action of correctionPlan.actions) {
    lines.push(`### ${action.stateId}`);
    lines.push('');
    lines.push(`- Action: ${action.action}`);
    lines.push(`- Issue key: ${action.issueKey ? `\`${action.issueKey}\`` : 'ninguno'}`);
    lines.push(`- Reason: ${action.reason}`);
    if (action.expectedSummary) lines.push(`- Expected summary: \`${action.expectedSummary}\``);
    if (action.relatedIssueKeys && action.relatedIssueKeys.length > 0) {
      lines.push(`- Related issue keys: ${action.relatedIssueKeys.map((key) => `\`${key}\``).join(', ')}`);
    }
    lines.push('');
  }

  lines.push('## Write Boundary');
  lines.push('');
  lines.push('Este artifact no aplica cambios en Jira. Para ejecutar una correccion real se requiere una fase de escritura separada, aprobada y sin reconciliaciones ambiguas.');

  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
  return output;
}

function writeCorrectionPlanJson(config, correctionPlan) {
  const output = outputPath(config, 'correction-plan-preview.json');
  fs.writeFileSync(output, JSON.stringify(correctionPlan, null, 2), 'utf8');
  return output;
}

function writeSubagentEvidence(config) {
  const output = outputPath(config, 'subagent-deployment-evidence.md');
  const lines = [];

  lines.push('# Subagent Deployment Evidence');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push('- Task weight: `complex-high-risk-task`');
  lines.push('- Policy ref: `docs/ai/model-selection-policy.md`');
  lines.push('- Subagents required by local policy: si');
  lines.push('- Subagents deployed: no');
  lines.push('');
  lines.push('## Fallback');
  lines.push('');
  lines.push('El runtime expone herramientas de subagentes, pero su contrato indica usarlas solo cuando el usuario pide subagentes, delegacion o trabajo paralelo de forma explicita. El usuario pidio continuar con CR-SST-0037, sin pedir subagentes. La revision de arquitectura, frontera de escritura y validacion se ejecuta secuencialmente en el agente principal.');

  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
  return output;
}

function listRequestEvidenceFiles(fileName) {
  if (!fs.existsSync(EVIDENCE_REQUESTS_DIR)) return [];
  return fs
    .readdirSync(EVIDENCE_REQUESTS_DIR)
    .filter((dir) => /^CR-SST-\d{4}$/.test(dir))
    .sort((a, b) => requestNumber(b) - requestNumber(a))
    .map((dir) => path.join(EVIDENCE_REQUESTS_DIR, dir, fileName))
    .filter((file) => fs.existsSync(file));
}

function findRequestFile(dir, requestId) {
  if (!fs.existsSync(dir)) return null;
  const match = fs.readdirSync(dir).find((file) => file.startsWith(requestId) && file.endsWith('.yaml'));
  return match ? path.join(dir, match) : null;
}

function requestNumber(requestId) {
  const match = requestId.match(/CR-SST-(\d{4})/);
  return match ? Number(match[1]) : 0;
}

function groupCounts(values) {
  return values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function topLevel(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*(.+)\\s*$`, 'm'));
  return match ? strip(match[1]) : null;
}

function listUnder(text, section) {
  const lines = text.split(/\r?\n/);
  const values = [];
  let inSection = false;

  for (const line of lines) {
    if (line.startsWith(`${section}:`)) {
      inSection = true;
      continue;
    }
    if (!inSection) continue;
    if (/^[A-Za-z0-9_-]+:/.test(line)) break;

    const match = line.match(/^\s+-\s+(.+)\s*$/);
    if (match) values.push(strip(match[1]));
  }

  return values;
}

function firstMatch(text, regex) {
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

function strip(value) {
  return String(value).replace(/^['"]|['"]$/g, '').trim();
}

function outputPath(config, fileName) {
  const output = path.join(ROOT, config.evidence.outputDir, fileName);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  return output;
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
