const fs = require('fs');
const path = require('path');
const { loadConfig } = require('./lib/config');
const { McpStdioClient } = require('./lib/mcp-stdio-client');
const { applyEvidenceArgs, parseArgs, requireEvidenceArgs } = require('./lib/cli-args');

const ROOT = process.cwd();
const CONNECT_FLAG = '--connect';

async function main() {
  const config = loadConfig();
  const args = parseArgs(process.argv.slice(2), { valueOptions: ['request-id', 'output-dir'] });
  if (args['request-id'] || args['output-dir']) requireEvidenceArgs(args);
  const effectiveConfig = applyEvidenceArgs(config, args);
  const shouldConnect = process.argv.includes(CONNECT_FLAG);
  const verification = {
    requestId: effectiveConfig.evidence.requestId,
    date: today(),
    mode: shouldConnect ? 'connect' : 'preflight',
    configSource: effectiveConfig.source,
    serverUrl: effectiveConfig.server.url,
    boardName: effectiveConfig.jira.boardName,
    projectKey: effectiveConfig.jira.projectKey,
    issueType: effectiveConfig.jira.issueType,
    confluenceSpaceKey: effectiveConfig.confluence.spaceKey,
    writeOperations: false,
    status: 'BLOCKED',
    tools: [],
    resources: [],
    projectVisible: null,
    confluenceSpaceVisible: null,
    notes: [],
    errors: [],
  };

  if (!shouldConnect) {
    verification.status = 'PREFLIGHT_ONLY';
    verification.notes.push('No se uso --connect, por lo tanto no se contacto Atlassian MCP.');
    verification.notes.push('Este modo valida config local y escribe evidencia sin ejecutar red ni OAuth.');
    writeEvidence(effectiveConfig, verification);
    printSummary(effectiveConfig, verification);
    return;
  }

  const client = buildClient(effectiveConfig);
  try {
    await client.connect();
    const tools = await client.listTools();
    verification.tools = tools.map((tool) => ({
      name: tool.name,
      description: tool.description || '',
      inputSchema: tool.inputSchema || null,
    }));

    const resourcesTool = tools.find((tool) => tool.name === 'getAccessibleAtlassianResources');
    const projectTool = selectProjectTool(tools);
    const confluenceSpacesTool = tools.find((tool) => tool.name === 'getConfluenceSpaces');

    if (!resourcesTool) {
      verification.status = 'BLOCKED';
      verification.errors.push('Atlassian MCP respondio, pero no se encontro getAccessibleAtlassianResources.');
      return;
    }

    if (!projectTool && !confluenceSpacesTool) {
      verification.status = 'BLOCKED';
      verification.errors.push('Atlassian MCP respondio, pero no se encontraron tools read-only Jira/Confluence.');
      return;
    }

    const resourcesResult = await client.callTool(resourcesTool.name, {});
    const resourcesData = parseToolData(resourcesResult);
    verification.resources = normalizeResources(resourcesData);

    if (verification.resources.length === 0) {
      verification.status = 'BLOCKED';
      verification.errors.push('No se pudo resolver ningun recurso Atlassian accesible con cloudId.');
      return;
    }

    if (projectTool) {
      verification.notes.push(`Tool usada para proyectos Jira: ${projectTool.name}`);
      verification.projectVisible = false;
      for (const resource of verification.resources) {
        const result = await client.callTool(projectTool.name, { cloudId: resource.cloudId });
        const data = parseToolData(result);
        if (containsKey(data, effectiveConfig.jira.projectKey)) {
          verification.projectVisible = true;
          verification.notes.push(`Project key ${effectiveConfig.jira.projectKey} visible en recurso ${resource.safeName}.`);
          break;
        }
      }
    }

    if (confluenceSpacesTool) {
      verification.notes.push(`Tool usada para espacios Confluence: ${confluenceSpacesTool.name}`);
      verification.confluenceSpaceVisible = false;
      for (const resource of verification.resources) {
        const result = await client.callTool(confluenceSpacesTool.name, { cloudId: resource.cloudId });
        const data = parseToolData(result);
        if (containsKey(data, effectiveConfig.confluence.spaceKey)) {
          verification.confluenceSpaceVisible = true;
          verification.notes.push(`Space key ${effectiveConfig.confluence.spaceKey} visible en recurso ${resource.safeName}.`);
          break;
        }
      }
    }

    verification.status = statusFromVisibility(verification.projectVisible, verification.confluenceSpaceVisible);
  } catch (error) {
    verification.status = 'BLOCKED';
    verification.errors.push(error.message);
    if (client.stderr) verification.errors.push(`stderr: ${sanitize(client.stderr)}`);
  } finally {
    client.close();
    writeEvidence(effectiveConfig, verification);
    printSummary(effectiveConfig, verification);
  }

  if (verification.status === 'FAIL') process.exitCode = 1;
}

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

