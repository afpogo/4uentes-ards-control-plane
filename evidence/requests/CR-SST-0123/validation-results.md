# CR-SST-0123 - Validation Results

## Estado

- Fecha: 2026-07-05
- Request: `CR-SST-0123`
- Resultado: implementacion validada localmente; browser E2E pendiente por sesion.

## Pruebas focalizadas

Comando:

```bash
npm.cmd test -- LearningWorkspace.test.tsx ArticleCreateFlow.test.tsx --runInBand
```

Resultado:

- PASS.
- Test suites: 2/2.
- Tests: 12/12.

Cobertura agregada:

- `/learning` standalone envia `annotations[]` no vacio en preview.
- La granularidad default `paragraph` genera selector `Parrafo 1`.
- La granularidad `document` genera selector de documento entero.
- `ArticleCreateFlow` sigue pasando como consumidor embebido.

## Gate sst-fend

Comando:

```bash
npm.cmd run check
```

Resultado:

- PASS con ejecucion escalada por escritura en `dist`.
- `[ARDS CHECK] OK`.
- Webpack build: compiled successfully.
- Jest completo: 26 suites / 156 tests passed.

Observaciones preexistentes:

- 22 warnings de `react-hooks/exhaustive-deps`.
- Warnings deprecados de Ant Design en tests existentes.
- Logs `ECONNREFUSED ::1:80` en tests existentes durante `Dictionary`, sin fallo de suite.

## Browser / Chrome DevTools MCP

Se levanto dev server local:

```bash
npm.cmd run start -- --port 4091
```

URL:

- `http://localhost:4091/`

Resultado:

- Dev server compilo correctamente.
- `http://localhost:4091/learning` redirige a portada publica `/` por falta de sesion autenticada en el nuevo origen.
- No se cerro E2E visual porque no se debe marcar `SST-52` ni `SST-48` como Listo sin validar `/learning` autenticado.

Evidencia:

- `evidence/requests/CR-SST-0123/chrome-learning-blank-4091-2026-07-05.png`

## Decision

- Mantener `SST-52` en `En curso`.
- Solicitar login/autenticacion en `http://localhost:4091` o reutilizar un origen autenticado con el bundle actualizado.
- Despues de autenticar, reintentar `/learning`: preview, accept y contexto aceptado con `annotations` y `contentBlocks`.

## Control Plane Final

Comando:

```bash
npm.cmd run check
```

Resultado:

- PASS.
- Owner enforcement reconoce `CR-SST-0123`.
- Se corrigio un bloqueo de enforcement no relacionado: `INIT-PORTFOLIO-0002`
  ahora registra `CR-4UENTES-0027` como CR conocido de origen.

## Jira Sync

- Comentario preparado: `evidence/requests/CR-SST-0123/jira-sst-52-implementation-progress-comment.md`.
- Publicacion a Jira no ejecutada: la llamada fue rechazada por politica de
  salida de datos hacia servicio externo sin aprobacion explicita posterior al
  aviso de riesgo.
- Estado local recomendado para Jira: mantener `SST-52` en `En curso`.

## Update 2026-07-06 - Texto Nativo

Validacion agregada despues del QA manual de articulo `text`:

- `sst-fend`: `npm.cmd test -- LearningWorkspace.test.tsx ArticleCreateFlow.test.tsx --runInBand`
  - PASS.
  - 2 suites / 14 tests.
- `sst-fend`: `npm.cmd run check`
  - PASS.
  - 27 suites / 162 tests.
  - Mantiene warnings preexistentes de hooks/Ant Design/jsdom.
- `sst-bend`: `node --check src/apps/sst/presentation/schemas/articulo.dto.js`
  - PASS.
- `sst-bend`: `node --check src/apps/sst/domain/articulos/article-payload.factory.js`
  - PASS.
- `sst-bend`: validacion runtime minima con Node
  - PASS: `payload.kind=text` con `data: {}` y sin `url/sourceUrl`.
- `sst-bend`: `npm.cmd run check`
  - Exit 0.
  - Observacion: el harness reporta cobertura protegida parcial por falta de
    `SMOKE_JWT`; los smokes autenticados quedan skipped.

## Update 2026-07-07 - LearningContext Separado De Article

Se documento el boundary de capabilities para permitir que QA/UX de `SST-52`
trabaje con la hoja real de generacion de contenido como superficie de
`LearningContext`, separada del recurso vivo `Article`.

Owner docs/specs actualizados:

- `sst-bend`
  - `specs/capabilities/outbound/learning-workspace-context.yaml`
  - `docs/capabilities/outbound/learning-workspace-context.md`
- `node-auth`
  - `specs/capabilities/inbound/sst-bend--learning-workspace-context.yaml`
  - `docs/capabilities/inbound/sst-bend--learning-workspace-context.md`

Validacion:

- `sst-bend`: `npm.cmd run check`
  - Exit 0.
  - Observacion: mantiene warning/harness de cobertura protegida parcial por
    falta de `SMOKE_JWT`; no se ejecutaron smokes protegidos.
- `node-auth`: `npm.cmd run check`
  - PASS.
- `4uentes-orchestor`: `npm.cmd run check`
  - PASS.

Decision:

- `SST-52` puede validarse desde frontend como UX de LearningContext:
  preview, accept/reject y contexto aceptado.
- `SST-52` no debe depender de crear primero un Article ni de una URL externa.
- `SST-53` queda separado como bloqueo runtime de Article text sin URL en
  `/api/articulos`.

## Update 2026-07-10 - Chrome Authenticated E2E

QA autenticado ejecutado con Chrome DevTools MCP en:

```text
http://localhost:4090/learning
```

Resultado:

- `/learning` abre con sesion autenticada.
- `POST /api/learning-workspaces/sources/preview`: 200.
- Preview request incluye `annotations[]` no vacio.
- `POST /api/learning-workspaces/sources/{previewId}/accept`: 201.
- `GET /api/learning-workspaces/context`: 200.
- Template renderizado muestra anotacion aceptada.
- Contexto aceptado contiene `annotations[]` no vacio.
- Contexto aceptado contiene documento `annotated-text-context` con
  `contentBlocks[]` no vacio.
- Consola sin errores JavaScript.

Evidencia:

- `evidence/requests/CR-SST-0123/chrome-authenticated-e2e-pass-2026-07-10.md`
- `evidence/requests/CR-SST-0123/chrome-learning-authenticated-e2e-pass-2026-07-10.png`

Decision:

- `SST-52 / CR-SST-0123` puede transicionar a `Listo`.
- `SST-48 / CR-SST-0118` puede cerrarse despues de sincronizar `SST-52`, porque
  el E2E completo ya tiene evidencia autenticada.
