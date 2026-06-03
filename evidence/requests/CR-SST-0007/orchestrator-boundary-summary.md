# CR-SST-0007 - Boundary `sst_chatbot` A `4uentes-orchestor`

Observado el: 2026-05-20

## Lectura Corta

`sst_chatbot` define el lado agente del contrato. `4uentes-orchestor` deberia
definir si acepta, cola, agenda y ejecuta los trabajos.

El contrato no permite que el agente ejecute comandos libres ni mute servidores
directamente. El agente debe producir un `operation_intent` estructurado,
validado localmente, y luego un `handoff_payload` para el orquestador.

## Ownership Declarado Por `sst_chatbot`

`sst_chatbot` se asigna:

- contratos de creacion de agentes;
- estados de lifecycle de agentes;
- comportamiento de planning provider-agnostic;
- schemas de operation intent estructurado;
- fake orchestrator client para POCs y tests.

`4uentes-orchestor` queda como owner de:

- server orchestration;
- durable operation queues;
- production workers;
- runtime scheduling policy;
- infrastructure adapters;
- server-side audit records.

## Lifecycle Propuesto

Estados candidatos:

- `requested`
- `classified`
- `planned`
- `validated_for_handoff`
- `handoff_requested`
- `handoff_accepted`
- `completed`
- `failed`
- `rejected`

## Tipos Iniciales De Operation Intent

- `workspace.generate_bundle`
- `workspace.apply_patch`
- `user_history.propose_update`
- `ui_customization.enqueue_change`
- `server.refresh_cache`
- `server.restart_service`

## Campos Del Handoff Payload

- `operation_intent_id`
- `capability_id`
- `tenant_id`
- `user_id`
- `payload`
- `priority`
- `preferred_execution_window`
- `requested_retry_policy`
- `idempotency_key`
- `correlation_id`
- `audit_metadata`

## POC Asociado

`specs/pocs/agent-lifecycle-orchestrator-boundary-poc.yaml` esta en status
`draft`.

El POC busca probar:

- mock SST event ingestion;
- validacion de lifecycle transition;
- validacion de operation intent;
- creacion de handoff payload;
- fake `4uentes-orchestor` client.

Promotion criteria relevantes:

- documentar el primer boundary API consumidor de SST;
- documentar el handoff boundary de `4uentes-orchestor`;
- reemplazar el fake orchestrator client por un adapter boundary que mapee a
  `4uentes-orchestor`.

## Estado De Adopcion En El Control-Plane

No existe todavia:

- capability inbound en `4uentes-orchestor`;
- request lifecycle especifico para operation intents de agentes;
- schema de handoff payload en este repo;
- queue/scheduling model asociado a estos intent types;
- registro de `sst_chatbot` como productor canonico.

## Decision Pendiente

Antes de implementar o consumir este handoff, `4uentes-orchestor` deberia
resolver:

1. si acepta `agent-lifecycle-and-orchestrator-boundary` como capability inbound;
2. que tipo inicial de `operation_intent` se permite;
3. donde se valida `tenant_id`, `user_id`, `idempotency_key` y `correlation_id`;
4. que estados del lifecycle quedan persistidos en `sst_chatbot` y cuales en
   `4uentes-orchestor`;
5. si `server.restart_service` y `server.refresh_cache` entran en scope temprano
   o quedan bloqueados hasta una fase de hardening.
