# Global Tag Model Decision Log

## Estado

- Fecha: 2026-06-13
- Request: CR-SST-0071
- Modo: control-plane contract closure
- Repos funcionales modificados: no
- Jira write ejecutado: no

## Decisiones cerradas

1. Modelo persistido objetivo

- El modelo global queda fijado como `tag_definitions`, `tag_values` y
  `tag_occurrences`.
- No se agregan tablas o columnas por dominio nuevo.

2. Unicidad de `TagValue`

- `TagValue` es reutilizable global por definicion.
- La unicidad queda fijada como `accountId + definitionKey + slug`.
- La unicidad no depende de `scope`, `resourceType` ni del recurso puntual.

3. Separacion de conceptos

- `scope` queda como superficie funcional: `articulos`, `diccionario`.
- `resourceType` queda como tipo tecnico enlazable: `articulo`,
  `diccionario`.
- `learning-content` y `bitacora` quedan reservados como scopes y resource
  types futuros.

4. Ownership de `TagDefinition`

- `TagDefinition` no se crea por accion de usuario final.
- La carga inicial y ampliacion controlada queda para seed o registry de
  sistema en `CR-SST-0072`.

5. Regla de creacion explicita

- La API futura solo podra crear `TagValue` mediante accion explicita.
- Si existe duplicado por `definitionKey + slug`, la respuesta esperada es
  `409`.

6. Legacy mapping

- `dictionary_tag_values` migra conceptualmente a `tag_values`.
- `dictionary_tag_occurrences.article_id` y `.entry_id` migran a
  `tag_occurrences.resourceType + resourceId`.

## Consecuencia operativa

- `CR-SST-0071` no implementa runtime.
- `CR-SST-0072` toma persistencia, seeds y backfill.
- `CR-SST-0073` toma search y resource binding API.
- `CR-SST-0074` toma fachada BFF.
- `CR-SST-0075` toma selector gobernado de Articulos.
- `CR-SST-0076` toma adopcion de Diccionario y cierre de `SST-4`.
