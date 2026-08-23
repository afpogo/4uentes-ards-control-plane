# Validación integrada local CR-SST-0204

## Resultado

El cuarto slice de `sst-bend` quedó preservado localmente en `1fe43de` sobre
`feat/CR-SST-0204/chat-retention-contract`. La capability continúa `draft` y
no fue publicada.

## PostgreSQL 11

- suite completa de migraciones: PASS;
- migración `20260822090000-add-chat-retention-lifecycle`: `up/down/up` PASS;
- el `down` removió `chat_retention_promotions`, `retention_mode` y `saved_at`;
- el `up` restauró default `saved-legacy` e índice único
  `tenant_id + account_id + user_id + idempotency_key`;
- una fila sintética preexistente quedó clasificada `saved-legacy` con
  `saved_at IS NULL`; luego fue eliminada.

## Redis 7 y autoridad durable

- Redis disponible: PASS para no persistencia temporal, promoción PostgreSQL,
  cache de historial, idempotencia, delete y purga física de payloads;
- Redis detenido: PASS fail-open hacia PostgreSQL con timeout y cooldown
  acotados;
- la existencia y ownership se revalidan siempre en PostgreSQL, evitando que
  metadata stale sobreviva lógicamente a un delete cuya invalidación Redis
  haya fallado;
- las keys de historial quedan indexadas por conversation ID opaco para que el
  delete post-commit elimine los bytes y no dependa sólo del TTL.

## Gate owner

- `npm run test:chat-retention`: PASS.
- `npm run test:chat-retention-http`: PASS.
- `npm run smoke:chat-retention:postgres-redis`: PASS con Redis disponible y
  PASS con Redis indisponible.
- `npm run build`: PASS.
- `npm run check`: exit code 0 con SST activo y retention flag encendido.

El harness informó skips de endpoints protegidos ajenos a retención porque no
se proporcionó un JWT de QA. No se usaron credenciales reales. Los fixtures se
eliminaron y los contenedores efímeros se apagaron.

## Límites

No hubo push, PR, Jira, Auth, Fend, deployment ni producción. La validación
habilita `owner_tests_passed: true`, pero no cambia
`publication_status: draft` ni `ready_for_consumer: false`. El siguiente gate
es revisión/publicación explícita del owner antes de destrabar `CR-SST-0211`.
