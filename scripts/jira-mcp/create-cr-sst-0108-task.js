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
const REQUEST_ID = 'CR-SST-0108';
const INITIATIVE_ID = 'INIT-SST-0003';
const PROJECT_KEY = 'SST';
const EPIC_KEY = 'SST-29';
const RELATED_ISSUE_KEY = 'SST-30';
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'requests', REQUEST_ID);
const SUMMARY = '[SST][INIT-SST-0003][CR-SST-0108] Harden node-auth extension session payload ingestion';

async function main() {
  requireConnectFlag();
  requireApprovedFlag();

  const { client } = await connectAtlassian();
  try {
    const cloudId = await resolveCloudId(client);
    const existing = await findExistingIssue(client, cloudId);
    const issue = existing || await createIssue(client, cloudId);
    const linkResult = await linkRelatedIssue(client, cloudId, issue.key);

    const summary = {
      requestId: REQUEST_ID,
      initiativeId: INITIATIVE_ID,
      epicKey: EPIC_KEY,
      relatedIssueKey: RELATED_ISSUE_KEY,
      issue,
      existing: Boolean(existing),
      linkResult: sanitizeJson(linkResult),
      externalWrite: true,
    };
    const output = writeEvidence(summary);

    console.log(`OK: ${REQUEST_ID}: ${issue.key} (${existing ? 'existing' : 'created'})`);
    console.log(`OK: Evidence written: ${rel(output)}`);
  } finally {
    client.close();
  }
}

async function findExistingIssue(client, cloudId) {
  const result = await client.callTool('searchJiraIssuesUsingJql', {
    cloudId,
    jql: `project = ${PROJECT_KEY} AND summary ~ "${REQUEST_ID}" ORDER BY created DESC`,
    fields: ['summary', 'status', 'parent', 'labels'],
    maxResults: 5,
  });
  const data = parseToolData(result);
  const issues = data && Array.isArray(data.issues) ? data.issues : [];
  const match = issues.find((item) => (item.fields?.summary || '') === SUMMARY) || issues[0];
  if (!match) return null;
  return {
    key: match.key,
    summary: match.fields?.summary || SUMMARY,
    parentKey: match.fields?.parent?.key || null,
    status: match.fields?.status?.name || null,
    source: 'existing-search',
    raw: sanitize(JSON.stringify(data)),
  };
}

async function createIssue(client, cloudId) {
  const result = await client.callTool('createJiraIssue', {
    cloudId,
    projectKey: PROJECT_KEY,
    issueTypeName: 'Tarea',
    parent: EPIC_KEY,
    summary: SUMMARY,
    description: renderDescription(),
    additional_fields: {
      labels: [
        'ards-sdd',
        'control-plane',
        'init-sst-0003',
        'cr-sst-0108',
        'node-auth',
        'sst-extension',
        'session-ingestion',
      ],
    },
    contentFormat: 'markdown',
    responseContentFormat: 'markdown',
  });
  const data = parseToolData(result);
  const keys = extractIssueKeys(data, PROJECT_KEY);
  if (keys.length === 0) {
    throw new Error(`No issue key returned from createJiraIssue: ${sanitize(JSON.stringify(data))}`);
  }
  return {
    key: keys[0],
    summary: SUMMARY,
    parentKey: EPIC_KEY,
    source: 'created',
    raw: sanitize(JSON.stringify(data)),
  };
}

async function linkRelatedIssue(client, cloudId, issueKey) {
  if (issueKey === RELATED_ISSUE_KEY) return { skipped: true, reason: 'same issue' };
  try {
    const result = await client.callTool('createIssueLink', {
      cloudId,
      type: 'Relates',
      inwardIssue: issueKey,
      outwardIssue: RELATED_ISSUE_KEY,
      comment: `${REQUEST_ID} is the node-auth follow-up discovered during ${RELATED_ISSUE_KEY} manual QA.`,
      contentFormat: 'markdown',
    });
    return parseToolData(result);
  } catch (error) {
    return { warning: sanitize(error.message || String(error)) };
  }
}

