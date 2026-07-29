const fs = require('fs');
const path = require('path');
const {
  connectAtlassian,
  extractIssueKeys,
  parseToolData,
  requireApprovedFlag,
  requireConnectFlag,
  resolveCloudId,
  sanitize,
} = require('./lib/atlassian-mcp');

const ROOT = process.cwd();
const INITIATIVE_ID = 'INIT-CP-0003';
const PROJECT_KEY = 'ARDS';
const EPIC_KEY = process.env.INIT_CP_0003_EPIC_KEY || 'TODO-INIT-CP-0003-EPIC';
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'initiatives', INITIATIVE_ID);
const ISSUE_TYPE_CANDIDATES = ['Tarea', 'Task'];

const ISSUES = [
  {
    requestId: 'CR-CP-0008',
    summary: '[ARDS][INIT-CP-0003][CR-CP-0008] Define audit binding and policy enforcement pack skeleton',
    labels: ['ards-sdd', 'control-plane', 'runtime-enforcement', 'audit-binding', 'cr-cp-0008'],
    description: [
      'CR: CR-CP-0008',
      `Initiative: ${INITIATIVE_ID}`,
      `Epic: ${EPIC_KEY}`,
      '',
      'Objetivo:',
      '',
      'Crear el binding local de auditoria y el skeleton del primer Audit Pack para enforcement de policies.',
      '',
      'Definition of Done:',
      '',
      '- [ ] Existe `specs/ards/audit-binding.yaml` o path equivalente aprobado.',
      '- [ ] Existe skeleton local de `ARDS-POLICY-ENFORCEMENT-AUDIT`.',
      '- [ ] El modo inicial queda `advisory` y `read_only`.',
      '- [ ] No se mutan repos hijos.',
      '- [ ] `npm.cmd run check` pasa.',
    ],
  },
  {
    requestId: 'CR-CP-0009',
    summary: '[ARDS][INIT-CP-0003][CR-CP-0009] Define reusable policy control, probe, and gate model',
    labels: ['ards-sdd', 'control-plane', 'runtime-enforcement', 'policy-controls', 'cr-cp-0009'],
    description: [
      'CR: CR-CP-0009',
      `Initiative: ${INITIATIVE_ID}`,
      `Epic: ${EPIC_KEY}`,
      '',
      'Objetivo:',
      '',
      'Definir el modelo reusable de controles, probes y gates para agregar policies futuras sin duplicar scripts.',
      '',
      'Definition of Done:',
      '',
      '- [ ] Modelo de control/probe/gate documentado.',
      '- [ ] Templates reutilizables creados.',
      '- [ ] Se preservan SOLID y DRY.',
      '- [ ] No se hardcodea una policy por script cuando puede modelarse como control.',
      '- [ ] `npm.cmd run check` pasa.',
    ],
  },
  {
    requestId: 'CR-CP-0010',
    summary: '[ARDS][INIT-CP-0003][CR-CP-0010] Implement human documentation language runtime validator',
    labels: ['ards-sdd', 'control-plane', 'runtime-enforcement', 'human-doc-language', 'cr-cp-0010'],
    description: [
      'CR: CR-CP-0010',
      `Initiative: ${INITIATIVE_ID}`,
      `Epic: ${EPIC_KEY}`,
      '',
      'Objetivo:',
      '',
      'Implementar el primer validator concreto para que `human-doc-language` sea policy enforceable.',
      '',
      'Definition of Done:',
      '',
      '- [ ] Existe `check:human-doc-language` o comando equivalente.',
      '- [ ] `docs/**/*.md`, `evidence/**/*.md`, `knowledge/**/*.md` se revisan segun policy.',
      '- [ ] IDs, paths, comandos, bloques de codigo y payloads externos quedan exceptuados correctamente.',
      '- [ ] Las excepciones quedan documentadas.',
      '- [ ] `npm.cmd run check` pasa.',
    ],
  },
  {
    requestId: 'CR-CP-0011',
    summary: '[ARDS][INIT-CP-0003][CR-CP-0011] Implement policy registry and adoption runtime validator',
    labels: ['ards-sdd', 'control-plane', 'runtime-enforcement', 'policy-registry', 'cr-cp-0011'],
    description: [
      'CR: CR-CP-0011',
      `Initiative: ${INITIATIVE_ID}`,
      `Epic: ${EPIC_KEY}`,
      '',
      'Objetivo:',
      '',
      'Validar registry, metadata de classification/adoption/enforcement y manifests de adopcion/excepcion cuando correspondan.',
      '',
      'Definition of Done:',
      '',
      '- [ ] Policies activas declaran campos requeridos.',
      '- [ ] `core-general` y `core-profile-scoped` se distinguen correctamente.',
      '- [ ] Adoption/exception manifests se validan por applicability.',
      '- [ ] Child rollout sigue request-driven.',
      '- [ ] `npm.cmd run check` pasa.',
    ],
  },
  {
    requestId: 'CR-CP-0012',
    summary: '[ARDS][INIT-CP-0003][CR-CP-0012] Implement audit capsule and policy runtime runner MVP',
    labels: ['ards-sdd', 'control-plane', 'runtime-enforcement', 'audit-capsule', 'cr-cp-0012'],
    description: [
      'CR: CR-CP-0012',
      `Initiative: ${INITIATIVE_ID}`,
      `Epic: ${EPIC_KEY}`,
      '',
      'Objetivo:',
      '',
      'Implementar runner MVP read-only para ejecutar controles y escribir Audit Capsules normalizadas.',
      '',
      'Definition of Done:',
      '',
      '- [ ] Existe estructura `evidence/audits/<audit-run-id>/`.',
      '- [ ] La corrida registra manifest, deterministic evidence, result y report.',
      '- [ ] Gate mode no aplica remediaciones automaticamente.',
      '- [ ] El runner puede ejecutarse en modo `targeted` y `gate`.',
      '- [ ] `npm.cmd run check` pasa.',
    ],
  },
  {
    requestId: 'CR-CP-0013',
    summary: '[ARDS][INIT-CP-0003][CR-CP-0013] Apply policy runtime MVP to local control-plane policies',
    labels: ['ards-sdd', 'control-plane', 'runtime-enforcement', 'local-rollout', 'cr-cp-0013'],
    description: [
      'CR: CR-CP-0013',
      `Initiative: ${INITIATIVE_ID}`,
      `Epic: ${EPIC_KEY}`,
      '',
      'Objetivo:',
      '',
      'Aplicar el runtime MVP al set local de policies y producir matriz de readiness/follow-ups.',
      '',
      'Definition of Done:',
      '',
      '- [ ] Cada policy local queda clasificada por enforcement readiness.',
      '- [ ] Gaps quedan como findings o CRs propuestos.',
      '- [ ] No se declara enforcement completo para policies semanticas sin probes.',
      '- [ ] No se mutan repos hijos.',
      '- [ ] `npm.cmd run check` pasa.',
    ],
  },
];

