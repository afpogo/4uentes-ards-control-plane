# CR-SST-0126 - QA Visual Autenticado

Fecha: 2026-07-10

## Sesion Y Superficies

QA ejecutado con una sesion real autenticada como Andres Pogo Fuentes mediante
Chrome DevTools MCP contra `http://localhost:4090`.

- Desktop: ventana solicitada `1440x900`; el area de contenido reportada por
  Chrome fue aproximadamente `1443x732` por el chrome del navegador.
- Mobile: emulacion exacta `390x844`, DPR 1, touch habilitado.
- Articulo existente: `47f4fa14-3fbe-4d61-b1f0-0f542ed551b2`.
- Articulo creado durante QA: `QA CR-SST-0126 Sheet Workspace`.

## Resultado De Layout

PASS para el contrato visual de `SstSheetWorkspace`:

- `/artsst` lista, detalle y edicion sin overflow horizontal ni solapamientos.
- Creacion `Text` conserva el formulario editorial como accion primaria.
- `SST Workspace` embebido abre de forma opcional y no reemplaza la creacion.
- `/learning` standalone conserva editor, relevancia y revision propios.
- Mobile `/learning`: `scrollWidth=clientWidth=390`; el rail de relevancia
  aparece debajo del editor y la revision debajo del rail.
- Mobile edit: dialogo de aproximadamente 374 px dentro del viewport; el rail
  de snapshot aparece debajo del formulario.
- Mobile create/embedded: hoja editable arriba y preview de Learning debajo;
  sin overflow horizontal (`scrollWidth=clientWidth=390`).

## Consola Y Red

- Consola: dos mensajes de deprecacion Ant Design ya existentes:
  `popupClassName` y `dropdownRender` en `Select`.
- Sin excepciones runtime atribuibles a `SstSheetWorkspace`.
- Red preservada al cierre: documento, refresh de auth, listado de articulos y
  valores de tags. Los `304` son respuestas de cache, no fallos funcionales.
- No aparecieron requests HTTP nuevos al abrir el primitive compartido.

## Defecto Bloqueante

FAIL en la coherencia funcional del resultado de creacion:

1. Se selecciono `Text`, se completo preview y se creo el articulo.
2. El catalogo aumento de 43 a 44 elementos y lista el nuevo articulo como
   `Text`.
3. El paso `Article created` muestra, de forma incorrecta, `Web`.
4. La causa se confirmo por inspeccion de codigo en
   `ArticleCreateFlow.tsx`: `created?.payload?.kind ?? 'web'` no usa el kind del
   formulario si la respuesta no devuelve `payload.kind`.

El defecto exige codigo y queda fuera del alcance documental de CR-SST-0126.
Se reservaron CR-SST-0127 y Jira SST-56 como bugfix separado. CR-SST-0126 y
SST-54 permanecen abiertos.

## Capturas

- `qa-desktop-articles-list-1440x900.png`
- `qa-desktop-article-detail-1440x900.png`
- `qa-desktop-article-edit-1440x900.png`
- `qa-desktop-text-create-1440x900.png`
- `qa-desktop-embedded-workspace-1440x900.png`
- `qa-desktop-text-created-1440x900.png`
- `qa-desktop-learning-1440x900.png`
- `qa-mobile-learning-exact-390x844.png`
- `qa-mobile-article-edit-390x844.png`
- `qa-mobile-text-create-390x844.png`
- `qa-mobile-embedded-workspace-390x844.png`

## Decision

- Mantener `sst-sheet-workspace-ui` en `validated-local`.
- Mantener CR-SST-0126 en `planned` y SST-54 en `En curso`.
- No mover a `ready-for-release`, `done` ni Jira `Listo`.
- Implementar y validar CR-SST-0127 antes de repetir el paso de creacion.
