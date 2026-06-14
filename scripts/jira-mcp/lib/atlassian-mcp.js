const { loadConfig } = require('./config');
const { McpStdioClient } = require('./mcp-stdio-client');

function buildClient(config) {
  const command = process.env.JIRA_MCP_COMMAND || defaultNpxCommand();
  const args = process.env.JIRA_MCP_ARGS
    ? splitArgs(process.env.JIRA_MCP_ARGS)
    : ['--yes', 'mcp-remote@latest', config.server.url];

  return new McpStdioClient({
    command,
    args,
    timeoutMs: Number(process.env.JIRA_MCP_TIMEOUT_MS || 120000),
  });
}

async function connectAtlassian() {
  const config = loadConfig();
  const client = buildClient(config);
  await client.connect();
  const tools = await client.listTools();
  return { config, client, tools };
}

async function resolveCloudId(client) {
  const result = await client.callTool('getAccessibleAtlassianResources', {});
  const data = parseToolData(result);
  const resources = normalizeResources(data);
  if (resources.length === 0) {
    throw new Error('No se pudo resolver ningun recurso Atlassian accesible con cloudId.');
  }
  return resources[0].cloudId;
}

function parseToolData(result) {
  const content = result && Array.isArray(result.content) ? result.content : [];
  const values = [];

  for (const item of content) {
    if (item.type !== 'text' || !item.text) continue;
    const text = item.text.trim();
    const parsed = tryParseJson(text);
    values.push(parsed === null ? text : parsed);
  }

  if (values.length === 1) return values[0];
  if (values.length > 1) return values;
  return result || {};
}

function normalizeResources(data) {
  const list = Array.isArray(data) ? data : data && Array.isArray(data.resources) ? data.resources : [];
  return list
    .map((item) => ({
      cloudId: item.id || item.cloudId || item.cloudid || item.resourceId || item.url,
    }))
    .filter((item) => item.cloudId);
}

function extractIssueKeys(value, projectKey) {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  const regex = new RegExp(`\\b${escapeRegExp(projectKey)}-\\d+\\b`, 'g');
  return [...new Set(text.match(regex) || [])];
}

function sanitize(value) {
  return String(value)
    .replace(/https:\/\/[^/\s"']+\.atlassian\.net[^\s)"']*/g, '[jira-site-redacted]')
    .replace(/[A-Za-z0-9.-]+\.atlassian\.net/g, '[jira-site-redacted]')
    .replace(/https:\/\/secure\.gravatar\.com\/avatar\/[^"\s]+/g, '[avatar-url-redacted]')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email-redacted]')
    .replace(/"accountId"\s*:\s*"[^"]+"/g, '"accountId": "[accountId-redacted]"')
    .replace(/accountId=[^&"\s]+/g, 'accountId=[accountId-redacted]')
    .replace(/\b[0-9]{4,}:\[cloudId-redacted\]/g, '[accountId-redacted]')
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '[cloudId-redacted]')
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, 'Bearer [redacted]')
    .replace(/token[=:]\s*[A-Za-z0-9._-]+/gi, 'token=[redacted]');
}

function requireConnectFlag() {
  if (!process.argv.includes('--connect')) {
    throw new Error('Este comando requiere --connect para usar Atlassian MCP.');
  }
}

function requireApprovedFlag() {
  if (!process.argv.includes('--approved')) {
    throw new Error('Este comando requiere --approved para escribir en Jira.');
  }
}

function splitArgs(value) {
  return value.match(/(?:[^\s"]+|"[^"]*")+/g).map((item) => item.replace(/^"|"$/g, ''));
}

function defaultNpxCommand() {
  return process.platform === 'win32' ? 'npx.cmd' : 'npx';
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    return null;
  }
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  connectAtlassian,
  extractIssueKeys,
  parseToolData,
  requireApprovedFlag,
  requireConnectFlag,
  resolveCloudId,
  sanitize,
};