async function main() {
  requireConnectFlag();
  requireApprovedFlag();
  if (EPIC_KEY === 'TODO-INIT-CP-0003-EPIC') {
    throw new Error('INIT_CP_0003_EPIC_KEY debe apuntar a la Epic Jira de INIT-CP-0003 antes de crear/reusar tareas.');
  }

  const { client } = await connectAtlassian();
  try {
    const cloudId = await resolveCloudId(client);
    const results = [];
    for (const issue of ISSUES) {
      const existing = await findExistingIssue(client, cloudId, issue);
      const created = existing || (await createIssue(client, cloudId, issue));
      const commentResult = await addSyncComment(client, cloudId, created.key, issue);
      results.push({
        requestId: issue.requestId,
        issueKey: created.key,
        source: existing ? 'existing' : 'created',
        status: created.status || null,
        summary: issue.summary,
        commentResult: sanitizeJson(commentResult),
        raw: created.raw || null,
      });
    }

    const output = writeEvidence(results);
    console.log(`OK: Jira issues processed: ${results.length}`);
    console.log(`OK: Evidence written: ${rel(output.summaryPath)}`);
    for (const result of results) {
      console.log(`OK: ${result.requestId}: ${result.issueKey} (${result.source})`);
    }
  } finally {
    client.close();
  }
}

async function findExistingIssue(client, cloudId, issue) {
  const result = await client.callTool('searchJiraIssuesUsingJql', {
    cloudId,
    jql: `project = ${PROJECT_KEY} AND summary ~ "${issue.requestId}" ORDER BY created DESC`,
    fields: ['summary', 'status', 'parent', 'labels'],
    maxResults: 5,
  });
  const data = parseToolData(result);
  const issues = data && Array.isArray(data.issues) ? data.issues : [];
  const match = issues.find((item) => (item.fields?.summary || '') === issue.summary) || null;
  if (!match) return null;
  return {
    key: match.key,
    status: match.fields?.status?.name || null,
    parentKey: match.fields?.parent?.key || null,
    raw: sanitize(JSON.stringify(data)),
  };
}

