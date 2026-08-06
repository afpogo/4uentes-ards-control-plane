# CR-SST-0076 - Bugfix de shape de tags en Dictionary Management

## Estado

- Fecha: 2026-06-24
- Request: `CR-SST-0076`
- Jira: `SST-24`
- Servicio afectado: `sst-fend`

## Problema observado

Durante QA manual, al seleccionar una entry en `Diccionario > Gestion`, la UI
mostraba una notificacion con:

```text
(intermediate value)(intermediate value)(intermediate value).map is not a function
```

## Causa

La UI de Dictionary Management asumía que los tags siempre llegaban como array:

- `entry.tagValues`
- `entry.tags`
- `tagGovernanceService.getValues(...).data`

Ese supuesto no era suficientemente defensivo para la convivencia actual entre
legacy dictionary tags y tag governance. En runtime esas superficies pueden
llegar como:

- array directo;
- envelope con `items`, `data`, `results`, `tagValues` o `tags`;
- objeto unico de tag;
- valor ausente.

Cuando el valor no era array, el click de seleccion de entry o la carga de
opciones gobernadas podia ejecutar `.map()` sobre un objeto/envelope.

## Solucion aplicada

En `sst-fend/src/pages/Dictionary/index.tsx` se agrego normalizacion defensiva:

- `asRecord` para distinguir objetos plain de arrays/nulls.
- `extractTagList` para convertir arrays, envelopes y objeto unico en lista.
- `getEntryTagValues` para leer `entry.tagValues ?? entry.tags` sin asumir array.
- `loadGovernedTagOptions` usa `extractTagList(response.data)` antes de mapear.
- `Select.onChange` valida `Array.isArray(selectedKeys)` antes de mapear.

El cambio preserva el contrato HTTP y evita cambiar DTOs publicos.

## Validacion

Comando:

```bash
npm.cmd run build
```

Resultado:

- PASS.
- Webpack compilo con 3 warnings de performance por bundle grande.
- No hubo errores TypeScript ni errores de CSS modules.

Comando:

```bash
npm.cmd test -- src/pages/Dictionary/__tests__/Dictionary.test.tsx
```

Resultado:

- PASS.
- Test suite: 1 passed.
- Tests: 8 passed.
- Warnings no bloqueantes preexistentes:
  - fallback de `VITE_BF_BASE_URL` en ambiente test;
  - deprecations de Ant Design para `popupClassName` y `dropdownRender`.

## Riesgo residual

Queda recomendado repetir QA manual con el backend real:

- abrir `Diccionario > Gestion`;
- seleccionar entries con y sin tags;
- seleccionar entries con tags legacy;
- crear o editar tags gobernados;
- confirmar que no aparece la notificacion `.map is not a function`.

## QA manual posterior - creacion y busqueda de tags

Fecha: 2026-06-24

Herramienta:

- Chrome DevTools MCP sobre `http://localhost:4090/dictionary`.
- Runtime Docker local con `sst-fend` reiniciado para aplicar cambios.

Problema adicional reproducido:

- Al crear un tag desde `Diccionario > Gestion > Governed tags`, el frontend
  enviaba `definitionKey="tema"` junto con `resourceType="diccionario"`.
- SST respondia `400 Bad Request`.
- Body observado:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "TagDefinition is not allowed for resourceType"
}
```

Causa:

- `tema` esta permitido en DB para `allowed_resource_types=["articulo"]`.
- Las definitions activas de diccionario usan keys propias, por ejemplo
  `diccionario.area`, `diccionario.name`, `diccionario.desc`.
- La UI de Dictionary estaba reutilizando el default conceptual de Articulos.

Solucion aplicada:

- `sst-fend/src/pages/Dictionary/index.tsx` cambia el default de Dictionary de
  `tema` a `diccionario.area`.
- `diccionario.area` preserva la semantica vigente de tags de Diccionario como
  area/filtro materializado.

Evidencia runtime:

- Antes del fix:
  - `POST /api/tags/values` -> `400`.
  - Request body:

```json
{
  "definitionKey": "tema",
  "label": "QA Dictionary Tag 624Q",
  "resourceType": "diccionario",
  "metadata": {
    "producer": "frontend"
  }
}
```

- Despues del fix y restart de Docker:
  - `GET /api/tags/values?scope=diccionario&resourceType=diccionario&definitionKey=diccionario.area` -> `200`.
  - `POST /api/tags/values` -> `201`.
  - Request body:

```json
{
  "definitionKey": "diccionario.area",
  "label": "QA",
  "resourceType": "diccionario",
  "metadata": {
    "producer": "frontend"
  }
}
```

  - Response body:

```json
{
  "id": "d91dd176-9d88-4565-ac1a-0ddf37fc1e64",
  "definitionKey": "diccionario.area",
  "label": "QA",
  "slug": "qa",
  "status": "active",
  "ownership": "account-owned",
  "metadata": {
    "producer": "frontend"
  }
}
```

  - `GET /api/tags/values?scope=diccionario&resourceType=diccionario&definitionKey=diccionario.area&q=Q` -> `200`.
  - La respuesta incluyo el tag creado `QA`.

Validacion adicional:

- `sst-fend`: `npm.cmd run build` PASS con 3 warnings de performance conocidos.
- `sst-fend`: `npm.cmd test -- src/pages/Dictionary/__tests__/Dictionary.test.tsx` PASS 8/8.
- `sst-fend`: `docker compose restart sst-fend` ejecutado para aplicar el cambio al runtime QA.

Notas de consola:

- No quedaron errores funcionales del flujo de tags despues del fix.
- Persisten warnings conocidos de React Router future flags y deprecations de
  Ant Design `popupClassName`/`dropdownRender`.
- Durante el restart/reload del dev server aparecieron errores transitorios de
  HMR/MIME por bundle anterior, no reproducidos como fallo funcional del flujo.
