# Archivos cambiados por CR-SST-0160

Repo funcional: `sst-bend`.

## Runtime y persistencia

- `src/apps/sst/application/diccionario/dictionary-secret-crypto.service.js`
- `src/apps/sst/application/diccionario/dictionary-secret-policy.js`
- `src/apps/sst/infrastructure/db/postgres/diccionario/sequelize-dictionary-secret.repository.js`
- `src/apps/sst/presentation/schemas/dictionary-secrets.dto.js`
- `src/apps/sst/presentation/middlewares/validator.handler.js`
- `src/apps/sst/presentation/middlewares/error.handler.js`
- `db/models/protected-secret-value.js`
- `db/migrations/20260811090000-add-aad-version-to-protected-secret-values.js`

## QA y operación

- `scripts/test-dictionary-secrets.js`
- `scripts/smoke-dictionary-secrets-security.js`
- `scripts/inventory-dictionary-secret-metadata-keys.js`
- `package.json`

## Owner docs

- `specs/api/dictionary-secret-management.yaml`
- `docs/api/25-dictionary-secret-management.md`
- `specs/capabilities/outbound/dictionary-secret-management-v1.yaml`
- `docs/capabilities/outbound/dictionary-secret-management-v1.md`
- `specs/api/error-handling.yaml`
- `docs/api/07-error-handling.md`
- `specs/api/logging-observability.yaml`
- `docs/api/08-observability.md`
- `docs/tasks/2026-08-11-cr-sst-0160-dictionary-secret-context-hardening.md`
- `docs/tasks/README.md`

No se modificó ningún otro repo funcional.
