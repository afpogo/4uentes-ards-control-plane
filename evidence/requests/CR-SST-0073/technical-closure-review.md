# CR-SST-0073 Revision Tecnica De Cierre

## Estado

- Date: 2026-06-18
- Request: CR-SST-0073
- Jira issue: SST-21
- Jira status: En curso
- Scope reviewed: `sst-bend` backend producer-side API y evidencia local ARDS/SDD

## Hallazgos

Se encontro un problema bloqueante de migracion durante la validacion real de
DB local:

- `20260613120000-create-global-tag-tables.js` paso checks sintacticos/unitarios
  pero fallo en `sequelize-cli db:migrate` real porque los valores JSONB en
  `bulkInsert` no estaban serializados.
- Fix applied: serializar JSONB `metadata` y `allowed_resource_types` con
  `JSON.stringify` en las filas insertadas por la migracion.
- La migracion parcial local fallida dejo las tablas `tag_definitions`,
  `tag_values` y `tag_occurrences`. Esas tres tablas parciales se dropearon
  localmente y la migracion se re-ejecuto con exito.

Se encontro un problema de alineacion de contrato API:

- `PUT /tags/resources/:resourceType/:resourceId` aceptaba inicialmente los
  resource types reservados `learning-content` y `bitacora` en el schema Joi de
  params, pero el repositorio solo soporta `articulo` y `diccionario`.
- Fix applied: el schema de params ahora permite solo los resource types
  bindables iniciales `articulo` y `diccionario`, mientras que los filtros de
  query para definition/value siguen aceptando scopes/resource types reservados
  para discovery.

## Validacion De DB

Resultado de migracion en Postgres local:

```text
npm run migration:run
== 20260613120000-create-global-tag-tables: migrated
```

Conteos post-migracion:

```text
tag_definitions: 39
tag_values: 21
tag_occurrences: 45
legacy_values: 21
legacy_occurrences: 45
```

Indices verificados:

- `tag_definitions_key_unique`
- `tag_definitions_scope_status_idx`
- `tag_values_account_definition_slug_unique`
- `tag_values_account_definition_idx`
- `tag_occurrences_account_resource_idx`
- `tag_occurrences_account_source_idx`
- `tag_occurrences_account_definition_idx`

## Validacion De Boundary Runtime

Pruebas de rutas no autenticadas:

```text
GET /4uentes/v1/tags/definitions -> 401
GET /4uentes/v1/tags/values -> 401
PUT /4uentes/v1/tags/resources/articulo/:id -> 401
```

No se ejecutaron pruebas runtime autenticadas porque no habia `SMOKE_JWT` ni
`SMOKE_JWT_OWNER` disponibles en el entorno.

## Decision

La implementacion backend producer-side de `CR-SST-0073` queda tecnicamente mas
fuerte despues de la validacion real de migracion. El gap runtime restante es
la verificacion de endpoints autenticados con owner JWT.
