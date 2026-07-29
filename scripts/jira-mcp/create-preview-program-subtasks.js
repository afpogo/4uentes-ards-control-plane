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
const PROJECT = 'SST';
const INITIATIVE = 'INIT-SST-0003';
const PARENT = 'SST-50';
const OUTPUT_DIR = path.join(ROOT, 'evidence', 'requests', 'CR-SST-0120');

const ITEMS = [
  {
    cr: 'CR-SST-0137',
    summary: '[SST][INIT-SST-0003][CR-SST-0137] Add canonical article preview resolution in sst-bend',
    owner: 'sst-bend',
    purpose: 'Own ArticlePreviewResolution v1, strategy resolution, DB-first persistence and authenticated preview bytes.',
    dependsOn: [],
  },
  {
    cr: 'CR-SST-0138',
    summary: '[SST][INIT-SST-0003][CR-SST-0138] Adopt article preview contract passthrough in node-auth',
    owner: 'node-auth',
    purpose: 'Adopt the backend capability and preserve preview fields without persisting preview domain state.',
    dependsOn: ['CR-SST-0137'],
  },
  {
    cr: 'CR-SST-0139',
    summary: '[SST][INIT-SST-0003][CR-SST-0139] Produce consented private preview candidates in sst-extension',
    owner: 'sst-extension',
    purpose: 'Produce bounded optional browser-session preview candidates with explicit consent off by default.',
    dependsOn: ['CR-SST-0137', 'CR-SST-0138', 'CR-SST-0101', 'CR-SST-0121'],
  },
  {
    cr: 'CR-SST-0140',
    summary: '[SST][INIT-SST-0003][CR-SST-0140] Complete article preview contract adoption in sst-fend',
    owner: 'sst-fend',
    purpose: 'Consume deployed preview fields, preserve legacy fallback and reconcile per-tab deploy previews.',
    dependsOn: ['CR-SST-0137', 'CR-SST-0138', 'CR-SST-0139'],
  },
];

async function main() {
  requireConnectFlag();
  requireApprovedFlag();
  const { client } = await connectAtlassian();
  try {
    const cloudId = await resolveCloudId(client);
    const results = [];
    for (const item of ITEMS) {
      const existing = await findExisting(client, cloudId, item);
      const issue = existing || (await createSubtask(client, cloudId, item));
      results.push({ cr: item.cr, existing: Boolean(existing), issue });
      console.log(`OK: ${item.cr} -> ${issue.key} (${existing ? 'existing' : 'created'})`);
    }
    writeEvidence(results);
  } finally {
    client.close();
  }
}

async function findExisting(client, cloudId, item) {
  const result = await client.callTool('searchJiraIssuesUsingJql', {
    cloudId,
    jql: `project = ${PROJECT} AND summary ~ "${item.cr}" ORDER BY created DESC`,
    fields: ['summary', 'status', 'parent', 'issuetype', 'labels'],
    maxResults: 10,
  });
  const data = parseToolData(result);
  const issues = data && Array.isArray(data.issues) ? data.issues : [];
  const match = issues.find((issue) => issue.key && String(issue.fields?.summary || '').includes(item.cr));
  if (!match) return null;
  const parentKey = match.fields?.parent?.key || null;
  if (parentKey !== PARENT) throw new Error(`${item.cr} already exists as ${match.key} under unexpected parent ${parentKey || 'none'}`);
  return summarize(match, 'existing-search');
}

async function createSubtask(client, cloudId, item) {
  const result = await client.callTool('createJiraIssue', {
    cloudId,
    projectKey: PROJECT,
    issueTypeName: 'Subtask',
    parent: PARENT,
    summary: item.summary,
    description: renderDescription(item),
    additional_fields: { labels: ['ards-sdd', 'control-plane', 'init-sst-0003', item.cr.toLowerCase(), 'preview-image', item.owner] },
    contentFormat: 'markdown',
    responseContentFormat: 'markdown',
  });
  const data = parseToolData(result);
  const keys = extractIssueKeys(data, PROJECT);
  if (!keys.length) throw new Error(`No issue key returned for ${item.cr}: ${sanitize(JSON.stringify(data))}`);
  return { key: keys[0], summary: item.summary, parentKey: PARENT, issueType: 'Subtask', source: 'created' };
}

function summarize(issue, source) {
  return {
    key: issue.key,
    summary: issue.fields?.summary || '',
    parentKey: issue.fields?.parent?.key || null,
    issueType: issue.fields?.issuetype?.name || null,
    status: issue.fields?.status?.name || null,
    source,
  };
}

function renderDescription(item) {
  return [
    `CR: ${item.cr}`,
    `Initiative: ${INITIATIVE}`,
    `Parent program: ${PARENT} / CR-SST-0120`,
    `Owner repository: ${item.owner}`,
    `Dependencies: ${item.dependsOn.join(', ') || 'none'}`,
    '',
    item.purpose,
    '',
    'Owner documentation and validation:',
    '* Update owner ARDS/SDD specs/docs in the mutated repository or record an approved exception.',
    '* Run the complete child-repository check.',
    '* Run `npm.cmd run check` in the control-plane before closure.',
    '',
    'Boundary:',
    '* Jira is a mirror; the control-plane remains source of truth.',
    '* Do not include private URLs, page content, cookies, JWTs, PDFs, thumbnails, secrets, or user data in Jira/evidence.',
  ].join('\n');
}

function writeEvidence(results) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const json = path.join(OUTPUT_DIR, 'jira-preview-subtasks-create-result.json');
  const md = path.join(OUTPUT_DIR, 'jira-preview-subtasks-create-summary.md');
  fs.writeFileSync(json, JSON.stringify({ initiativeId: INITIATIVE, parentIssueKey: PARENT, results, externalWrite: true }, null, 2), 'utf8');
  fs.writeFileSync(md, ['# Jira Preview Program Subtasks', '', `- Parent: \`${PARENT}\``, '- Jira is a mirror; control-plane is source of truth.', '', ...results.map((r) => `- \`${r.cr}\` -> \`${r.issue.key}\` (${r.existing ? 'existing' : 'created'}), parent \`${r.issue.parentKey}\``), '', `Resultado sanitizado: \`${rel(json)}\``, ''].join('\n'), 'utf8');
  console.log(`OK: Evidence written: ${rel(md)}`);
}

function rel(file) { return path.relative(ROOT, file).replace(/\\/g, '/'); }

main().catch((error) => { console.error(`FAIL: ${sanitize(error.message || String(error))}`); process.exit(1); });
