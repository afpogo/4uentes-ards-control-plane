const fs = require('fs');
const path = require('path');
const { applyEvidenceArgs, parseArgs, requireEvidenceArgs } = require('./lib/cli-args');
const { loadConfig } = require('./lib/config');
const { readNonDoneFeatureStates } = require('./lib/feature-state-reader');
const { buildIssuePayloads } = require('./lib/jira-payloads');

const ROOT = process.cwd();
const AUTH_ENDPOINT = 'https://mcp.atlassian.com/v1/mcp/authv2';
const OPERATIONAL_ENDPOINT = 'https://mcp.atlassian.com/v1/mcp';
const OPERATIONAL_ARGS = `--yes mcp-remote@latest ${OPERATIONAL_ENDPOINT}`;
const BASE_LABELS = ['ards-sdd', 'control-plane', 'feature-state', 'not-done'];
const REQUIRED_DESCRIPTION_MARKERS = [
  'Proceso de sincronizacion:',
  'Procesos origen:',
  'Estado actual:',
  'Objetivo:',
  'Gaps abiertos:',
  'State id:',
  'Servicios afectados:',
  'Request ids relacionados:',
  'Fuente control-plane:',
  'Evidence refs:',
  'Validation refs:',
  'Criterio de cierre esperado:',
];
const PRIORITY_BY_STATUS = {
  'runtime-partial': 'High',
  'implemented-local': 'Medium',
  'ards-documented': 'Medium',
  'validated-local': 'Low-Medium',
  'validated-live': 'Low-Medium',
};

function main() {
  const args = parseArgs(process.argv.slice(2), { valueOptions: ['request-id', 'output-dir', 'expected-count'] });
  requireEvidenceArgs(args);
  const config = applyEvidenceArgs(loadConfig(), args);
  const states = readNonDoneFeatureStates();
  const payloads = buildIssuePayloads(states, config);
  const findings = [];

  checkConfig(config, findings);
  checkBatch(states, payloads, args, findings);
  payloads.forEach((payload, index) => checkPayload(payload, index, config, findings));

  const result = findings.some((finding) => finding.severity === 'error') ? 'FAIL' : 'PASS';
  const evidencePath = writeEvidence(config, args, states, payloads, findings, result);

  console.log(`OK: Request: ${config.evidence.requestId}`);
  console.log(`OK: Jira board: ${config.jira.boardName}`);
  console.log(`OK: Jira project key: ${config.jira.projectKey}`);
  console.log(`OK: Issue type: ${config.jira.issueType}`);
  console.log(`OK: Policy check result: ${result}`);
  console.log(`OK: Feature payloads checked: ${payloads.length}`);
  console.log(`OK: Evidence written: ${evidencePath}`);

  if (result !== 'PASS') {
    process.exitCode = 1;
  }
}

function checkConfig(config, findings) {
  expectEqual(findings, 'config', 'server.url', config.server.url, AUTH_ENDPOINT);
  expectEqual(findings, 'config', 'jira.boardName', config.jira.boardName, 'SST-Team');
  expectEqual(findings, 'config', 'jira.projectKey', config.jira.projectKey, 'SST');
  expectEqual(findings, 'config', 'jira.issueType', config.jira.issueType, 'Tarea');
  expectEqual(findings, 'config', 'auth.method', config.auth.method, 'oauth');
  expectEqual(findings, 'config', 'auth.tokenStorage', config.auth.tokenStorage, 'external');
}

function checkBatch(states, payloads, args, findings) {
  if (states.length === 0) {
    addError(findings, 'batch', 'El batch no contiene feature states no done.');
  }

  const expectedCount = args['expected-count'] ? Number(args['expected-count']) : null;
  if (expectedCount !== null && payloads.length !== expectedCount) {
    addError(findings, 'batch', `El batch contiene ${payloads.length} payloads; se esperaban ${expectedCount}.`);
  }

  const doneStates = states.filter((state) => state.status === 'done');
  if (doneStates.length > 0) {
    addError(findings, 'batch', `El batch incluye estados done: ${doneStates.map((state) => state.id).join(', ')}.`);
  }

  const ids = new Set();
  payloads.forEach((payload) => {
    if (ids.has(payload.stateId)) {
      addError(findings, 'batch', `State id duplicado en payloads: ${payload.stateId}.`);
    }
    ids.add(payload.stateId);
  });
}

