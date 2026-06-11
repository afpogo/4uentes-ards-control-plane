const fs = require('fs');
const path = require('path');
const { parseArgs, requireEvidenceArgs } = require('../jira-mcp/lib/cli-args');

const ROOT = process.cwd();
const REQUIRED_REQUEST_ID = 'CR-SST-0039';
const ALLOWED_ACTIONS = new Set(['update', 'create']);

async function main() {
  const args = parseArgs(process.argv.slice(2), {
    valueOptions: ['request-id', 'output-dir', 'actions'],
  });
  requireEvidenceArgs(args);
  requireRequestId(args['request-id']);

  const dryRun = Boolean(args['dry-run']);
  const approved = Boolean(args.approved);
  const requestedActions = parseActions(args.actions || 'update,create');
  if (!dryRun && !approved) {
    throw new Error('El modo real requiere --approved.');
  }

  const context = loadContext(args['request-id'], args['output-dir'], requestedActions, dryRun);
  const credentials = dryRun ? null : readCredentials();
  const results = [];

  for (const action of context.actions) {
    if (dryRun) {
      results.push(toDryRunResult(action));
      continue;
    }
    if (action.kind === 'update') {
      results.push(await updateIssue(credentials, action));
    } else if (action.kind === 'create') {
      results.push(await createIssue(credentials, action));
    }
  }

  const output = writeEvidence(context, results, dryRun);
  console.log(`OK: Request: ${context.requestId}`);
  console.log(`OK: Mode: ${dryRun ? 'dry-run' : 'apply'}`);
  console.log(`OK: Actions selected: ${context.actions.length}`);
  console.log(`OK: Updates selected: ${context.actions.filter((item) => item.kind === 'update').length}`);
  console.log(`OK: Creates selected: ${context.actions.filter((item) => item.kind === 'create').length}`);
  console.log(`OK: Jira write executed: ${dryRun ? 'no' : 'yes'}`);
  console.log(`OK: Evidence written: ${rel(output.summary)}`);
}

function requireRequestId(requestId) {
  if (requestId !== REQUIRED_REQUEST_ID) {
    throw new Error(`Este writer esta acotado a ${REQUIRED_REQUEST_ID}. Request recibido: ${requestId}.`);
  }
}

function parseActions(value) {
  const actions = String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  if (actions.length === 0) throw new Error('El argumento --actions no puede estar vacio.');
  for (const action of actions) {
    if (!ALLOWED_ACTIONS.has(action)) {
      throw new Error(`Action no permitida: ${action}. Permitidas: update, create.`);
    }
  }
  return new Set(actions);
}

function loadContext(requestId, outputDir, requestedActions, dryRun) {
  const evidenceDir = path.join(ROOT, outputDir);
  const correctionPlan = readJson(path.join(evidenceDir, 'correction-plan-preview.json'));
  const policyText = readText(path.join(evidenceDir, 'jira-policy-check-summary.md'));
  const doctorText = readText(path.join(evidenceDir, 'doctor-summary.md'));

  validatePlan(requestId, correctionPlan);
  validatePolicy(policyText);
  validateDoctor(doctorText);

  const actions = [];
  for (const item of correctionPlan.actions) {
    if (item.action === 'propose-description-update' && requestedActions.has('update')) {
      actions.push({
        kind: 'update',
        stateId: item.stateId,
        issueKey: item.issueKey,
        description: item.proposedDescription,
        expectedSummary: item.expectedSummary,
      });
    }
    if (item.action === 'propose-issue-create' && requestedActions.has('create')) {
      actions.push({
        kind: 'create',
        stateId: item.stateId,
        issue: item.proposedIssue,
        expectedSummary: item.expectedSummary,
      });
    }
  }

  validateSelectedActions(actions);

  return {
    requestId,
    outputDir,
    evidenceDir,
    dryRun,
    sourceCorrectionPlan: 'correction-plan-preview.json',
    actions,
  };
}

function validatePlan(requestId, plan) {
  if (plan.requestId !== requestId) {
    throw new Error(`El correction plan pertenece a ${plan.requestId}, no a ${requestId}.`);
  }
  if (plan.externalWrite !== false) {
    throw new Error('El correction plan debe declarar externalWrite=false.');
  }
  if (!plan.summary || plan.summary.blocked !== 0) {
    throw new Error('El correction plan debe tener blocked=0.');
  }
  if (!Array.isArray(plan.actions)) {
    throw new Error('El correction plan no contiene actions.');
  }
}

function validatePolicy(text) {
  if (!/Resultado:\s+PASS/i.test(text)) {
    throw new Error('jira-policy-check-summary.md no registra Resultado: PASS.');
  }
}

function validateDoctor(text) {
  if (!/Blocked:\s+0/i.test(text)) {
    throw new Error('doctor-summary.md no registra Blocked: 0.');
  }
}

