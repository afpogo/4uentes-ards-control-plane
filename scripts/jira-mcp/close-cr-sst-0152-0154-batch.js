const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  connectAtlassian,
  extractIssueKeys,
  parseToolData,
  requireConnectFlag,
  resolveCloudId,
  sanitize,
} = require('./lib/atlassian-mcp');

const ROOT = process.cwd();
const PROJECT_KEY = 'SST';
const REQUEST_ID = 'CR-SST-0152';
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'requests', REQUEST_ID);
const AUTHORIZATION_PATH = path.join(OUTPUT_DIR, 'jira-frontend-closure-authorization.json');
const HASHES_PATH = path.join(OUTPUT_DIR, 'jira-frontend-closure-comment-hashes.json');
const DOCTOR_PATH = path.join(OUTPUT_DIR, 'jira-frontend-closure-doctor.json');
const PLAN_PATH = path.join(OUTPUT_DIR, 'jira-frontend-closure-correction-plan-preview.json');
const POLICY_PATH = path.join(OUTPUT_DIR, 'jira-frontend-closure-policy-check.json');
const RESULT_PATH = path.join(OUTPUT_DIR, 'jira-frontend-closure-result.json');
const SUMMARY_PATH = path.join(OUTPUT_DIR, 'jira-frontend-closure-summary.md');

const SPECS = [
  {
    id: 'INIT-SST-0004',
    summary: '[SST][INIT-SST-0004] SST Infrastructure Production Readiness',
    kind: 'epic',
    issueType: 'Epic',
    parentRef: null,
    labels: ['ards-sdd', 'control-plane', 'init-sst-0004', 'infrastructure-production-readiness'],
  },
  {
    id: 'CR-SST-0152',
    summary: '[SST][CR-SST-0152] Govern minimal SST development release train',
    kind: 'task',
    issueType: 'Tarea',
    parentRef: 'INIT-SST-0004',
    labels: ['ards-sdd', 'control-plane', 'init-sst-0004', 'cr-sst-0152', 'sst-fend', 'release-train'],
    commentPath: path.join(OUTPUT_DIR, 'jira-cr-sst-0152-closure-comment.md'),
  },
  {
    id: 'CR-SST-0153',
    summary: '[SST][CR-SST-0153] Separate learning preview from accepted context',
    kind: 'subtask',
    issueType: 'Subtask',
    parentRef: 'SST-6',
    labels: ['ards-sdd', 'control-plane', 'init-sst-0001', 'cr-sst-0153', 'sst-fend', 'learning-content-tags'],
    commentPath: path.join(OUTPUT_DIR, 'jira-cr-sst-0153-closure-comment.md'),
  },
  {
    id: 'CR-SST-0154',
    summary: '[SST][CR-SST-0154] Classify learning source presentation types',
    kind: 'subtask',
    issueType: 'Subtask',
    parentRef: 'SST-6',
    labels: ['ards-sdd', 'control-plane', 'init-sst-0001', 'cr-sst-0154', 'sst-fend', 'learning-content-tags'],
    commentPath: path.join(OUTPUT_DIR, 'jira-cr-sst-0154-closure-comment.md'),
  },
];

const TOOL_NAMES = [
  'getAccessibleAtlassianResources',
  'getJiraProjectIssueTypesMetadata',
  'searchJiraIssuesUsingJql',
  'getJiraIssue',
  'createJiraIssue',
  'getTransitionsForJiraIssue',
  'addCommentToJiraIssue',
  'transitionJiraIssue',
];

