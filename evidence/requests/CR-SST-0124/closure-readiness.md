# CR-SST-0124 - Closure Readiness

## Estado

- Fecha: 2026-07-07
- Request: `CR-SST-0124`
- Jira mirror: `SST-53`
- Estado: bloqueado por QA manual autenticado.

## Completado

- `sst-fend` expone runtime URL para articulos `text` nativos creados.
- La runtime URL se deriva desde `window.location.origin` y
  `/leafArticulo/:articleId`.
- La runtime URL no se persiste como `url` ni `payload.data.sourceUrl`.
- Articulos web conservan su URL externa como fuente.
- Owner docs de `sst-fend` fueron actualizadas.
- El boundary Articulo vs `LearningWorkspace` quedo documentado en
  control-plane.

## Validacion Ejecutada

- `npm.cmd test -- ArticleCreateFlow.test.tsx --runInBand`: PASS.
- `npm.cmd run check` en `sst-fend`: PASS.
- `npm.cmd run check` en `4uentes-orchestor`: PASS.

## QA Pendiente

QA manual autenticado en `/artsst`:

1. Crear articulo `text` sin URL externa.
2. Confirmar que el response no persiste URL falsa ni `sourceUrl` artificial.
3. Confirmar que el resultado muestra runtime URL interna.
4. Abrir runtime URL y verificar que navega a la hoja/detalle del articulo.
5. Confirmar que no dispara scraping ni `LearningWorkspace` automaticamente.

## Bloqueo Observado

Chrome DevTools MCP pudo abrir `http://localhost:4090/artsst`, pero la app
redirigio a `http://localhost:4090/` por falta de sesion autenticada.

Se abrio el formulario `Sign in`, pero no habia credenciales gobernadas en el
contexto. No se usaron ni persistieron secretos, cookies o credenciales.

## QA Autenticado

El QA autenticado posterior si pudo abrir `/artsst`, crear un borrador `Text`
sin source reference y enviar `POST /api/articulos`.

Resultado:

- request sin URL falsa ni `payload.data.sourceUrl` artificial;
- `payload.kind`: `text`;
- `payload.data`: `{}`;
- respuesta runtime: `400 {"error":"Missing url"}`.

Evidencia: `evidence/requests/CR-SST-0124/chrome-devtools-authenticated-qa-blocker.md`.

## Jira

`SST-53` fue comentado con la evidencia de bloqueo y devuelto de `En revision`
a `En curso` mediante Atlassian MCP. No se transiciono a `Listo`.

## Decision

No transicionar Jira a cierre. La primera etapa no puede cerrarse hasta que el
runtime detras de `/api/articulos` acepte articulos `text` nativos sin `url` ni
`payload.data.sourceUrl`, o hasta que se confirme y despliegue la version de
backend/BFF que ya contiene esa alineacion.
