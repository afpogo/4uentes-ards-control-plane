# Boundary Del Orchestrator

## Proposito

Este documento define la posicion operativa de `4uentes-orchestor` frente a
handoffs de agentes, especialmente desde `sst_chatbot`.

La regla central es:

```text
sst_chatbot propone trabajo; 4uentes-orchestor decide si lo acepta, planifica,
encola, ejecuta o rechaza.
```

## Posicion De `4uentes-orchestor`

`4uentes-orchestor` no debe ejecutar output libre de agentes.

El rol correcto del orchestrator es:

- recibir contexto o `operation_intent` estructurado;
- validar shape, scope e idempotencia;
- convertir trabajo aceptable en request auditable;
- calcular impacto con el planner;
- conservar evidence;
- decidir si algo puede pasar a `queued`, `running`, `done` o `rejected`;
- bloquear operaciones que no tengan contrato, permiso o aprobacion suficiente.

## Posicion De `sst_chatbot`

`sst_chatbot` puede actuar como productor de:

- contexto resumido;
- `operation_intent` estructurado;
- propuesta de update;
- propuesta de bundle;
- plan tecnico no ejecutado.

`sst_chatbot` no debe:

- modificar repos funcionales directamente;
- ejecutar comandos de servidor;
- crear patches sin request aprobado;
- decidir scheduling productivo;
- saltarse el lifecycle del orchestrator.

## MVP De Corto Plazo

El corte viable en corto plazo es `context_only` o request generation.

Flujo recomendado:

1. `sst_chatbot` recibe contexto validado por el control-plane.
2. `sst_chatbot` devuelve un `operation_intent` estructurado.
3. `4uentes-orchestor` valida el intent localmente.
4. Si pasa validacion, `4uentes-orchestor` crea un archivo en
   `requests/inbox/`.
5. El planner genera `requests/planned/`.
6. La decision queda `pending` hasta aprobacion humana.
7. La evidencia queda en `evidence/requests/<request-id>/`.

Esto permite usar agentes sin darles poder de ejecucion directa.

## Intent Types Permitidos Inicialmente

Permitidos como propuesta, no como ejecucion automatica:

- `user_history.propose_update`
- `workspace.generate_bundle`
- `ui_customization.enqueue_change`

Permitido solo si termina en request planificado y aprobacion posterior:

- `workspace.apply_patch`

Bloqueados por ahora:

- `server.restart_service`
- `server.refresh_cache`
- cualquier operacion destructiva
- cualquier mutacion directa de repos funcionales
- cualquier accion que requiera credenciales productivas

## Mapping Al Request Lifecycle

Mapping inicial recomendado:

| Estado de agente | Estado en `4uentes-orchestor` |
|---|---|
| `validated_for_handoff` | contexto o intent aceptable como input |
| `handoff_requested` | candidato a `requests/inbox/` |
| `handoff_accepted` | request planificado en `requests/planned/` |
| `rejected` | `requests/rejected/` o evidencia de rechazo |
| `completed` | solo despues de validacion y evidencia suficiente |

`queued` y `running` no deben activarse automaticamente desde un agente en el
MVP.

## Payload Minimo

Un handoff aceptable debe incluir:

- `operation_intent_id`
- `capability_id`
- `tenant_id` o scope equivalente
- `user_id` cuando aplique
- `payload`
- `priority`
- `preferred_execution_window`
- `requested_retry_policy`
- `idempotency_key`
- `correlation_id`
- `audit_metadata`

Si faltan `idempotency_key` o `correlation_id`, el handoff debe rechazarse o
normalizarse antes de entrar al lifecycle del orchestrator.

## Reglas De Seguridad

- Agent output nunca es ejecucion.
- Todo intent debe pasar por validacion determinista.
- Todo trabajo cross-repo entra por request.
- Repos funcionales no se modifican sin request aprobado y plan.
- Operaciones de servidor requieren approval gate explicito.
- `server.restart_service` y `server.refresh_cache` quedan bloqueados hasta que
  existan RBAC, auditoria, rollback y scheduling policy.
- `preferred_execution_window` es solo hint; la politica final pertenece a
  `4uentes-orchestor`.

## Estado Actual De `CR-SST-0006`

`CR-SST-0006` produjo salida segura para `sst_chatbot`:

- `evidence/requests/CR-SST-0006/chatbot-context.md`
- `evidence/requests/CR-SST-0006/chatbot-handoff-payload.yaml`

Esa salida esta en modo `context_only` y `validated_for_handoff`.

No autoriza:

- mover `CR-SST-0006` a `done`;
- modificar repos funcionales;
- ejecutar operaciones de servidor;
- crear patches automaticos.

## Estado Actual De `CR-SST-0007`

`CR-SST-0007` rastreo las capabilities de `sst_chatbot`.

La capability relevante es:

```text
agent-lifecycle-and-orchestrator-boundary
```

Todavia falta en `4uentes-orchestor`:

- capability inbound para `sst_chatbot`;
- schema local de `operation_intent`;
- schema local de `handoff_payload`;
- mapping formal a request lifecycle;
- politica de acceptance/rejection;
- decision de si `sst_chatbot` sera servicio catalogado, productor externo o
  experimento local.

## Decision Recomendada

Avanzar en corto plazo solo con handoff de contexto e intenciones.

No implementar ejecucion automatica todavia.

El siguiente paso correcto es crear una capability inbound en
`4uentes-orchestor` para `agent-lifecycle-and-orchestrator-boundary` y definir
schemas locales de validacion antes de aceptar cualquier handoff productivo.
