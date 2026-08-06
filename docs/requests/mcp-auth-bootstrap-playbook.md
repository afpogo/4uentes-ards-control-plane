# MCP Auth Bootstrap Playbook

## Purpose

Provide a local, repeatable way to start OAuth/authentication for remote MCP
servers before Codex, VSCode, or another agent needs the tools.

The script does not store tokens and does not print credentials. OAuth state is
owned by each MCP implementation, typically `mcp-remote` or the provider.

## Discovery Sources

The bootstrap reads:

- Codex: `%USERPROFILE%\.codex\config.toml`
- VSCode: `%APPDATA%\Code\User\mcp.json`

It currently authenticates HTTP/remoted MCP servers by launching them through:

```powershell
npx --yes mcp-remote@latest <url>
```

Template URLs that contain placeholders like `{instance}` or `${input:token}`
are skipped by default.

## Commands

List discovered remote MCP targets:

```powershell
npm.cmd run mcp:auth:list
```

Connect all discovered remote MCP targets and trigger OAuth when needed:

```powershell
npm.cmd run mcp:auth:connect
```

Connect only one provider:

```powershell
node scripts\mcp-auth\bootstrap-remotes.js --connect --only atlassian
node scripts\mcp-auth\bootstrap-remotes.js --connect --only figma
```

Continue even if one provider fails:

```powershell
node scripts\mcp-auth\bootstrap-remotes.js --connect --continue-on-error
```

## Expected Behavior

- If a provider has no active session, `mcp-remote` may open a browser.
- Complete OAuth manually in the browser.
- The script then calls MCP `tools/list` and exits.
- A successful provider prints `OK <name>: tools=<count>`.

## Boundaries

- This is an authentication/bootstrap helper only.
- It does not call provider business tools.
- It does not write Jira, Figma, GitHub, Postman, or any external system data.
- It does not manage provider-specific tokens or VSCode input prompts.
