# Backlog Diferido Jira MCP Y Politica De Evidencia E2E

## Proposito

Este documento deja ordenados los pendientes de Jira/MCP/control-plane que no
son prioritarios ahora, sin perder trazabilidad ni romper el modelo.

La regla es:

```text
Cada pendiente futuro debe tener backlog_id estable.
Solo recibe CR-SST cuando se activa como proceso real.
```

## Estado Actual

`CR-SST-0045` ya esta ocupado y cerrado. El backlog diferido queda gobernado por
`CR-SST-0046`.

El estado consolidado actual es:

- Jira y control-plane tienen 9 issues/features observados.
- `IN_SYNC`: 7.
- `STATUS_SIGNAL_PENDING`: 2.
- Escrituras Jira requeridas: 0.
- Transiciones locales automaticas: 0.
- Tickets huerfanos: 0.

## Politica E2E

Antes de activar cualquier pendiente, debe existir:

1. Item en `state/jira-backlog-registry.yaml` con `backlog_id`.
2. Request `CR-SST-****` en `requests/inbox` solo cuando el item se activa.
3. Request `CR-SST-****` en `requests/planned` con `task_weight`,
   `model_selection` y `subagent_deployment_plan`.
4. Evidencia de entrada en `evidence/requests/<CR-SST-****>/`.
5. Si involucra Jira, evidencia read-only MCP previa.
6. Si involucra API/Jira writer, policy check y aprobacion humana.
7. Si involucra SST o repos funcionales, request aprobado antes de modificar
   repos hijos.
8. Evidencia final con comandos ejecutados y `npm.cmd run check`.

## Rutas E2E Permitidas

### Jira -> MCP -> Control-Plane

Uso: una persona mueve o asigna un issue Jira.

```text
Jira
  -> MCP read/status-observe
  -> status-proposals
  -> sync-health
  -> decision/evidence
```

No cambia `feature_state` automaticamente.

### Control-Plane -> MCP/Writer -> Jira

Uso: el control-plane crea o actualiza un ticket Jira.

```text
CR-SST planned
  -> dry-run
  -> policy-check
  -> metadata/duplicates/reconcile
  -> approval
  -> MCP write o writer REST
  -> post-write reconciliation
```

Requiere aprobacion explicita.

### Control-Plane -> API/SST -> Jira

Uso: una funcionalidad requiere trabajo en repos SST y luego sincronizar Jira.

```text
CR-SST planned
  -> impact analysis
  -> child repo request/handoff
  -> implementation evidence
  -> validation evidence
  -> feature_state update candidate
  -> Jira sync-health / writer
```

No se toca un repo funcional sin request aprobado.

## Backlog Diferido

| Backlog id | Pendiente | Prioridad | Ruta E2E | Assigned CR-SST | Jira ticket ahora | Motivo |
|---|---|---:|---|---|---|---|
| `SST-BL-JIRA-001` | Writer Jira generico no acotado a `CR-SST-0039` | Media | Control-Plane -> API/Writer -> Jira | ninguno | no | Solo necesario cuando haya nuevas escrituras aprobadas. |
| `SST-BL-JIRA-002` | Issue properties para metadata estructurada | Baja/media | Control-Plane -> API Jira -> Jira | ninguno | no | Mejora futura para evitar parsear descripcion. |
| `SST-BL-JIRA-003` | Transiciones Jira controladas (`To Do`, `In Progress`, `Done`) | Baja/media | Control-Plane -> MCP/Writer -> Jira | ninguno | no | Requiere approval fuerte; no es necesario para operar read-only. |
| `SST-BL-JIRA-004` | Webhook/gateway Jira para eventos inmediatos | Baja | Jira -> Gateway -> Control-Plane | ninguno | no | Polling manual por MCP es suficiente por ahora. |
| `SST-BL-JIRA-005` | End-to-end runbook operativo Jira/MCP/API/SST | Media | Bidireccional | ninguno | no | Util para operacion repetible, no bloquea el modelo. |
| `SST-BL-JIRA-006` | Sincronizar backlog diferido a Jira cuando se priorice | Baja | Control-Plane -> MCP write -> Jira | ninguno | no | Crear tickets ahora agregaria ruido al tablero. |

## Decision

No es necesario crear tickets Jira para estos pendientes ahora.

Si una tarea pasa a prioridad activa, primero se le asigna el proximo CR-SST
real disponible desde el control-plane. Luego se genera evidencia e2e y recien
despues se sincroniza a Jira por el circuito aprobado.
