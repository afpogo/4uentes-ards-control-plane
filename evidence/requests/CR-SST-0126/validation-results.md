# CR-SST-0126 - Resultados De Validacion

Fecha: 2026-07-10

## `sst-fend`

- `npm.cmd test -- LearningWorkspace.test.tsx ArticleCreateFlow.test.tsx --runInBand`
  - PASS en la segunda ejecucion: 2 suites, 17 tests.
  - El primer intento agoto 120 segundos sin resultado; la repeticion con una
    ventana mayor completo en aproximadamente 60 segundos.
- `npm.cmd run check`
  - PASS.
  - ARDS check: OK.
  - Build webpack: PASS.
  - Tests completos: 27 suites, 167 tests, todos PASS.
  - Lint: 0 errores y 22 warnings historicos de
    `react-hooks/exhaustive-deps`.
  - La suite mantiene warnings preexistentes de AntD/JSDOM/StrictMode.

## Owner Documentation

- IDs reconciliados: `sst-sheet-workspace-ui`, `CR-SST-0126`, `SST-54`.
- `CR-SST-0126` es el link principal de
  `specs/38-learning-workspace-frontend.yml`.
- `CR-SST-0124` permanece en `previous_request_ids`.
- `specs/capabilities/inbound/node-auth--learning-workspace-context.yaml` no
  fue modificado y conserva `CR-SST-0123`.

## QA Visual

EJECUTADO con sesion autenticada. El layout desktop/mobile, el apilado del rail,
la ausencia de overflow y la separacion de acciones de Articles/Learning pasan.
La pantalla final de creacion falla: un articulo creado como `Text` aparece
rotulado `Web`. Ver
`evidence/requests/CR-SST-0126/authenticated-visual-qa-2026-07-10.md`.

## Control Plane

- `npm.cmd run check`: PASS.
- Catalogo: 5 OK, 0 WARN, 0 FAIL.
- Bindings locales: 39 OK, 0 WARN, 0 FAIL.
- State model: 50 OK, 0 WARN, 0 FAIL; 45 capability links validos.
- Initiatives: 13 OK, 0 WARN, 0 FAIL.
- Owner documentation: 47 OK, 0 WARN, 0 FAIL; los gates de
  `CR-SST-0126` y `CR-SST-0127` son validos.
- La primera ejecucion posterior al QA detecto correctamente que
  `owner_documentation.status: pending` no era un valor admitido para
  CR-SST-0127. Se corrigio a `planned` y la repeticion completa paso.

## Decision De Estado

La automatizacion y el layout sostienen `validated-local`, pero no habilitan
`ready-for-release`. El cierre local y Jira `Listo` quedan bloqueados por el
defecto separado en CR-SST-0127 / SST-56.
