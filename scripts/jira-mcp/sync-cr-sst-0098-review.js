const fs = require('fs');
const path = require('path');
const {
  connectAtlassian,
  parseToolData,
  requireApprovedFlag,
  requireConnectFlag,
  resolveCloudId,
  sanitize,
} = require('./lib/atlassian-mcp');

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'requests', 'CR-SST-0098');
const EPIC_KEY = 'SST-29';
const ISSUE_KEY = 'SST-30';

async function main() {
  requireConnectFlag();
  requireApprovedFlag();

  const { client } = await connectAtlassian();
  try {
    const cloudId = await resolveCloudId(client);
    const epicBefore = await getIssue(client, cloudId, EPIC_KEY);
    const issueBefore = await getIssue(client, cloudId, ISSUE_KEY);
    const issueTransitions = await getTransitions(client, cloudId, ISSUE_KEY);
    const reviewTransition = selectReviewTransition(issueTransitions);
    const issueAlreadyReview = isReviewStatus(issueBefore.status, issueBefore.statusCategory);

    if (!issueAlreadyReview && !reviewTransition) {
      throw new Error(
        `No review transition available for ${ISSUE_KEY}. Available transitions: ${issueTransitions
          .map((transition) => `${transition.name} (${transition.id})`)
          .join(', ')}`
      );
    }

    const epicComment = readComment(
      'evidence/initiatives/INIT-SST-0003/jira-sst-29-ards-sdd-sync-comment.md'
    );
    const issueComment = readComment('evidence/requests/CR-SST-0098/jira-sst-30-review-comment.md');

    const epicCommentResult = await addComment(client, cloudId, EPIC_KEY, epicComment);
    let transitionResult = null;
    if (!issueAlreadyReview) {
      transitionResult = await transitionIssue(client, cloudId, ISSUE_KEY, reviewTransition);
    }
    const issueCommentResult = await addComment(client, cloudId, ISSUE_KEY, issueComment);

    const epicAfter = await getIssue(client, cloudId, EPIC_KEY);
    const issueAfter = await getIssue(client, cloudId, ISSUE_KEY);

    const summary = {
      requestId: 'CR-SST-0098',
      initiativeId: 'INIT-SST-0003',
      epicKey: EPIC_KEY,
      issueKey: ISSUE_KEY,
      mode: 'approved-write',
      externalWrite: true,
      epic: {
        before: epicBefore,
        after: epicAfter,
        commentResult: sanitizeJson(epicCommentResult),
      },
      issue: {
        before: issueBefore,
        after: issueAfter,
        transitions: issueTransitions,
        selectedTransition: reviewTransition,
        alreadyReview: issueAlreadyReview,
        transitionResult: transitionResult ? sanitizeJson(transitionResult) : null,
        commentResult: sanitizeJson(issueCommentResult),
      },
    };
    const output = writeEvidence(summary);

    console.log(`OK: Epic: ${EPIC_KEY} (${epicBefore.status} -> ${epicAfter.status})`);
    console.log(`OK: Issue: ${ISSUE_KEY} (${issueBefore.status} -> ${issueAfter.status})`);
    console.log(`OK: Evidence written: ${rel(output)}`);
  } finally {
    client.close();
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
  const fields = data && typeof data === 'object' && data.fields ? data.fields : {};
  return {
    summary: fields.summary || firstMarkdownValue(text, 'Summary') || firstJsonLikeValue(text, 'summary') || 'no-detectado',
    status: fields.status?.name || firstMarkdownValue(text, 'Status') || firstJsonLikeValue(text, 'name') || 'no-detectado',
    statusCategory: fields.status?.statusCategory?.name || statusCategoryValue(text) || 'no-detectado',
    resolution: fields.resolution?.name || firstMarkdownValue(text, 'Resolution') || 'no-detectado',
    assignee: fields.assignee?.displayName || firstMarkdownValue(text, 'Assignee') || 'no-asignado',
    updated: fields.updated || firstMarkdownValue(text, 'Updated') || 'no-detectado',
    labels: Array.isArray(fields.labels) ? fields.labels.map(String) : extractLabels(text),
  };
}

async function getTransitions(client, cloudId, issueKey) {
  const result = await client.callTool('getTransitionsForJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
  });
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

async function addComment(client, cloudId, issueKey, commentBody) {
  const result = await client.callTool('addCommentToJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    commentBody,
    contentFormat: 'markdown',
    responseContentFormat: 'markdown',
  });
  return parseToolData(result);
}

function selectReviewTransition(transitions) {
  return (
    transitions.find((item) => item.id === '31') ||
    transitions.find((item) => /review|revisi/.test(normalize(`${item.name} ${item.toStatus} ${item.toStatusCategory}`))) ||
    null
  );
}

function isReviewStatus(status, statusCategory) {
  return /review|revisi/.test(normalize(`${status} ${statusCategory}`));
}

function readComment(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function writeEvidence(summary) {
  const jsonOutput = path.join(OUTPUT_DIR, 'jira-ards-sdd-sync-review-result.json');
  const output = path.join(OUTPUT_DIR, 'jira-ards-sdd-sync-review-summary.md');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(sanitizeJson(summary), null, 2), 'utf8');

  const lines = [
    '# CR-SST-0098 Jira ARDS/SDD Sync Review',
    '',
    '## Estado',
    '',
    `- Fecha: ${today()}`,
    '- Initiative: `INIT-SST-0003`',
    '- Request: `CR-SST-0098`',
    '- Escritura Jira: si, limitada a Epic comment + ticket review transition/comment',
    '',
    '## Resultado',
    '',
    `- Epic: ${EPIC_KEY}`,
    `- Epic status previo: ${sanitize(summary.epic.before.status)}`,
    `- Epic status posterior: ${sanitize(summary.epic.after.status)}`,
    '- Epic comentario agregado: si',
    `- Ticket: ${ISSUE_KEY}`,
    `- Ticket status previo: ${sanitize(summary.issue.before.status)}`,
    `- Ticket status posterior: ${sanitize(summary.issue.after.status)}`,
    `- Ticket transicion seleccionada: ${
      summary.issue.selectedTransition
        ? `${sanitize(summary.issue.selectedTransition.name)} (${sanitize(summary.issue.selectedTransition.id)})`
        : 'ninguna; ya estaba en revision'
    }`,
    '- Ticket comentario agregado: si',
    '',
    '## Evidencia',
    '',
    `- Resultado JSON sanitizado: \`${rel(jsonOutput)}\``,
  ];
  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
  return output;
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

function extractLabels(text) {
  const match = text.match(/"labels"\s*:\s*\[([^\]]*)\]/i);
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]);
}

function sanitizeJson(value) {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return sanitize(value);
  if (Array.isArray(value)) return value.map((item) => sanitizeJson(item));
  if (typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeJson(item)]));
  return value;
}

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
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