async function main() {
  if (process.argv.includes('--self-test')) {
    runSelfTest();
    return;
  }

  requireConnectFlag();
  const preflightOnly = process.argv.includes('--preflight-only');
  const approved = process.argv.includes('--approved');
  if (preflightOnly === approved) throw new Error('Use exactamente uno de --preflight-only o --approved.');

  const governance = loadGovernance({ requirePristine: true });
  const { client, tools } = await connectAtlassian();
  const execution = {
    status: 'started',
    phase: 'local-gates-passed',
    externalWrite: false,
    operations: [],
    issues: {},
    error: null,
  };

  try {
    requireTools(tools);
    const cloudId = await resolveCloudId(client);
    const preflight = await readPreflight(client, cloudId);
    validatePreflight(preflight);
    writeDoctor(preflight);
    execution.phase = 'live-preflight-passed';

    if (preflightOnly) {
      writeResult({ ...execution, status: 'preflight-pass', preflight });
      console.log('OK: Jira frontend closure preflight PASS; no external writes executed.');
      return;
    }

    markAuthorizationInProgress();
    execution.externalWrite = true;
    execution.phase = 'writes-in-progress';

    const issueTypeNames = preflight.issueTypeNames;
    for (const spec of SPECS) {
      assertAuthorizationCurrent();
      const parentKey = resolveParentKey(spec, execution.issues);
      const issueTypeName = spec.kind === 'subtask' ? selectSubtaskType(issueTypeNames) : spec.issueType;
      const issue = await createWithReconciliation(client, cloudId, spec, parentKey, issueTypeName);
      validateCreatedIssue(issue, spec, parentKey);
      execution.issues[spec.id] = issue;
      execution.operations.push({ sequence: execution.operations.length + 1, tool: 'createJiraIssue', candidateId: spec.id, issueKey: issue.key, reconciled: issue.reconciled === true });
      console.log(`OK: ${spec.id} -> ${issue.key} created and verified.`);
    }

    for (const spec of SPECS.filter((item) => item.commentPath)) {
      const issueKey = execution.issues[spec.id].key;
      const commentBody = readRequired(spec.commentPath);
      assertAuthorizationCurrent();
      const commentReconciled = await addCommentWithReconciliation(client, cloudId, spec, issueKey, commentBody);
      execution.operations.push({ sequence: execution.operations.length + 1, tool: 'addCommentToJiraIssue', candidateId: spec.id, issueKey, reconciled: commentReconciled });

      const transitions = await readTransitions(client, cloudId, issueKey);
      const terminal = selectTerminalTransition(transitions);
      if (!terminal) throw new Error(`No se observo una transicion directa a Listo para ${issueKey}.`);
      assertAuthorizationCurrent();
      const transitionReconciled = await transitionWithReconciliation(client, cloudId, spec, issueKey, terminal);
      execution.operations.push({ sequence: execution.operations.length + 1, tool: 'transitionJiraIssue', candidateId: spec.id, issueKey, transitionId: terminal.id, targetStatus: terminal.toStatus, reconciled: transitionReconciled });
      console.log(`OK: ${spec.id} -> ${issueKey} commented and transitioned to ${terminal.toStatus}.`);
    }

    execution.phase = 'final-readback';
    for (const spec of SPECS) {
      const issueKey = execution.issues[spec.id].key;
      const issue = await readIssue(client, cloudId, issueKey, true);
      validateFinalIssue(issue, spec, resolveParentKey(spec, execution.issues));
      execution.issues[spec.id] = issue;
    }
    const sst74 = await readIssue(client, cloudId, 'SST-74', false);
    assertTerminal(sst74, 'SST-74');
    execution.sst74 = sst74;
    execution.phase = 'complete';
    execution.status = 'complete';
    consumeAuthorization(execution);
    writeResult(execution);
    console.log('OK: Authorized Jira batch completed: 4 creates, 3 comments, 3 terminal transitions.');
    console.log(`OK: Evidence written: ${rel(SUMMARY_PATH)}`);
  } catch (error) {
    execution.status = execution.externalWrite ? 'partial-failure' : 'blocked-before-write';
    execution.error = sanitize(error.stack || error.message || String(error));
    if (execution.externalWrite) consumeAuthorizationPartial(execution);
    writeResult(execution);
    throw error;
  } finally {
    client.close();
  }
}

