# CR-SST-0073 Resumen De Archivos Modificados

## sst-bend

Runtime:

- `src/apps/sst/application/tags/list-tag-definitions.usecase.js`
- `src/apps/sst/application/tags/search-tag-values.usecase.js`
- `src/apps/sst/application/tags/create-tag-value.usecase.js`
- `src/apps/sst/application/tags/replace-resource-tags.usecase.js`
- `src/apps/sst/application/tags/index.js`
- `src/apps/sst/infrastructure/db/postgres/tags/sequelize-tags-governance.repository.js`
- `src/apps/sst/presentation/controllers/tags.controller.js`
- `src/apps/sst/presentation/routes/tags.routes.js`
- `src/apps/sst/presentation/schemas/tags.dto.js`
- `db/migrations/20260613120000-create-global-tag-tables.js`

Specs/docs/capability:

- `specs/api/sst-tags-governance.yaml`
- `specs/api/00-index.yaml`
- `specs/api/routing.yaml`
- `docs/api/23-sst-tags-governance.md`
- `docs/api/README.md`
- `docs/api/00-overview.md`
- `docs/api/13-endpoint-test-map.md`
- `specs/capabilities/outbound/sst-tags-governance.yaml`
- `specs/capabilities/outbound/00-index.yaml`
- `docs/capabilities/outbound/sst-tags-governance.md`
- `docs/capabilities/00-overview.md`

Validacion:

- `scripts/test-tags-governance.js`

Cierre tecnico:

- `evidence/requests/CR-SST-0073/technical-closure-review.md`

## 4uentes-orchestor

- `requests/planned/CR-SST-0073-sst-tags-search-and-resource-binding-api.yaml`
- `state/features/sst-tags-governance.current.yaml`
- `evidence/requests/CR-SST-0073/implementation-notes.md`
- `evidence/requests/CR-SST-0073/changed-files-summary.md`
- `evidence/requests/CR-SST-0073/validation-results.md`
