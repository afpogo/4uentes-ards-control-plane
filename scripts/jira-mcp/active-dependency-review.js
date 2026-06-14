const fs = require('fs');
const path = require('path');
const {
  connectAtlassian,
  parseToolData,
  requireConnectFlag,
  resolveCloudId,
  sanitize,
} = require('./lib/atlassian-mcp');
const { applyEvidenceArgs, parseArgs, requireEvidenceArgs } = require('./lib/cli-args');

const ROOT = process.cwd();

async function main() {
  requireConnectFlag();
  const args = parseArgs(process.argv.slice(2), {
    valueOptions: ['request-id', 'output-dir', 'issue-key'],
  });
  requireEvidenceArgs(args);

  const targetIssueKey = String(args['issue-key'] || 'SST-12').trim().toUpperCase();
  if (!/^SST-\d+$/.test(targetIssueKey)) {
    throw new Error('El argumento --issue-key debe tener formato SST-*.');
  }

  const { config, client } = await connectAtlassian();
  const effectiveConfig = applyEvidenceArgs(config, args);

  try {
    const cloudId = await resolveCloudId(client);
    const activeIssues = await searchIssues(client, cloudId, effectiveConfig, {
      id: 'active-issues',
      jql: `project = ${effectiveConfig.jira.projectKey} AND statusCategory != Done ORDER BY key ASC`,
      maxResults: 100,
    });
    const linkedToTarget = await searchIssues(client, cloudId, effectiveConfig, {
      id: 'linked-to-target',
      jql: `project = ${effectiveConfig.jira.projectKey} AND issue in linkedIssues("${targetIssueKey}") ORDER BY key ASC`,
      maxResults: 50,
      tolerateErrors: true,
    });
    const mentionsTarget = await searchIssues(client, cloudId, effectiveConfig, {
      id: 'mentions-target',
      jql: `project = ${effectiveConfig.jira.projectKey} AND text ~ "${targetIssueKey}" ORDER BY key ASC`,
      maxResults: 50,
      tolerateErrors: true,
    });
    const targetIssue = await getIssue(client, cloudId, targetIssueKey, effectiveConfig);
    const targetRemoteLinks = await getRemoteLinks(client, cloudId, targetIssueKey);
    const targetTransitions = await getTransitions(client, cloudId, targetIssueKey);

    const review = buildReview({
      config: effectiveConfig,
      targetIssueKey,
      activeIssues,
      linkedToTarget,
      mentionsTarget,
      targetIssue,
      targetRemoteLinks,
      targetTransitions,
    });

    const output = writeEvidence(effectiveConfig, review);
    console.log(`OK: Active Jira issues observed: ${activeIssues.issueKeys.length}`);
    console.log(`OK: ${targetIssueKey} linked issues observed: ${linkedToTarget.issueKeys.length}`);
    console.log(`OK: ${targetIssueKey} textual mentions observed: ${mentionsTarget.issueKeys.length}`);
    console.log(`OK: Jira writes: 0`);
    console.log(`OK: Evidence written: ${rel(output.markdown)}`);
  } finally {
    client.close();
  }
}

async function searchIssues(client, cloudId, config, query) {
  try {
    const result = await client.callTool('searchJiraIssuesUsingJql', {
      cloudId,
      jql: query.jql,
      maxResults: query.maxResults,
      fields: ['summary', 'status', 'issuetype', 'updated', 'assignee', 'labels'],
      responseContentFormat: 'markdown',
    });
    const data = parseToolData(result);
    return {
      id: query.id,
      jql: query.jql,
      raw: sanitize(typeof data === 'string' ? data : JSON.stringify(data)),
      issueKeys: extractJiraIssueKeys(data, config.jira.projectKey),
      error: null,
    };
  } catch (error) {
    if (!query.tolerateErrors) throw error;
    return {
      id: query.id,
      jql: query.jql,
      raw: '',
      issueKeys: [],
      error: sanitize(error.message),
    };
  }
}