function loadGovernance({ requirePristine, allowConsumed = false }) {
  const authorization = readJson(AUTHORIZATION_PATH);
  const hashes = readJson(HASHES_PATH);
  const doctor = readJson(DOCTOR_PATH);
  const plan = readJson(PLAN_PATH);
  const policy = readJson(POLICY_PATH);

  assertEqual(authorization.requestId, REQUEST_ID, 'authorization requestId');
  assertEqual(authorization.projectKey, PROJECT_KEY, 'authorization project');
  assertEqual(authorization.approvalStatus, 'approved', 'authorization status');
  assertEqual(authorization.approvalStatement, 'Autorizo el lote Jira enumerado', 'authorization statement');
  if (!allowConsumed && authorization.consumed !== false) throw new Error('La autorizacion ya fue consumida.');
  if (requirePristine && authorization.consumptionStatus) throw new Error('La autorizacion no esta en estado pristine.');
  const approvedAt = Date.parse(authorization.approvedAt || '');
  const expiresAt = Date.parse(authorization.expiresAt || '');
  if (!Number.isFinite(approvedAt) || !Number.isFinite(expiresAt) || approvedAt >= expiresAt || (!allowConsumed && Date.now() > expiresAt)) {
    throw new Error('La ventana de autorizacion es invalida o expiro.');
  }
  assertEqual(authorization.allowedWriteCount, 10, 'authorized write count');
  assertEqual(authorization.allowedWrites.length, 10, 'authorized writes length');
  assertEqual(plan.result, 'PASS', 'correction plan');
  assertEqual(plan.summary.blocked, 0, 'correction plan blocked');
  assertEqual(policy.result, 'PASS', 'policy check');
  assertEqual(policy.blocked, 0, 'policy blocked');
  assertEqual(doctor.localGateResult, 'PASS', 'doctor local gate');
  if (!['PENDING_LIVE_PREFLIGHT', 'PASS'].includes(doctor.result)) throw new Error('Doctor lifecycle invalido.');

  for (const spec of SPECS.filter((item) => item.commentPath)) {
    const body = readRequired(spec.commentPath);
    const expected = hashes.comments[spec.id];
    if (!expected) throw new Error(`Falta hash para ${spec.id}.`);
    assertEqual(expected.path, rel(spec.commentPath), `${spec.id} comment path`);
    assertEqual(expected.sha256, sha256(body), `${spec.id} comment hash`);
    const authorized = authorization.allowedWrites.find((item) => item.tool === 'addCommentToJiraIssue' && item.candidateId === spec.id);
    assertEqual(authorized && authorized.commentSha256, expected.sha256, `${spec.id} authorized hash`);
  }

  validateLocalLifecycle();
  return { authorization, hashes, doctor, plan, policy };
}

function validateLocalLifecycle() {
  const required = [
    ['requests/done/CR-SST-0152-sst-governed-development-release-train.yaml', 'status: "done"'],
    ['requests/done/CR-SST-0153-learning-preview-accepted-context-separation.yaml', 'status: "done"'],
    ['requests/done/CR-SST-0154-learning-source-presentation-classification.yaml', 'status: "done"'],
    ['initiatives/INIT-SST-0001-tags-governance-continuity.yaml', 'source_of_truth: false'],
    ['initiatives/INIT-SST-0004-infrastructure-production-readiness.yaml', 'source_of_truth: false'],
    ['evidence/requests/CR-SST-0152/closure-and-rollout-2026-08-10.md', 'b5742eb709d555dd5c9bbc5d58a6bfdd90c47b8b'],
  ];
  for (const [file, expected] of required) {
    const text = readRequired(path.join(ROOT, file));
    if (!text.includes(expected)) throw new Error(`Local lifecycle gate missing ${expected} in ${file}.`);
  }
}

async function readPreflight(client, cloudId) {
  const metadataResult = await callChecked(client, 'getJiraProjectIssueTypesMetadata', {
    cloudId,
    projectIdOrKey: PROJECT_KEY,
    maxResults: 200,
  });
  const issueTypeNames = collectIssueTypes(parseToolData(metadataResult));
  const duplicateSearches = [];
  for (const spec of SPECS) duplicateSearches.push(await searchIdentity(client, cloudId, spec));
  const sst6 = await readIssue(client, cloudId, 'SST-6', false);
  const sst27 = await readIssue(client, cloudId, 'SST-27', false);
  const sst74 = await readIssue(client, cloudId, 'SST-74', false);
  return { observedAt: new Date().toISOString(), issueTypeNames, duplicateSearches, sst6, sst27, sst74 };
}

