# Changed Files Summary

## `sst-bend`

- `db/migrations/20260613120000-create-global-tag-tables.js`
  - crea tablas globales, indices, seed y backfill inicial.
- `db/models/tag-definition.js`
- `db/models/tag-value.js`
- `db/models/tag-occurrence.js`
  - agregan los modelos Sequelize del nuevo store global.
- `db/models/index.js`
  - registra los nuevos modelos en el bootstrap de Sequelize.
- `src/apps/sst/application/tags/global-tag-definitions.js`
  - centraliza seed/inferencia de `TagDefinition`.
- `src/apps/sst/infrastructure/db/postgres/diccionario/sequelize-dictionary-domain.repository.js`
  - agrega dual-write temporal sin alterar readers publicos.

## Cambios preexistentes preservados

- El repo `sst-bend` ya tenia cambios locales no relacionados en docs, specs,
  rutas de tags prefix-engine y otros archivos. No se revirtieron ni se
  mezclaron con este CR mas alla del mismo working tree.
