# CR-SST-0084 - Resumen de archivos cambiados

Este resumen lista solo los cambios atribuibles a la implementacion de
`dictionary-secret-management-v1`. Los repos locales tenian cambios previos no
relacionados que no se reclaman en esta evidencia.

## 4uentes-orchestor

- `evidence/requests/CR-SST-0084/validation-results.md`: actualiza resultados
  de validacion cross-repo, warnings y fallback secuencial de subagentes.
- `evidence/requests/CR-SST-0084/changed-files-summary.md`: registra el corte
  de archivos implementados.

## sst-bend

- `config/index.js`: agrega configuracion de master key de secretos de
  Diccionario.
- `db/migrations/20260624090000-create-dictionary-secret-management-tables.js`:
  crea tablas `dictionary_secret_entries`, `protected_secret_values`,
  `connection_profiles` y `secret_access_events`.
- `db/models/dictionary-secret-entry.js`, `protected-secret-value.js`,
  `connection-profile.js`, `secret-access-event.js`, `db/models/index.js`:
  registran modelos Sequelize y asociaciones.
- `src/apps/sst/application/diccionario/dictionary-secret-crypto.service.js`:
  AES-256-GCM para cifrado/decrypt de valores protegidos.
- `src/apps/sst/application/diccionario/dictionary-secret-policy.js`:
  presenter metadata-only y bloqueo de seed/recovery material.
- `src/apps/sst/infrastructure/db/postgres/diccionario/sequelize-dictionary-secret.repository.js`:
  repositorio separado con create, list, detail, update, reveal, copy, rotate y
  revoke auditado.
- `src/apps/sst/presentation/schemas/dictionary-secrets.dto.js`,
  `controllers/dictionary-secrets.controller.js`,
  `routes/dictionary-secrets.routes.js`, `routes/diccionario.routes.js`:
  superficie `/4uentes/v1/diccionario/secrets/*`.
- `scripts/test-dictionary-secrets.js`, `package.json`: test focalizado
  `test:diccionario:secrets`.
- `specs/api/dictionary-secret-management.yaml`,
  `docs/api/25-dictionary-secret-management.md`,
  `specs/api/00-index.yaml`: contrato API local.
- `specs/capabilities/outbound/dictionary-secret-management-v1.yaml`,
  `docs/capabilities/outbound/dictionary-secret-management-v1.md`,
  `specs/capabilities/outbound/00-index.yaml`,
  `docs/capabilities/00-overview.md`: capability outbound para consumidores.

## 4uentes-auth / node-auth

- `src/presentation/dictionary/controller.ts`: proxy para `/secrets/*` y filtro
  defensivo de campos tipo value fuera de reveal/copy.
- `src/presentation/dictionary/routes.ts`: rutas BF
  `/api/diccionario/secrets/*`.
- `specs/capabilities/inbound/sst-bend--dictionary-secret-management-v1.yaml`
  y doc derivado: adopcion upstream.
- `specs/capabilities/outbound/dictionary-secret-management-v1.yaml` y doc
  derivado: publicacion hacia `sst-fend`.
- `specs/capabilities/inbound/00-index.yaml`,
  `specs/capabilities/outbound/00-index.yaml`: indices actualizados.

## sst-fend

- `src/services/types/dictionary.ts`: tipos de secrets, access y rotate.
- `src/services/dictionaryService.ts`: cliente
  `dictionarySecretService`.
- `src/pages/Dictionary/components/DictionarySecretsPanel.tsx`: tab de
  Secretos con create/list/reveal/copy/rotate/revoke y estado local efimero.
- `src/pages/Dictionary/components/DictionaryPaperWorkspace.tsx` y
  `src/pages/Dictionary/index.tsx`: tercer tab `Secretos`.
- `specs/capabilities/inbound/node-auth--dictionary-secret-management-v1.yaml`
  y doc derivado: adopcion de capability BF.
- `specs/capabilities/inbound/00-index.yaml`: indice inbound actualizado.
- `docs/34-dictionary-frontend.md` y `specs/34-dictionary-frontend.yml`:
  contrato frontend de Dictionary actualizado.
