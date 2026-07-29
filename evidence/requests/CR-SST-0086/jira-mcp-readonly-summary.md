# Resumen Jira/MCP Read-Only

## Ejecucion

Se ejecuto verificacion read-only con el endpoint operativo canonico:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
npm.cmd run jira:mcp:verify -- --connect --request-id CR-SST-0086 --output-dir evidence/requests/CR-SST-0086
Remove-Item Env:\JIRA_MCP_ARGS
```

## Resultado

- Resultado: `PARTIAL_PASS`.
- Jira project key `SST`: visible.
- Confluence space key `SST`: no visible.
- Writes ejecutados: no.
- Error `403 The app is not installed`: no observado en esta corrida.

## Nota Sobre Config

El archivo `jira-mcp-project-verification.md` muestra `serverUrl` desde la
config local/example historica (`authv2`), pero el comando operativo usado fue
`JIRA_MCP_ARGS` con `/v1/mcp`, de acuerdo con
`docs/requests/jira-mcp-endpoint-connection-policy.md`.

## Pendiente

Reconciliar issue key especifico para `dictionary-secret-management`. Cualquier
comentario o transicion Jira requiere aprobacion humana explicita y una nueva
evidencia post-write sanitizada.