async function getIssue(client, cloudId, issueKey, config) {
  const result = await client.callTool('getJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    fields: [
      'summary',
      'status',
      'issuetype',
      'assignee',
      'updated',
      'labels',
      'parent',
      'subtasks',
      'issuelinks',
      'description',
    ],
    responseContentFormat: 'markdown',
  });
  const data = parseToolData(result);
  const raw = sanitize(typeof data === 'string' ? data : JSON.stringify(data));
  const fields = data && typeof data === 'object' && !Array.isArray(data) ? data.fields || {} : {};
  return {
    issueKey,
    raw,
    issueKeys: extractJiraIssueKeys(data, config.jira.projectKey),
    summary: firstMarkdownValue(raw, 'Summary') || firstJsonLikeValue(raw, 'summary') || 'no-detectado',
    status: fields.status && fields.status.name ? fields.status.name : firstMarkdownValue(raw, 'Status') || 'no-detectado',
    assignee: fields.assignee && fields.assignee.displayName ? fields.assignee.displayName : firstMarkdownValue(raw, 'Assignee') || firstJsonLikeValue(raw, 'displayName') || 'no-asignado',
    updated: fields.updated || firstMarkdownValue(raw, 'Updated') || firstJsonLikeValue(raw, 'updated') || 'no-detectado',
  };
}

async function getRemoteLinks(client, cloudId, issueKey) {
  try {
    const result = await client.callTool('getJiraIssueRemoteIssueLinks', {
      cloudId,
      issueIdOrKey: issueKey,
    });
    const data = parseToolData(result);
    return sanitize(typeof data === 'string' ? data : JSON.stringify(data));
  } catch (error) {
    return `ERROR: ${sanitize(error.message)}`;
  }
}

async function getTransitions(client, cloudId, issueKey) {
  try {
    const result = await client.callTool('getTransitionsForJiraIssue', {
      cloudId,
      issueIdOrKey: issueKey,
    });
    const data = parseToolData(result);
    const raw = sanitize(typeof data === 'string' ? data : JSON.stringify(data));
    return {
      raw,
      names: extractTransitionNames(data),
      error: null,
    };
  } catch (error) {
    return {
      raw: '',
      names: [],
      error: sanitize(error.message),
    };
  }
}

function buildReview({ config, targetIssueKey, activeIssues, linkedToTarget, mentionsTarget, targetIssue, targetRemoteLinks, targetTransitions }) {
  const targetMentionKeys = withoutKey(mentionsTarget.issueKeys, targetIssueKey);
  const directLinkedKeys = withoutKey(linkedToTarget.issueKeys, targetIssueKey);
  const rawTargetLinkedKeys = withoutKey(targetIssue.issueKeys, targetIssueKey);
  const activeRelatedKeys = unique([...directLinkedKeys, ...targetMentionKeys, ...rawTargetLinkedKeys])
    .filter((key) => activeIssues.issueKeys.includes(key));
  const selfDependencySignals = [
    ...linkedToTarget.issueKeys.filter((key) => key === targetIssueKey),
    ...rawTargetLinkedKeys.filter((key) => key === targetIssueKey),
  ];

  return {
    requestId: config.evidence.requestId,
    targetIssueKey,
    projectKey: config.jira.projectKey,
    activeIssues,
    linkedToTarget,
    mentionsTarget,
    targetIssue,
    targetRemoteLinks,
    targetTransitions,
    analysis: {
      activeIssueKeys: activeIssues.issueKeys,
      directLinkedKeys,
      textualMentionKeys: targetMentionKeys,
      targetRawRelatedKeys: rawTargetLinkedKeys,
      activeRelatedKeys,
      selfDependencyDetected: selfDependencySignals.length > 0,
      recommendation: recommend(targetIssue.status, activeRelatedKeys, targetTransitions.names),
    },
  };
}

function recommend(targetStatus, activeRelatedKeys, transitionNames) {
  const normalizedStatus = String(targetStatus || '').toLowerCase();
  if (/done|listo|cerrado|closed|resolved|complete/.test(normalizedStatus)) {
    return 'SST-12 already appears closed; keep local evidence and do not transition again.';
  }
  if (activeRelatedKeys.length > 0) {
    return 'Keep SST-12 open/in progress and comment CR-SST-0069 evidence; review active dependencies before closure.';
  }
  const closureTransition = transitionNames.find((name) => /done|listo|cerrad|finaliz|complete|resolve/i.test(name));
  if (closureTransition) {
    return `SST-12 can be moved through transition "${closureTransition}" after posting CR-SST-0069 evidence.`;
  }
  return 'SST-12 can be proposed for validation/closure if the Jira workflow has a suitable transition.';
}

