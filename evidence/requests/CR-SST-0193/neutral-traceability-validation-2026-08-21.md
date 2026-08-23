# CR-SST-0193 - ValidaciÃ³n De Trazabilidad Neutral

Fecha: 2026-08-21.

## DecisiÃ³n

La memoria canÃ³nica conserva procedencia y auditorÃ­a suficientes para que un
consumidor posterior construya RAG, sin persistir representaciones de
LangChain, prompts renderizados ni respuestas del proveedor.

Se mantuvieron separadas tres responsabilidades:

- `sst-bend` conserva memoria, scope, consentimiento, procedencia y decisiÃ³n;
- `sst-chatbot` adaptarÃ¡ records autorizados a contexto RAG bajo CR-SST-0194;
- el proveedor LLM recibe contexto transitorio y no adquiere autoridad de
  identidad, autorizaciÃ³n o persistencia.

## ImplementaciÃ³n Owner

La migration forward
`db/migrations/20260821120000-add-user-memory-neutral-traceability.js` agrega:

- eventos: `event_type`, `source_surface`, `source_ref`, `correlation_id` y
  `occurred_at`;
- propuestas: `producer_service`, `source_event_ids`, `confidence`,
  `validation_summary`, `correlation_id` y `reviewed_by`;
- records: `source_event_ids`, `confidence` y `created_by`;
- recalls: `requester_type`, `requester_id`, `policy_version`, `decision_code`,
  `retrieved_memory_ids` y `citation_refs`.

Productor, requester, actores, policy, decision code y result count se derivan
en backend. Los eventos fuente y records recuperados se validan dentro del
memory space resuelto. Las referencias de fuente y cita son opacas. La policy
rechaza metadata con campos de prompt, mensajes runtime, respuestas de
proveedor o tokens.

## ValidaciÃ³n Ejecutada

- `npm.cmd run test:user-memory`: PASS, cinco suites.
- `npm.cmd run build`: PASS.
- `git diff --check`: PASS.
- migraciÃ³n completa sobre Postgres 11 efÃ­mero en `localhost:15432`: PASS.
- rollback y reaplicaciÃ³n de
  `20260821120000-add-user-memory-neutral-traceability`: PASS.
- `npm.cmd run smoke:user-memory:postgres`: PASS; dos aceptaciones concurrentes
  produjeron exactamente un record.
- inspecciÃ³n de esquema: 5 campos de traza en events, 6 en proposals, 3 en
  records y 8 campos de traza/auditorÃ­a observados en recalls contando los ya
  existentes.
- cleanup de fixtures: 0 events, 0 proposals, 0 records y 0 recalls.
- `sst-bend npm.cmd run check`: cÃ³digo 0; mantiene warning heredado de coverage
  protegida 50% por ausencia de `SMOKE_JWT`.

El contenedor, la red, el override Compose y el directorio de datos efÃ­mero
fueron retirados al finalizar. No se ejecutaron migraciones sobre el Postgres
compartido.

## Gate Del Control Plane

`4uentes-orchestor npm.cmd run check` se ejecutÃ³ y quedÃ³ bloqueado antes del
owner-documentation validator por una falla ajena a CR-SST-0193:

```text
scripts/test-verify-local-bindings.js:17
AssertionError: null !== 1
```

No se modificÃ³ HPT, el validator ni los bindings para saltear el gate. La CR no
debe cerrarse hasta que el gate completo pueda volver a pasar y se complete el
QA HTTP autenticado del runtime adoptado.