function defaultNpxCommand() {
  return process.platform === 'win32' ? 'npx.cmd' : 'npx';
}

function selectProjectTool(tools) {
  const exactNames = [
    'getVisibleJiraProjects',
    'getJiraProjects',
    'listJiraProjects',
  ];

  for (const name of exactNames) {
    const tool = tools.find((candidate) => candidate.name === name);
    if (tool) return tool;
  }

  return tools.find((tool) => {
    const haystack = `${tool.name} ${tool.description || ''}`.toLowerCase();
    return haystack.includes('jira') && haystack.includes('project') && !haystack.includes('create');
  });
}

function splitArgs(value) {
  return value.match(/(?:[^\s"]+|"[^"]*")+/g).map((item) => item.replace(/^"|"$/g, ''));
}

function writeEvidence(config, verification) {
  const outputDir = path.join(ROOT, config.evidence.outputDir);
  fs.mkdirSync(outputDir, { recursive: true });
  const fileName = verification.mode === 'preflight'
    ? 'jira-mcp-preflight.md'
    : 'jira-mcp-project-verification.md';
  fs.writeFileSync(
    path.join(outputDir, fileName),
    renderEvidence(verification),
    'utf8',
  );
}

function renderEvidence(verification) {
  const lines = [];
  lines.push('# Verificacion Read-Only Jira MCP');
  lines.push('');
  lines.push('## Estado');
  lines.push('');
  lines.push(`- Fecha: ${verification.date}`);
  lines.push(`- Request: ${verification.requestId}`);
  lines.push(`- Modo: ${verification.mode}`);
  lines.push(`- Resultado: ${verification.status}`);
  lines.push(`- Config source: \`${verification.configSource}\``);
  lines.push(`- Server URL: \`${verification.serverUrl}\``);
  lines.push(`- Jira board: \`${verification.boardName}\``);
  lines.push(`- Project key esperado: \`${verification.projectKey}\``);
  lines.push(`- Confluence space key esperado: \`${verification.confluenceSpaceKey}\``);
  lines.push(`- Issue type asumido: \`${verification.issueType}\``);
  lines.push(`- Operaciones de escritura: ${verification.writeOperations ? 'si' : 'no'}`);
  lines.push('');
  lines.push('## Recursos Atlassian Accesibles');
  lines.push('');
  if (verification.resources.length === 0) {
    lines.push('- ninguno');
  } else {
    for (const [index, resource] of verification.resources.entries()) {
      lines.push(`- \`recurso-atlassian-${index + 1}\` cloudId: \`${redactCloudId(resource.cloudId)}\``);
    }
  }
  lines.push('');
  lines.push('## Resultado De Proyecto');
  lines.push('');
  lines.push(`- Jira project key visible: ${formatNullableBoolean(verification.projectVisible)}`);
  lines.push(`- Confluence space key visible: ${formatNullableBoolean(verification.confluenceSpaceVisible)}`);
  lines.push('');
  lines.push('## Tools Descubiertas');
  lines.push('');
  if (verification.tools.length === 0) {
    lines.push('- ninguna');
  } else {
    for (const tool of verification.tools) {
      lines.push(`- \`${tool.name}\`: ${sanitize(tool.description || 'sin descripcion')}`);
    }
  }
  lines.push('');
  lines.push('## Notas');
  lines.push('');
  if (verification.notes.length === 0) lines.push('- ninguna');
  else verification.notes.forEach((note) => lines.push(`- ${sanitize(note)}`));
  lines.push('');
  lines.push('## Errores');
  lines.push('');
  if (verification.errors.length === 0) lines.push('- ninguno');
  else verification.errors.forEach((error) => lines.push(`- ${sanitize(error)}`));
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  lines.push('- No se crean Jira issues.');
  lines.push('- No se editan Jira issues.');
  lines.push('- No se comentan Jira issues.');
  lines.push('- No se transicionan Jira issues.');
  lines.push('- No se registran tokens, cookies ni secretos.');
  lines.push('');
  return `${lines.join('\n')}`;
}

function formatNullableBoolean(value) {
  if (value === true) return 'si';
  if (value === false) return 'no';
  return 'no verificado';
}

function sanitize(value) {
  return String(value)
    .replace(/https:\/\/[^/\s]+\.atlassian\.net[^\s)]*/g, '[jira-site-redacted]')
    .replace(/[A-Za-z0-9.-]+\.atlassian\.net/g, '[jira-site-redacted]')
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '[cloudId-redacted]')
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, 'Bearer [redacted]')
    .replace(/token[=:]\s*[A-Za-z0-9._-]+/gi, 'token=[redacted]');
}

