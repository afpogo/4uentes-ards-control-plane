# CR-SST-0022 - Resumen De Implementacion

Observado el: 2026-05-31

## Resumen

Se implemento la Ruta B en `sst-chatbot`: un adapter local/fake de handoff hacia
el orchestrator. El adapter valida payloads, registra receipts en memoria y
devuelve estados locales sin seleccionar transporte real.

## Superficies Implementadas

- Tipos locales `HandoffPayload`, `HandoffDecision`, `HandoffReceipt` y
  `HandoffStatus`.
- `InMemoryHandoffStore` para receipts aceptados.
- `FakeOrchestratorClient` para simular aceptacion/rechazo local.
- Validacion de scope, correlation id, idempotency key, audit metadata,
  operaciones bloqueadas y revision humana para `workspace.apply_patch`.
- Estados locales: `accepted_for_review`, `rejected_by_policy`, `duplicate` y
  `conflict`.

## Boundary

`accepted_for_review` no equivale a `queued`, `running` ni aprobacion de
ejecucion. Solo significa que el fake adapter acepto la forma de la propuesta
para revision local.

No se implemento HTTP, queue real, worker productivo, comandos shell, escritura
en DB, restart/cache refresh ni mutaciones de repos funcionales.
