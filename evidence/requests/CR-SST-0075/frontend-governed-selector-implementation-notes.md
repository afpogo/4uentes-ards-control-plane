# CR-SST-0075 - Implementacion frontend selector gobernado

- Fecha: 2026-06-21
- Repo objetivo: `sst-fend`
- Jira: `SST-23`
- Request: `CR-SST-0075`

## Alcance implementado

- Se reemplazo la captura libre `tagsText` por `tags` estructurados en el
  formulario de Articulos.
- Se agrego cliente frontend para BFF tags governance:
  - `GET /api/tags/values`
  - `POST /api/tags/values`
  - `GET /api/tags/definitions` queda preparado en el servicio aunque no se
    consume todavia en este corte.
- El selector ahora:
  - busca valores gobernados por `scope=articulos`,
    `resourceType=articulo`, `definitionKey=tema`;
  - permite seleccionar multiples valores reutilizables;
  - permite crear un `TagValue` explicito cuando no existe coincidencia exacta.
- Los payloads de create/update de Articulos envian `tags` estructurados.
- Los updates ya preservan `tags: []` para detach total cuando el usuario limpia
  la seleccion.

## Boundary respetado

- No se modifico `sst-bend`.
- No se modifico `4uentes-auth`.
- No se modifico `sst-extension`.
- No se introdujo CRUD de `TagDefinition` desde UI.