function checkPayload(payload, index, config, findings) {
  const scope = `payload ${index + 1} ${payload.stateId}`;
  const state = payload.rawState;

  if (!state.id || !state.title || !state.status) {
    addError(findings, scope, 'El feature state debe tener id, title y status.');
  }

  expectEqual(findings, scope, 'stateId', payload.stateId, state.id);
  expectEqual(findings, scope, 'projectKey', payload.projectKey, 'SST');
  expectEqual(findings, scope, 'boardName', payload.boardName, 'SST-Team');
  expectEqual(findings, scope, 'issueType', payload.issueType, 'Tarea');

  if (!payload.summary.startsWith('[SST][feature-state] ')) {
    addError(findings, scope, 'El summary debe iniciar con [SST][feature-state].');
  }

  BASE_LABELS.forEach((label) => {
    if (!payload.labels.includes(label)) {
      addError(findings, scope, `Falta label base: ${label}.`);
    }
  });

  if (!payload.labels.includes(state.status)) {
    addError(findings, scope, `Falta label de estado: ${state.status}.`);
  }

  const expectedPriority = PRIORITY_BY_STATUS[state.status];
  if (!expectedPriority) {
    addError(findings, scope, `Status no permitido por politica: ${state.status}.`);
  } else {
    expectEqual(findings, scope, 'priority', payload.priority, expectedPriority);
  }

  REQUIRED_DESCRIPTION_MARKERS.forEach((marker) => {
    if (!payload.description.includes(marker)) {
      addError(findings, scope, `La descripcion no incluye la seccion requerida: ${marker}.`);
    }
  });

  if (!/\n- CR-SST-\d{4}\b/.test(payload.description)) {
    addError(findings, scope, 'La descripcion no incluye un proceso con formato CR-SST-****.');
  }

  if (!payload.description.includes(`- ${config.evidence.requestId}`)) {
    addError(findings, scope, `La descripcion no incluye el proceso de sincronizacion activo: ${config.evidence.requestId}.`);
  }

  if (payload.description.includes('Proceso control-plane:')) {
    addError(findings, scope, 'La descripcion usa el campo ambiguo obsoleto: Proceso control-plane.');
  }

  if (state.requestIds.length === 0) {
    if (!sectionIncludes(payload.description, 'Procesos origen:', 'ninguno')) {
      addError(findings, scope, 'La descripcion no declara Procesos origen como ninguno.');
    }
  } else {
    state.requestIds.forEach((requestId) => {
      if (!sectionIncludes(payload.description, 'Procesos origen:', requestId)) {
        addError(findings, scope, `La descripcion no incluye proceso origen: ${requestId}.`);
      }
    });
  }

  if (!state.file.startsWith('state/features/') || !state.file.endsWith('.current.yaml')) {
    addError(findings, scope, `Fuente control-plane invalida: ${state.file}.`);
  }

  checkSensitiveText(findings, scope, 'summary', payload.summary);
  checkSensitiveText(findings, scope, 'description', payload.description);
  checkSensitiveText(findings, scope, 'labels', payload.labels.join(' '));
  checkSensitiveText(findings, scope, 'sourceFile', state.file);
}

function checkSensitiveText(findings, scope, field, value) {
  const checks = [
    { id: 'bearer-token', pattern: /bearer\s+[A-Za-z0-9._-]+/i },
    { id: 'authorization-header', pattern: /authorization\s*[:=]/i },
    { id: 'cookie-header', pattern: /cookie\s*[:=]/i },
    { id: 'explicit-token-assignment', pattern: /token\s*[:=]\s*[A-Za-z0-9._-]+/i },
    { id: 'cloud-id', pattern: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i },
    { id: 'private-atlassian-url', pattern: /[A-Za-z0-9.-]+\.atlassian\.net/i },
    { id: 'windows-absolute-path', pattern: /[A-Za-z]:\\/ },
  ];

  checks.forEach((check) => {
    if (check.pattern.test(value)) {
      addError(findings, scope, `Campo ${field} contiene patron prohibido: ${check.id}.`);
    }
  });
}

