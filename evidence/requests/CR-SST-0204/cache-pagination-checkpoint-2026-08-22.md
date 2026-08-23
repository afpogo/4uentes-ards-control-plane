# Checkpoint cache y paginación CR-SST-0204

## Implementación local Bend

El tercer slice quedó preservado en la branch
`feat/CR-SST-0204/chat-retention-contract`, sin publicación remota:

- `93fb3fd`: Redis cache-aside fail-open opcional, paginación opaca, pruebas
  sintéticas HTTP/migración y dependencia Redis;
- `cb943ae`: harness owner `httpPruebas/sst.chat.http` alineado con list, save,
  finish y delete durable;
- `0fe7508`: prueba de carrera que impide resurrección de historial stale tras
  invalidación.

El feature flag continúa apagado. `CHAT_REDIS_URL` sólo habilita cache para el
store durable cuando `CHAT_RETENTION_V1_ENABLED=true`; PostgreSQL conserva la
autoridad. Las escrituras durables preceden toda actualización o invalidación
Redis, y las fallas Redis degradan a PostgreSQL.

## Validación

- `npm run test:chat-retention`: PASS; cubre TTL, no persistencia implícita,
  paginación, owner scope, orden PostgreSQL/cache, fail-open y carrera stale.
- `npm run test:chat-retention-http`: PASS con Express efímero y metadata
  sintética.
- `npm run build`: PASS.
- `git diff --check` y sintaxis Node focalizada: PASS.
- `npm run check`: las dos suites anteriores y el smoke de timeout pasan; el
  preflight ARDS se bloquea porque SST no está disponible en
  `localhost:3005`. El gate owner completo permanece abierto.

## Estado y límites

La capability sigue `draft` y `ready_for_consumer=false`. No se ejecutó la
migración contra PostgreSQL real ni se validó Redis real, no se publicó branch
o PR hijo y no se modificaron Jira, Auth, Fend, deployment ni producción.

Siguiente gate lógico: levantar un entorno sintético owner con PostgreSQL,
Redis, SST y scrapper; ejecutar migración up/down, degradación Redis y el
`npm run check` completo antes de evaluar la publicación para `CR-SST-0211`.
