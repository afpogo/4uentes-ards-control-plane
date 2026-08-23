# CR-SST-0193 - Smoke Real De MigraciÃ³n Postgres

Fecha: 2026-08-18

## Entorno

- stack local Docker Compose de `sst-bend`;
- PostgreSQL 11 publicado en `localhost:5432`;
- base local `sstdb`;
- ninguna tabla `user_memory_*` existÃ­a antes del primer `up`;
- el runtime activo usaba cÃ³digo anterior y no podÃ­a escribir memoria.

No se usÃ³ una base productiva y no se copiaron credenciales al worktree.

## Ciclo Ejecutado

1. `db:migrate`: PASS, primer `up` en 0,397 s.
2. InspecciÃ³n SQL: 5 tablas y 10 Ã­ndices; se detectaron FKs incompletas.
3. ConfirmaciÃ³n de 0 filas en las cinco tablas.
4. `db:migrate:undo --name 20260818090000-create-user-memory-tables.js`:
   PASS, rollback en 0,216 s.
5. ConfirmaciÃ³n SQL: 0 tablas `user_memory_*` remanentes.
6. CorrecciÃ³n de FKs de account, user, proposal y revisiones.
7. `db:migrate`: PASS, `up` final en 0,497 s.
8. `db:migrate:status`: migraciÃ³n final marcada `up`.

## Estructura Final

Tablas:

- `user_memory_spaces`;
- `user_memory_events`;
- `user_memory_proposals`;
- `user_memory_records`;
- `user_memory_recalls`.

Resultado SQL:

- 10 Ã­ndices, incluidos scope e idempotencia Ãºnicos;
- 9 foreign keys;
- space enlazado a `accounts` y `conso_users`;
- eventos/propuestas/records/recalls enlazados al space;
- records enlazados a proposal y revisiones anterior/siguiente;
- 0 filas en todas las tablas al finalizar.

## RegresiÃ³n Posterior

- `npm run test:user-memory`: PASS;
- `sst-bend npm run check`: cÃ³digo 0, con warning heredado de smoke protegido
  sin `SMOKE_JWT`;
- `git diff --check`: PASS;
- `4uentes-orchestor npm run check`: PASS, 0 FAIL.

La migraciÃ³n queda aplicada en el Postgres local. El siguiente gate es iniciar
el runtime del worktree con `USER_MEMORY_ENABLED=true` y ejecutar QA HTTP con
JWT y membership vÃ¡lidos.

## Endurecimiento Incremental Del 2026-08-20

La revisiÃ³n previa a promociÃ³n detectÃ³ que review y creaciÃ³n del record debÃ­an
ser atÃ³micos. Como la migration inicial ya estaba aplicada, se evitÃ³ editar su
estado en la base y se creÃ³ una migration forward independiente:

- `20260820100000-enforce-user-memory-proposal-record-uniqueness.js`.

ValidaciÃ³n realizada:

1. `db:migrate:status` confirmÃ³ que era la Ãºnica migration pendiente.
2. `db:migrate` la aplicÃ³ correctamente en 0,100 s.
3. PostgreSQL confirmÃ³ el Ã­ndice UNIQUE
   `user_memory_records_proposal_unique (proposal_id)`.
4. `npm run smoke:user-memory:postgres`: PASS.
5. Dos aceptaciones concurrentes devolvieron el mismo record canÃ³nico.
6. Una decisiÃ³n posterior contradictoria devolviÃ³ conflicto.
7. La limpieza dejÃ³ 0 spaces, 0 proposals y 0 records de fixtures.

El repositorio ejecuta el review bajo transacciÃ³n y row lock; el Ã­ndice actÃºa
como segunda barrera durable.

## Trazabilidad Neutral Del 2026-08-21

La migration forward
`20260821120000-add-user-memory-neutral-traceability.js` fue validada en una
base Postgres 11 efÃ­mera y separada en `localhost:15432`:

1. todas las migrations del repo: PASS;
2. rollback de la migration nueva: PASS;
3. reaplicaciÃ³n: PASS;
4. smoke de aceptaciÃ³n concurrente: PASS;
5. columnas de traza presentes en las cuatro tablas afectadas;
6. cleanup final: 0 filas de fixture.

La base compartida no recibiÃ³ migrations. La infraestructura efÃ­mera y su
directorio de datos fueron retirados al finalizar.
