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
const REQUEST_ID = 'CR-SST-0125';
const INITIATIVE_ID = 'INIT-SST-0001';
const PROJECT_KEY = 'SST';
const PARENT_ISSUE_KEY = 'SST-6';
const RELATED_ISSUE_KEY = 'SST-53';
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'requests', REQUEST_ID);
const SUMMARY = '[SST][CR-SST-0125] LearningWorkspace source preview/import normalization';
const SUBTASK_ISSUE_TYPE_CANDIDATES = ['Sub-task', 'Subtask', 'Subtarea'];

async function main() {
  requireConnectFlag();
  requireApprovedFlag();

  const { client } = await connectAtlassian();
  try {
    const cloudId = await resolveCloudId(client);
    const existing = await findExistingIssue(client, cloudId);
    const issue = existing || (await createIssue(client, cloudId));
    const before = await getIssue(client, cloudId, issue.key);
    const linkResult = await linkRelatedIssue(client, cloudId, issue.key);
    const transitions = await getTransitions(client, cloudId, issue.key);
    const selectedTransition = selectStartTransition(transitions);
    let transitionResult = null;
    let action = existing ? 'existing-commented' : 'created-commented';

    if (!isActive(before.status, before.statusCategory)) {
      if (selectedTransition) {
        transitionResult = await transitionIssue(client, cloudId, issue.key, selectedTransition);
        action = `${action}-and-transitioned`;
      } else {
        action = `${action}-no-active-transition`;
      }
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
          'cr-sst-0125',
          'sst-bend',
          'learning-content-tags',
          'learning-workspace',
          'preview-import',
          'subtask',
          'backend',
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

async function linkRelatedIssue(client, cloudId, issueKey) {
  if (issueKey === RELATED_ISSUE_KEY) return { skipped: true, reason: 'same issue' };
  try {
    const result = await client.callTool('createIssueLink', {
      cloudId,
      type: 'Relates',
      inwardIssue: issueKey,
      outwardIssue: RELATED_ISSUE_KEY,
      comment: `${REQUEST_ID} continues backend parser/import normalization after ${RELATED_ISSUE_KEY} closure.`,
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
    `Related: ${RELATED_ISSUE_KEY}`,
    '',
    'Purpose:',
    '',
    'Implement the next sst-bend backend slice for LearningWorkspace source preview/import normalization. Keep the existing preview endpoint, preserve preview-only behavior, and add warning-first handling for bounded source payloads.',
    '',
    'Definition of Done:',
    '',
    '* [ ] CourseSource-style payload is normalized into previewable sourceText/materialized blocks.',
    '* [ ] WebArticleSource/manual text payload remains bounded and does not crawl.',
    '* [ ] Generated/excluded paths produce warnings, not silent ingestion.',
    '* [ ] Preview response remains preview-only and non-persisted.',
    '* [ ] Existing annotation preview/accept behavior remains valid.',
    '* [ ] sst-bend owner docs/specs are updated.',
    '* [ ] sst-bend and control-plane checks pass.',
    '',
    'Control-plane evidence:',
    '',
    '* `requests/planned/CR-SST-0125-sst-bend-learning-source-preview-import-normalization.yaml`',
    '* `evidence/requests/CR-SST-0125/policy-and-owner-enforcement-start.md`',
    '* `evidence/requests/CR-SST-0125/implementation-analysis-start.md`',
    '',
    'Boundary:',
    '',
    '* Jira is an operational mirror; ARDS/SDD remains the source of truth.',
    '* Do not create TagDefinition records automatically.',
    '* Do not perform crawler recursion, mass scraping, automatic publish or preview persistence.',
    '* Do not store secrets, JWTs, cookies or private content in Jira or evidence.',
  ].join('\n');
}

function renderStartComment(before, selectedTransition, action) {
  return [
    `${REQUEST_ID} start checkpoint.`,
    '',
    'Scope:',
    '',
    '* Target repo: `sst-bend`.',
    '* Reuse `POST /learning-workspaces/sources/preview`.',
    '* Normalize bounded CourseSource/WebArticleSource/manual text payloads before tag-prefix parsing.',
    '* Keep `persistenceMode=preview-only` and no automatic TagDefinition creation.',
    '',
    'Policies:',
    '',
    '* Owner documentation gate is required before closure.',
    '* Control-plane `npm.cmd run check` passed before Jira sync.',
    '',
    `Before status: ${before.status}`,
    `Action: ${action}`,
    selectedTransition ? `Transition: ${selectedTransition.name} (${selectedTransition.id})` : 'Transition: not required or unavailable.',
    '',
    'Evidence:',
    '',
    '* `evidence/requests/CR-SST-0125/policy-and-owner-enforcement-start.md`',
    '* `evidence/requests/CR-SST-0125/implementation-analysis-start.md`',
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

function writeEvidence(summary) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const jsonOutput = path.join(OUTPUT_DIR, 'jira-cr-sst-0125-create-start-result.json');
  const output = path.join(OUTPUT_DIR, 'jira-cr-sst-0125-create-start-summary.md');
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');
  fs.writeFileSync(output, renderEvidenceMarkdown(summary, jsonOutput), 'utf8');
  return output;
}

function renderEvidenceMarkdown(summary, jsonOutput) {
  return [
    '# CR-SST-0125 Jira Create/Start Summary',
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

function sanitizeJson(value, key = '') {
  if (value === null || value === undefined) return value;
  if (/accountid|cloudid|email|avatar|self/i.test(key)) return '[redacted]';
  if (typeof value === 'string') return sanitize(value);
  if (Array.isArray(value)) return value.map((item) => sanitizeJson(item));
  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([entryKey, item]) => [entryKey, sanitizeJson(item, entryKey)]));
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
