# Endpoint Override Execution Note

## Estado

- Fecha: 2026-06-08
- Request: CR-SST-0058
- Issue Jira: SST-8
- Endpoint default: `https://mcp.atlassian.com/v1/mcp/authv2`
- Endpoint operativo usado: `https://mcp.atlassian.com/v1/mcp`
- Jira write ejecutado: si

## Contexto

`CR-SST-0057` observo que el endpoint default `authv2` fallaba durante OAuth
dynamic client registration con HTML `404`, antes de exponer tools MCP.

Para `CR-SST-0058`, se uso el mismo override operativo validado:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
```

## Resultado

Con el endpoint operativo, el MCP conecto correctamente, expuso tools Jira,
leyo `SST-8`, obtuvo transiciones y ejecuto la transicion aprobada `Listo (41)`.

No se leyeron ni persistieron tokens OAuth en el control-plane.
