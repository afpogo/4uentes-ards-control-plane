# 4uentes-auth Article Tags BFF Boundary

## Estado

- Fecha: 2026-06-11
- Request gobernante: `CR-SST-0060`
- Jira issue: `SST-4`
- Repo: `4uentes-auth` (`node-auth` path local)
- Resultado: BFF boundary actualizado y publicado como capability ARDS local.

## Cambios Runtime

- `ArticuloDTO` y `UpdateArticuloDTO` aceptan `tags` estructurados con
  `definitionKey` y `label` obligatorios.
- Create idempotente y create directo preservan `tags` dentro de
  `ArticuloEntity`.
- El datasource forwardea `tags` en create/update y `includeTags` en detail.
- El controller forwardea `includeTags` en list/detail y devuelve `400` para
  booleanos invalidos.
- El mapper preserva `tags` retornados por SST sin convertirlos a `string[]`.

## Cambios ARDS/SDD En Repo Hijo

- Agregada adopcion inbound:
  `specs/capabilities/inbound/sst-bend--article-tags.yaml`.
- Agregado handoff outbound:
  `specs/capabilities/outbound/article-tags.yaml`.
- Actualizados indices inbound/outbound.
- Agregada documentacion derivada en:
  - `docs/capabilities/inbound/sst-bend--article-tags.md`
  - `docs/capabilities/outbound/article-tags.md`

## Validacion

- `4uentes-auth: npm.cmd run check`: pass.
- `4uentes-auth: npm.cmd run build`: pass.

Nota: ambos comandos requirieron ejecucion elevada porque el sandbox fallo con
`EPERM` al limpiar archivos existentes dentro de `dist`.

## Gaps Pendientes

- Ejecutar QA runtime BFF contra servicios levantados:
  - create con `tags`;
  - update con `tags`;
  - list con `includeTags=true`;
  - detail con `includeTags=true`.
- Adoptar el contrato en `sst-fend`.
- Completar QA end-to-end frontend/BFF/backend antes de cerrar fase 1.