async function createIssue(client, cloudId, issue) {
  const errors = [];
  for (const issueTypeName of ISSUE_TYPE_CANDIDATES) {
    try {
      const result = await client.callTool('createJiraIssue', {
        cloudId,
        projectKey: PROJECT_KEY,
        issueTypeName,
        parent: EPIC_KEY,
        summary: issue.summary,
        description: renderDescription(issue),
        additional_fields: {
          labels: issue.labels,
        },
        contentFormat: 'markdown',
        responseContentFormat: 'markdown',
      });
      const data = parseToolData(result);
      const keys = extractIssueKeys(data, PROJECT_KEY);
      if (keys.length > 0) {
        return {
          key: keys[0],
          issueTypeName,
          raw: sanitize(JSON.stringify(data)),
        };
      }
      errors.push(`${issueTypeName}: ${sanitize(JSON.stringify(data))}`);
    } catch (error) {
      errors.push(`${issueTypeName}: ${sanitize(error.message || String(error))}`);
    }
  }
  throw new Error(`No issue key returned for ${issue.requestId}. Tried: ${errors.join(' | ')}`);
}

async function addSyncComment(client, cloudId, issueKey, issue) {
  const result = await client.callTool('addCommentToJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    commentBody: renderComment(issue),
    contentFormat: 'markdown',
    responseContentFormat: 'markdown',
  });
  return parseToolData(result);
}

function renderDescription(issue) {
  return [
    ...issue.description,
    '',
    'Control-plane source:',
    '',
    `- \`requests/planned/${requestFileName(issue.requestId)}\``,
    '- `initiatives/INIT-CP-0003-ards-sdd-runtime-enforcement.yaml`',
    '- `evidence/initiatives/INIT-CP-0003/runtime-enforcement-scope.md`',
    '',
    'Boundary:',
    '',
    '- Jira is an operational mirror; ARDS/SDD remains the source of truth.',
    '- The MVP starts in the control-plane and does not mutate child repos.',
  ].join('\n');
}

function renderComment(issue) {
  return [
    `${issue.requestId} synced from INIT-CP-0003.`,
    '',
    'Runtime enforcement chain:',
    '',
    '`Policy -> Control -> Probe -> Gate -> Evidence -> State/CR`',
    '',
    'This task is part of the ARDS/SDD runtime enforcement MVP under ARDS-1.',
    'Jira is a mirror; ARDS/SDD files remain the source of truth.',
  ].join('\n');
}

function requestFileName(requestId) {
  const names = {
    'CR-CP-0008': 'CR-CP-0008-audit-binding-and-pack-skeleton.yaml',
    'CR-CP-0009': 'CR-CP-0009-policy-control-probe-gate-model.yaml',
    'CR-CP-0010': 'CR-CP-0010-human-doc-language-runtime-validator.yaml',
    'CR-CP-0011': 'CR-CP-0011-policy-registry-adoption-runtime-validator.yaml',
    'CR-CP-0012': 'CR-CP-0012-audit-capsule-and-runtime-runner.yaml',
    'CR-CP-0013': 'CR-CP-0013-local-policy-runtime-rollout.yaml',
  };
  return names[requestId] || `${requestId}.yaml`;
}

function writeEvidence(results) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const resultPath = path.join(OUTPUT_DIR, 'jira-runtime-mvp-sync-result.json');
  const summaryPath = path.join(OUTPUT_DIR, 'jira-runtime-mvp-sync-summary.md');
  const payload = {
    initiativeId: INITIATIVE_ID,
    epicKey: EPIC_KEY,
    projectKey: PROJECT_KEY,
    externalWrite: true,
    results,
  };
  fs.writeFileSync(resultPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(summaryPath, renderSummary(results, resultPath), 'utf8');
  return { resultPath, summaryPath };
}

function renderSummary(results, resultPath) {
  const lines = [];
  lines.push('# INIT-CP-0003 Jira Runtime MVP Sync');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push('- Escritura externa: `true`');
  lines.push(`- Initiative: \`${INITIATIVE_ID}\``);
  lines.push(`- Epic: \`${EPIC_KEY}\``);
  lines.push(`- Project: \`${PROJECT_KEY}\``);
  lines.push(`- Issues procesados: ${results.length}`);
  lines.push(`- Resultado JSON sanitizado: \`${rel(resultPath)}\``);
  lines.push('');
  lines.push('## Issues');
  lines.push('');
  for (const result of results) {
    lines.push(`- \`${result.requestId}\` -> \`${result.issueKey}\` (${result.source})`);
  }
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  lines.push('Jira es mirror operativo. ARDS/SDD conserva la fuente de verdad.');
  lines.push('');
  return `${lines.join('\n')}`;
}

function sanitizeJson(value) {
  return JSON.parse(sanitize(JSON.stringify(value || null)));
}

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