function renderDescription() {
  return [
    `CR: ${REQUEST_ID}`,
    `Initiative: ${INITIATIVE_ID}`,
    `Epic: ${EPIC_KEY}`,
    `Discovered from: ${RELATED_ISSUE_KEY} manual QA`,
    '',
    'Purpose:',
    '',
    'Harden the node-auth browser extension session ingestion boundary after SST-30 manual QA showed that multi-tab PDF session submits exceeded the default Express JSON parser limit and surfaced as a generic 500.',
    '',
    'Implementation scope:',
    '',
    '* [x] Keep the global BF body parser limit unchanged for unrelated routes.',
    '* [x] Add a route-scoped JSON parser for `/api/extension/sessions`.',
    '* [x] Make the session body limit configurable with `EXTENSION_SESSION_BODY_LIMIT`.',
    '* [x] Return sanitized `413 Request body too large` for oversized bodies.',
    '* [x] Update node-auth owner ARDS/SDD docs/specs.',
    '* [x] Rebuild and redeploy the local kind workload for manual QA.',
    '',
    'Validation:',
    '',
    '* [x] `node-auth npm.cmd run build`: PASS.',
    '* [x] `node-auth npm.cmd run check`: PASS.',
    '* [x] Synthetic 200 KB session submit without bearer reaches auth and returns 401.',
    '* [x] Synthetic 6 MB session submit returns 413.',
    '* [x] `4uentes-orchestor npm.cmd run check`: PASS.',
    '* [ ] User manual retry from existing sst-extension queued session.',
    '',
    'Scalability boundary:',
    '',
    '* This CR is an immediate BF ingestion hardening fix.',
    '* Future work should evaluate multipart, chunked, or object-storage-backed artifact upload for larger sessions.',
    '* Do not store private page content, real PDF bodies, cookies, JWTs, or plaintext secrets in Jira or evidence.',
    '',
    'Control-plane evidence:',
    '',
    '* `requests/planned/CR-SST-0108-node-auth-extension-session-body-limit.yaml`',
    '* `evidence/requests/CR-SST-0108/payload-limit-analysis.md`',
    '* `evidence/requests/CR-SST-0108/changed-files-summary.md`',
    '* `evidence/requests/CR-SST-0108/validation-results.md`',
    '',
    'Boundary:',
    '',
    '* Jira is an operational mirror; ARDS/SDD remains the source of truth.',
  ].join('\n');
}

function writeEvidence(summary) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const jsonOutput = path.join(OUTPUT_DIR, 'jira-cr-sst-0108-create-result.json');
  const output = path.join(OUTPUT_DIR, 'jira-cr-sst-0108-create-summary.md');
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');
  fs.writeFileSync(output, [
    '# CR-SST-0108 Jira Create Summary',
    '',
    '## Estado',
    '',
    `- Fecha: ${today()}`,
    `- Request: \`${REQUEST_ID}\``,
    `- Initiative: \`${INITIATIVE_ID}\``,
    `- Epic: \`${EPIC_KEY}\``,
    `- Issue key: \`${sanitize(summary.issue.key)}\``,
    `- Issue source: \`${summary.existing ? 'existing' : 'created'}\``,
    '- Escritura Jira: si',
    '',
    '## Relacion',
    '',
    `- Related issue: \`${RELATED_ISSUE_KEY}\``,
    '- Link attempted: yes',
    '',
    '## Evidencia',
    '',
    `- Resultado JSON sanitizado: \`${rel(jsonOutput)}\``,
    '',
    '## Notas',
    '',
    '- Jira is an operational mirror; ARDS/SDD remains the source of truth.',
    '- No secrets, JWTs, cookies, private page content, or plaintext secrets were included.',
  ].join('\n') + '\n', 'utf8');
  return output;
}

function sanitizeJson(value) {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return sanitize(value);
  if (Array.isArray(value)) return value.map((item) => sanitizeJson(item));
  if (typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeJson(item)]));
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
