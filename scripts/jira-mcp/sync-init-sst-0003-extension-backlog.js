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
const INITIATIVE_ID = 'INIT-SST-0003';
const EPIC_KEY = 'SST-29';
const PROJECT_KEY = 'SST';
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'initiatives', INITIATIVE_ID);

const TASKS = [
  {
    cr: 'CR-SST-0098',
    summary: '[SST][INIT-SST-0003][CR-SST-0098] Fix sst-extension session tab-by-tab visual PDF capture',
    labels: ['ards-sdd', 'control-plane', 'init-sst-0003', 'cr-sst-0098', 'sst-extension', 'session-capture'],
    purpose: 'Fix robust visual PDF capture for each session tab, including tab focus, ready/settle wait, partial failure handling, and original active tab restoration.',
    subtasks: [
      'Actualizar spec sessions con carga, settle y restauracion de foco.',
      'Actualizar docs owner de sst-extension afectadas por el cambio.',
      'Capturar y restaurar tab activa original.',
      'Agregar wait strategy por tab: tabs.onUpdated, document.readyState, settle y timeout.',
      'Preservar scroll inicial por tab cuando sea posible.',
      'Mantener fallo parcial sin abortar todo el lote.',
      'Agregar unit tests de tab activation, timeout y restore original.',
      'Ejecutar pnpm test, pnpm build y pnpm check.'
    ],
    dod: [
      'La tab original queda activa al terminar.',
      'Tabs lentas no se capturan antes de ready/settle o producen warning.',
      'Una tab fallida no invalida necesariamente toda la sesion.',
      'No se introducen content scripts persistentes sin spec.',
      'Evidencia central lista rutas owner actualizadas en sst-extension.'
    ]
  },
  {
    cr: 'CR-SST-0099',
    summary: '[SST][INIT-SST-0003][CR-SST-0099] Add session snapshot outcomes and warnings',
    labels: ['ards-sdd', 'control-plane', 'init-sst-0003', 'cr-sst-0099', 'sst-extension', 'session-capture'],
    purpose: 'Add explicit session snapshot outcome and warning metadata for visual capture, textual fallback, unsupported URLs, permissions, timeouts and failures.',
    subtasks: [
      'Definir snapshot.captureMode o snapshot.outcome.',
      'Definir warnings[] por tab.',
      'Actualizar specs/docs owner de sst-extension.',
      'Actualizar normalizadores de storage.',
      'Actualizar payload hacia node-auth sin romper compatibilidad.',
      'Agregar tests de migracion/normalizacion.'
    ],
    dod: [
      'PDF visual y PDF textual fallback son distinguibles.',
      'Warnings son per-tab y sanitizados.',
      'Payload antiguo sigue normalizando de forma compatible.',
      'Evidencia central lista rutas owner actualizadas o excepcion aprobada.'
    ]
  },
  {
    cr: 'CR-SST-0100',
    summary: '[SST][INIT-SST-0003][CR-SST-0100] Show session capture progress and per-tab degradations',
    labels: ['ards-sdd', 'control-plane', 'init-sst-0003', 'cr-sst-0100', 'sst-extension', 'extension-ui'],
    purpose: 'Show capture quality to users: visual/text/failure counts and per-tab degradation states without exposing private content.',
    subtasks: [
      'Mostrar conteo visual/textual/fallidas.',
      'Mostrar warnings por tab sin exponer contenido.',
      'Actualizar docs/specs owner si cambia comportamiento observable.',
      'Mantener acciones retry/restore/delete.',
      'Agregar tests de helpers de presentacion.',
      'Ejecutar QA manual en popup y sidepanel.'
    ],
    dod: [
      'El usuario entiende el resultado de cada tab.',
      'No hay layout shift severo ni texto superpuesto.',
      'No se muestra contenido privado real en evidencia.',
      'Owner docs quedan actualizados o excepcion documentada.'
    ]
  },
  {
    cr: 'CR-SST-0101',
    summary: '[SST][INIT-SST-0003][CR-SST-0101] Define sst-extension CredentialedWebSource producer contract',
    labels: ['ards-sdd', 'control-plane', 'init-sst-0003', 'cr-sst-0101', 'sst-extension', 'credentialed-web-source'],
    purpose: 'Define sst-extension as producer of CredentialedWebSource in browser-session mode without using DictionarySecret plaintext in the client.',
    subtasks: [
      'Definir sourceType: credentialed-web.',
      'Definir captureMode: browser-session.',
      'Crear o actualizar specs/docs owner en sst-extension.',
      'Mapear artifacts: visualPdf, readableText y futuro rawHtml.',
      'Declarar que DictionarySecret SecretRef queda fuera del cliente.',
      'Definir provenance y preview-only gate.'
    ],
    dod: [
      'Contrato documentado sin implementar crawler.',
      'No hay flujo que entregue plaintext secret al frontend.',
      'Queda claro como entra luego a LearningWorkspace.',
      'sst-extension conserva autoridad documental del producer contract.'
    ]
  },
  {
    cr: 'CR-SST-0102',
    summary: '[SST][INIT-SST-0003][CR-SST-0102] Prepare LearningWorkspace preview handoff for extension session artifacts',
    labels: ['ards-sdd', 'control-plane', 'init-sst-0003', 'cr-sst-0102', 'sst-extension', 'learning-workspace'],
    purpose: 'Prepare preview-only handoff from extension session artifacts to LearningWorkspace, preserving user acceptance and account/user scoping.',
    subtasks: [
      'Confirmar endpoint productor/consumer.',
      'Actualizar owner docs en cada repo hijo mutado o registrar excepcion.',
      'Definir payload preview-only.',
      'No crear TagDefinition.',
      'No enviar contenido a agente IA antes de aceptacion.',
      'Registrar warnings y provenance.'
    ],
    dod: [
      'Preview-only gate preservado.',
      'Scope cuenta/usuario definido.',
      'No hay persistencia durable sin aceptacion.',
      'Productor, consumidor y rol del control-plane quedan identificados.'
    ]
  },
  {
    cr: 'CR-SST-0103',
    summary: '[SST][INIT-SST-0003][CR-SST-0103] Add QA harness for private authenticated page capture',
    labels: ['ards-sdd', 'control-plane', 'init-sst-0003', 'cr-sst-0103', 'sst-extension', 'qa'],
    purpose: 'Add reproducible QA for private authenticated page capture without storing real private content, cookies, JWTs or secret plaintext.',
    subtasks: [
      'Fixture local de pagina autenticada ficticia.',
      'Documentar QA owner en sst-extension.',
      'Caso pagina lenta.',
      'Caso scroll largo.',
      'Caso permiso denegado.',
      'Caso URL no soportada.',
      'Caso fallo parcial multi-tab.',
      'Evidencia sanitizada.'
    ],
    dod: [
      'QA reproducible sin credenciales reales.',
      'Evidencia sanitizada.',
      'Casos cubren tabs privadas, lentas y fallidas.',
      'QA owner queda referenciada desde evidencia central.'
    ]
  }
];

