# CR-4UENTES-0033 - Revision De Conexion Jira MCP

Fecha: 2026-07-07

## Politica Revisada

- `docs/requests/jira-write-connection-contract.md`
- `docs/requests/mcp-auth-bootstrap-playbook.md`

## Decision Operativa

Se usa Jira MCP como primera opcion porque las tools Atlassian estan
disponibles en el runtime.

Fallback permitido:

1. Scripts `scripts/jira-mcp/*` si la tool directa falla.
2. Jira REST API o writer externo solo como ultimo recurso, con aprobacion
   explicita y evidencia de bloqueo MCP.

## Seguridad

No se persisten tokens, URLs privadas, cloud IDs, emails, account IDs ni
respuestas crudas del conector Jira en evidencia local.
