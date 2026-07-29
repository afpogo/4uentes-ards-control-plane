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
const PROJECT_KEY = 'SST';
const EPIC_KEY = 'SST-29';
const RELATED_ISSUE_KEY = 'SST-32';
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'initiatives', INITIATIVE_ID);

const TASKS = [
  {
    cr: 'CR-SST-0119',
    summary: '[SST][INIT-SST-0003][CR-SST-0119] Add configurable sst-extension session capture mode',
    labels: [
      'ards-sdd',
      'control-plane',
      'init-sst-0003',
      'cr-sst-0119',
      'sst-extension',
      'session-capture',
      'capture-mode',
    ],
    purpose:
      'Add a user-configurable session capture mode in sst-extension so users can choose between auto, visual-only, text-only, and prefer-text behavior.',
    subtasks: [
      'Define capture mode enum and local preference boundary.',
      'Expose mode selection in the extension UI without leaking private content.',
      'Auto mode preserves current visual-first/textual-fallback behavior.',
      'Visual-only mode marks failed visual captures instead of silently generating textual PDFs.',
      'Text-only mode skips visual capture and generates textual artifacts intentionally.',
      'Prefer-text mode prioritizes text for private or long pages while retaining documented fallback behavior.',
      'Update sst-extension owner specs/docs and QA notes.',
      'Add tests for mode selection, capture branching, warning labels, and storage normalization.',
    ],
    dod: [
      'The user can identify and choose the capture mode before session capture.',
      'Mode behavior is explicit in UI and documentation.',
      'No private page content, cookies, JWTs or plaintext secrets are stored in Jira or evidence.',
      'sst-extension owner documentation is updated or an exception is recorded.',
      '`pnpm check` passes in sst-extension and `npm run check` passes in control-plane.',
    ],
    controlPlaneSource: 'requests/planned/CR-SST-0119-sst-extension-configurable-session-capture-mode.yaml',
  },
  {
    cr: 'CR-SST-0120',
    summary: '[SST][INIT-SST-0003][CR-SST-0120] Define preview image contract for session-derived articles',
    labels: [
      'ards-sdd',
      'control-plane',
      'init-sst-0003',
      'cr-sst-0120',
      'sst-extension',
      'sst-fend',
      'node-auth',
      'preview-image',
    ],
    purpose:
      'Define how articles generated from sst-extension session capture should carry or derive preview images when the captured artifact is textual PDF fallback.',
    subtasks: [
      'Select the owner boundary for preview metadata: producer, ingestion, frontend rendering, or explicit cross-repo contract.',
      'Define behavior for visual captures: safe thumbnail, derived preview, or unavailable reason.',
      'Define behavior for textual fallback PDFs: generated placeholder, downstream derivation, or explicit preview-unavailable reason.',
      'Define persistence and privacy rules for thumbnails from private pages.',
      'Update owner docs/specs in every mutated repo or record approved exceptions.',
      'Add QA coverage that proves text-only session-derived articles do not fail silently when preview image is unavailable.',
    ],
    dod: [
      'Session-derived articles have an explicit preview image behavior.',
      'Preview unavailable is a governed state, not an ambiguous UI gap.',
      'No private preview image is stored in ARDS/SDD evidence.',
      'Every mutated repository has owner documentation updated or an exception recorded.',
      '`npm run check` passes in control-plane plus child-repo checks required by the selected implementation boundary.',
    ],
    controlPlaneSource: 'requests/planned/CR-SST-0120-session-derived-article-preview-image-contract.yaml',
  },
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
      const issue = existing || (await createIssue(client, cloudId, task));
      const linkResult = await linkRelatedIssue(client, cloudId, issue.key, task.cr);
      results.push({
        cr: task.cr,
        summary: task.summary,
        issue,
        existing: Boolean(existing),
        linkResult: sanitizeJson(linkResult),
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
    status: match.fields?.status?.name || null,
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

async function linkRelatedIssue(client, cloudId, issueKey, cr) {
  if (issueKey === RELATED_ISSUE_KEY) return { skipped: true, reason: 'same issue' };
  try {
    const result = await client.callTool('createIssueLink', {
      cloudId,
      type: 'Relates',
      inwardIssue: issueKey,
      outwardIssue: RELATED_ISSUE_KEY,
      comment: `${cr} is a follow-up discovered during ${RELATED_ISSUE_KEY} / CR-SST-0100 manual QA.`,
      contentFormat: 'markdown',
    });
    return parseToolData(result);
  } catch (error) {
    return { warning: sanitize(error.message || String(error)) };
  }
}

function renderDescription(task) {
  return [
    `CR: ${task.cr}`,
    `Initiative: ${INITIATIVE_ID}`,
    `Epic: ${EPIC_KEY}`,
    `Discovered from: ${RELATED_ISSUE_KEY} / CR-SST-0100 manual QA`,
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
    '* Owner ARDS/SDD specs/docs must be updated in every mutated repository, or an explicit owner-documentation exception must be recorded before closure.',
    '',
    'Control-plane source:',
    '',
    `* ${task.controlPlaneSource}`,
    '* initiatives/INIT-SST-0003-sst-extension-construction.yaml',
    '* evidence/requests/CR-SST-0100/manual-qa-gap-analysis.md',
    '',
    'Boundary:',
    '',
    '* Jira is an operational mirror; ARDS/SDD remains the source of truth.',
    '* Do not store private page content, cookies, JWTs, raw PDFs, thumbnails from private pages, or plaintext secrets in Jira or evidence.',
  ].join('\n');
}

function writeEvidence(results) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const jsonOutput = path.join(OUTPUT_DIR, 'jira-cr-sst-0119-0120-create-result.json');
  const summaryOutput = path.join(OUTPUT_DIR, 'jira-cr-sst-0119-0120-create-summary.md');
  fs.writeFileSync(
    jsonOutput,
    JSON.stringify(
      sanitizeJson({
        initiativeId: INITIATIVE_ID,
        epicKey: EPIC_KEY,
        relatedIssueKey: RELATED_ISSUE_KEY,
        results,
        externalWrite: true,
      }),
      null,
      2
    ),
    'utf8'
  );
  fs.writeFileSync(
    summaryOutput,
    [
      '# CR-SST-0119 / CR-SST-0120 Jira Create Summary',
      '',
      '## Estado',
      '',
      `- Fecha: ${today()}`,
      `- Initiative: \`${INITIATIVE_ID}\``,
      `- Epic: \`${EPIC_KEY}\``,
      `- Related issue: \`${RELATED_ISSUE_KEY}\``,
      '- Escritura Jira: si',
      '',
      '## Issues',
      '',
      ...results.map(
        (item) =>
          `- \`${item.cr}\` -> \`${sanitize(item.issue.key)}\` (${item.existing ? 'existing' : 'created'}), parent \`${sanitize(
            item.issue.parentKey || EPIC_KEY
          )}\``
      ),
      '',
      '## Evidencia',
      '',
      `- Resultado JSON sanitizado: \`${rel(jsonOutput)}\``,
      '',
      '## Notas',
      '',
      '- Jira is an operational mirror; ARDS/SDD remains the source of truth.',
      '- No private page content, raw PDFs, preview thumbnails, cookies, JWTs, or plaintext secrets were included.',
    ].join('\n') + '\n',
    'utf8'
  );
  return { json: jsonOutput, summary: summaryOutput };
}

function sanitizeJson(value) {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return sanitize(value);
  if (Array.isArray(value)) return value.map((item) => sanitizeJson(item));
  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeJson(item)]));
  }
  return value;
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

main().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
});