function validatePreflight(preflight) {
  if (!preflight.issueTypeNames.includes('Epic')) throw new Error('Jira metadata no expone Epic.');
  if (!preflight.issueTypeNames.includes('Tarea')) throw new Error('Jira metadata no expone Tarea.');
  selectSubtaskType(preflight.issueTypeNames);
  for (const search of preflight.duplicateSearches) {
    if (search.matches.length > 0) throw new Error(`Duplicate identity detected for ${search.candidateId}: ${search.matches.map((item) => item.key).join(', ')}.`);
  }
  assertEqual(preflight.sst6.projectKey, PROJECT_KEY, 'SST-6 project');
  assertEqual(preflight.sst6.issueType, 'Tarea', 'SST-6 issue type');
  assertEqual(preflight.sst6.parentKey, 'SST-27', 'SST-6 parent');
  if (!preflight.sst6.summary.includes('Learning Content Tags') || !preflight.sst6.labels.includes('feature-state')) {
    throw new Error('SST-6 no coincide con el feature-state learning-content-tags esperado.');
  }
  assertEqual(preflight.sst27.issueType, 'Epic', 'SST-27 issue type');
  if (!preflight.sst27.summary.includes('INIT-SST-0001')) throw new Error('SST-27 no contiene INIT-SST-0001.');
  assertTerminal(preflight.sst74, 'SST-74');
}

async function searchIdentity(client, cloudId, spec) {
  const jql = `project = ${PROJECT_KEY} AND summary ~ "${spec.id}" ORDER BY created DESC`;
  const result = await callChecked(client, 'searchJiraIssuesUsingJql', {
    cloudId,
    jql,
    fields: ['project', 'summary', 'status', 'parent', 'issuetype', 'labels'],
    maxResults: 20,
  });
  const issues = collectIssueObjects(parseToolData(result)).map(normalizeIssue);
  const matches = issues.filter((issue) => issue.summary.includes(spec.id));
  return { candidateId: spec.id, jql, matches };
}

async function createWithReconciliation(client, cloudId, spec, parentKey, issueTypeName) {
  try {
    const result = await callChecked(client, 'createJiraIssue', {
      cloudId,
      projectKey: PROJECT_KEY,
      issueTypeName,
      ...(parentKey ? { parent: parentKey } : {}),
      summary: spec.summary,
      description: renderDescription(spec, parentKey),
      additional_fields: { labels: spec.labels },
      contentFormat: 'markdown',
      responseContentFormat: 'markdown',
    });
    const keys = extractIssueKeys(parseToolData(result), PROJECT_KEY);
    if (keys.length !== 1) throw new Error(`createJiraIssue no devolvio una key unica para ${spec.id}.`);
    return await readIssue(client, cloudId, keys[0], true);
  } catch (error) {
    const search = await searchIdentity(client, cloudId, spec);
    const compatible = search.matches.filter((issue) => issue.summary === spec.summary && issue.parentKey === parentKey);
    if (compatible.length === 1) return { ...compatible[0], reconciled: true };
    throw new Error(`Create partial failure for ${spec.id}; no compatible unique readback. ${sanitize(error.message)}`);
  }
}

async function addCommentWithReconciliation(client, cloudId, spec, issueKey, commentBody) {
  try {
    await callChecked(client, 'addCommentToJiraIssue', {
      cloudId,
      issueIdOrKey: issueKey,
      commentBody,
      contentFormat: 'markdown',
      responseContentFormat: 'markdown',
    });
  } catch (error) {
    const issue = await readIssue(client, cloudId, issueKey, true);
    if (countMatchingComments(issue.comments, commentBody) === 1) return true;
    throw new Error(`Comment partial failure for ${spec.id}; readback did not confirm the approved comment. ${sanitize(error.message)}`);
  }
  const issue = await readIssue(client, cloudId, issueKey, true);
  assertEqual(countMatchingComments(issue.comments, commentBody), 1, `${spec.id} approved comment count`);
  return false;
}

async function transitionWithReconciliation(client, cloudId, spec, issueKey, transition) {
  try {
    await callChecked(client, 'transitionJiraIssue', {
      cloudId,
      issueIdOrKey: issueKey,
      transition: { id: transition.id },
    });
  } catch (error) {
    const issue = await readIssue(client, cloudId, issueKey, true);
    if (isTerminal(issue)) return true;
    throw new Error(`Transition partial failure for ${spec.id}; readback did not confirm Listo. ${sanitize(error.message)}`);
  }
  const issue = await readIssue(client, cloudId, issueKey, true);
  assertTerminal(issue, spec.id);
  return false;
}

async function readIssue(client, cloudId, issueKey, includeComments) {
  const fields = ['project', 'summary', 'status', 'issuetype', 'parent', 'labels'];
  if (includeComments) fields.push('comment');
  const result = await callChecked(client, 'getJiraIssue', {
    cloudId,
    issueIdOrKey: issueKey,
    fields,
    responseContentFormat: 'markdown',
  });
  const objects = collectIssueObjects(parseToolData(result));
  if (objects.length === 0) throw new Error(`No structured readback for ${issueKey}.`);
  return normalizeIssue(objects[0], includeComments);
}

