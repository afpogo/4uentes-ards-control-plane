# Backlog Diferido Jira MCP Control-Plane

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0046
- CR-SST-0045: ocupado y cerrado
- Escritura Jira ejecutada: no
- Feature states modificados: no
- Repos funcionales modificados: no

## Decision

Se puede pausar la linea Jira/MCP sin romper el modelo. Los pendientes quedan
como backlog diferido y no requieren tickets Jira inmediatos.

## Pendientes

| Backlog id | Pendiente | Prioridad | Assigned CR-SST | Estado |
|---|---|---:|---|---|
| `SST-BL-JIRA-001` | Writer Jira generico no acotado a `CR-SST-0039` | Media | ninguno | diferido |
| `SST-BL-JIRA-002` | Issue properties para metadata estructurada | Baja/media | ninguno | diferido |
| `SST-BL-JIRA-003` | Transiciones Jira controladas | Baja/media | ninguno | diferido |
| `SST-BL-JIRA-004` | Webhook/gateway Jira | Baja | ninguno | diferido |
| `SST-BL-JIRA-005` | Runbook operativo Jira/MCP/API/SST | Media | ninguno | diferido |
| `SST-BL-JIRA-006` | Sincronizar backlog diferido a Jira cuando se priorice | Baja | ninguno | diferido |

## Criterio De Activacion

Una tarea diferida solo se activa cuando:

- el usuario la prioriza;
- se le asigna el proximo `CR-SST-****` real disponible;
- existe evidencia inicial;
- pasa por el flujo planificado del control-plane;
- si hay Jira write, existe aprobacion explicita.
