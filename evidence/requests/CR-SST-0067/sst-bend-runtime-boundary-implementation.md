# SST-12 Runtime Boundary Implementation

## Estado

- Fecha: 2026-06-12
- Request: CR-SST-0067
- Servicio: `sst-bend`
- Jira issue: `SST-12`
- Feature state: `sst-tag-prefix-engine`
- Repos funcionales modificados: si, `sst-bend`

## Implementacion

Se promovio el POC backend del motor de prefijos a un boundary runtime
preview-only:

- `POST /4uentes/v1/tags/prefix-engine/preview`
- requiere JWT y account context;
- valida body con Joi;
- no persiste resultados;
- retorna `contractVersion=sst-tag-prefix-engine.preview.v1`;
- retorna `persistenceMode=preview-only` y `persisted=false`;
- materializa:
  - `ContentBlock`
  - `TagValue`
  - `TagOccurrence`
  - `AssetRef`
  - `ExternalReference`
  - `ImportedReference`

## Archivos Principales

- `src/apps/sst/application/tags/preview-tag-prefixes.usecase.js`
- `src/apps/sst/presentation/controllers/tags.controller.js`
- `src/apps/sst/presentation/routes/tags.routes.js`
- `src/apps/sst/presentation/schemas/tags.dto.js`
- `src/apps/sst/presentation/routes/index.js`
- `scripts/test-tag-engine.js`
- `scripts/smoke-test.js`
- `scripts/protected-coverage.config.js`
- `specs/api/sst-tag-prefix-engine.yaml`
- `docs/api/22-sst-tag-prefix-engine.md`
- `specs/capabilities/outbound/sst-tag-prefix-engine.yaml`
- `docs/capabilities/outbound/sst-tag-prefix-engine.md`

## Decision De Persistencia

La fase queda `preview-only`.

No se agregaron migraciones ni tablas nuevas. `TagDefinition` sigue gobernado
por registry de codigo en esta fase. El import persistido queda como follow-up
explicito.

## Boundary

Incluido:

- runtime backend en `sst-bend`;
- contrato API/documentacion/capability outbound;
- tests automatizados del boundary;
- registro del endpoint en coverage protegida.

Excluido:

- `SST-6 / learning-content-tags`;
- Bitacora workflow;
- BFF pass-through en `4uentes-auth`;
- UI/reference chips en `sst-fend`;
- CRUD publico de `TagDefinition`;
- persisted import.
