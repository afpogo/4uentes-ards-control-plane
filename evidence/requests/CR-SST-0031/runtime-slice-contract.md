# CR-SST-0031 - Contrato Del Primer Slice Runtime De Memoria Interna

Observado el: 2026-06-05

## Decision

El primer slice implementable de memoria interna de usuario SST debe probar el
nucleo de memoria antes de integrar fuentes largas, PDFs o derivacion por
parrafos.

El slice inicial se enfoca en:

- capturar eventos internos simples;
- proponer hechos e intenciones con chatbot;
- validar y persistir memoria durable desde backend;
- recuperar memoria basica por chatbot.

## Vision De Implementacion

La implementacion debe comenzar como un circuito minimo verificable entre
`sst-bend` y `sst-chatbot`.

`sst-bend` debe ser la autoridad de memoria durable. `sst-chatbot` debe producir
propuestas y pedir recall. `sst-fend` puede quedar fuera del primer corte o
limitarse a disparar eventos ya existentes, porque la UI completa de memoria
todavia no es necesaria para probar el nucleo.

El primer objetivo no es que el usuario vea una pantalla nueva. El primer
objetivo es que el sistema pueda recordar una intencion simple con scope,
validacion e idempotencia, y recuperarla luego desde el chatbot.

## Flujo Principal

```text
user action or chatbot interaction
  -> user_memory_event
  -> user_memory_proposal
  -> backend validation
  -> user_memory_fact / user_memory_intention
  -> user_memory_recall
```

## Objetos Del Slice

### `user_memory_event`

Evento durable observado dentro de SST.

Campos minimos:

- `event_id`;
- `memory_space_id`;
- `tenant_id`;
- `account_id`;
- `user_id`;
- `event_type`;
- `source_surface`;
- `payload`;
- `occurred_at`;
- `correlation_id`;
- `idempotency_key`.

Tipos iniciales:

- `chat.message_sent`;
- `chat.memory_requested`;
- `chat.memory_confirmed`;
- `user.item_saved`;
- `user.item_tagged`;
- `user.remember_requested`;

### `user_memory_proposal`

Propuesta generada por chatbot o backend derivador.

Campos minimos:

- `proposal_id`;
- `memory_space_id`;
- `producer_service`;
- `source_event_ids`;
- `proposal_type`;
- `proposed_payload`;
- `confidence`;
- `validation_summary`;
- `correlation_id`;
- `idempotency_key`;
- `status`.

Tipos iniciales:

- `fact`;
- `intention`;
- `thread_link`;

Estados iniciales:

- `drafted`;
- `validated`;
- `accepted`;
- `rejected`;
- `needs_user_review`;
- `superseded`.

### `user_memory_fact`

Hecho recordable consolidado.

Campos minimos:

- `fact_id`;
- `memory_space_id`;
- `statement`;
- `source_event_ids`;
- `source_proposal_id`;
- `confidence`;
- `visibility`;
- `status`;
- `created_by`;
- `created_at`.

### `user_memory_intention`

Intencion encaminada o pendiente.

Campos minimos:

- `intention_id`;
- `memory_space_id`;
- `intent_text`;
- `source_event_ids`;
- `source_proposal_id`;
- `status`;
- `priority`;
- `next_action_hint`;
- `created_at`;
- `updated_at`.

### `user_memory_recall`

Respuesta de recuperacion agentica.

Campos minimos:

- `recall_id`;
- `memory_space_id`;
- `query`;
- `retrieved_event_ids`;
- `retrieved_fact_ids`;
- `retrieved_intention_ids`;
- `answer_summary`;
- `confidence`;
- `created_at`.

## Reglas

- La memoria se guarda por `tenant_id`, `account_id` y `user_id`.
- El chatbot no escribe memoria durable sin validacion backend.
- Toda escritura durable requiere `correlation_id` e `idempotency_key`.
- El primer slice no necesita UI completa; puede exponerse desde flujos backend
  o chatbot controlados.
- Las fuentes largas y parrafos quedan fuera de este slice.

## Fuera De Alcance

- Procesamiento secuencial por parrafos.
- UI avanzada de memoria.
- Borrado/portabilidad completa de memoria.
- Busqueda semantica/vectorial.
- Migraciones o endpoints reales en esta fase del orquestador.

## Primer Request De Implementacion Recomendado

El proximo request debe habilitar cambios funcionales solo para el slice minimo:

- `sst-bend`: modelo, validacion y persistencia de memoria interna.
- `sst-chatbot`: propuesta de memoria y recall basico.
- `4uentes-auth`: solo consumir scope existente si ya esta disponible.
- `sst-fend`: diferido salvo que se necesite una accion minima de prueba.

No debe incluir procesamiento de documentos largos ni UI avanzada.