async function readTransitions(client, cloudId, issueKey) {
  const result = await callChecked(client, 'getTransitionsForJiraIssue', { cloudId, issueIdOrKey: issueKey });
  const data = parseToolData(result);
  const source = Array.isArray(data) ? data : data && Array.isArray(data.transitions) ? data.transitions : [];
  return source.map((item) => ({
    id: String(item.id || item.transitionId || ''),
    name: String(item.name || item.transitionName || ''),
    toStatus: String(item.to && (item.to.name || item.to.status) || item.toStatus || ''),
    toStatusCategory: String(item.to && item.to.statusCategory && (item.to.statusCategory.name || item.to.statusCategory.key) || item.toStatusCategory || ''),
  })).filter((item) => item.id);
}

function selectTerminalTransition(transitions) {
  return transitions.find((item) => normalize(item.name) === 'listo') ||
    transitions.find((item) => ['listo', 'done'].includes(normalize(item.toStatusCategory)) && /listo|done|close|complete|final/i.test(`${item.name} ${item.toStatus}`)) ||
    null;
}

function validateCreatedIssue(issue, spec, parentKey) {
  assertEqual(issue.projectKey, PROJECT_KEY, `${spec.id} project`);
  assertEqual(issue.summary, spec.summary, `${spec.id} summary`);
  assertEqual(issue.parentKey, parentKey, `${spec.id} parent`);
  if (spec.kind === 'epic') assertEqual(issue.issueType, 'Epic', `${spec.id} type`);
  if (spec.kind === 'task') assertEqual(issue.issueType, 'Tarea', `${spec.id} type`);
  if (spec.kind === 'subtask' && !isSubtaskType(issue.issueType)) throw new Error(`${spec.id} type mismatch: ${issue.issueType}.`);
}

function validateFinalIssue(issue, spec, parentKey) {
  validateCreatedIssue(issue, spec, parentKey);
  if (spec.kind === 'epic') return;
  assertTerminal(issue, spec.id);
  const commentBody = readRequired(spec.commentPath);
  assertEqual(countMatchingComments(issue.comments, commentBody), 1, `${spec.id} final approved comment count`);
}

function resolveParentKey(spec, issues) {
  if (!spec.parentRef) return null;
  if (spec.parentRef.startsWith('SST-')) return spec.parentRef;
  const parent = issues[spec.parentRef];
  if (!parent || !parent.key) throw new Error(`Parent ${spec.parentRef} is unresolved for ${spec.id}.`);
  return parent.key;
}

function renderDescription(spec, parentKey) {
  const sources = {
    'INIT-SST-0004': 'initiatives/INIT-SST-0004-infrastructure-production-readiness.yaml',
    'CR-SST-0152': 'requests/done/CR-SST-0152-sst-governed-development-release-train.yaml',
    'CR-SST-0153': 'requests/done/CR-SST-0153-learning-preview-accepted-context-separation.yaml',
    'CR-SST-0154': 'requests/done/CR-SST-0154-learning-source-presentation-classification.yaml',
  };
  return [
    `ARDS/SDD identity: ${spec.id}`,
    `Project: ${PROJECT_KEY}`,
    `Parent: ${parentKey || 'none (Epic)'}`,
    '',
    'Mirror boundary:',
    '',
    '* Jira is an operational mirror; the ARDS/SDD control-plane remains source of truth.',
    '* This issue does not authorize additional child-repository or cluster mutation.',
    '',
    'Control-plane source:',
    '',
    `* \`${sources[spec.id]}\``,
    '* `evidence/requests/CR-SST-0152/closure-and-rollout-2026-08-10.md`',
    '',
    'Data boundary:',
    '',
    '* Do not add secrets, private URLs, cloud IDs, account IDs, emails, tokens or user data.',
  ].join('\n');
}

