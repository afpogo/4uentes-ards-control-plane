# CR-SST-0007 - Gaps De Adopcion

Observado el: 2026-05-20

## Gaps Principales

| Gap | Estado | Impacto |
|---|---|---|
| `sst_chatbot` no esta catalogado | open | El planner no puede incluirlo como servicio afectado. |
| No hay capability inbound en `4uentes-orchestor` | open | El handoff hacia el orquestador esta definido solo del lado productor. |
| No hay schema local de `operation_intent` | open | El control-plane no puede validar payloads de agentes. |
| No hay schema local de `handoff_payload` | open | No hay contrato ejecutable para aceptar/rechazar handoffs. |
| No hay mapping a request lifecycle | open | Falta decidir si un handoff crea `requests/inbox`, `queued`, o una cola nueva. |
| No hay politica de scheduling para hints offline | open | `sst_chatbot` declara hints, pero la politica final pertenece al orquestador. |
| No hay adapter real | open | El POC usa fake orchestrator client como target futuro. |

## Riesgos

- Tratar specs draft de `sst_chatbot` como contrato productivo antes de una
  decision del control-plane.
- Permitir intent types de server como `server.restart_service` sin RBAC,
  auditoria y approval gates.
- Mezclar responsabilidades: `sst_chatbot` define intent; `4uentes-orchestor`
  debe decidir ejecucion.
- Catalogar `sst_chatbot` como servicio sin resolver si es repo independiente,
  subcomponente o experimento local.

## Camino Recomendado

1. Crear un request dedicado para decidir identidad de `sst_chatbot`.
2. Si se acepta como productor, agregarlo al catalogo con `status: candidate` o
   equivalente.
3. Crear una capability inbound en `4uentes-orchestor` para
   `agent-lifecycle-and-orchestrator-boundary`.
4. Definir schemas locales para `operation_intent` y `handoff_payload`.
5. Mapear los estados `handoff_requested` y `handoff_accepted` al lifecycle del
   orquestador.
6. Bloquear `server.restart_service` y `server.refresh_cache` hasta tener
   approval gates, auditoria y permisos.
