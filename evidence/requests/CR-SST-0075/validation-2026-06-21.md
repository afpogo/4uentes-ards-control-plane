# CR-SST-0075 - Validacion 2026-06-21

## Comandos ejecutados

- `sst-fend: npm run check`
- `sst-fend: npx eslint <archivos tocados por CR>`
- `4uentes-orchestor: npm run check`

## Resultado

- `sst-fend: npx eslint <archivos tocados por CR>`: OK
- `4uentes-orchestor: npm run check`: OK
- `sst-fend: npm run check`: FAIL por deuda previa del repo no introducida por
  este CR.

## Observaciones sobre `sst-fend`

- El `check` global sigue rojo por errores `prettier/prettier` y warnings
  `react-hooks/exhaustive-deps` en archivos fuera del alcance de `CR-SST-0075`.
- Los archivos alcanzados por este CR quedaron validados de forma puntual con
  ESLint sin errores.
- La evidencia local indica que el bloqueo restante es baseline del repo y no
  del selector gobernado implementado en este request.

## Smoke runtime con JWT real

- Se ejecuto un smoke end-to-end con JWT real de login sobre runtime local.
- El helper `.runtime/smoke-token.js` de `sst-bend` no alcanzo para el slice del
  BFF por scope/cuenta y devolvio `403`, por lo que no se uso como evidencia
  final de este CR.
- Con JWT real se valido:
  - `GET /api/tags/definitions`
  - `POST /api/tags/values`
  - `POST /api/articulos`
  - `GET /api/articulos/:id?includeTags=true`
  - `PUT /api/articulos/:id` con `tags: []`
  - `DELETE /api/articulos/:id`
- Resultado observado:
  - el detalle del articulo creado devolvio `1` tag;
  - el update posterior con `tags: []` devolvio `0` tags.
- Evidencia detallada: `evidence/requests/CR-SST-0075/runtime-smoke-real-jwt-2026-06-21.md`

## Build frontend 2026-06-23

- Durante QA manual se detectaron errores TypeScript en el selector gobernado de
  tags por `exactOptionalPropertyTypes: true`.
- Se corrigieron los mappers para omitir propiedades opcionales cuando el valor
  es `undefined`.
- `sst-fend: npm.cmd run build`: PASS.
- Webpack mantiene 3 warnings de performance por tamano de bundle.
- Evidencia detallada:
  `evidence/requests/CR-SST-0075/frontend-build-fix-exact-optional-types-2026-06-23.md`

## QA manual frontend 2026-06-23

- Durante la prueba manual se detecto que el alta de tags desde el formulario
  fallaba porque el frontend enviaba `scope` en el body de `POST /api/tags/values`.
- Se confirmo que `node-auth` actua como passthrough para `/api/tags/values`.
- Se removio `scope` del contrato frontend de creacion y del payload enviado por
  `ArticleForm`.
- Se ajusto la UI del selector para que use una superficie tipo carta y estilos
  propios de foco, pastillas y dropdown.
- `sst-fend: npm.cmd run css:types`: PASS.
- `sst-fend: npm.cmd run build`: PASS.
- Evidencia detallada:
  `evidence/requests/CR-SST-0075/frontend-manual-qa-fix-tag-create-ui-2026-06-23.md`

## QA manual final 2026-06-23

- El usuario ejecuto nuevamente la prueba manual de creacion de tags en articulo.
- Resultado reportado: PASS.
- El selector gobernado de tags y el alta de valores quedaron funcionales desde
  la UI.
- Evidencia detallada:
  `evidence/requests/CR-SST-0075/manual-qa-pass-article-governed-tags-2026-06-23.md`

## Jira MCP

- Se intento retomar escritura por MCP Atlassian en este corte.
- La tool `search` devolvio `403` indicando `The app is not installed on this
  instance`.
- La verificacion posterior mostro acceso parcial operativo:
  - el proyecto Jira `SST` es visible;
  - la lectura directa de `SST-23` por issue key funciona;
  - `SST-23` sigue en `En curso`.
- El bloqueo actual queda acotado a `search`/Rovo como health check generico,
  no a toda la conectividad Jira MCP.
- Evidencia detallada:
  `evidence/requests/CR-SST-0075/jira-mcp-access-diagnosis-2026-06-22.md`
