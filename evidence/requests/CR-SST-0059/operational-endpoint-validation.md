# Operational Endpoint Validation

## Estado

- Fecha: 2026-06-08
- Request: CR-SST-0059
- Endpoint default: `https://mcp.atlassian.com/v1/mcp/authv2`
- Endpoint operativo observado: `https://mcp.atlassian.com/v1/mcp`
- Escritura Jira ejecutada por este request: no

## Resultado

El patron observado en `CR-SST-0057` fue confirmado nuevamente durante
`CR-SST-0058`:

- `authv2` falla durante OAuth dynamic client registration con HTML `404`.
- `/v1/mcp` permite conectar `mcp-remote`, listar tools Jira y leer `SST-8`.
- La sesion OAuth se toma desde la cache externa de `mcp-remote`; el
  control-plane no lee ni persiste tokens.

## Decision

El playbook `docs/requests/jira-mcp-oauth-session-playbook.md` fue actualizado
para declarar `/v1/mcp` como override operativo mientras `authv2` siga fallando
en `registerClient`.
