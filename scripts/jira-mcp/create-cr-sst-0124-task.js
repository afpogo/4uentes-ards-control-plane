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
const REQUEST_ID = 'CR-SST-0124';
const INITIATIVE_ID = 'INIT-SST-0001';
const PROJECT_KEY = 'SST';
const PARENT_ISSUE_KEY = 'SST-6';
const RELATED_ISSUE_KEY = 'SST-52';
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'requests', REQUEST_ID);
const SUMMARY = '[SST][CR-SST-0124] Native SST article runtime URL';
const SUBTASK_ISSUE_TYPE_CANDIDATES = ['Sub-task', 'Subtask', 'Subtarea'];

async function main() {
  requireConnectFlag();
  requireApprovedFlag();

  const { client } = await connectAtlassian();
  try {
    const cloudId = await resolveCloudId(client);
    const existing = await findExistingIssue(client, cloudId);
    const issue = existing || (await createIssue(client, cloudId));
    const linkResult = await linkRelatedIssue(client, cloudId, issue.key);
    const transitions = await getTransitions(client, cloudId, issue.key);
    const selectedTransition = selectStartTransition(transitions);
    let transitionResult = null;

    if (selectedTransition && !isActive(issue.status)) {
      transitionResult = await transitionIssue(client, cloudId, issue.key, selectedTransition);
    }

    const commentResult = await addStartComment(client, cloudId, issue.key, selectedTransition);
    const summary = {
      requestId: REQUEST_ID,
      initiativeId: INITIATIVE_ID,
      parentIssueKey: PARENT_ISSUE_KEY,
      relatedIssueKey: RELATED_ISSUE_KEY,
      issue,
      existing: Boolean(existing),
      selectedTransition,
      transitions,
      linkResult: sanitizeJson(linkResult),
      transitionResult: transitionResult ? sanitizeJson(transitionResult) : null,
      commentResult: commentResult ? sanitizeJson(commentResult) : null,
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
  const errors = [];
  for (const issueTypeName of SUBTASK_ISSUE_TYPE_CANDIDATES) {
    const result = await client.callTool('createJiraIssue', {
      cloudId,
      projectKey: PROJECT_KEY,
      issueTypeName,
      parent: PARENT_ISSUE_KEY,
      summary: SUMMARY,
      description: renderDescription(),
      additional_fields: {
        labels: [
          'ards-sdd',
          'control-plane',
          'init-sst-0001',
          'cr-sst-0124',
          'sst-fend',
          'learning-content-tags',
          'runtime-url',
          'subtask',
          'frontend',
        ],
      },
      contentFormat: 'markdown',
      responseContentFormat: 'markdown',
    });
    const data = parseToolData(result);
    const keys = extractIssueKeys(data, PROJECT_KEY);
    if (keys.length > 0) {
      return {
        key: keys[0],
        summary: SUMMARY,
        parentKey: PARENT_ISSUE_KEY,
        issueTypeName,
        source: 'created',
        raw: sanitize(JSON.stringify(data)),
      };
    }
    errors.push(`${issueTypeName}: ${sanitize(JSON.stringify(data))}`);
  }
  throw new Error(`No issue key returned from createJiraIssue. Tried: ${errors.join(' | ')}`);
}

async function linkRelatedIssue(client, cloudId, issueKey) {
  try {
    const result = await client.callTool('createIssueLink', {
      cloudId,
      type: 'Relates',
      inwardIssue: issueKey,
      outwardIssue: RELATED_ISSUE_KEY,
      comment: `${REQUEST_ID} is the runtime URL MVP continuation after ${RELATED_ISSUE_KEY}.`,
      contentFormat: 'markdown',
    });
    return parseToolData(result);
  } catch (error) {
    return { warning: sanitize(error.message || String(error)) };
  }
}

async function getTransitions(client, cloudId, issueKey) {
  const result = await client.callTool('getTransitionsForJiraIssue', { cloudId, issueIdOrKey: issueKey });
  const data = parseToolData(result);
  const source = Array.isArray(data) ? data : data && Array.isArray(data.transitions) ? data.transitions : [];
  return source
    .map((item) => ({
      id: String(item.id || item.transitionId || ''),
      name: String(item.name || item.transitionName || ''),
      toStatus: item.to ? String(item.to.name || item.to.status || '') : String(item.toStatus || ''),
    }))
    .filter((item) => item.id && item.name);
}

async function transitionIssue(client, cloudId, issueKey, transition) {
  const result = await client.callTool('transitionJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    transition: { id: transition.id },
  });
  return parseToolData(result);
}

async function addStartComment(client, cloudId, issueKey, selectedTransition) {
  const result = await client.callTool('addCommentToJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    commentBody: renderStartComment(selectedTransition),
    contentFormat: 'markdown',
    responseContentFormat: 'markdown',
  });
  return parseToolData(result);
}