function validateSelectedActions(actions) {
  for (const action of actions) {
    if (action.kind === 'update') {
      if (!/^SST-\d+$/.test(action.issueKey || '')) {
        throw new Error(`Update sin issue key valida para ${action.stateId}.`);
      }
      if (!action.description) {
        throw new Error(`Update sin descripcion propuesta para ${action.stateId}.`);
      }
    }
    if (action.kind === 'create') {
      if (!action.issue || action.issue.projectKey !== 'SST' || action.issue.issueType !== 'Tarea') {
        throw new Error(`Create fuera de project/issue type permitido para ${action.stateId}.`);
      }
      if (!action.issue.summary || !action.issue.description) {
        throw new Error(`Create incompleto para ${action.stateId}.`);
      }
    }
  }
}

function readCredentials() {
  const baseUrl = cleanBaseUrl(process.env.JIRA_BASE_URL);
  const email = requiredEnv('JIRA_EMAIL');
  const token = requiredEnv('JIRA_API_TOKEN');
  return {
    baseUrl,
    authHeader: `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`,
  };
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Variable de entorno requerida no configurada: ${name}.`);
  }
  return value.trim();
}

function cleanBaseUrl(value) {
  const raw = requiredEnv('JIRA_BASE_URL').replace(/\/+$/, '');
  if (!/^https:\/\/[^/]+\.atlassian\.net$/i.test(raw)) {
    throw new Error('JIRA_BASE_URL debe tener formato https://<site>.atlassian.net.');
  }
  return raw;
}

async function updateIssue(credentials, action) {
  const url = `${credentials.baseUrl}/rest/api/3/issue/${encodeURIComponent(action.issueKey)}`;
  await jiraFetch(credentials, url, {
    method: 'PUT',
    body: {
      fields: {
        description: textToAdf(action.description),
      },
    },
  });
  return {
    stateId: action.stateId,
    action: 'updated-description',
    issueKey: action.issueKey,
    status: 'PASS',
  };
}

async function createIssue(credentials, action) {
  const url = `${credentials.baseUrl}/rest/api/3/issue`;
  const data = await jiraFetch(credentials, url, {
    method: 'POST',
    body: {
      fields: {
        project: { key: action.issue.projectKey },
        issuetype: { name: action.issue.issueType },
        summary: action.issue.summary,
        description: textToAdf(action.issue.description),
        labels: action.issue.labels || [],
      },
    },
  });
  return {
    stateId: action.stateId,
    action: 'created',
    issueKey: data && data.key ? data.key : null,
    status: 'PASS',
  };
}

async function jiraFetch(credentials, url, options) {
  const response = await fetch(url, {
    method: options.method,
    headers: {
      Authorization: credentials.authHeader,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options.body),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(`Jira REST ${options.method} fallo con status ${response.status}: ${sanitizeMessage(text)}`);
  }
  return data;
}

function textToAdf(text) {
  const content = String(text)
    .split(/\r?\n/)
    .map((line) => paragraph(line))
    .filter(Boolean);
  return {
    type: 'doc',
    version: 1,
    content: content.length ? content : [paragraph('')],
  };
}

function paragraph(line) {
  if (line === '') {
    return { type: 'paragraph', content: [] };
  }
  return {
    type: 'paragraph',
    content: [{ type: 'text', text: line }],
  };
}

function toDryRunResult(action) {
  return {
    stateId: action.stateId,
    action: action.kind === 'update' ? 'would-update-description' : 'would-create',
    issueKey: action.kind === 'update' ? action.issueKey : null,
    status: 'DRY-RUN',
  };
}

function writeEvidence(context, results, dryRun) {
  fs.mkdirSync(context.evidenceDir, { recursive: true });
  const summary = path.join(context.evidenceDir, 'jira-writer-apply-summary.md');
  const json = path.join(context.evidenceDir, 'jira-writer-apply-results.json');
  fs.writeFileSync(json, JSON.stringify({ requestId: context.requestId, dryRun, results }, null, 2), 'utf8');
  fs.writeFileSync(summary, renderSummary(context, results, dryRun), 'utf8');
  return { summary, json };
}

function renderSummary(context, results, dryRun) {
  const lines = [];
  lines.push('# Jira Writer Apply Summary');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${context.requestId}`);
  lines.push(`- Mode: ${dryRun ? 'dry-run' : 'apply'}`);
  lines.push(`- Source correction plan: \`${context.sourceCorrectionPlan}\``);
  lines.push(`- Jira write executed: ${dryRun ? 'no' : 'yes'}`);
  lines.push(`- Actions selected: ${context.actions.length}`);
  lines.push(`- Updates selected: ${context.actions.filter((item) => item.kind === 'update').length}`);
  lines.push(`- Creates selected: ${context.actions.filter((item) => item.kind === 'create').length}`);
  lines.push('');
  lines.push('## Resultados');
  lines.push('');
  for (const result of results) {
    lines.push(`- ${result.stateId}: ${result.action}, issue=${result.issueKey || 'ninguno'}, status=${result.status}`);
  }
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  lines.push('El writer consume solo el correction plan aprobado del control-plane. Jira sigue siendo espejo operativo.');
  return `${lines.join('\n')}\n`;
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function readText(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`No existe artifact requerido: ${rel(file)}.`);
  }
  return fs.readFileSync(file, 'utf8');
}

function sanitizeMessage(value) {
  return String(value || '')
    .replace(/Basic\s+[A-Za-z0-9+/=]+/g, 'Basic [redacted]')
    .slice(0, 500);
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
