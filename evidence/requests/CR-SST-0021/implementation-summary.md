# CR-SST-0021 - Resumen De Implementacion

Observado el: 2026-05-31

## Resumen

Se implemento el primer runtime de memoria operacional ARDS agnostico de
provider dentro de `sst-chatbot`, bajo `src/app/memory/`.

El runtime persiste registros operacionales estructurados y los avanza por
fases programables deterministicas. No llama a OpenAI, LangChain, base de datos,
storage de filesystem, colas, codigo frontend ni transporte real hacia el
orchestrator.

## Superficies Implementadas

- Modelo gobernado `OperationalRecord` para intents, acciones, decisiones,
  referencias de evidencia, recordatorios, eventos runtime, candidatos de
  visibilidad, ejecuciones de modelo, ejecuciones de agente, corridas de fase y
  resultados de validacion.
- Soporte obligatorio para correlacion, idempotencia, productor, metadata de
  auditoria, scope, tags, proveniencia, visibilidad, cuerpo estructurado y hash
  estable del cuerpo.
- Implementacion in-memory del puerto `RecordStore` con comportamiento de
  idempotencia tipo no-op/conflicto.
- Validadores deterministicos para campos requeridos, scope, hash del cuerpo,
  visibilidad y operaciones de servidor bloqueadas.
- `PhaseRunner` con definiciones de fase locales para capture, classify,
  local_validate, draft_intent, prepare_handoff, run_provider_adapter,
  collect_observation, select_visibility, archive_local_record y
  reject_local_record. Estas fases no son estados del request lifecycle de
  `4uentes-orchestor`.
- Adapter fake de provider que emite registros `agent_execution` estructurados
  sin red ni acoplamiento a SDKs de providers.
- Generacion de candidatos de visibilidad para recordatorios, decisiones,
  evidencia pendiente y validaciones fallidas.
- Mapping de handoff hacia shapes `operation_intent`, `handoff_payload` y
  `agent_result` compatibles con la capability inbound del orchestrator.

## Decisiones De Boundary

- `sst-chatbot` puede producir datos estructurados y validados de intent/result.
- `4uentes-orchestor` mantiene la responsabilidad sobre aceptacion, request
  lifecycle, queueing, scheduling, aprobacion de ejecucion, evidencia y
  reconciliacion.
- `4uentes-ards-core` sigue siendo la fuente canonica de estandar y no fue
  modificado.
- `server.restart_service` y `server.refresh_cache` siguen bloqueados
  semanticamente hasta que existan RBAC, auditoria, rollback, scheduling policy
  y approval gates.
