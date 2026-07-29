# CR-SST-0092 - Resumen De Archivos Cambiados

Pendiente de completar despues de la implementacion en `sst-bend`.

## Control-Plane

- `requests/inbox/CR-SST-0092-sst-bend-learning-workspace-first-runtime-slice.yaml`
- `requests/planned/CR-SST-0092-sst-bend-learning-workspace-first-runtime-slice.yaml`
- `initiatives/INIT-SST-0001-tags-governance-continuity.yaml`
- `evidence/requests/CR-SST-0092/execution-start.md`
- `evidence/requests/CR-SST-0092/changed-files-summary.md`
- `evidence/requests/CR-SST-0092/validation-results.md`
- `evidence/requests/CR-SST-0092/jira-task-sync-summary.md`
- `evidence/requests/CR-SST-0092/jira-task-sync-result.json`

## sst-bend

- `db/migrations/20260630090000-create-learning-workspace-tables.js`
- `db/models/index.js`
- `db/models/learning-workspace.js`
- `db/models/learning-source-ref.js`
- `db/models/learning-document-ref.js`
- `db/models/learning-content-block-ref.js`
- `db/models/learning-asset-ref.js`
- `db/models/learning-lab-ref.js`
- `db/models/learning-spec-ref.js`
- `db/models/learning-import-warning.js`
- `db/models/learning-import-provenance.js`
- `src/apps/sst/domain/learning-workspaces/`
- `src/apps/sst/application/learning-workspaces/`
- `src/apps/sst/infrastructure/db/postgres/learning-workspaces/sequelize-learning-workspace.repository.js`
- `src/apps/sst/presentation/schemas/learning-workspace.dto.js`
- `src/apps/sst/presentation/controllers/learning-workspaces.controller.js`
- `src/apps/sst/presentation/routes/learning-workspaces.routes.js`
- `src/apps/sst/presentation/routes/index.js`
- `scripts/test-learning-workspace.js`
- `package.json`

## Cambios Preexistentes No Relacionados En `sst-bend`

Se observaron como dirty antes o fuera de este CR y no fueron revertidos:

- `.env.example`
- `.github/workflows/build-publish-development.yml`
- `docker-compose.yml`
- `docs/api/25-dictionary-secret-management.md`
- `scripts/test-dictionary-secrets.js`
- `specs/api/dictionary-secret-management.yaml`
- `src/apps/sst/application/diccionario/dictionary-secret-crypto.service.js`