function expectEqual(findings, scope, field, actual, expected) {
  if (actual !== expected) {
    addError(findings, scope, `${field} esperado: ${expected}; observado: ${actual || 'no-disponible'}.`);
  }
}

function sectionIncludes(text, heading, value) {
  const start = text.indexOf(heading);
  if (start === -1) return false;
  const bodyStart = start + heading.length;
  const remainder = text.slice(bodyStart);
  const end = remainder.indexOf('\n\n');
  const body = end === -1 ? remainder : remainder.slice(0, end);
  return body.includes(`- ${value}`);
}

function addError(findings, scope, message) {
  findings.push({ severity: 'error', scope, message });
}

function writeEvidence(config, args, states, payloads, findings, result) {
  const outputDir = path.join(ROOT, config.evidence.outputDir);
  fs.mkdirSync(outputDir, { recursive: true });

  const file = path.join(outputDir, 'jira-policy-check-summary.md');
  fs.writeFileSync(file, renderEvidence(config, args, states, payloads, findings, result), 'utf8');
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function renderEvidence(config, args, states, payloads, findings, result) {
  const lines = [];
  const errors = findings.filter((finding) => finding.severity === 'error');

  lines.push('# Resumen De Policy Check Jira');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push('- Fecha: 2026-06-06');
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Resultado: ${result}`);
  lines.push(`- Politica tickets: \`docs/requests/jira-feature-ticket-policy.md\``);
  lines.push(`- Politica endpoint MCP: \`docs/requests/jira-mcp-endpoint-connection-policy.md\``);
  lines.push(`- Feature states no \`done\` observados: ${states.length}`);
  lines.push(`- Payloads revisados: ${payloads.length}`);
  lines.push(`- Expected count: ${args['expected-count'] || 'no-configurado'}`);
  lines.push('- Escritura Jira: no');
  lines.push('');
  lines.push('## Gates Revisados');
  lines.push('');
  lines.push(`- Endpoint OAuth/DCR configurado: ${passOrFail(config.server.url === AUTH_ENDPOINT)}`);
  lines.push(`- Endpoint operativo MCP requerido por policy: \`${OPERATIONAL_ENDPOINT}\``);
  lines.push(`- Patron operativo esperado: \`$env:JIRA_MCP_ARGS='${OPERATIONAL_ARGS}'\``);
  lines.push(`- Project key \`SST\`: ${passOrFail(config.jira.projectKey === 'SST')}`);
  lines.push(`- Board \`SST-Team\`: ${passOrFail(config.jira.boardName === 'SST-Team')}`);
  lines.push(`- Issue type \`Tarea\`: ${passOrFail(config.jira.issueType === 'Tarea')}`);
  lines.push(`- OAuth con storage externo: ${passOrFail(config.auth.method === 'oauth' && config.auth.tokenStorage === 'external')}`);
  lines.push(`- Template minimo por payload: ${passOrFail(errors.length === 0)}`);
  lines.push('- Secret scan de summaries/descriptions/labels/source files: ' + passOrFail(!hasSensitiveFinding(errors)));
  lines.push('');
  lines.push('## Payloads');
  lines.push('');

  payloads.forEach((payload, index) => {
    lines.push(`- ${index + 1}. \`${payload.stateId}\` status=\`${payload.rawState.status}\` priority=\`${payload.priority}\``);
  });

  lines.push('');
  lines.push('## Hallazgos');
  lines.push('');
  if (findings.length === 0) {
    lines.push('- ninguno');
  } else {
    findings.forEach((finding) => {
      lines.push(`- ${finding.severity.toUpperCase()} ${finding.scope}: ${finding.message}`);
    });
  }
  lines.push('');
  lines.push('## Decision');
  lines.push('');
  if (result === 'PASS') {
    lines.push('El batch cumple la politica local de generacion de tickets. Esto no ejecuta escritura Jira ni reemplaza la aprobacion humana requerida para publicar en Jira Cloud.');
  } else {
    lines.push('El batch no debe publicarse en Jira hasta corregir los hallazgos.');
  }

  return `${lines.join('\n')}\n`;
}

function passOrFail(condition) {
  return condition ? 'PASS' : 'FAIL';
}

function hasSensitiveFinding(findings) {
  return findings.some((finding) => /patron prohibido/.test(finding.message));
}

try {
  main();
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
}