async function main() {
  requireConnectFlag();
  requireApprovedFlag();

  const { client } = await connectAtlassian();
  try {
    const cloudId = await resolveCloudId(client);
    const results = [];
    for (const task of TASKS) {
      const existing = await findExistingIssue(client, cloudId, task);
      const issue = existing || await createIssue(client, cloudId, task);
      results.push({
        cr: task.cr,
        summary: task.summary,
        issue,
        existing: Boolean(existing),
      });
      console.log(`OK: ${task.cr}: ${issue.key} (${existing ? 'existing' : 'created'})`);
    }
    const outputs = writeEvidence(results);
    console.log(`OK: Evidence written: ${rel(outputs.summary)}`);
  } finally {
    client.close();
  }
}

async function findExistingIssue(client, cloudId, task) {
  const result = await client.callTool('searchJiraIssuesUsingJql', {
    cloudId,
    jql: `project = ${PROJECT_KEY} AND summary ~ "${task.cr}" ORDER BY created DESC`,
    fields: ['summary', 'status', 'parent', 'labels'],
    maxResults: 5,
  });
  const data = parseToolData(result);
  const issues = data && Array.isArray(data.issues) ? data.issues : [];
  const match = issues.find((issue) => issue.key && (issue.fields?.summary || '') === task.summary) || issues[0];
  if (!match) return null;
  return {
    key: match.key,
    summary: match.fields?.summary || task.summary,
    parentKey: match.fields?.parent?.key || null,
    source: 'existing-search',
    raw: sanitize(JSON.stringify(data)),
  };
}

