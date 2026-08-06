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
const INITIATIVE_ID = 'INIT-SST-0001';
const PROJECT_KEY = 'SST';
const EPIC_SUMMARY = '[SST][INIT-SST-0001] SST Tags Governance Continuity';
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'initiatives', INITIATIVE_ID);
const RELATED_ISSUES = ['SST-4', 'SST-6'];

async function main() {
  requireConnectFlag();
  requireApprovedFlag();

  const { client } = await connectAtlassian();
  try {
    const cloudId = await resolveCloudId(client);
    const existingEpic = await findExistingEpic(client, cloudId);
    const epic = existingEpic || await createEpic(client, cloudId);
    const associations = [];

    for (const issueKey of RELATED_ISSUES) {
      associations.push(await associateIssue(client, cloudId, epic.key, issueKey));
    }

    const evidence = {
      initiativeId: INITIATIVE_ID,
      epic,
      created: !existingEpic,
      relatedIssues: RELATED_ISSUES,
      associations,
    };
    const outputs = writeEvidence(evidence);
    console.log(`OK: Epic: ${epic.key}`);
    console.log(`OK: Created: ${!existingEpic}`);
    for (const item of associations) {
      console.log(`OK: ${item.issueKey}: ${item.action}`);
    }
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
      labels: ['ards-sdd', 'control-plane', 'init-sst-0001', 'sst-tags-governance', 'learning-content-tags'],
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

async function associateIssue(client, cloudId, epicKey, issueKey) {
  const issue = await getIssueSummary(client, cloudId, issueKey);
  if (issue.issueType && issue.issueType.toLowerCase() === 'epic') {
    return createRelatesLink(client, cloudId, epicKey, issueKey, issue, 'issue-is-epic');
  }

  try {
    const result = await client.callTool('editJiraIssue', {
      cloudId,
      issueIdOrKey: issueKey,
      fields: {
        parent: { key: epicKey },
      },
      contentFormat: 'markdown',
      responseContentFormat: 'markdown',
    });
    const data = parseToolData(result);
    const after = await getIssueSummary(client, cloudId, issueKey);
    return {
      issueKey,
      issueType: issue.issueType,
      action: after.parentKey === epicKey ? 'parent-set' : 'parent-edit-returned-without-parent-confirmation',
      parent: after.parentKey || null,
      fallback: false,
      raw: sanitize(JSON.stringify(data)),
    };
  } catch (error) {
    const linked = await createRelatesLink(client, cloudId, epicKey, issueKey, issue, `parent-set-failed: ${error.message}`);
    return {
      ...linked,
      parentError: sanitize(error.message),
    };
  }
}

async function createRelatesLink(client, cloudId, epicKey, issueKey, issue, reason) {
  const result = await client.callTool('createIssueLink', {
    cloudId,
    type: 'Relates',
    inwardIssue: epicKey,
    outwardIssue: issueKey,
    comment: `Linked to ${INITIATIVE_ID} epic ${epicKey}. Reason: ${reason}. Jira is an operational mirror; ARDS/SDD remains source of truth.`,
    contentFormat: 'markdown',
  });
  const data = parseToolData(result);
  return {
    issueKey,
    issueType: issue.issueType || 'unknown',
    action: 'relates-link-created',
    parent: issue.parentKey || null,
    fallback: true,
    fallbackReason: sanitize(reason),
    raw: sanitize(JSON.stringify(data)),
  };
}

async function getIssueSummary(client, cloudId, issueKey) {
  const result = await client.callTool('getJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    fields: ['summary', 'issuetype', 'parent', 'status', 'labels'],
    responseContentFormat: 'markdown',
  });
  const data = parseToolData(result);
  const fields = data && data.fields ? data.fields : {};
  return {
    key: data.key || issueKey,
    summary: fields.summary || '',
    issueType: fields.issuetype ? fields.issuetype.name : '',
    parentKey: fields.parent ? fields.parent.key : null,
    labels: Array.isArray(fields.labels) ? fields.labels : [],
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
    'Initiative/Epic mirror for INIT-SST-0001.',
    '',
    'Purpose:',
    '',
    '* Govern SST tags continuity after the closed SST-4 cut.',
    '* Separate completed dictionary/article governance from the active learning-content track.',
    '* Keep CR-SST-0088, CR-SST-0089, CR-SST-0090 and CR-SST-0091 visible under one initiative-level Jira epic.',
    '',
    'Control-plane source:',
    '',
    '* initiatives/INIT-SST-0001-tags-governance-continuity.yaml',
    '* state/features/learning-content-tags.current.yaml',
    '* requests/planned/CR-SST-0088-learning-source-model-boundary.yaml',
    '* requests/planned/CR-SST-0089-learning-content-preview-import-boundary.yaml',
    '* requests/planned/CR-SST-0090-learning-workspace-controlled-adoption.yaml',
    '* requests/planned/CR-SST-0091-sst-bend-learning-workspace-implementation-readiness.yaml',
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

  const lines = [];
  lines.push('# Jira Epic Sync Summary');
  lines.push('');
  lines.push('## Status');
  lines.push('');
  lines.push(`- Date: ${today()}`);
  lines.push(`- Initiative: \`${INITIATIVE_ID}\``);
  lines.push(`- Project key: \`${PROJECT_KEY}\``);
  lines.push('- Issue type: `Epic`');
  lines.push('- Jira write: yes, limited to epic create/search plus parent association or Relates fallback');
  lines.push(`- Epic: \`${sanitize(evidence.epic.key)}\``);
  lines.push(`- Created: ${evidence.created ? 'yes' : 'no, reused existing epic'}`);
  lines.push('');
  lines.push('## Related Issues');
  lines.push('');
  for (const item of evidence.associations) {
    const parent = item.parent ? ` parent \`${sanitize(item.parent)}\`` : ' no parent observed';
    const fallback = item.fallback ? ` fallback=${sanitize(item.fallbackReason || 'yes')}` : ' fallback=no';
    lines.push(`- \`${sanitize(item.issueKey)}\`: ${sanitize(item.action)} ->${parent};${fallback}`);
  }
  lines.push('');
  lines.push('## Evidence');
  lines.push('');
  lines.push(`- JSON sanitizado: \`${rel(jsonOutput)}\``);
  lines.push('');
  lines.push('## Notes');
  lines.push('');
  lines.push('- Jira is an operational mirror; ARDS/SDD remains the source of truth.');
  lines.push('- No secrets, JWTs, cookies, master keys, or plaintext secrets were included.');
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
