# CR-SST-0172 - Readiness De Cierre Local/Dev

> Evidencia histórica del 2026-08-10; no constituye readback actual de repos,
> sesiones o cluster. Ver la calificación del 2026-08-18 en
> `evidence/initiatives/INIT-SST-0007/canonical-reconciliation-2026-08-18.md`.

## Resultado

Fecha: 2026-08-10.

La vertical híbrida está operativa en local/dev y el owner confirmó el QA
manual después de corregir el facade HTTP durable. La revisión de cierre
detectó dos brechas funcionales adicionales: una carrera en la idempotencia
concurrente de mensajes Postgres y la ausencia de logout explícito ante `403`
en el cliente realtime. Ambas quedaron corregidas, probadas y publicadas en
PRs draft, junto con la cobertura del error parcial NDJSON.

`CR-SST-0172` permanece `running` y la capability permanece `draft`. Los
cambios de cierre todavía deben fusionarse, desplegarse y pasar el smoke
post-merge antes de promover estado.

## Evidencia Base Ya Aprobada

- Implementación inicial:
  `evidence/initiatives/INIT-SST-0007/implementation-validation-2026-08-09.md`.
- Validación con Mongo, Postgres, JWT, Socket.IO, NDJSON y handoff real:
  `evidence/initiatives/INIT-SST-0007/operational-validation-2026-08-10.md`.
- PRs base fusionados: `4uentes-auth#4`, `sst-bend#9`, `sst-chatbot#4` y
  `sst-fend#7`.
- Correcciones post-merge fusionadas: `sst-bend#10` y `4uentes-auth#5`.
- QA manual owner: confirmado después de `4uentes-auth#5`; no se adjuntó una
  captura de navegador y la evidencia se registra como atestación del owner.

## Hallazgos Y Follow-Ups

### sst-bend

- Hallazgo: dos sockets podían superar el `find` previo y competir en el
  `INSERT`. La restricción única protegía Postgres, pero la segunda solicitud
  podía fallar en vez de devolver el mensaje canónico.
- Corrección: inserción `ON CONFLICT DO NOTHING`, recuperación del registro
  canónico y supresión de una segunda invocación al runtime.
- Cobertura nueva: concurrencia idempotente, CORS, aislamiento cross-tenant y
  rooms, tamaño de mensajes, guards y adapter Sequelize.
- Commit: `20389c1`.
- PR draft: https://github.com/afpogo/sst-bend/pull/11.
- GitHub: mergeable/CLEAN; CI Node 18, CI Node 20 y build/publicación de
  imagen en SUCCESS.

### sst-chatbot

- Hallazgo: el contrato implementaba `error` después de una falla del runtime,
  pero no existía una prueba explícita de delta parcial seguido de error.
- Cobertura nueva: `delta -> error`, ausencia de `completed` y ausencia del
  detalle sensible de la excepción en el stream.
- Commit: `e9792f6`.
- PR draft: https://github.com/afpogo/sst-chatbot/pull/5.
- GitHub: mergeable/CLEAN; el repositorio no reporta checks para este PR.

### sst-fend

- Hallazgo: `401` coordinaba refresh y `session_revoked` hacía logout, pero un
  `403` explícito quedaba solamente en estado offline.
- Corrección: clasificación única `401 -> refresh`, `403/revoked -> logout` y
  fallas de red -> offline, aplicada a handshake y `chat:error`.
- Commit: `8f748b3`.
- PR draft: https://github.com/afpogo/sst-fend/pull/10.
- GitHub: mergeable; build/publicación de imagen todavía IN_PROGRESS en la
  última observación de esta revisión.

## Matriz De Aceptación

| Gate | Estado | Evidencia |
| --- | --- | --- |
| `sid`, refresh, logout, introspección, revocación, scopes y service tokens | PASS base | Auth owner check, smoke real y PRs `#4/#5` fusionados |
| CORS/origin, tenant, rooms, límites, ack, duplicados, orden, cancelación y backpressure | PASS local; merge pendiente | suites `test:chat-security`, `test:chat-realtime`, `test:chat-guards` en `sst-bend#11` |
| Replay tras disconnect/restart, retención e idempotencia concurrente | PASS local; merge pendiente | smoke restart previo y tests de store/concurrencia en `sst-bend#11` |
| Streaming, cancelación, error parcial y logs/stream sin secretos | PASS local; merge pendiente | 118/118 tests y smoke SSE simulado en `sst-chatbot#5` |
| Login, refresh/reconnect, logout, offline, historial y deduplicación frontend | PASS local; merge pendiente | 31/31 suites, 199/199 tests y QA manual owner en `sst-fend#10` |
| Checks de owners y control plane | PASS local | checks owner documentados; control-plane debe repetirse al finalizar esta reconciliación |

## Validaciones Ejecutadas En Esta Revisión

- `sst-bend`:
  - `npm run test:chat-realtime` -> PASS.
  - `npm run test:chat-security` -> PASS.
  - `npm run test:chat-store-idempotency` -> PASS.
  - `npm run test:chat-guards` -> PASS.
  - `npm run check` -> PASS; conserva advertencias heredadas por falta de
    `SMOKE_JWT` en endpoints ajenos a SST-7.
- `sst-chatbot`:
  - `scripts/check.py` -> PASS.
  - `pytest` -> 118/118 PASS.
  - smoke OpenAI-compatible SSE a NDJSON -> PASS.
- `sst-fend`:
  - tests realtime focalizados -> 2/2 suites, 4/4 tests PASS.
  - `npm run check` -> 31/31 suites, 199/199 tests, build PASS y lint sin
    errores; permanecen 22 warnings heredados de hooks.
- `4uentes-orchestor`:
  - `npm run check` -> PASS: catálogo 5 OK; bindings 47 OK y 4 warnings de
    remote local distinto del catálogo; state 53 OK; initiatives 18 OK; owner
    documentation 91 OK; 0 fallas.

## Gates Restantes Para Cerrar

1. Esperar y revisar los checks GitHub de `sst-bend#11` y `sst-fend#10`;
   `sst-chatbot#5` no reporta workflow en GitHub y usa su check owner local.
2. Fusionar los tres PRs follow-up.
3. Re desplegar las revisiones fusionadas y repetir:
   - smoke real login -> Socket.IO -> NDJSON -> completed -> replay -> handoff
     -> revocación;
   - smoke de restart recovery;
   - smoke del facade `sst-fend -> 4uentes-auth -> sst-bend`;
   - smoke del provider LLM simulado.
4. Re ejecutar `npm run check` del control plane y sólo entonces evaluar el
   cierre de `CR-SST-0172` y la promoción de la capability.

## Fuera Del Gate Local/Dev

- Un proveedor LLM externo con credenciales/cuota reales no es requisito del
  scope single-instance local/dev; el boundary se valida con proveedor SSE
  simulado. Sigue siendo deuda de productización.
- Secret manager, rotación coordinada productiva, Dockerfile/Compose canónico
  de `sst-chatbot`, proxy WebSocket, sticky sessions, Redis Streams y múltiples
  nodos requieren CRs productivos posteriores.
- No se realizó ninguna escritura Jira durante esta revisión.
