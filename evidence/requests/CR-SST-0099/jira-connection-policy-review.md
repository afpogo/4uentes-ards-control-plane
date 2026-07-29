# CR-SST-0099 - Jira connection policy review

Fecha: 2026-07-04

Politicas revisadas:

- `docs/requests/jira-mcp-endpoint-connection-policy.md`
- `docs/requests/jira-write-connection-contract.md`

Decision aplicada:

1. Primera intencion: MCP Jira directo mediante tools Atlassian del runtime.
2. Fallback preferente: scripts `scripts/jira-mcp/*`, que siguen usando MCP y
   resuelven `cloudId` dinamicamente sin persistirlo.
3. Ultimo fallback: Jira REST API/writer externo, solo si MCP no esta disponible
   o no puede ejecutar la accion requerida.

Resultado observado:

- MCP directo `search` para `SST-31` devolvio `403 Access denied`.
- Se uso fallback por script MCP para transicionar `SST-31`.
- No se uso Jira REST API.

Actualizacion documental:

- `docs/requests/jira-write-connection-contract.md` ahora declara el orden
  operativo de conexion.
