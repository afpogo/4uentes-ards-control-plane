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
const PARENT_EPIC_KEY = 'ARDS-1';
const EPIC_SUMMARY = '[ARDS][INIT-CP-0003] ARDS/SDD Runtime Enforcement MVP';
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'initiatives', INITIATIVE_ID);
const RELATED_ISSUES = ['ARDS-7', 'ARDS-8', 'ARDS-9', 'ARDS-10', 'ARDS-11', 'ARDS-12'];

async function main() {
  requireConnectFlag();
  requireApprovedFlag();

  const { client } = await connectAtlassian();
  try {
    const cloudId = await resolveCloudId(client);
    const existingEpic = await findExistingEpic(client, cloudId);
    const epic = existingEpic || (await createEpic(client, cloudId));
    const parentLink = await createParentRelatesLink(client, cloudId, epic.key);
    const associations = [];

    for (const issueKey of RELATED_ISSUES) {
      associations.push(await associateIssue(client, cloudId, epic.key, issueKey));
    }

    const evidence = {
      initiativeId: INITIATIVE_ID,
      projectKey: PROJECT_KEY,
      parentEpicKey: PARENT_EPIC_KEY,
      epic,
      created: !existingEpic,
      parentLink,
      relatedIssues: RELATED_ISSUES,
      associations,
      externalWrite: true,
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
  const match = issues.find((issue) => issue.key && issue.summary === EPIC_SUMMARY) || null;
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
      labels: ['ards-sdd', 'control-plane', 'init-cp-0003', 'runtime-enforcement', 'audit-runtime'],
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

async function createParentRelatesLink(client, cloudId, epicKey) {
  try {
    const result = await client.callTool('createIssueLink', {
      cloudId,
      type: 'Relates',
      inwardIssue: PARENT_EPIC_KEY,
      outwardIssue: epicKey,
      comment: `${INITIATIVE_ID} is a dedicated Initiative/Epic for ARDS/SDD runtime enforcement. It relates to umbrella epic ${PARENT_EPIC_KEY}; ARDS/SDD remains source of truth.`,
      contentFormat: 'markdown',
    });
    return { action: 'relates-link-created', raw: sanitize(JSON.stringify(parseToolData(result))) };
  } catch (error) {
    return { action: 'relates-link-failed', error: sanitize(error.message || String(error)) };
  }
}

async function associateIssue(client, cloudId, epicKey, issueKey) {
  const before = await getIssueSummary(client, cloudId, issueKey);
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
    const comment = await addCorrectionComment(client, cloudId, issueKey, epicKey, before.parentKey, after.parentKey);
    return {
      issueKey,
      issueType: before.issueType,
      action: after.parentKey === epicKey ? 'parent-set' : 'parent-edit-returned-without-parent-confirmation',
      beforeParent: before.parentKey || null,
      parent: after.parentKey || null,
      fallback: false,
      editRaw: sanitize(JSON.stringify(data)),
      commentRaw: sanitize(JSON.stringify(comment)),
    };
  } catch (error) {
    const linked = await createRelatesLink(client, cloudId, epicKey, issueKey, before, `parent-set-failed: ${error.message}`);
    return {
      ...linked,
      beforeParent: before.parentKey || null,
      parentError: sanitize(error.message),
    };
  }
}

async function addCorrectionComment(client, cloudId, issueKey, epicKey, beforeParent, afterParent) {
  const result = await client.callTool('addCommentToJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    commentBody: [
      'Hierarchy correction for INIT-CP-0003.',
      '',
      `Correct Initiative/Epic parent: ${epicKey}.`,
      `Previous parent observed: ${beforeParent || 'none'}.`,
      `Current parent observed: ${afterParent || 'none'}.`,
      '',
      'Reason:',
      '',
      '- ARDS/SDD maps Initiative to Jira Epic.',
      '- CRs are tracked as tasks under the Initiative/Epic.',
      '- ARDS/SDD remains the source of truth; Jira is an operational mirror.',
    ].join('\n'),
    contentFormat: 'markdown',
    responseContentFormat: 'markdown',
  });
  return parseToolData(result);
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
    status: fields.status ? fields.status.name : null,
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
    'Initiative/Epic mirror for INIT-CP-0003.',
    '',
    'Purpose:',
    '',
    '* Build the ARDS/SDD runtime enforcement MVP.',
    '* Start by making policies and living resources executable through controls, probes, gates, and audit evidence.',
    '* Preserve SOLID and DRY so new policies can be added through templates and reusable controls.',
    '',
    'MVP CRs:',
    '',
    '* CR-CP-0008: audit binding and policy enforcement pack skeleton.',
    '* CR-CP-0009: reusable policy control, probe, and gate model.',
    '* CR-CP-0010: human documentation language runtime validator.',
    '* CR-CP-0011: policy registry and adoption runtime validator.',
    '* CR-CP-0012: audit capsule and policy runtime runner MVP.',
    '* CR-CP-0013: local policy runtime rollout.',
    '',
    'Control-plane source:',
    '',
    '* initiatives/INIT-CP-0003-ards-sdd-runtime-enforcement.yaml',
    '* evidence/initiatives/INIT-CP-0003/runtime-enforcement-scope.md',
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
  const jsonOutput = path.join(OUTPUT_DIR, 'jira-runtime-epic-correction-result.json');
  const summaryOutput = path.join(OUTPUT_DIR, 'jira-runtime-epic-correction-summary.md');
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(evidence), null, 2), 'utf8');

  const lines = [];
  lines.push('# INIT-CP-0003 Jira Epic Correction Summary');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Initiative: \`${INITIATIVE_ID}\``);
  lines.push(`- Project key: \`${PROJECT_KEY}\``);
  lines.push('- Issue type: `Epic`');
  lines.push('- Escritura Jira: si, limitada a epic create/search, parent association, comments, and Relates fallback');
  lines.push(`- Epic: \`${sanitize(evidence.epic.key)}\``);
  lines.push(`- Created: ${evidence.created ? 'yes' : 'no, reused existing epic'}`);
  lines.push(`- Umbrella related epic: \`${PARENT_EPIC_KEY}\``);
  lines.push('');
  lines.push('## CR Issues');
  lines.push('');
  for (const item of evidence.associations) {
    const parent = item.parent ? ` parent \`${sanitize(item.parent)}\`` : ' no parent observed';
    const before = item.beforeParent ? ` previous \`${sanitize(item.beforeParent)}\`` : ' previous none';
    const fallback = item.fallback ? ` fallback=${sanitize(item.fallbackReason || 'yes')}` : ' fallback=no';
    lines.push(`- \`${sanitize(item.issueKey)}\`: ${sanitize(item.action)} ->${parent};${before};${fallback}`);
  }
  lines.push('');
  lines.push('## Evidencia');
  lines.push('');
  lines.push(`- JSON sanitizado: \`${rel(jsonOutput)}\``);
  lines.push('');
  lines.push('## Nota');
  lines.push('');
  lines.push('La correccion reestablece el modelo ARDS/SDD: Initiative corresponde a Epic y CR corresponde a task bajo esa Epic.');
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
