const { spawn } = require('child_process');

const DEFAULT_PROTOCOL_VERSION = '2024-11-05';

class McpStdioClient {
  constructor(options) {
    this.command = options.command;
    this.args = options.args;
    this.timeoutMs = options.timeoutMs || 120000;
    this.nextId = 1;
    this.pending = new Map();
    this.buffer = '';
    this.stderr = '';
    this.process = null;
  }

  async connect() {
    this.process = spawn(this.command, this.args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: shouldUseShell(this.command),
    });

    this.process.stdout.setEncoding('utf8');
    this.process.stderr.setEncoding('utf8');

    this.process.stdout.on('data', (chunk) => this.handleStdout(chunk));
    this.process.stderr.on('data', (chunk) => {
      this.stderr += chunk;
    });
    this.process.on('error', (error) => {
      for (const { reject, timer } of this.pending.values()) {
        clearTimeout(timer);
        reject(error);
      }
      this.pending.clear();
    });
    this.process.on('exit', (code, signal) => {
      const stderr = redactProcessOutput(this.stderr).slice(-4000);
      const details = stderr ? ` stderr: ${stderr}` : '';
      const error = new Error(`MCP process exited with code ${code} signal ${signal}.${details}`);
      for (const { reject, timer } of this.pending.values()) {
        clearTimeout(timer);
        reject(error);
      }
      this.pending.clear();
    });

    await this.request('initialize', {
      protocolVersion: DEFAULT_PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: {
        name: '4uentes-orchestor-jira-mcp-client',
        version: '0.1.0',
      },
    });

    this.notify('notifications/initialized', {});
  }

  async listTools() {
    const response = await this.request('tools/list', {});
    return response.tools || [];
  }

  async callTool(name, args) {
    return this.request('tools/call', {
      name,
      arguments: args || {},
    });
  }

  close() {
    if (this.process && !this.process.killed) {
      this.process.kill();
    }
  }

  request(method, params) {
    const id = this.nextId;
    this.nextId += 1;
    const message = {
      jsonrpc: '2.0',
      id,
      method,
      params,
    };

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Timed out waiting for MCP response to ${method}`));
      }, this.timeoutMs);

      this.pending.set(id, { resolve, reject, timer });
      this.write(message);
    });
  }

  notify(method, params) {
    this.write({
      jsonrpc: '2.0',
      method,
      params,
    });
  }

  write(message) {
    this.process.stdin.write(`${JSON.stringify(message)}\n`);
  }

  handleStdout(chunk) {
    this.buffer += chunk;
    let newlineIndex = this.buffer.indexOf('\n');

    while (newlineIndex !== -1) {
      const line = this.buffer.slice(0, newlineIndex).trim();
      this.buffer = this.buffer.slice(newlineIndex + 1);
      if (line) this.handleMessageLine(line);
      newlineIndex = this.buffer.indexOf('\n');
    }
  }

  handleMessageLine(line) {
    let message;
    try {
      message = JSON.parse(line);
    } catch (_) {
      this.stderr += `${line}\n`;
      return;
    }

    if (!message.id || !this.pending.has(message.id)) return;

    const pending = this.pending.get(message.id);
    this.pending.delete(message.id);
    clearTimeout(pending.timer);

    if (message.error) {
      pending.reject(new Error(message.error.message || JSON.stringify(message.error)));
      return;
    }

    pending.resolve(message.result || {});
  }
}

module.exports = {
  McpStdioClient,
};

function shouldUseShell(command) {
  return process.platform === 'win32' && /\.cmd$/i.test(command);
}

function redactProcessOutput(value) {
  return String(value || '')
    .replace(/code_challenge=[^&\s]+/g, 'code_challenge=[redacted]')
    .replace(/state=[^&\s]+/g, 'state=[redacted]')
    .replace(/client_id=[^&\s]+/g, 'client_id=[redacted]')
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, 'Bearer [redacted]')
    .replace(/token[=:]\s*[A-Za-z0-9._-]+/gi, 'token=[redacted]');
}
