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
const REQUEST_ID = 'CR-SST-0092';
const EPIC_KEY = 'SST-27';
const SUMMARY = '[SST][CR-SST-0092] Implement sst-bend LearningWorkspace first runtime slice';
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'requests', REQUEST_ID);

async function main() {
  requireConnectFlag();
  requireApprovedFlag();
  const { client } = await connectAtlassian();
  try {
    const cloudId = await resolveCloudId(client);
    const existing = await findExistingIssue(client, cloudId);
    const issue = existing || await createIssue(client, cloudId);
    if (!existing) {
      await transitionStart(client, cloudId, issue.key);
    }
    const observed = await getIssue(client, cloudId, issue.key);
    const output = writeEvidence({
      issue,
      existing: Boolean(existing),
      observed,
    });
    console.log(`OK: Issue: ${issue.key}`);
    console.log(`OK: Existing: ${Boolean(existing)}`);
    console.log(`OK: Status: ${observed.status}`);
    console.log(`OK: Evidence written: ${rel(output)}`);
  } finally {
    client.close();
  }
}

async function findExistingIssue(client, cloudId) {
  const result = await client.callTool('searchJiraIssuesUsingJql', {
    cloudId,
    jql: `project = SST AND summary ~ "${REQUEST_ID}" ORDER BY created DESC`,
    fields: ['summary', 'status', 'parent', 'labels'],
    maxResults: 5,
  });
  const data = parseToolData(result);
  const issues = data && Array.isArray(data.issues) ? data.issues : [];
  const match = issues.find((issue) => issue.key && (issue.fields?.summary || '') === SUMMARY) || issues[0];
  return match ? { key: match.key, summary: match.fields?.summary || SUMMARY, raw: sanitize(JSON.stringify(data)) } : null;
}

async function createIssue(client, cloudId) {
  const result = await client.callTool('createJiraIssue', {
    cloudId,
    projectKey: 'SST',
    issueTypeName: 'Tarea',
    parent: EPIC_KEY,
    summary: SUMMARY,
    description: description(),
    additional_fields: {
      labels: ['ards-sdd', 'control-plane', 'init-sst-0001', 'cr-sst-0092', 'learning-content-tags', 'sst-bend'],
    },
    contentFormat: 'markdown',
    responseContentFormat: 'markdown',
  });
  const data = parseToolData(result);
  const keys = extractIssueKeys(data, 'SST');
  if (keys.length === 0) throw new Error(`No issue key returned from createJiraIssue: ${sanitize(JSON.stringify(data))}`);
  return { key: keys[0], summary: SUMMARY, raw: sanitize(JSON.stringify(data)) };
}

async function transitionStart(client, cloudId, issueKey) {
  const transitions = await client.callTool('getTransitionsForJiraIssue', { cloudId, issueIdOrKey: issueKey });
  const data = parseToolData(transitions);
  const source = Array.isArray(data) ? data : data && Array.isArray(data.transitions) ? data.transitions : [];
  const transition = source.find((item) => String(item.id) === '21') ||
    source.find((item) => /curso|progress|start/i.test(`${item.name || ''} ${item.to?.name || ''}`));
  if (!transition) return null;
  return parseToolData(await client.callTool('transitionJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    transition: { id: String(transition.id) },
  }));
}

async function getIssue(client, cloudId, issueKey) {
  const result = await client.callTool('getJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    fields: ['summary', 'status', 'parent', 'labels'],
    responseContentFormat: 'markdown',
  });
  const data = parseToolData(result);
  const fields = data && data.fields ? data.fields : {};
  return {
    key: data.key || issueKey,
    summary: fields.summary || SUMMARY,
    status: fields.status ? fields.status.name : 'no-detectado',
    statusCategory: fields.status?.statusCategory ? fields.status.statusCategory.name || fields.status.statusCategory.key : 'no-detectado',
    parentKey: fields.parent ? fields.parent.key : null,
    labels: Array.isArray(fields.labels) ? fields.labels : [],
    raw: sanitize(JSON.stringify(data)),
  };
}

function description() {
  return [
    'Execution task for CR-SST-0092 under INIT-SST-0001 / SST-27.',
    '',
    'Purpose:',
    '',
    '* Implement the first sst-bend LearningWorkspace runtime slice.',
    '* Preserve preview-only behavior until explicit source acceptance.',
    '* Return LearningWorkspaceContext with accepted scoped content only.',
    '* Keep TagDefinition creation manual/governed.',
    '',
    'Control-plane source:',
    '',
    '* requests/planned/CR-SST-0092-sst-bend-learning-workspace-first-runtime-slice.yaml',
    '* evidence/requests/CR-SST-0091/sst-bend-file-plan.md',
    '* evidence/requests/CR-SST-0090/workspace-boundary.md',
    '* evidence/requests/CR-SST-0090/chatbot-read-contract.md',
    '',
    'Boundary:',
    '',
    '* Jira is an operational mirror.',
    '* ARDS/SDD remains the source of truth.',
    '* This task may mutate only sst-bend plus control-plane execution evidence.',
  ].join('\n');
}

function writeEvidence(summary) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const jsonOutput = path.join(OUTPUT_DIR, 'jira-task-sync-result.json');
  const output = path.join(OUTPUT_DIR, 'jira-task-sync-summary.md');
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');
  const lines = [
    '# CR-SST-0092 Jira Task Sync Summary',
    '',
    '## Status',
    '',
    `- Date: ${today()}`,
    `- Request: \`${REQUEST_ID}\``,
    `- Epic: \`${EPIC_KEY}\``,
    `- Issue: \`${sanitize(summary.issue.key)}\``,
    `- Existing: ${summary.existing ? 'yes' : 'no, created'}`,
    `- Observed status: ${sanitize(summary.observed.status)}`,
    `- Observed parent: ${summary.observed.parentKey ? `\`${sanitize(summary.observed.parentKey)}\`` : 'none'}`,
    '- Jira write: yes, limited to task create/reuse and start transition',
    '',
    '## Evidence',
    '',
    `- JSON sanitizado: \`${rel(jsonOutput)}\``,
  ];
  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
  return output;
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