function normalizeIssue(issue, includeComments = false) {
  const fields = issue.fields || {};
  const status = fields.status || {};
  const statusCategory = status.statusCategory || {};
  const comments = includeComments ? extractComments(fields.comment) : [];
  return {
    key: String(issue.key || ''),
    projectKey: String(fields.project && fields.project.key || String(issue.key || '').split('-')[0]),
    summary: String(fields.summary || ''),
    status: String(status.name || ''),
    statusCategory: String(statusCategory.name || statusCategory.key || ''),
    issueType: String(fields.issuetype && fields.issuetype.name || ''),
    parentKey: fields.parent ? String(fields.parent.key || '') : null,
    labels: Array.isArray(fields.labels) ? fields.labels.map(String) : [],
    comments,
  };
}

function extractComments(value) {
  if (!value) return [];
  const source = Array.isArray(value) ? value : Array.isArray(value.comments) ? value.comments : [];
  return source.map((item) => canonicalComment(extractCommentBody(item && item.body !== undefined ? item.body : item)));
}

function extractCommentBody(body) {
  if (typeof body === 'string') return body;
  if (!body || typeof body !== 'object') return '';
  if (body.type === 'doc' && Array.isArray(body.content)) return adfBlocks(body.content);
  return JSON.stringify(body);
}

function adfBlocks(blocks) {
  return blocks.map((block) => {
    if (block.type === 'paragraph') return inlineText(block.content || []);
    if (block.type === 'bulletList') return (block.content || []).map((item) => `- ${listItemText(item)}`).join('\n');
    if (block.type === 'orderedList') return (block.content || []).map((item, index) => `${index + 1}. ${listItemText(item)}`).join('\n');
    return inlineText(block.content || []);
  }).join('\n\n');
}

function listItemText(item) {
  return (item.content || []).map((block) => inlineText(block.content || [])).join('\n');
}

function inlineText(nodes) {
  return nodes.map((node) => {
    if (node.type === 'text') {
      const code = Array.isArray(node.marks) && node.marks.some((mark) => mark.type === 'code');
      return code ? `\`${node.text || ''}\`` : String(node.text || '');
    }
    if (node.type === 'hardBreak') return '\n';
    return inlineText(node.content || []);
  }).join('');
}

function countMatchingComments(comments, body) {
  const expected = canonicalComment(body);
  return comments.filter((comment) => canonicalComment(comment) === expected).length;
}

function canonicalComment(value) {
  return String(value).replace(/\r\n/g, '\n').replace(/^[*+] /gm, '- ').replace(/\n$/, '');
}

function collectIssueObjects(value, output = []) {
  if (!value || typeof value !== 'object') return output;
  if (!Array.isArray(value) && value.key && value.fields) output.push(value);
  if (Array.isArray(value)) value.forEach((item) => collectIssueObjects(item, output));
  else Object.values(value).forEach((item) => collectIssueObjects(item, output));
  return uniqueBy(output, (item) => String(item.key));
}

function collectIssueTypes(value, output = []) {
  if (!value || typeof value !== 'object') return output;
  if (!Array.isArray(value) && value.id && value.name) output.push(String(value.name));
  if (Array.isArray(value)) value.forEach((item) => collectIssueTypes(item, output));
  else Object.values(value).forEach((item) => collectIssueTypes(item, output));
  return [...new Set(output)];
}

function selectSubtaskType(names) {
  const match = ['Subtarea', 'Subtask', 'Sub-task'].find((name) => names.includes(name));
  if (!match) throw new Error('Jira metadata no expone un tipo Subtask/Subtarea.');
  return match;
}

function isSubtaskType(name) {
  return ['subtarea', 'subtask', 'sub-task'].includes(normalize(name));
}

function isTerminal(issue) {
  return ['listo', 'finalizada', 'done', 'closed'].includes(normalize(issue.status)) ||
    ['listo', 'done'].includes(normalize(issue.statusCategory));
}

function assertTerminal(issue, label) {
  if (!isTerminal(issue)) throw new Error(`${label} no esta terminal: ${issue.status} (${issue.statusCategory}).`);
}

