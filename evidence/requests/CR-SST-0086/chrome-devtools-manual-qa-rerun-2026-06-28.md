# QA Manual Chrome DevTools MCP - Revalidacion

## Alcance

- Request: `CR-SST-0086`
- Fecha: `2026-06-28`
- Frontend: `http://127.0.0.1:4090`
- BF: `http://localhost:4000`
- SST API: `http://localhost:3005`

La revalidacion se ejecuto con usuario local ficticio y valores ficticios. No se
registran JWTs, cookies, master keys ni plaintext de secretos.

## Preparacion Runtime

- `sst-bend`/Postgres, `4uentes-auth`/Mongo y `sst-fend` se levantaron en Docker.
- Primer intento de `create` fallo con `503` en `sst-bend`:
  `Dictionary secrets master key is not configured`.
- Se confirmo que la master key es una precondicion runtime real para create,
  reveal, copy y rotate.
- Para completar QA local, se levanto una instancia SST QA efimera con
  `SST_DICTIONARY_SECRETS_MASTER_KEY` ficticia y alias Docker `sst`, sin escribir
  valores en archivos ni evidencia.

## Flujo Ejecutado

- Chrome DevTools MCP conectado: PASS.
- Alta de usuario local ficticio: PASS.
- Navegacion SPA a `Dictionary > Secretos`: PASS.
- DOM focalizado:
  - `button button`: `0`.
  - campos de secretos con `id`, `name` y `autocomplete`.
  - `dictionary-secret-value`: `autocomplete=new-password`.
- Create secreto ficticio: PASS despues de configurar master key QA.
- List metadata-only/masked: PASS.
  - fila visible con `********`.
  - plaintext no visible.
- Reveal: PASS.
  - plaintext ficticio visible temporalmente.
  - evidencia redactada.
- Auto-hide posterior a reveal/copy: PASS.
  - la UI volvio a `********`.
  - plaintext ficticio no visible.
- Copy: PARTIAL_PASS.
  - el click fue ejecutado desde la UI.
  - la lectura de clipboard desde MCP quedo bloqueada por timeout/permisos del
    navegador, por lo que no se afirma contenido del portapapeles en esta
    revalidacion.
  - luego del intento, la UI permanecio masked y sin plaintext persistente.
- Rotate: PASS.
  - nuevo valor ficticio no quedo visible.
  - campo `dictionary-secret-rotate-value` se limpio.
  - fila siguio masked.
- Revoke: PASS.
  - confirmacion modal `OK` ejecutada.
  - fila paso a `revoked`.
  - alerta `Secreto no activo` visible.
  - `Reveal`, `Copy`, `Revoke` y `Rotar` deshabilitados.

## Hallazgos

- El runtime local no debe considerarse transicionable si
  `SST_DICTIONARY_SECRETS_MASTER_KEY` no esta configurada en el ambiente
  objetivo. Sin esa variable, create falla con `503` y la UI muestra error
  generico.
- El BF requiere que su `SST_BASE_URL` resuelva al host Docker `sst`; al levantar
  una instancia QA fuera del alias esperado, el BF devuelve `Error proxying
  dictionary request`.
- La validacion funcional queda PASS con master key QA y alias Docker correcto.
- La validacion de clipboard queda parcial por limitacion MCP, no por evidencia
  de fuga.

## Decision

`dictionary-secret-management-v1` sigue implementado y funcional en QA local
cuando se cumplen las precondiciones runtime. Para transicionar a
`validated-live` todavia falta reconciliar el issue Jira especifico y confirmar
la master key por ambiente objetivo.
