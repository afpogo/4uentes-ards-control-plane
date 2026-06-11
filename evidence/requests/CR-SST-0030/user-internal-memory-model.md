# CR-SST-0030 - Modelo De Memoria Interna De Usuario SST

Observado el: 2026-06-05

## Proposito

La memoria interna de usuario guarda lo que el usuario hace, dice, intenta y
necesita recordar dentro de SST.

Debe alimentar ayuda agentica futura sin convertir el producto en un sistema de
archivos ARDS/SDD por usuario.

## Objetos Iniciales

### `user_memory_space`

Scope raiz de memoria por usuario/account.

Campos minimos:

- `tenant_id`;
- `account_id`;
- `user_id`;
- `memory_space_id`;
- `status`;
- `created_at`;
- `updated_at`.

### `user_memory_event`

Evento observado dentro de SST.

Ejemplos:

- usuario guarda una URL;
- usuario procesa un PDF;
- usuario crea o edita un tag;
- usuario conversa con chatbot;
- usuario aprueba, rechaza o pospone una sugerencia;
- usuario marca algo para recordar.

Campos minimos:

- `event_id`;
- `memory_space_id`;
- `event_type`;
- `source_surface`;
- `payload`;
- `occurred_at`;
- `correlation_id`;
- `idempotency_key`.

### `user_memory_fact`

Hecho recordable derivado de eventos o declarado por el usuario.

Campos minimos:

- `fact_id`;
- `memory_space_id`;
- `statement`;
- `source_event_ids`;
- `confidence`;
- `visibility`;
- `status`;
- `created_by`;
- `created_at`.

### `user_memory_intention`

Intencion encaminada o pendiente.

Ejemplos:

- "quiero estudiar este tema";
- "quiero volver a revisar este articulo";
- "quiero construir un resumen";
- "quiero completar una tarea luego";
- "quiero que el chatbot recuerde este criterio".

Campos minimos:

- `intention_id`;
- `memory_space_id`;
- `intent_text`;
- `source_event_ids`;
- `status`;
- `priority`;
- `next_action_hint`;
- `created_at`;
- `updated_at`.

Estados iniciales:

- `captured`;
- `active`;
- `paused`;
- `completed`;
- `cancelled`;
- `superseded`.

### `user_memory_thread`

Agrupa eventos, hechos e intenciones alrededor de un tema.

Campos minimos:

- `thread_id`;
- `memory_space_id`;
- `title`;
- `topic_tags`;
- `event_ids`;
- `fact_ids`;
- `intention_ids`;
- `status`.

### `user_memory_recall`

Resultado de una recuperacion agentica.

Campos minimos:

- `recall_id`;
- `memory_space_id`;
- `query`;
- `retrieved_fact_ids`;
- `retrieved_intention_ids`;
- `retrieved_event_ids`;
- `answer_summary`;
- `confidence`;
- `created_at`.

## Autoridad

El chatbot puede proponer hechos, intenciones o recalls.

El backend autorizado debe validar scope, permisos, idempotencia y persistencia
antes de guardar memoria durable.

El usuario debe poder revisar o borrar memoria visible cuando el producto lo
exponga.

## Primer Slice Implementable

El primer slice no deberia comenzar por procesamiento de PDFs por parrafos.
Debe comenzar por eventos internos simples:

1. capturar evento de usuario;
2. persistir evento con scope;
3. permitir que chatbot proponga un hecho o intencion;
4. validar y guardar esa propuesta;
5. permitir recall basico por chatbot.

Este slice prueba el nucleo de memoria antes de agregar fuentes largas.
