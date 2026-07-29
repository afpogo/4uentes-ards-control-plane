# Implementacion De Persistencia Global En SST Bend

## Alcance implementado

1. Persistencia global

- Se agregaron las tablas objetivo `tag_definitions`, `tag_values` y
  `tag_occurrences`.
- `tag_values` conserva la unicidad `accountId + definitionKey + slug`.
- `tag_occurrences` usa `resourceType + resourceId` en lugar de columnas
  especificas de dominio.

2. Seed y backfill

- El seed inicial toma definiciones del registry actual de tags, del lifecycle
  legacy de diccionario y del contrato de gobernanza.
- Se agrego inferencia tolerante para keys legacy observadas en datos, evitando
  que el backfill falle por definiciones no sembradas explicitamente.
- Los valores de `dictionary_tag_values` se copian en `tag_values`.
- Las ocurrencias de `dictionary_tag_occurrences` se copian en
  `tag_occurrences` mapeando:
  - `entry_id -> resourceType=diccionario`
  - `article_id -> resourceType=articulo`

3. Dual-write temporal

- `findOrCreateTagValue` sigue operando sobre `dictionary_tag_values` y ahora
  tambien asegura el espejo en `tag_values`.
- `syncEntryTags` sigue escribiendo `dictionary_entry_tags` y
  `dictionary_tag_occurrences`, y ademas crea ocurrencias globales para
  `resourceType=diccionario`.
- `syncArticleTags` sigue escribiendo ocurrencias legacy de articulo y ademas
  crea ocurrencias globales para `resourceType=articulo`.
- Para articulos, el replace actual tambien limpia las ocurrencias globales del
  mismo recurso y `sourceType=article-tag` antes de recrearlas.

## Fuera de alcance mantenido

- No se expuso CRUD publico de `TagDefinition`.
- No se migraron los readers publicos al modelo global.
- No se tocaron `4uentes-auth`, `sst-fend` ni `sst-extension`.