function redactCloudId(value) {
  return value ? '[cloudId-redacted]' : 'no-disponible';
}

function statusFromVisibility(projectVisible, confluenceSpaceVisible) {
  if (projectVisible === true && confluenceSpaceVisible === true) return 'PASS';
  if (projectVisible === true || confluenceSpaceVisible === true) return 'PARTIAL_PASS';
  return 'FAIL';
}

function printSummary(config, verification) {
  console.log(`OK: Jira board: ${verification.boardName}`);
  console.log(`OK: Jira project key expected: ${verification.projectKey}`);
  console.log(`OK: Confluence space key expected: ${verification.confluenceSpaceKey}`);
  console.log(`OK: Mode: ${verification.mode}`);
  console.log(`OK: Result: ${verification.status}`);
  const fileName = verification.mode === 'preflight'
    ? 'jira-mcp-preflight.md'
    : 'jira-mcp-project-verification.md';
  console.log(`OK: Evidence written: ${config.evidence.outputDir.replace(/\\/g, '/')}/${fileName}`);
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

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    return null;
  }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeResources(data) {
  const list = Array.isArray(data) ? data : data && Array.isArray(data.resources) ? data.resources : [];
  return list
    .map((item, index) => ({
      cloudId: item.id || item.cloudId || item.cloudid || item.resourceId || item.url,
      safeName: `recurso-atlassian-${index + 1}`,
      scopes: item.scopes || [],
    }))
    .filter((item) => item.cloudId);
}

function containsKey(data, expectedKey) {
  return findMatchingKey(data, expectedKey) !== null;
}

function findMatchingKey(value, expectedKey) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value === expectedKey ? value : null;
  if (typeof value !== 'object') return null;
  if (Array.isArray(value)) {
    for (const item of value) {
      const match = findMatchingKey(item, expectedKey);
      if (match) return match;
    }
    return null;
  }

  for (const [key, childValue] of Object.entries(value)) {
    if ((key === 'key' || key === 'projectKey' || key === 'spaceKey') && childValue === expectedKey) {
      return childValue;
    }
    const match = findMatchingKey(childValue, expectedKey);
    if (match) return match;
  }

  return null;
}

main().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
});
