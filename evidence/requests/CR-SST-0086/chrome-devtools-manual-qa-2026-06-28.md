# QA Manual Chrome DevTools MCP

## Alcance

Pasada manual con Chrome DevTools MCP sobre el runtime local:

- Frontend: `http://localhost:4090`
- BF: `http://localhost:4000`
- SST API: `http://localhost:3005`
- Request: `CR-SST-0086`
- Fecha: `2026-06-28`

La QA se ejecuto con usuario local ficticio y valores ficticios. No se registran
credenciales, JWTs, cookies, master keys ni plaintext de secretos.

## Policies Revisadas

- `specs/integration/policies.yaml`
- `docs/policies/README.md`
- `docs/policies/agent-architecture-boundary-policy.md`
- `docs/policies/agent-context-management-policy.md`

Aplicacion durante la QA:

- preservar evidencia sin redefinir contratos ARDS/SDD;
- usar runtime local y request existente antes de mutar o validar repos hijos;
- no registrar datos sensibles;
- documentar blockers y observaciones separadas de resultados funcionales.

## Preparacion

- Se verifico que `localhost:4090`, `localhost:4000` y `localhost:3005`
  respondian.
- El primer intento de QA detecto bundle stale en `sst-fend` Docker:
  `4090` servia un bundle anterior sin los nuevos `id/name/autocomplete`.
- Se reinicio `docker compose restart sst-fend` en `sst-fend`.
- La segunda pasada uso el bundle nuevo `home.592175cbb7ff787aa008.js`.

## Flujo Ejecutado

- Login inicial con credencial historica documentada: bloqueo `401`.
- Alta de usuario local ficticio: PASS.
- Login con usuario local ficticio: PASS.
- Navegacion a `Dictionary` > `Secretos`: PASS.
- DOM/a11y focalizado:
  - `button button`: `0`.
  - fila de secreto: `article`.
  - fila seleccionada: `aria-selected=true`.
  - acciones `Reveal`, `Copy`, `Revoke`: botones reales con accessible name.
  - campos principales con `id`, `name` y `autocomplete`.
  - `dictionary-secret-value`: `autocomplete=new-password`.
  - `dictionary-secret-rotate-value`: `autocomplete=new-password`.
- Create secreto ficticio: PASS, `POST /api/diccionario/secrets` devolvio `201`.
- List metadata-only/masked: PASS, fila mostro `********`.
- Reveal: PASS, el valor se mostro temporalmente y volvio a masked despues del
  TTL de 60s.
- Copy: PASS, no dejo plaintext persistente en la fila.
- Rotate: PASS, el campo de nuevo valor se limpio y la fila siguio masked.
- Revoke: PASS, la fila quedo masked y con estado `revoked`.

## Endpoints Observados

Se observaron llamadas autenticadas a:

- `GET /api/diccionario/secrets?limit=100`
- `POST /api/diccionario/secrets`
- `POST /api/diccionario/secrets/<id-redacted>/reveal`
- `POST /api/diccionario/secrets/<id-redacted>/copy`
- `POST /api/diccionario/secrets/<id-redacted>/rotate`
- `DELETE /api/diccionario/secrets/<id-redacted>`

## Evidencia Visual

- `evidence/requests/CR-SST-0086/qa-chrome-secrets-revoked-masked-2026-06-28.png`

La captura final muestra el secreto de QA en estado `revoked` y con valor
masked. No contiene plaintext del secreto ni tokens.

## Observaciones

- La consola conserva warnings no relacionados con `DictionarySecretsPanel`:
  `fetchPriority` en landing y `findDOMNode` desde componentes/Ant Design.
- No se observo `validateDOMNesting` durante la pasada actual.
- La home/workspace disparo muchas solicitudes repetidas a
  `/api/articulos?page=1&limit=10&includeTags=true` con `304`. No bloquea
  secrets, pero conviene investigarlo en otro request.
- El `fill` automatizado de Chrome DevTools duplico el texto de categoria
  (`api_keyapi_key`) durante create. El backend lo acepto como metadata; no es
  fuga de secreto, pero indica que los campos libres aceptan categorias
  arbitrarias.

## Resultado

PASS para QA manual Chrome DevTools MCP del flujo v1
create/list/reveal/copy/rotate/revoke, DOM sin nested buttons, list masked,
reveal auto-hide de 60s y copy sin persistencia visible de plaintext.