function writeDoctor(preflight) {
  const doctor = readJson(DOCTOR_PATH);
  doctor.mode = 'live-preflight';
  doctor.result = 'PASS';
  doctor.lastPreflightAt = preflight.observedAt;
  doctor.observed = sanitizeJson({
    issueTypes: preflight.issueTypeNames,
    duplicateMatches: Object.fromEntries(preflight.duplicateSearches.map((item) => [item.candidateId, item.matches.map((issue) => issue.key)])),
    sst6: evidenceIssue(preflight.sst6),
    sst27: evidenceIssue(preflight.sst27),
    sst74: evidenceIssue(preflight.sst74),
  });
  fs.writeFileSync(DOCTOR_PATH, `${JSON.stringify(doctor, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'jira-frontend-closure-doctor.md'), renderDoctor(doctor), 'utf8');
}

function renderDoctor(doctor) {
  return [
    '# Doctor Jira Del Cierre Frontend',
    '',
    `- Request: \`${REQUEST_ID}\``,
    `- Resultado: \`${doctor.result}\``,
    `- Preflight: \`${doctor.lastPreflightAt}\``,
    '- Escritura externa: no',
    '- Identidades duplicadas: 0',
    '- Parent de CR-SST-0153/0154: `SST-6`, verificado bajo `SST-27 / INIT-SST-0001`.',
    '- `SST-74`: verificado terminal en modo read-only.',
    '- Writes permitidos por el lote: `4 create + 3 comment + 3 transition`.',
    '',
  ].join('\n');
}