async function createIssue(client, cloudId, task) {
  const result = await client.callTool('createJiraIssue', {
    cloudId,
    projectKey: PROJECT_KEY,
    issueTypeName: 'Tarea',
    parent: EPIC_KEY,
    summary: task.summary,
    description: renderDescription(task),
    additional_fields: {
      labels: task.labels,
    },
    contentFormat: 'markdown',
    responseContentFormat: 'markdown',
  });
  const data = parseToolData(result);
  const keys = extractIssueKeys(data, PROJECT_KEY);
  if (keys.length === 0) {
    throw new Error(`No issue key returned from createJiraIssue for ${task.cr}: ${sanitize(JSON.stringify(data))}`);
  }
  return {
    key: keys[0],
    summary: task.summary,
    parentKey: EPIC_KEY,
    source: 'created',
    raw: sanitize(JSON.stringify(data)),
  };
}

function renderDescription(task) {
  return [
    `CR: ${task.cr}`,
    `Initiative: ${INITIATIVE_ID}`,
    `Epic: ${EPIC_KEY}`,
    '',
    'Purpose:',
    '',
    task.purpose,
    '',
    'Subtasks / checklist:',
    '',
    ...task.subtasks.map((item) => `* [ ] ${item}`),
    '',
    'Definition of Done:',
    '',
    ...task.dod.map((item) => `* [ ] ${item}`),
    '',
    'Owner documentation gate:',
    '',
    '* sst-extension owner ARDS/SDD specs/docs must be updated for any mutated behavior, or an explicit owner-documentation exception must be recorded before closure.',
    '',
    'Control-plane source:',
    '',
    `* requests/planned/${task.cr.toLowerCase()}-TODO.yaml`,
    '* initiatives/INIT-SST-0003-sst-extension-construction.yaml',
    '* evidence/requests/CR-SST-0095/jira-cr-backlog-candidates.md',
    '',
    'Boundary:',
    '',
    '* Jira is an operational mirror; ARDS/SDD remains the source of truth.',
    '* Do not store private page content, cookies, JWTs or plaintext secrets in Jira or evidence.',
  ].join('\n');
}

function writeEvidence(results) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const jsonOutput = path.join(OUTPUT_DIR, 'jira-extension-backlog-sync-result.json');
  const summaryOutput = path.join(OUTPUT_DIR, 'jira-extension-backlog-sync-summary.md');
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson({
    initiativeId: INITIATIVE_ID,
    epicKey: EPIC_KEY,
    results,
  }), null, 2), 'utf8');

  const lines = [
    '# Jira Extension Backlog Sync Summary',
    '',
    '## Status',
    '',
    `- Date: ${today()}`,
    `- Initiative: \`${INITIATIVE_ID}\``,
    `- Epic: \`${EPIC_KEY}\``,
    '- Jira write: yes, limited to task create/reuse under the Epic',
    '',
    '## Issues',
    '',
  ];

  for (const result of results) {
    lines.push(`- \`${result.cr}\`: \`${sanitize(result.issue.key)}\` (${result.existing ? 'existing' : 'created'})`);
  }

  lines.push('');
  lines.push('## Evidence');
  lines.push('');
  lines.push(`- JSON sanitizado: \`${rel(jsonOutput)}\``);
  lines.push('');
  lines.push('## Notes');
  lines.push('');
  lines.push('- Jira is an operational mirror; ARDS/SDD remains the source of truth.');
  lines.push('- No secrets, JWTs, cookies, private page content, or plaintext secrets were included.');
  lines.push('- Each issue includes subtasks/checklist in the Jira description.');

  fs.writeFileSync(summaryOutput, `${lines.join('\n')}\n`, 'utf8');
  return { summary: summaryOutput, json: jsonOutput };
}

function sanitizeJson(value) {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return sanitize(value);
  if (Array.isArray(value)) return value.map((item) => sanitizeJson(item));
  if (typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeJson(item)]));
  return value;
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
