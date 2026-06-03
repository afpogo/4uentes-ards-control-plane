# CR-SST-0016 - Backend POC Summary

## Resumen

Se implemento un POC backend del motor de tags/prefixers en `sst-bend`.

La primera version es una capa pura de application/domain:

- no agrega migraciones;
- no agrega endpoints HTTP;
- no modifica BFF ni frontend;
- no reemplaza el runtime actual de Diccionario.

## Componentes

Archivos principales en `sst-bend`:

- `src/apps/sst/domain/tags/tag-prefix-entities.js`
- `src/apps/sst/application/tags/tag-prefix-registry.js`
- `src/apps/sst/application/tags/tag-prefix-engine.js`
- `src/apps/sst/application/tags/index.js`
- `scripts/test-tag-engine.js`

## Semantica implementada

Scopes iniciales:

- `diccionario`
- `articulos`
- `learning-content`
- `bitacora`

Materializaciones POC:

- `ContentBlock`
- `TagValue`
- `TagOccurrence`
- `AssetRef`
- `ExternalReference`
- `ImportedReference`

Reglas principales:

- Un prefix se interpreta por el scope activo.
- Un mismo prefix puede tener semantica diferente por scope.
- Prefix desconocido genera warning, no mutacion silenciosa.
- Los aliases se normalizan preservando `rawKey`.
- `diccionario-ref` y `articulo-ref` crean referencias importadas con
  `ownership: external`, no `TagValue` local.

## Capability

Se agrego capability outbound draft en `sst-bend`:

- `specs/capabilities/outbound/sst-tag-prefix-engine.yaml`
- `docs/capabilities/outbound/sst-tag-prefix-engine.md`

## Decision

El estado inicial correcto es `implemented-local`: la base POC existe y tiene
test automatizado, pero todavia no hay endpoint, DB persistida ni adopcion UI.

## Frontend/BFF Boundary

La revision read-only de frontend confirma que este slice no debe modificar UI:

- Articulos todavia trata `tags` como `string[]` y no tiene edicion de tags.
- Diccionario ya tolera tags object-shaped para lectura/filtro.
- El POC no cambia contratos HTTP, por lo tanto `node-auth` y `sst-fend`
  quedan fuera de implementacion en CR-SST-0016.
