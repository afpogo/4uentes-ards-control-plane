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
const REQUEST_ID = 'CR-SST-0123';
const INITIATIVE_ID = 'INIT-SST-0001';
const PROJECT_KEY = 'SST';
const PARENT_ISSUE_KEY = 'SST-6';
const RELATED_ISSUE_KEY = 'SST-48';
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'requests', REQUEST_ID);
const SUMMARY = '[SST][CR-SST-0123] Fix LearningWorkspace annotated context render';
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
    const before = await getIssue(client, cloudId, issue.key);
    const transitions = await getTransitions(client, cloudId, issue.key);
    const selectedTransition = selectStartTransition(transitions);
    let transitionResult = null;
    let action = existing ? 'existing-commented' : 'created-commented';

    if (!isActive(before.status, before.statusCategory)) {
      if (!selectedTransition) {
        throw new Error(`No active transition available for ${issue.key}.`);
      }
      transitionResult = await transitionIssue(client, cloudId, issue.key, selectedTransition);
      action = `${action}-and-transitioned`;
    } else {
      action = `${action}-already-active`;
    }

    const commentResult = await addStartComment(client, cloudId, issue.key, before, selectedTransition, action);
    const after = await getIssue(client, cloudId, issue.key);

    const summary = {
      requestId: REQUEST_ID,
      initiativeId: INITIATIVE_ID,
      parentIssueKey: PARENT_ISSUE_KEY,
      relatedIssueKey: RELATED_ISSUE_KEY,
      issue,
      existing: Boolean(existing),
      action,
      before,
      after,
      selectedTransition,
      transitions,
      linkResult: sanitizeJson(linkResult),
      transitionResult: transitionResult ? sanitizeJson(transitionResult) : null,
      commentResult: commentResult ? sanitizeJson(commentResult) : null,
      externalWrite: true,
    };
    const output = writeEvidence(summary);

    console.log(`OK: ${REQUEST_ID}: ${issue.key} (${existing ? 'existing' : 'created'})`);
    console.log(`OK: Action: ${action}`);
    console.log(`OK: Status: ${before.status} -> ${after.status}`);
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
          'cr-sst-0123',
          'sst-fend',
          'learning-content-tags',
          'subtask',
          'bugfix',
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
  if (issueKey === RELATED_ISSUE_KEY) return { skipped: true, reason: 'same issue' };
  try {
    const result = await client.callTool('createIssueLink', {
      cloudId,
      type: 'Relates',
      inwardIssue: issueKey,
      outwardIssue: RELATED_ISSUE_KEY,
      comment: `${REQUEST_ID} is the frontend follow-up for the annotated context gap blocking ${RELATED_ISSUE_KEY}.`,
      contentFormat: 'markdown',
    });
    return parseToolData(result);
  } catch (error) {
    return { warning: sanitize(error.message || String(error)) };
  }
}

async function getIssue(client, cloudId, issueKey) {
  const result = await client.callTool('getJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    fields: ['summary', 'status', 'resolution', 'assignee', 'updated', 'labels'],
    responseContentFormat: 'markdown',
  });
  const data = parseToolData(result);
  const text = typeof data === 'string' ? data : JSON.stringify(data);
  return {
    summary: firstMarkdownValue(text, 'Summary') || firstJsonLikeValue(text, 'summary') || 'no-detectado',
    status: firstMarkdownValue(text, 'Status') || firstJsonLikeValue(text, 'name') || 'no-detectado',
    statusCategory: statusCategoryValue(text) || 'no-detectado',
    resolution: firstMarkdownValue(text, 'Resolution') || firstJsonLikeValue(text, 'resolution') || 'no-detectado',
    assignee: firstMarkdownValue(text, 'Assignee') || firstJsonLikeValue(text, 'displayName') || 'no-asignado',
    updated: firstMarkdownValue(text, 'Updated') || firstJsonLikeValue(text, 'updated') || 'no-detectado',
    raw: sanitize(text),
  };
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
      toStatusCategory:
        item.to && item.to.statusCategory
          ? String(item.to.statusCategory.name || item.to.statusCategory.key || '')
          : String(item.toStatusCategory || ''),
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

async function addStartComment(client, cloudId, issueKey, before, selectedTransition, action) {
  const result = await client.callTool('addCommentToJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    commentBody: renderStartComment(before, selectedTransition, action),
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
    `Blocks closure of: ${RELATED_ISSUE_KEY} / CR-SST-0118`,
    '',
    'Purpose:',
    '',
    'Fix the /learning E2E gap where preview and accept succeed after CR-SST-0122, but accepted context visible in the UI still has no annotations or contentBlocks.',
    '',
    'Analysis checklist:',
    '',
    '* [ ] Inspect sst-fend /learning route/component.',
    '* [ ] Verify preview payload includes annotated content and block metadata.',
    '* [ ] Verify accept flow uses the previewId and annotation identifiers expected by the contract.',
    '* [ ] Verify accepted context renderer reads the correct fields.',
    '* [ ] Expand to node-auth or sst-bend only if frontend payload/render is correct.',
    '* [ ] Update owner ARDS/SDD docs/specs for every mutated repo.',
    '',
    'Definition of Done:',
    '',
    '* [ ] /learning preview sends or derives non-empty annotated content.',
    '* [ ] Accepting a preview produces accepted annotations and contentBlocks in visible context.',
    '* [ ] Template render shows accepted annotated text, not only an empty document shell.',
    '* [ ] Chrome DevTools MCP evidence exists.',
    '* [ ] Required checks pass in mutated repo(s) and control-plane.',
    '',
    'Control-plane evidence:',
    '',
    '* `requests/planned/CR-SST-0123-sst-fend-learning-annotated-context-render-fix.yaml`',
    '* `evidence/requests/CR-SST-0123/policy-and-owner-enforcement-start.md`',
    '* `evidence/requests/CR-SST-0123/implementation-analysis-start.md`',
    '* `evidence/requests/CR-SST-0118/e2e-revalidation-after-cr-sst-0122-2026-07-05.md`',
    '',
    'Boundary:',
    '',
    '* Jira is an operational mirror; ARDS/SDD remains the source of truth.',
    '* Do not close SST-48 until CR-SST-0118 E2E validation passes.',
    '* Do not store secrets, JWTs, cookies or private content in Jira or evidence.',
  ].join('\n');
}

