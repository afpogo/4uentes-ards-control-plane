# SST Bend Article Tags Capability Update

## Estado

- Fecha: 2026-06-11
- Request gobernante: `CR-SST-0060`
- Jira issue: `SST-4`
- Repo hijo: `sst-bend`
- Modo: phase-1 backend capability alignment
- Jira writes: no

## Cambios En Repo Hijo

Archivos actualizados en `sst-bend`:

- `specs/capabilities/outbound/article-tags.yaml`
- `specs/capabilities/outbound/00-index.yaml`
- `docs/capabilities/outbound/article-tags.md`

## Resultado

- `article-tags` fue promovida de `draft` a `ready-for-consumer`.
- Se agrego `orchestrator_link` hacia:
  - state id: `sst-tags-governance`
  - request id: `CR-SST-0060`
  - Jira issue/correlation: `SST-4`
- Se enlazo la capability con el contrato global:
  - `4uentes-orchestor/docs/requests/sst-tags-governance-contract.md`
- Se dejaron gaps QA explicitos para:
  - `POST /articulos` con `tags`;
  - `PATCH /articulos/:id` con `tags`;
  - `GET /articulos?includeTags=true`;
  - `GET /articulos/:id?includeTags=true`;
  - `GET /article-nodes/:id/articles?includeTags=true`.

## Lectura Tecnica

La implementacion runtime observada ya soporta:

- validacion DTO de `tags` con `definitionKey`, `label`, `slug?`, `value?`;
- sync de tags de Articulos mediante `DictionaryTagValue`;
- ocurrencias con `sourceType: article-tag`;
- `includeTags=true` en repositorio de Articulos;
- respuesta inmediata con tags cuando create/update recibe tags.

Por eso esta pasada no modifica logica de negocio. El siguiente gap backend es
QA explicito y luego adopcion downstream en `4uentes-auth` y `sst-fend`.

## Validacion

- Comando: `npm.cmd run check`
- Resultado: blocked-runtime
- Motivo: `scripts/ards-check.js` requiere SST y scrapper levantados.
- Error observado: `Service preflight failed for sst. Start SST and scrapper before running npm run check. Details: fetch failed`

## Boundary

- No se modificaron tablas ni runtime HTTP.
- No se ejecuto Jira write.
- No se marco `sst-tags-governance` como done.
