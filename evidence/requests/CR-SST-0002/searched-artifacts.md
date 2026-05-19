# CR-SST-0002 - Searched Artifacts

Observed at: 2026-05-18

## Control-Plane Inputs

- `requests/inbox/CR-SST-0002-tags-dictionary-implementation-review.yaml`
- `requests/planned/CR-SST-0002-tags-dictionary-implementation-review.yaml`
- `knowledge/business-intake/sst-tags-dictionary-2026-05-18.md`
- `catalog/services/*.yaml`
- `solutions/sst.yaml`
- `inventory/phase-0.md`
- `inventory/evidence/git/sst-fend.md`
- `inventory/evidence/git/sst-extension.md`

## Routing Limitation

`environments/local/bindings.local.yaml` was not present. Local repo paths were taken from Phase 0 inventory evidence only and must not be treated as stable catalog configuration.

## Repositories Inspected Read-Only

### sst-bend

Observed path source: `inventory/phase-0.md`

Primary ARDS/docs:

- `AGENTS.md`
- `docs/00-overview.md`
- `specs/api/diccionario-sst-tag.yaml`
- `docs/api/20-diccionario-sst-tag.md`
- `docs/api/21-diccionario-data-architecture.md`
- `specs/capabilities/outbound/dictionary-legacy-read.yaml`
- `specs/capabilities/outbound/dictionary-domain-v1.yaml`
- `specs/capabilities/outbound/dictionary-domain-read-v1.yaml`
- `specs/capabilities/outbound/dictionary-domain-management-v1.yaml`
- `docs/capabilities/outbound/dictionary-legacy-read.md`
- `docs/capabilities/outbound/dictionary-domain-v1.md`
- `docs/capabilities/outbound/dictionary-domain-read-v1.md`
- `docs/capabilities/outbound/dictionary-domain-management-v1.md`

Runtime evidence:

- `src/apps/sst/presentation/routes/diccionario.routes.js`
- `src/apps/sst/presentation/controllers/diccionario.controller.js`
- `src/apps/sst/presentation/middlewares/resolve-account-context.middleware.js`
- `src/apps/sst/infrastructure/filesystem/diccionario/diccionario-legacy-parser.js`
- `src/apps/sst/application/diccionario/*.js`
- `src/apps/sst/domain/diccionario/*.js`
- `db/models/dictionary-*.js`
- `db/migrations/20260502120000-create-dictionary-domain-tables.js`
- `db/migrations/20260502140000-dictionary-domain-stage3-management.js`

### 4uentes-auth

Observed path source: `inventory/phase-0.md`; local folder is legacy alias `node-auth`.

Primary ARDS/docs:

- `AGENTS.md`
- `specs/capabilities/inbound/sst-bend--dictionary-legacy-read.yaml`
- `specs/capabilities/inbound/sst-bend--dictionary-domain-read-v1.yaml`
- `specs/capabilities/inbound/sst-bend--dictionary-domain-management-v1.yaml`
- `specs/capabilities/outbound/dictionary-legacy-read.yaml`
- `specs/capabilities/outbound/dictionary-domain-read-v1.yaml`
- `specs/capabilities/outbound/dictionary-domain-management-v1.yaml`
- `docs/capabilities/inbound/sst-bend--dictionary-legacy-read.md`
- `docs/capabilities/inbound/sst-bend--dictionary-domain-read-v1.md`
- `docs/capabilities/inbound/sst-bend--dictionary-domain-management-v1.md`
- `docs/capabilities/outbound/dictionary-legacy-read.md`
- `docs/capabilities/outbound/dictionary-domain-read-v1.md`
- `docs/capabilities/outbound/dictionary-domain-management-v1.md`

Runtime evidence:

- `src/presentation/dictionary/routes.ts`
- `src/presentation/dictionary/controller.ts`
- `src/domain/use-cases/Dictionary/getDictionaryLegacyRead.usecase.ts`
- `src/domain/use-cases/Dictionary/proxyDictionaryRequest.usecase.ts`
- `src/infrastructure/datasources/dictionary.datasource.impl.ts`

### sst-fend

Observed path source: `inventory/evidence/git/sst-fend.md`

Primary ARDS/docs:

- `AGENTS.md`
- `specs/34-dictionary-frontend.yml`
- `docs/34-dictionary-frontend.md`
- `specs/capabilities/inbound/node-auth--dictionary-legacy-read.yaml`
- `specs/capabilities/inbound/node-auth--dictionary-domain-read-v1.yaml`
- `specs/capabilities/inbound/node-auth--dictionary-domain-management-v1.yaml`
- `docs/capabilities/inbound/node-auth--dictionary-legacy-read.md`
- `docs/capabilities/inbound/node-auth--dictionary-domain-read-v1.md`
- `docs/capabilities/inbound/node-auth--dictionary-domain-management-v1.md`

Runtime evidence:

- `src/services/dictionaryService.ts`
- `src/services/types/dictionary.ts`
- `src/store/actions/dictionary.action.ts`
- `src/store/slices/dictionary.slice.ts`
- `src/store/selectors/dictionary.selector.ts`
- `src/pages/Dictionary/index.tsx`
- `src/pages/Dictionary/__tests__/Dictionary.test.tsx`

### sst-extension

Observed path source: `inventory/evidence/git/sst-extension.md`

Primary ARDS/docs:

- `AGENTS.md`
- `specs/features/dictionary.yaml`
- `specs/integration/node-auth-extension-dictionary.yaml`
- `specs/integration/inbound/node-auth--dictionary-legacy-read.yaml`
- `specs/integration/inbound/node-auth--dictionary-domain-management-v1.yaml`
- `specs/runtime/internal-messaging-contracts.yaml`
- `docs/integration/node-auth-extension-dictionary.md`
- `docs/integration/inbound/node-auth--dictionary-legacy-read.md`
- `docs/integration/inbound/node-auth--dictionary-domain-management-v1.md`

Runtime evidence:

- `src/features/dictionary/create-dictionary-service.ts`
- `src/platform/api/dictionary-bff-gateway.ts`
- `src/platform/api/node-auth-dictionary-domain-management.ts`
- `src/shared/dictionary.ts`
- `src/shared/extension-messages.ts`
- `src/ui/quick-save/QuickSaveSurface.tsx`

### sst-4uentes-infra

Observed path source: `inventory/phase-0.md`

Primary ARDS/docs/manifests:

- `AGENTS.md`
- `specs/infra/deployment-contracts/sst-bend.yaml`
- `specs/infra/deployment-contracts/node-auth.yaml`
- `specs/infra/deployment-contracts/sst-fend.yaml`
- `specs/infra/deployment-contracts/sst-extension.yaml`
- `specs/infra/security/no-plaintext-secrets.yaml`
- `specs/infra/security/secrets-provider.yaml`
- `k8s-manifests/base/*.yml`
- `argocd/argocd-configmap.yml`

## Search Terms

- `tag`
- `tags`
- `scope`
- `key`
- `dictionary`
- `dictionary entry`
- `dictionary sheet`
- `translation`
- `translations`
- `alias`
- `account`
- `security`
- `encryption`
- `offline`
- `endpoint`
- `secure`
- `reveal`
