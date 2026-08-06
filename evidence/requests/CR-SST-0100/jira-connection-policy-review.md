# CR-SST-0100 - Jira connection policy review

Fecha: 2026-07-04

Politicas aplicadas:

- `docs/requests/jira-mcp-endpoint-connection-policy.md`
- `docs/requests/jira-write-connection-contract.md`

Orden operativo aplicado:

1. MCP Jira directo como primera intencion.
2. Fallback por scripts `scripts/jira-mcp/*`, que siguen usando MCP.
3. Jira REST API solo como ultimo fallback.

Resultado:

- MCP directo `search` para `SST-32` devolvio `403 Access denied`.
- Se uso fallback por script MCP para observar e iniciar `SST-32`.
- Jira REST API no fue usado.
