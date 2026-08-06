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
const EPIC_SUMMARY = '[SST][INIT-SST-0003] SST Extension Construction';
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'initiatives', INITIATIVE_ID);

async function main() {
  requireConnectFlag();
  requireApprovedFlag();

  const { client } = await connectAtlassian();
  try {
    const cloudId = await resolveCloudId(client);
    const existingEpic = await findExistingEpic(client, cloudId);
    const epic = existingEpic || await createEpic(client, cloudId);
    const evidence = {
      initiativeId: INITIATIVE_ID,
      epic,
      created: !existingEpic,
      relatedIssues: [],
      associations: [],
    };
    const outputs = writeEvidence(evidence);
    console.log(`OK: Epic: ${epic.key}`);
    console.log(`OK: Created: ${!existingEpic}`);
    console.log(`OK: Evidence written: ${rel(outputs.summary)}`);
  } finally {
    client.close();
  }
}

async function findExistingEpic(client, cloudId) {
  const jql = `project = ${PROJECT_KEY} AND issuetype = Epic AND summary ~ "${INITIATIVE_ID}" ORDER BY created DESC`;
  const result = await client.callTool('searchJiraIssuesUsingJql', {
    cloudId,
    jql,
    fields: ['summary', 'status', 'labels'],
    maxResults: 5,
  });
  const data = parseToolData(result);
  const issues = normalizeIssues(data);
  const match = issues.find((issue) => issue.key && issue.summary === EPIC_SUMMARY) || issues[0];
  if (!match) return null;
  return {
    key: match.key,
    summary: match.summary || EPIC_SUMMARY,
    source: 'existing-search',
    raw: sanitize(JSON.stringify(data)),
  };
}

async function createEpic(client, cloudId) {
  const result = await client.callTool('createJiraIssue', {
    cloudId,
    projectKey: PROJECT_KEY,
    issueTypeName: 'Epic',
    summary: EPIC_SUMMARY,
    description: epicDescription(),
    additional_fields: {
      labels: ['ards-sdd', 'control-plane', 'init-sst-0003', 'sst-extension'],
    },
    contentFormat: 'markdown',
    responseContentFormat: 'markdown',
  });
  const data = parseToolData(result);
  const keys = extractIssueKeys(data, PROJECT_KEY);
  if (keys.length === 0) {
    throw new Error(`No se detecto key de epic en createJiraIssue: ${sanitize(JSON.stringify(data))}`);
  }
  return {
    key: keys[0],
    summary: EPIC_SUMMARY,
    source: 'created',
    raw: sanitize(JSON.stringify(data)),
  };
}

function normalizeIssues(data) {
  if (Array.isArray(data)) return data.map(normalizeIssue);
  if (data && Array.isArray(data.issues)) return data.issues.map(normalizeIssue);
  if (data && data.key) return [normalizeIssue(data)];
  return [];
}

function normalizeIssue(issue) {
  const fields = issue.fields || {};
  return {
    key: issue.key,
    summary: fields.summary || issue.summary || '',
  };
}

function epicDescription() {
  return [
    'Initiative/Epic mirror for INIT-SST-0003.',
    '',
    'Purpose:',
    '',
    '* Govern construction of sst-extension as a first-class SST browser extension surface.',
    '* Group future CRs for authenticated tab capture, session PDF/HTML artifacts, Dictionary adjacency, LearningWorkspace handoff, and browser QA.',
    '* Keep private page content, cookies, JWTs, and secret plaintext out of Jira and ARDS/SDD evidence.',
    '',
    'Control-plane source:',
    '',
    '* initiatives/INIT-SST-0003-sst-extension-construction.yaml',
    '* requests/planned/CR-SST-0094-sst-extension-construction-initiative.yaml',
    '* evidence/requests/CR-SST-0093/session-pdf-capture-gap-analysis.md',
    '* evidence/requests/CR-SST-0093/credentialed-web-source-boundary.md',
    '',
    'Boundary:',
    '',
    '* Jira is an operational mirror.',
    '* ARDS/SDD remains the source of truth.',
    '* This epic does not authorize direct child-repo mutation.',
  ].join('\n');
}

function writeEvidence(evidence) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const jsonOutput = path.join(OUTPUT_DIR, 'jira-epic-sync-result.json');
  const summaryOutput = path.join(OUTPUT_DIR, 'jira-epic-sync-summary.md');
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(evidence), null, 2), 'utf8');

  const lines = [
    '# Jira Epic Sync Summary',
    '',
    '## Status',
    '',
    `- Date: ${today()}`,
    `- Initiative: \`${INITIATIVE_ID}\``,
    `- Project key: \`${PROJECT_KEY}\``,
    '- Issue type: `Epic`',
    '- Jira write: yes, limited to epic create/search',
    `- Epic: \`${sanitize(evidence.epic.key)}\``,
    `- Created: ${evidence.created ? 'yes' : 'no, reused existing epic'}`,
    '',
    '## Evidence',
    '',
    `- JSON sanitizado: \`${rel(jsonOutput)}\``,
    '',
    '## Notes',
    '',
    '- Jira is an operational mirror; ARDS/SDD remains the source of truth.',
    '- No secrets, JWTs, cookies, master keys, private page content, or plaintext secrets were included.',
  ];
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