function writeEvidence(config, review) {
  const output = path.join(ROOT, config.evidence.outputDir, 'jira-active-dependency-review-summary.md');
  const jsonOutput = path.join(ROOT, config.evidence.outputDir, 'jira-active-dependency-review-results.json');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(jsonOutput, JSON.stringify(review, null, 2), 'utf8');

  const lines = [];
  lines.push('# Jira Active Dependency Review');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${today()}`);
  lines.push(`- Request: ${config.evidence.requestId}`);
  lines.push(`- Issue objetivo: \`${review.targetIssueKey}\``);
  lines.push(`- Project key: \`${review.projectKey}\``);
  lines.push('- Modo: `mcp-read-only`');
  lines.push('- Escritura Jira: no');
  lines.push('');
  lines.push('## Consultas');
  lines.push('');
  for (const query of [review.activeIssues, review.linkedToTarget, review.mentionsTarget]) {
    lines.push(`### ${query.id}`);
    lines.push('');
    lines.push(`- JQL: \`${sanitize(query.jql)}\``);
    lines.push(`- Error: ${query.error ? `\`${query.error}\`` : 'ninguno'}`);
    lines.push(`- Issue keys: ${query.issueKeys.length ? query.issueKeys.map((key) => `\`${key}\``).join(', ') : 'ninguna'}`);
    lines.push('');
  }
  lines.push('## Issue Objetivo');
  lines.push('');
  lines.push(`- Summary: ${sanitize(review.targetIssue.summary)}`);
  lines.push(`- Status: ${sanitize(review.targetIssue.status)}`);
  lines.push(`- Assignee: ${sanitize(review.targetIssue.assignee)}`);
  lines.push(`- Updated: ${sanitize(review.targetIssue.updated)}`);
  lines.push(`- Keys detectadas en detalle: ${review.targetIssue.issueKeys.length ? review.targetIssue.issueKeys.map((key) => `\`${key}\``).join(', ') : 'ninguna'}`);
  lines.push(`- Transiciones disponibles: ${review.targetTransitions.names.length ? review.targetTransitions.names.map((name) => `\`${sanitize(name)}\``).join(', ') : 'ninguna detectada'}`);
  lines.push(`- Error leyendo transiciones: ${review.targetTransitions.error ? `\`${review.targetTransitions.error}\`` : 'ninguno'}`);
  lines.push('');
  lines.push('## Analisis');
  lines.push('');
  lines.push(`- Tickets SST activos/no Done: ${review.analysis.activeIssueKeys.length ? review.analysis.activeIssueKeys.map((key) => `\`${key}\``).join(', ') : 'ninguno'}`);
  lines.push(`- Dependencias directas observadas hacia ${review.targetIssueKey}: ${review.analysis.directLinkedKeys.length ? review.analysis.directLinkedKeys.map((key) => `\`${key}\``).join(', ') : 'ninguna'}`);
  lines.push(`- Menciones textuales a ${review.targetIssueKey}: ${review.analysis.textualMentionKeys.length ? review.analysis.textualMentionKeys.map((key) => `\`${key}\``).join(', ') : 'ninguna'}`);
  lines.push(`- Relacionados activos detectados: ${review.analysis.activeRelatedKeys.length ? review.analysis.activeRelatedKeys.map((key) => `\`${key}\``).join(', ') : 'ninguno'}`);
  lines.push(`- Auto-dependencia detectada: ${review.analysis.selfDependencyDetected ? 'si' : 'no'}`);
  lines.push('');
  lines.push('## Recomendacion');
  lines.push('');
  lines.push(review.analysis.recommendation);
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  lines.push('Esta evidencia no comenta, edita ni transiciona Jira. La decision de escritura debe ejecutarse en un paso write-gated con aprobacion humana explicita.');

  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
  return { markdown: output, json: jsonOutput };
}

function firstMarkdownValue(text, label) {
  const match = text.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`, 'i'));
  return match ? match[1].trim() : null;
}

function extractJiraIssueKeys(value, projectKey) {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  const regex = new RegExp(`(?<![A-Z0-9-])${escapeRegExp(projectKey)}-\\d+\\b`, 'g');
  return unique(text.match(regex) || []);
}

function firstJsonLikeValue(text, key) {
  const match = text.match(new RegExp(`"${key}"\\s*:\\s*(?:"([^"]+)"|\\{[^}]*"name"\\s*:\\s*"([^"]+)")`, 'i'));
  return match ? (match[1] || match[2] || '').trim() : null;
}

function extractTransitionNames(data) {
  const transitions = Array.isArray(data)
    ? data
    : data && Array.isArray(data.transitions)
      ? data.transitions
      : [];
  return transitions
    .map((item) => item && (item.name || item.to && item.to.name))
    .filter(Boolean);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function withoutKey(keys, excludedKey) {
  return unique(keys).filter((key) => key !== excludedKey);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort(compareIssueKeys);
}

function compareIssueKeys(left, right) {
  const leftNumber = Number(String(left).split('-')[1] || 0);
  const rightNumber = Number(String(right).split('-')[1] || 0);
  return leftNumber - rightNumber;
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
