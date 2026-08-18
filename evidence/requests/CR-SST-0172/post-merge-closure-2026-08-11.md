# CR-SST-0172 - Cierre Post-Merge Local/Dev

> Evidencia histórica del 2026-08-11. Preserva el resultado observado entonces,
> pero no reemplaza el contrato de sesión vigente de `CR-SST-0180` ni prueba un
> deployment persistente actual.

## Resultado

Fecha: 2026-08-11.

La vertical hibrida de SST-7 quedo desplegada y validada en local/dev desde
las revisiones fusionadas. Se cierran conjuntamente `CR-SST-0165` a
`CR-SST-0172` porque el gate E2E depende de los siete slices de identidad,
contrato, runtime, persistencia, handoff y frontend.

El resultado promueve la feature a `validated-local` y la capability inbound a
`implemented`. No representa publicacion productiva, topologia multinodo ni
conexion a un proveedor LLM externo con credenciales reales.

## Revisiones Fusionadas De Cierre

| Repositorio | PR | Merge commit | Checks GitHub |
| --- | --- | --- | --- |
| `sst-bend` | `#11` | `0e48398639a0907f4ee774cd5d917cf42fbf9c62` | Node 18, Node 20 y build/publish: SUCCESS |
| `sst-chatbot` | `#5` | `1420e99cc951a7a49e1d071b6480dd19b6252cba` | El repositorio no publica workflow para el PR; check owner local aprobado |
| `sst-fend` | `#10` | `a7e6eea191bbe8dbc7d9cbbdce24e251bdf39a79` | build/publish: SUCCESS |

Los PRs base y correcciones previas ya fusionados permanecen documentados en
`closure-readiness-2026-08-10.md`.

## Despliegue Verificado

- `sst-bend` fue reconstruido y recreado con bind mount al worktree fijado en
  `0e48398`.
- `sst-chatbot` fue reconstruido como `sst7-chatbot:postmerge` desde
  `1420e99`; el contenedor anterior quedo detenido como respaldo recuperable.
- `sst-fend` fue reconstruido y recreado con bind mount al worktree fijado en
  `a7e6eea`.
- `4uentes-auth`, Mongo y Postgres conservaron la configuracion y datos locales
  previamente validados.
- Los secretos M2M y credenciales PG se reutilizaron solo en memoria desde los
  contenedores vigentes; no se imprimieron ni se escribieron en overrides.

## Smokes Post-Merge

### Vertical real

Comando owner equivalente: `node scripts/smoke-chat-real-services.js`.

Resultado final, exit code `0`:

```json
{"ok":true,"conversationId":"6253557b-552f-4ba9-9a8d-3fca130ab47a","receiptId":"5cdc407b-8e40-4fbd-b506-ee0ce047b714","sequences":[1,2],"replayedEvents":2,"persistedMessages":2,"sessionRevoked":true}
```

El recorrido cubrio registro, login y cookies de sesion, conversacion durable,
handshake y room Socket.IO, ack, delta/completed NDJSON, replay, handoff durable
idempotente, evidencia Postgres, logout y rechazo por sesion revocada.

Las primeras invocaciones desde el worktree aislado no se contabilizaron como
PASS: una uso el secreto M2M default del harness y otra intento resolver el
hostname Docker `postgres` desde el host. La pasada aprobatoria heredo en
memoria la identidad M2M configurada y uso el puerto Postgres publicado en
`127.0.0.1`; no hubo cambios de producto para ocultar esos fallos de entorno.

### Recovery

Resultado, exit code `0`:

```json
{"ok":true,"recovery":"server-restart","replayedSequences":[1,2],"persistedMessages":2}
```

### Facade HTTP durable

Resultado, exit code `0`:

```json
{"ok":true,"path":"sst-fend -> 4uentes-auth -> sst-bend","conversationId":"fffe8c67-fdad-40da-a630-42b0112d890c","statuses":{"create":201,"history":200,"delete":204}}
```

### Proveedor LLM simulado

Resultado, exit code `0`:

```json
{"ok":true,"provider_protocol":"openai-compatible-sse","chat_protocol":"application/x-ndjson","event_types":["delta","delta","completed"],"completed_text":"respuesta LLM simulada","principal_forwarded":false}
```

## Checks Owner

- `sst-bend`: suites realtime, security, store idempotency y guards aprobadas;
  `npm run check` aprobado.
- `sst-chatbot`: `scripts/check.py` y 118/118 tests aprobados.
- `sst-fend`: 31/31 suites y 199/199 tests aprobados, build aprobado y lint
  sin errores; conserva 22 warnings heredados de hooks.
- QA manual owner del frontend: confirmado despues de corregir el facade;
  registrado como atestacion porque no se adjunto captura.
- `4uentes-orchestor npm run check`: PASS; catalogo 5 OK, bindings 47 OK con
  4 warnings conocidos de remote local, state 53 OK, initiatives 18 OK y
  owner documentation 92 OK; 0 FAIL.

## Residuales Gobernados

- V1 permanece single-instance local/dev y con flags apagados por defecto.
- Un proveedor LLM externo, credenciales/cuota reales, secret manager,
  packaging canonico del chatbot, proxy WebSocket, sticky sessions, Redis
  Streams y escalado multinodo requieren requests productivos posteriores.
- No se realizaron escrituras Jira durante el cierre.

## Decision

La evidencia satisface el gate local/dev de `CR-SST-0172`. Los requests
`CR-SST-0165` a `CR-SST-0172` pasan a `done`, la feature a `validated-local`,
la capability a `implemented` y `INIT-SST-0007` a `done`. El `npm run check`
integral del control plane permanecio en PASS despues de la reconciliacion.