function renderStartComment(before, selectedTransition, action) {
  return [
    `${REQUEST_ID} start checkpoint.`,
    '',
    'This is the next technical follow-up after CR-SST-0122.',
    '',
    'Observed blocker:',
    '',
    '* /learning preview returns 200.',
    '* accept returns 201.',
    '* context returns 200.',
    '* visible accepted context still shows `annotations: []` and `contentBlocks: []`.',
    '',
    'Scope:',
    '',
    '* Start with sst-fend payload/render analysis.',
    '* Mutate sst-fend only unless evidence proves node-auth or sst-bend owns the gap.',
    '* Keep SST-48 En curso until full E2E validation passes.',
    '',
    'Policies:',
    '',
    '* Owner documentation gate is required before closure.',
    '* Control-plane `npm.cmd run check` passed before Jira sync.',
    '',
    `Before status: ${before.status}`,
    `Action: ${action}`,
    selectedTransition ? `Transition: ${selectedTransition.name} (${selectedTransition.id})` : 'Transition: not required.',
    '',
    'Evidence:',
    '',
    '* `evidence/requests/CR-SST-0123/policy-and-owner-enforcement-start.md`',
    '* `evidence/requests/CR-SST-0123/implementation-analysis-start.md`',
  ].join('\n');
}

function writeEvidence(summary) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const jsonOutput = path.join(OUTPUT_DIR, 'jira-cr-sst-0123-create-start-result.json');
  const output = path.join(OUTPUT_DIR, 'jira-cr-sst-0123-create-start-summary.md');
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');
  fs.writeFileSync(output, renderEvidenceMarkdown(summary, jsonOutput), 'utf8');
  return output;
}

function renderEvidenceMarkdown(summary, jsonOutput) {
  return [
    '# CR-SST-0123 Jira Create/Start Summary',
    '',
    '## Estado',
    '',
    `- Fecha: ${today()}`,
    `- Request: \`${REQUEST_ID}\``,
    `- Initiative: \`${INITIATIVE_ID}\``,
    `- Parent issue: \`${PARENT_ISSUE_KEY}\``,
    `- Related issue: \`${RELATED_ISSUE_KEY}\``,
    `- Issue key: \`${sanitize(summary.issue.key)}\``,
    `- Issue source: \`${summary.existing ? 'existing' : 'created'}\``,
    '- Escritura Jira: si',
    `- Accion: \`${sanitize(summary.action)}\``,
    '',
    '## Resultado',
    '',
    `- Estado previo: ${sanitize(summary.before.status)}`,
    `- Estado posterior: ${sanitize(summary.after.status)}`,
    `- Transicion seleccionada: ${
      summary.selectedTransition
        ? `${sanitize(summary.selectedTransition.name)} (${sanitize(summary.selectedTransition.id)})`
        : 'ninguna'
    }`,
    '- Comentario agregado: si',
    '',
    '## Evidencia',
    '',
    `- Resultado JSON sanitizado: \`${rel(jsonOutput)}\``,
    '',
    '## Notas',
    '',
    '- Jira is an operational mirror; ARDS/SDD remains the source of truth.',
    '- No secrets, JWTs, cookies, private content, or plaintext secrets were included.',
    '',
  ].join('\n');
}

function selectStartTransition(transitions) {
  return (
    transitions.find((item) => item.id === '21') ||
    transitions.find((item) => /en curso|progress|doing|in work|start/i.test(`${item.name} ${item.toStatus} ${item.toStatusCategory}`)) ||
    null
  );
}

function isActive(status, statusCategory) {
  return /curso|progress|doing|in work/i.test(`${status} ${statusCategory}`);
}

function firstMarkdownValue(text, label) {
  const match = text.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`, 'i'));
  return match ? match[1].trim() : null;
}

function firstJsonLikeValue(text, key) {
  const match = text.match(new RegExp(`"${key}"\\s*:\\s*(?:"([^"]+)"|\\{[^}]*"name"\\s*:\\s*"([^"]+)")`, 'i'));
  return match ? (match[1] || match[2] || '').trim() : null;
}

function statusCategoryValue(text) {
  const match = text.match(/"statusCategory"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/i);
  return match ? match[1].trim() : firstJsonLikeValue(text, 'statusCategory');
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
  console.error(`FAIL: ${sanitize(error.stack || error.message || String(error))}`);
  process.exit(1);
});
