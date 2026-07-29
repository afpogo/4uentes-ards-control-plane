# Descubrimiento CR-SST-0142

Fecha: 2026-07-12.

La auditoría independiente de `CR-SST-0133` confirmó que la transacción del
aggregate Plaud termina antes de `markCompleted` del ingestion job. Un fallo o
crash en esa ventana puede dejar contenido confirmado con job `processing` o
`failed`, y el worker actual no recupera leases stale.

La solución exige una frontera distinta —reconciliación idempotente, recovery o
outbox— y por eso no se mezcló en el invariante artículo/payload/filtro.

Jira espejo: `SST-82`, Subtask de `SST-58`, bajo Epic `SST-57`.