function renderDescription() {
  return [
    `CR: ${REQUEST_ID}`,
    `Initiative: ${INITIATIVE_ID}`,
    `Parent: ${PARENT_ISSUE_KEY}`,
    `Related: ${RELATED_ISSUE_KEY} / CR-SST-0123`,
    '',
    'Purpose:',
    '',
    'Implement the MVP for native SST text articles to expose a browser-openable runtime URL derived from the article id and current SST origin, without storing a fake external source URL.',
    '',
    'Definition of Done:',
    '',
    '* [ ] Text article creation remains valid with no external URL.',
    '* [ ] Created native text article exposes an app/runtime open action.',
    '* [ ] Runtime URL opens the article in localhost/browser context.',
    '* [ ] Runtime URL is not persisted as article url or payload.data.sourceUrl.',
    '* [ ] Existing web/source article URL behavior remains unchanged.',
    '* [ ] Owner ARDS/SDD docs/specs and control-plane evidence are updated.',
    '',
    'Control-plane evidence:',
    '',
    '* `requests/planned/CR-SST-0124-sst-fend-native-article-runtime-url.yaml`',
    '* `evidence/requests/CR-SST-0124/policy-and-owner-enforcement-start.md`',
    '* `evidence/requests/CR-SST-0124/implementation-analysis-start.md`',
    '',
    'Boundary:',
    '',
    '* Jira is an operational mirror; ARDS/SDD remains the source of truth.',
    '* Internal runtime URLs must not be treated as scrapeable external source URLs.',
    '* Do not store secrets, JWTs, cookies or private content in Jira or evidence.',
  ].join('\n');
}

function renderStartComment(selectedTransition) {
  return [
    `Starting ${REQUEST_ID} under ${INITIATIVE_ID}.`,
    '',
    `Parent: ${PARENT_ISSUE_KEY}`,
    `Related: ${RELATED_ISSUE_KEY}`,
    `Transition requested: ${selectedTransition ? `${selectedTransition.name} (${selectedTransition.id})` : 'none available'}`,
    '',
    'Scope:',
    '',
    '* MVP runtime/app URL for SST-native text articles.',
    '* Keep source URL and runtime URL separate.',
    '* Start in sst-fend; node-auth/sst-bend remain verify-only unless analysis proves contract changes are required.',
  ].join('\n');
}

function selectStartTransition(transitions) {
  return transitions.find((item) => /en curso|in progress/i.test(`${item.name} ${item.toStatus}`)) || null;
}

function isActive(status) {
  return /en curso|in progress/i.test(String(status || ''));
}

function writeEvidence(summary) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const resultPath = path.join(OUTPUT_DIR, 'jira-cr-sst-0124-create-start-result.json');
  const summaryPath = path.join(OUTPUT_DIR, 'jira-cr-sst-0124-create-start-summary.md');
  fs.writeFileSync(resultPath, `${JSON.stringify(summary, null, 2)}\n`);
  fs.writeFileSync(summaryPath, renderSummary(summary, resultPath));
  return summaryPath;
}

function renderSummary(summary, resultPath) {
  return [
    '# CR-SST-0124 Jira Create/Start Summary',
    '',
    '## Estado',
    '',
    '- Escritura externa: `true`',
    `- Request: \`${REQUEST_ID}\``,
    `- Initiative: \`${INITIATIVE_ID}\``,
    `- Parent issue: \`${PARENT_ISSUE_KEY}\``,
    `- Related issue: \`${RELATED_ISSUE_KEY}\``,
    `- Issue key: \`${summary.issue.key}\``,
    `- Issue source: \`${summary.issue.source}\``,
    `- Transition selected: \`${summary.selectedTransition ? summary.selectedTransition.name : 'none'}\``,
    `- Resultado JSON sanitizado: \`${rel(resultPath)}\``,
    '',
    '## Boundary',
    '',
    'Jira is an operational mirror. ARDS/SDD remains the source of truth.',
    '',
  ].join('\n');
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
