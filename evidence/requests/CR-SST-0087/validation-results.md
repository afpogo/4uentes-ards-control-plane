# CR-SST-0087 - Resultados de validacion

Validado el 2026-06-28.

## 4uentes-orchestor

| Comando | Resultado | Notas |
| --- | --- | --- |
| `npm.cmd run check:initiatives` | PASS | `verify-initiatives` valido 2 initiatives con 4 OK, 0 WARN, 0 FAIL. |
| `npm.cmd run check` | PASS | `verify-catalog`, `verify-local-bindings --optional`, `verify-state-model` y `verify-initiatives` pasaron. |

## Jira

| Accion | Resultado | Notas |
| --- | --- | --- |
| Atlassian MCP search read-only | BLOCKED | `403`, app no instalada en la instancia. |

## Riesgos Residuales

- El estado live de Jira no pudo confirmarse en esta sesion por bloqueo MCP.
- `CR-SST-0076` conserva representacion local en `planned/in_progress` aunque
  existe evidencia de cierre Jira.
- `learning-content-tags` requiere un CR dedicado antes de mutar repos hijos.
