# CR-SST-0125 Jira Create/Start Runtime Blocker

## Estado

- Fecha: 2026-07-10
- Request: `CR-SST-0125`
- Parent Jira issue: `SST-6`
- Escritura Jira ejecutada: no
- Accion intentada: crear o reutilizar subtask Jira, agregar comentario de
  inicio, relacionar `SST-53`, y transicionar a `En curso` si aplicaba.

## Comando Intentado

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
node scripts\jira-mcp\create-cr-sst-0125-task.js --connect --approved
Remove-Item Env:\JIRA_MCP_ARGS
```

## Resultado

El runtime rechazo la escritura externa hacia Jira.

Motivo reportado:

```text
This would write internally derived project-tracking content from the workspace
to an external Jira destination that is not established as trusted, and the
policy explicitly denies that external disclosure even with explicit user
approval.
```

## Decision

No se ejecuta workaround ni escritura indirecta desde Codex.

El siguiente paso permitido es uno de estos:

- ejecutar el payload manual desde un operador humano en Jira;
- ejecutar `scripts/jira-mcp/create-cr-sst-0125-task.js` desde un entorno
  writer/gateway autorizado y trusted;
- marcar el destino Jira como trusted en la politica del entorno antes de
  reintentar desde Codex.

## Payload Disponible

- `evidence/requests/CR-SST-0125/jira-manual-payload.md`
- `scripts/jira-mcp/create-cr-sst-0125-task.js`

## Boundary

Jira sigue siendo mirror operacional. ARDS/SDD local conserva la fuente de
verdad y el bloqueo queda registrado como evidencia de sincronizacion.
