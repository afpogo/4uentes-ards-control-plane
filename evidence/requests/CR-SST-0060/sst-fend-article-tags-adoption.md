# sst-fend Article Tags Adoption

## Estado

- Fecha: 2026-06-11
- Request gobernante: `CR-SST-0060`
- Jira issue: `SST-4`
- Repo: `sst-fend`
- Resultado: frontend adopta tags estructurados para Articulos y publica adopcion ARDS local.

## Cambios Runtime

- `ArticleTag` estructurado agregado como tipo compartido.
- `IArticuloResponse.tags` dejo de ser `string[]`.
- List/detail/tree solicitan `includeTags=true`.
- Create/update envian tags estructurados desde formulario.
- Listado y detalle renderizan labels retornados por el contrato.
- El input inicial de tags usa valores separados por coma y los envia como:
  - `definitionKey: tema`
  - `scope: articulos`
  - `sourceType: article-tag`
  - `producer: frontend`

## Cambios ARDS/SDD En Repo Hijo

- Agregada adopcion inbound:
  `specs/capabilities/inbound/node-auth--article-tags.yaml`.
- Agregada documentacion derivada:
  `docs/capabilities/inbound/node-auth--article-tags.md`.
- Actualizados indices/overviews locales de capabilities y docs.
- Agregada tarea local:
  `docs/tasks/2026-06-11-sst-fend-article-tags-adoption.md`.

## Validacion

- `sst-fend: npm.cmd run build`: pass.
- `sst-fend: targeted article tests`: pass, 7 suites, 64 tests.
- `sst-fend: npm.cmd run check`: pass, 24 suites, 142 tests.

Notas:

- Los comandos que escriben o limpian `dist`/declarations CSS requirieron
  ejecucion elevada por `EPERM` en el sandbox.
- El check completo conserva 22 warnings existentes de
  `react-hooks/exhaustive-deps`.

## Gaps Pendientes

- Ejecutar QA runtime E2E con servicios levantados:
  - create con `tags`;
  - update con `tags`;
  - list con `includeTags=true`;
  - detail con `includeTags=true`.
- Decidir si `sst-extension` queda fuera de fase 1 como productor opcional.
- Reemplazar el input simple por coma por selector gobernado de
  `TagDefinition`/`TagValue` cuando se planifique la UI global de gobierno.
