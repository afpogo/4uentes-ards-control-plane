# Validacion Runtime De Master Key

## Contexto

- Request: `CR-SST-0086`
- Jira: `SST-26`
- Capability: `dictionary-secret-management-v1`
- Fecha local: `2026-06-28`
- Alcance: validar configuracion y comportamiento de
  `SST_DICTIONARY_SECRETS_MASTER_KEY` sin registrar valores secretos.

## Politica De Agentes

- Task weight: `complex-high-risk-task`.
- Modelo/politica aplicada: validacion principal en agente actual, con
  subagentes read-only para backend y BFF/frontend.
- Subagentes:
  - Backend/security config: PASS, read-only.
  - BFF/frontend contract: PASS, read-only.
- Fallback: no requerido para subagentes; ambos completaron.

## Resultados De Configuracion

- GitHub Secret `SST_DICTIONARY_SECRETS_MASTER_KEY`: PRESENTE en repo
  `afpogo/sst-bend`.
- Metadata observada por `gh secret list`: actualizado en
  `2026-06-29T01:35:30Z`.
- Valor del secreto: no consultado, no imprimible por GitHub Actions secrets y
  no registrado.
- `sst-bend/.env.example`: contiene referencia/documentacion para
  `SST_DICTIONARY_SECRETS_MASTER_KEY` y `SST_DICTIONARY_SECRETS_KEY_REF`.
- `sst-bend/docker-compose.yml`: inyecta ambas variables en `services.sst`.
- `sst-bend/.env` local observado en la ruta validada: no contiene una linea
  canonica `SST_DICTIONARY_SECRETS_MASTER_KEY=...`.

## Resultados De Runtime

- Docker Compose con master key QA efimera:
  - `SST_DICTIONARY_SECRETS_MASTER_KEY=set`: PASS.
  - `SST_DICTIONARY_SECRETS_KEY_REF=env:SST_DICTIONARY_SECRETS_MASTER_KEY`:
    PASS.
- `npm.cmd run test:diccionario:secrets`: PASS.
- `npm.cmd run test:diccionario:stage3`: PASS, 11/11.
- `npm.cmd run build` en `sst-bend`: PASS.
- `npm.cmd run check` en `sst-bend`: PASS con exit code 0. Mantiene cobertura
  protegida parcial por falta de `SMOKE_JWT`/`SMOKE_JWT_OWNER`.
- `npm.cmd run build` en `4uentes-auth`: PASS.
- `npm.cmd run check` en `4uentes-auth`: PASS.
- `npx.cmd eslint src/pages/Dictionary/components/DictionarySecretsPanel.tsx`:
  PASS.
- `npm.cmd run build` en `sst-fend`: PASS con warnings de bundle size
  preexistentes.
- `npm.cmd run check` en `sst-fend`: PASS. Mantiene 22 warnings lint
  preexistentes y warnings de consola en tests; 25 suites y 147 tests pasan.

## Smoke HTTP End-To-End

Ruta probada via BFF `http://localhost:4000/api/diccionario/secrets/*` con
usuario y secreto dummy efimeros:

- register/login: PASS.
- create: PASS.
- list metadata-only: PASS.
- detail metadata-only: PASS.
- reveal: PASS.
- copy endpoint: PASS.
- rotate: PASS.
- revoke: PASS.
- Plaintext/JWT/master key impresos: NO.

Nota: la API metadata-only no devuelve una senal textual `masked`, pero no
devuelve campos prohibidos (`value`, `secret`, `plaintext`, `plainText`,
`decryptedValue`) fuera de `reveal`/`copy`.

## Chrome DevTools MCP

Chrome DevTools MCP conectado y usado para smoke same-origin desde
`http://127.0.0.1:4000`:

- register/login: PASS.
- create/list/detail metadata-only: PASS.
- reveal/copy: PASS.
- rotate/revoke: PASS.
- dummy secret en DOM: false.
- dummy secret en localStorage: false.
- dummy secret en sessionStorage: false.
- token/master key/plaintext real impreso: NO.

Intento desde `http://127.0.0.1:4090/dictionary` hacia BFF fallo con
`Failed to fetch`, compatible con bloqueo CORS/origen en el contexto MCP. No
bloquea la validacion del runtime de master key porque el smoke HTTP y el smoke
same-origin por Chrome validaron BFF/backend.

## Decisiones

1. La master key esta validada a nivel codigo, tests y runtime Docker cuando el
   entorno la inyecta.
2. GitHub Secret existe, pero por si solo no alimenta el runtime local ni el
   contenedor. Para usarlo en despliegue, el workflow debe pasar el secret al
   mecanismo runtime correspondiente.
3. En la ruta local observada, `.env` no contiene la key canonica. Para Docker
   local, debe agregarse localmente o exportarse en la shell antes de
   `docker compose up -d sst`.
4. No promover a `validated-live` hasta confirmar el ambiente objetivo real:
   local Docker, k8s/ngrok, dev o staging.

## Gaps

- Wire de GitHub Actions: el workflow observado no referencia
  `SST_DICTIONARY_SECRETS_MASTER_KEY`; el secret existe, pero aun no hay
  evidencia de que el deploy lo aplique al runtime.
- `.env` local de `sst-bend` en esta ruta no contiene la key canonica; si el
  usuario la creo en otra ruta o archivo, falta alinear la fuente local.
- La lectura independiente de clipboard UI sigue dependiendo de permisos del
  navegador; endpoint `copy` fue validado por HTTP y Chrome MCP.
