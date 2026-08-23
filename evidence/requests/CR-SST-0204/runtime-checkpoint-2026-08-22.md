# Checkpoint runtime CR-SST-0204

## Implementación local

El segundo slice de Bend quedó preservado en el commit local `575b577`, sobre
la misma branch y worktree limpios del contrato owner.

Superficies implementadas detrás de `CHAT_RETENTION_V1_ENABLED=false`:

- migración reversible para `retention_mode`, `saved_at` y receipts de
  promoción idempotente;
- store temporal process-local con TTL configurable;
- composición temporal/durable sin escritura PostgreSQL al crear;
- promoción transaccional que elimina el estado temporal solamente después
  del commit durable;
- list, save, finish temporal y delete durable en las rutas de chat;
- compatibilidad de conversaciones PostgreSQL existentes como `saved-legacy`;
- validación de IDs e idempotency key;
- prueba automatizada agregada al inicio de `npm run check`.

## Validación

- `npm run test:chat-retention`: PASS.
- `npm run test:chat-store-idempotency`: PASS.
- `npm run build`: PASS.
- `node --check` sobre store, routes, migration y test: PASS.
- `npm run check`: la prueba nueva y el smoke de timeout pasan; el gate se
  bloquea después en el preflight porque SST no está levantado en
  `localhost:3005`.
- Tests Socket.IO históricos: no ejecutables en este worktree porque la
  instalación owner observada no contiene `socket.io-client`; no se declara
  regresión validada todavía.

## Gaps abiertos

- Redis cache-aside y coherencia post-commit.
- Paginación/cursor completa de list.
- Pruebas HTTP y Socket.IO con dependencias/runtime completos.
- Ejecución real y rollback de la migración sobre una base sintética.
- Publicación de la capability y habilitación de `CR-SST-0211`.

No se publicó branch/PR hijo, no se ejecutó migración y no se modificaron Jira,
deployment ni producción.
