const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { applyEvidenceArgs, parseArgs, requireEvidenceArgs } = require('./lib/cli-args');
const { loadConfig } = require('./lib/config');

const ROOT = process.cwd();
const MACHINE_FILE = path.join(ROOT, 'state', 'jira-backlog-sync-machine.yaml');
const READ_ONLY_DRY_RUN_EVENTS = [
  'BACKLOG_SYNC_REQUESTED',
  'CONTROL_PLANE_STATE_COLLECTED',
  'POLICY_CHECK_PASSED',
  'JIRA_METADATA_CONFIRMED',
  'JIRA_DUPLICATES_SEARCHED',
];

function main() {
  const args = parseArgs(process.argv.slice(2), {
    valueOptions: ['request-id', 'output-dir', 'mode'],
  });
  requireEvidenceArgs(args);
  const config = applyEvidenceArgs(loadConfig(), args);
  const mode = args.mode || 'dry-run';

  if (!['dry-run', 'read-only'].includes(mode)) {
    throw new Error(`Modo no soportado: ${mode}. Modos permitidos: dry-run, read-only.`);
  }

  if (mode === 'read-only' && !process.argv.includes('--connect')) {
    throw new Error('El modo read-only requiere --connect para ejecutar acciones MCP de lectura.');
  }

  const machineText = fs.readFileSync(MACHINE_FILE, 'utf8');
  const machine = parseMachine(machineText);
  const trace = runDryRun(machine, READ_ONLY_DRY_RUN_EVENTS);
  const actionResults = mode === 'read-only' ? runReadOnlyActions(config) : [];
  const output = writeEvidence(config, mode, machine, trace, actionResults);

  console.log(`OK: Request: ${config.evidence.requestId}`);
  console.log(`OK: Machine: ${rel(MACHINE_FILE)}`);
  console.log(`OK: Mode: ${mode}`);
  console.log(`OK: Initial state: ${trace[0].from}`);
  console.log(`OK: Final state: ${trace[trace.length - 1].to}`);
  console.log(`OK: Events applied: ${trace.length}`);
  if (mode === 'read-only') console.log(`OK: Read-only actions executed: ${actionResults.length}`);
  console.log(`OK: Evidence written: ${rel(output)}`);
}

function parseMachine(text) {
  const transitions = [];
  const lines = text.split(/\r?\n/);
  let inTransitions = false;
  let current = null;
  let currentList = null;

  for (const line of lines) {
    if (line.startsWith('transitions:')) {
      inTransitions = true;
      continue;
    }
    if (!inTransitions) continue;
    if (/^[A-Za-z0-9_-]+:/.test(line)) break;

    const from = line.match(/^\s{2}-\s+from:\s+(.+)\s*$/);
    if (from) {
      current = { from: strip(from[1]), actions: [], guards: [] };
      currentList = null;
      transitions.push(current);
      continue;
    }
    if (!current) continue;

    const event = line.match(/^\s{4}event:\s+(.+)\s*$/);
    if (event) {
      current.event = strip(event[1]);
      currentList = null;
    }

    const to = line.match(/^\s{4}to:\s+(.+)\s*$/);
    if (to) {
      current.to = strip(to[1]);
      currentList = null;
    }

    if (line.match(/^\s{4}guards:\s*$/)) {
      currentList = 'guards';
      continue;
    }

    if (line.match(/^\s{4}actions:\s*$/)) {
      currentList = 'actions';
      continue;
    }

    const item = line.match(/^\s{6}-\s+(.+)\s*$/);
    if (item) {
      const value = strip(item[1]);
      if (currentList === 'guards') current.guards.push(value);
      else current.actions.push(value);
    }
  }

  if (transitions.length === 0) {
    throw new Error('No se encontraron transiciones en state/jira-backlog-sync-machine.yaml.');
  }

  return {
    transitions,
  };
}

function runDryRun(machine, events) {
  let currentState = 'idle';
  const trace = [];

  for (const event of events) {
    const transition = machine.transitions.find((item) => item.from === currentState && item.event === event);
    if (!transition) {
      throw new Error(`Transicion no declarada: ${currentState} --${event}--> ?`);
    }
    trace.push({
      from: transition.from,
      event,
      to: transition.to,
      guards: transition.guards,
      actions: transition.actions,
    });
    currentState = transition.to;
  }

  if (currentState !== 'ready-for-approval') {
    throw new Error(`El dry-run debe terminar en ready-for-approval; termino en ${currentState}.`);
  }

  return trace;
}