function writeResult(execution) {
  const payload = sanitizeJson({
    requestId: REQUEST_ID,
    projectKey: PROJECT_KEY,
    status: execution.status,
    phase: execution.phase,
    externalWrite: execution.externalWrite,
    authorizedWriteCount: 10,
    observedWriteCount: execution.operations.length,
    operations: execution.operations,
    issues: Object.fromEntries(Object.entries(execution.issues || {}).map(([id, issue]) => [id, evidenceIssue(issue)])),
    sst74: evidenceIssue(execution.sst74),
    error: execution.error,
    generatedAt: new Date().toISOString(),
  });
  fs.writeFileSync(RESULT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(SUMMARY_PATH, renderSummary(payload), 'utf8');
}

function renderSummary(payload) {
  const lines = [
    '# Cierre Jira Del Lote Frontend',
    '',
    `- Request de autoridad: \`${REQUEST_ID}\``,
    `- Estado: \`${payload.status}\``,
    `- Fase: \`${payload.phase}\``,
    `- Escritura Jira: ${payload.externalWrite ? 'si' : 'no'}`,
    `- Writes observados: ${payload.observedWriteCount}/${payload.authorizedWriteCount}`,
    '- Jira es mirror operativo; ARDS/SDD permanece como source of truth.',
    '',
    '## Mirrors',
    '',
  ];
  for (const spec of SPECS) {
    const issue = payload.issues[spec.id];
    lines.push(`- \`${spec.id}\` -> ${issue ? `\`${issue.key}\`, ${issue.issueType}, parent ${issue.parentKey || 'ninguno'}, status ${issue.status}` : 'no creado/verificado'}`);
  }
  lines.push('', '## Verificacion Read-only', '', `- \`SST-74\`: ${payload.sst74 ? `${payload.sst74.status} (${payload.sst74.statusCategory})` : 'no observado'}`, '', '## Evidencia', '', `- Resultado JSON sanitizado: \`${rel(RESULT_PATH)}\``, `- Autorizacion consumible: \`${rel(AUTHORIZATION_PATH)}\``, `- Doctor: \`${rel(DOCTOR_PATH)}\``);
  if (payload.error) lines.push('', '## Error Sanitizado', '', `- ${payload.error}`);
  lines.push('');
  return lines.join('\n');
}

function markAuthorizationInProgress() {
  const authorization = readJson(AUTHORIZATION_PATH);
  if (authorization.consumed !== false || authorization.consumptionStatus) throw new Error('Authorization is not pristine.');
  authorization.consumptionStatus = 'in-progress';
  authorization.firstWriteAttemptAt = new Date().toISOString();
  fs.writeFileSync(AUTHORIZATION_PATH, `${JSON.stringify(authorization, null, 2)}\n`, 'utf8');
}

function assertAuthorizationCurrent() {
  const authorization = readJson(AUTHORIZATION_PATH);
  if (authorization.consumed !== false || authorization.consumptionStatus !== 'in-progress') throw new Error('Authorization is not active.');
  if (Date.now() > Date.parse(authorization.expiresAt)) throw new Error('Authorization expired during execution.');
}

function consumeAuthorization(execution) {
  const authorization = readJson(AUTHORIZATION_PATH);
  if (authorization.consumed !== false || authorization.consumptionStatus !== 'in-progress') throw new Error('Authorization changed before completion.');
  authorization.consumed = true;
  authorization.consumptionStatus = 'complete';
  authorization.consumedAt = new Date().toISOString();
  authorization.createdIssueKeys = Object.fromEntries(Object.entries(execution.issues).map(([id, issue]) => [id, issue.key]));
  authorization.resultRef = rel(RESULT_PATH);
  fs.writeFileSync(AUTHORIZATION_PATH, `${JSON.stringify(authorization, null, 2)}\n`, 'utf8');
}

function consumeAuthorizationPartial(execution) {
  const authorization = readJson(AUTHORIZATION_PATH);
  authorization.consumed = true;
  authorization.consumptionStatus = 'partial-failure';
  authorization.consumedAt = new Date().toISOString();
  authorization.completedWrites = execution.operations;
  authorization.retryRule = 'No retry is authorized. Reconcile by readback and obtain a new exact enumerated authorization.';
  authorization.resultRef = rel(RESULT_PATH);
  fs.writeFileSync(AUTHORIZATION_PATH, `${JSON.stringify(authorization, null, 2)}\n`, 'utf8');
}

function evidenceIssue(issue) {
  if (!issue) return null;
  return {
    key: issue.key,
    projectKey: issue.projectKey,
    summary: issue.summary,
    status: issue.status,
    statusCategory: issue.statusCategory,
    issueType: issue.issueType,
    parentKey: issue.parentKey,
    labels: issue.labels,
    commentCount: Array.isArray(issue.comments) ? issue.comments.length : 0,
    commentSha256: Array.isArray(issue.comments) ? issue.comments.map(sha256) : [],
  };
}

async function callChecked(client, toolName, args) {
  const result = await client.callTool(toolName, args);
  if (result && result.isError === true) {
    const data = parseToolData(result);
    throw new Error(`${toolName} returned an MCP error: ${sanitize(typeof data === 'string' ? data : JSON.stringify(data))}`);
  }
  return result;
}

function requireTools(tools) {
  const names = new Set((tools || []).map((tool) => tool.name));
  for (const name of TOOL_NAMES) if (!names.has(name)) throw new Error(`Required Jira MCP tool unavailable: ${name}.`);
}

function runSelfTest() {
  const governance = loadGovernance({ requirePristine: false, allowConsumed: true });
  assertEqual(governance.authorization.allowedWrites.filter((item) => item.tool === 'createJiraIssue').length, 4, 'self-test creates');
  assertEqual(governance.authorization.allowedWrites.filter((item) => item.tool === 'addCommentToJiraIssue').length, 3, 'self-test comments');
  assertEqual(governance.authorization.allowedWrites.filter((item) => item.tool === 'transitionJiraIssue').length, 3, 'self-test transitions');
  const transition = selectTerminalTransition([{ id: '41', name: 'Listo', toStatus: 'Listo', toStatusCategory: 'Done' }]);
  assertEqual(transition.id, '41', 'self-test terminal transition');
  console.log('OK: Local authorization, lifecycle, comment hashes and exact 10-write contract PASS.');
}

function readJson(file) { return JSON.parse(readRequired(file)); }
function readRequired(file) {
  if (!fs.existsSync(file)) throw new Error(`Required artifact missing: ${rel(file)}.`);
  return fs.readFileSync(file, 'utf8');
}
function sha256(value) { return crypto.createHash('sha256').update(value, 'utf8').digest('hex'); }
function normalize(value) { return String(value || '').trim().toLowerCase(); }
function rel(file) { return path.relative(ROOT, file).replace(/\\/g, '/'); }
function assertEqual(actual, expected, label) {
  if (actual !== expected) throw new Error(`${label} mismatch: expected ${JSON.stringify(expected)}, observed ${JSON.stringify(actual)}.`);
}
function uniqueBy(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function sanitizeJson(value, key = '') {
  if (value === null || value === undefined) return value;
  if (/accountid|cloudid|email|avatar|self|url/i.test(key)) return '[redacted]';
  if (typeof value === 'string') return sanitize(value);
  if (Array.isArray(value)) return value.map((item) => sanitizeJson(item));
  if (typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([entryKey, item]) => [entryKey, sanitizeJson(item, entryKey)]));
  return value;
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`FAIL: ${sanitize(error.stack || error.message || String(error))}`);
    process.exit(1);
  });
}
