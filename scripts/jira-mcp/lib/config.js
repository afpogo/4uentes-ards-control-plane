const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const LOCAL_CONFIG = path.join(ROOT, 'environments', 'local', 'jira-mcp.local.yaml');
const EXAMPLE_CONFIG = path.join(ROOT, 'environments', 'local', 'jira-mcp.local.example.yaml');

const DEFAULT_CONFIG = {
  server: {
    url: 'https://mcp.atlassian.com/v1/mcp/authv2',
  },
  jira: {
    boardName: 'SST-Team',
    projectKey: 'SST',
    issueType: 'Tarea',
  },
  confluence: {
    spaceKey: 'SST',
  },
  auth: {
    method: 'oauth',
    tokenStorage: 'external',
  },
  evidence: {
    requestId: 'CR-SST-0029',
    outputDir: 'evidence/requests/CR-SST-0029',
  },
  source: 'defaults',
};

function loadConfig() {
  const sourcePath = fs.existsSync(LOCAL_CONFIG) ? LOCAL_CONFIG : EXAMPLE_CONFIG;
  if (!fs.existsSync(sourcePath)) return { ...DEFAULT_CONFIG };

  const text = fs.readFileSync(sourcePath, 'utf8');
  return {
    server: {
      url: nested(text, 'server', 'url') || DEFAULT_CONFIG.server.url,
    },
    jira: {
      boardName: nested(text, 'jira', 'board_name') || DEFAULT_CONFIG.jira.boardName,
      projectKey: nested(text, 'jira', 'project_key') || DEFAULT_CONFIG.jira.projectKey,
      issueType: nested(text, 'jira', 'issue_type') || DEFAULT_CONFIG.jira.issueType,
    },
    confluence: {
      spaceKey: nested(text, 'confluence', 'space_key') || DEFAULT_CONFIG.confluence.spaceKey,
    },
    auth: {
      method: nested(text, 'auth', 'method') || DEFAULT_CONFIG.auth.method,
      tokenStorage: nested(text, 'auth', 'token_storage') || DEFAULT_CONFIG.auth.tokenStorage,
    },
    evidence: {
      requestId: nested(text, 'evidence', 'request_id') || DEFAULT_CONFIG.evidence.requestId,
      outputDir: nested(text, 'evidence', 'output_dir') || DEFAULT_CONFIG.evidence.outputDir,
    },
    source: path.relative(ROOT, sourcePath).replace(/\\/g, '/'),
  };
}

function nested(text, section, key) {
  const lines = text.split(/\r?\n/);
  let inSection = false;

  for (const line of lines) {
    if (line.startsWith(`${section}:`)) {
      inSection = true;
      continue;
    }
    if (inSection && /^[A-Za-z0-9_-]+:/.test(line)) break;
    if (!inSection) continue;

    const match = line.match(new RegExp(`^\\s{2}${key}:\\s*(.+)\\s*$`));
    if (match) return strip(match[1]);
  }

  return null;
}

function strip(value) {
  return value.replace(/^['"]|['"]$/g, '').trim();
}

module.exports = {
  loadConfig,
};