function runReadOnlyActions(config) {
  const commonArgs = [
    '--request-id',
    config.evidence.requestId,
    '--output-dir',
    config.evidence.outputDir,
  ];
  const actions = [
    {
      id: 'generate_jira_payload_dry_run',
      script: 'generate-dry-run.js',
      args: commonArgs,
    },
    {
      id: 'run_policy_check',
      script: 'policy-check.js',
      args: [...commonArgs, '--expected-count', '9'],
    },
    {
      id: 'read_jira_metadata',
      script: 'read-metadata.js',
      args: ['--connect', ...commonArgs],
    },
    {
      id: 'search_jira_duplicates',
      script: 'search-duplicates.js',
      args: ['--connect', ...commonArgs],
    },
    {
      id: 'reconcile_jira_issues',
      script: 'reconcile-existing-issues.js',
      args: ['--connect', ...commonArgs],
    },
  ];

  return actions.map((action) => runNodeAction(action));
}

function runNodeAction(action) {
  const scriptPath = path.join(ROOT, 'scripts', 'jira-mcp', action.script);
  const result = spawnSync(process.execPath, [scriptPath, ...action.args], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    throw new Error(`Accion read-only fallo: ${action.id}. ${lastLine(result.stderr || result.stdout)}`);
  }

  return {
    id: action.id,
    script: rel(scriptPath),
    status: 'PASS',
    stdout: sanitizeOutput(result.stdout),
  };
}

function writeEvidence(config, mode, machine, trace, actionResults) {
  const outputDir = path.join(ROOT, config.evidence.outputDir);
  fs.mkdirSync(outputDir, { recursive: true });
  const output = path.join(outputDir, mode === 'read-only' ? 'jira-sync-machine-read-only.md' : 'jira-sync-machine-dry-run.md');
  fs.writeFileSync(output, renderEvidence(config, mode, machine, trace, actionResults), 'utf8');
  return output;
}

function renderEvidence(config, mode, machine, trace, actionResults) {
  const lines = [];
  lines.push('# Dry Run De Maquina Jira Backlog Sync');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push('- Fecha: 2026-06-07');
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Machine: \`state/jira-backlog-sync-machine.yaml\``);
  lines.push(`- Mode: \`${mode}\``);
  lines.push(`- Transiciones declaradas: ${machine.transitions.length}`);
  lines.push(`- Eventos aplicados: ${trace.length}`);
  lines.push(`- Estado final: \`${trace[trace.length - 1].to}\``);
  lines.push(`- Jira MCP: ${mode === 'read-only' ? 'conectado para lectura' : 'no conectado'}`);
  lines.push('- Escritura Jira: no');
  lines.push('');
  lines.push('## Trace');
  lines.push('');
  for (const step of trace) {
    lines.push(`- \`${step.from}\` --\`${step.event}\`--> \`${step.to}\``);
    if (step.guards.length > 0) lines.push(`  - Guards: ${step.guards.map((item) => `\`${item}\``).join(', ')}`);
    if (step.actions.length > 0) lines.push(`  - Actions: ${step.actions.map((item) => `\`${item}\``).join(', ')}`);
  }
  if (actionResults.length > 0) {
    lines.push('');
    lines.push('## Acciones Read-Only Ejecutadas');
    lines.push('');
    for (const action of actionResults) {
      lines.push(`### ${action.id}`);
      lines.push('');
      lines.push(`- Script: \`${action.script}\``);
      lines.push(`- Resultado: ${action.status}`);
      lines.push('- Salida:');
      lines.push('');
      lines.push('```text');
      lines.push(action.stdout.trim());
      lines.push('```');
      lines.push('');
    }
  }
  lines.push('');
  lines.push('## Decision');
  lines.push('');
  lines.push('La maquina declarativa puede ejecutar el camino read-only hasta `ready-for-approval`. Las acciones de escritura externa quedan fuera de este runner.');
  return `${lines.join('\n')}\n`;
}

function sanitizeOutput(value) {
  return String(value || '')
    .replace(/https:\/\/[^/\s]+\.atlassian\.net[^\s)]*/g, '[jira-site-redacted]')
    .replace(/[A-Za-z0-9.-]+\.atlassian\.net/g, '[jira-site-redacted]')
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '[cloudId-redacted]')
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, 'Bearer [redacted]')
    .replace(/token[=:]\s*[A-Za-z0-9._-]+/gi, 'token=[redacted]');
}

function lastLine(value) {
  return String(value || '').trim().split(/\r?\n/).filter(Boolean).pop() || 'sin detalle';
}

function strip(value) {
  return String(value).replace(/^['"]|['"]$/g, '').trim();
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
