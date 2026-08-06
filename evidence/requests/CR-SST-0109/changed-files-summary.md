# CR-SST-0109 - Changed Files Summary

## Status

- Date: 2026-07-04
- Runtime code mutation: implemented locally
- Child repo mutation: implemented locally for `node-auth` and `sst-fend`

## Control-Plane Files

- `requests/inbox/CR-SST-0109-node-auth-learning-workspace-bff-passthrough.yaml`
- `requests/planned/CR-SST-0109-node-auth-learning-workspace-bff-passthrough.yaml`
- `evidence/requests/CR-SST-0109/implementation-plan.md`
- `evidence/requests/CR-SST-0109/changed-files-summary.md`

## node-auth Files

- `src/domain/constants/learning-workspaces.constants.ts`
- `src/domain/constants/index.ts`
- `src/domain/datasources/learning-workspaces.datasource.ts`
- `src/domain/repositories/learning-workspaces.repository.ts`
- `src/domain/use-cases/LearningWorkspaces/proxyLearningWorkspaceRequest.usecase.ts`
- `src/domain/index.ts`
- `src/infrastructure/datasources/learning-workspaces.datasource.impl.ts`
- `src/infrastructure/repositories/learning-workspaces.repository.ts`
- `src/infrastructure/index.ts`
- `src/presentation/learning-workspaces/controller.ts`
- `src/presentation/learning-workspaces/routes.ts`
- `src/presentation/routes.ts`
- `specs/capabilities/inbound/00-index.yaml`
- `specs/capabilities/inbound/sst-bend--learning-workspace-context.yaml`
- `specs/capabilities/outbound/00-index.yaml`
- `specs/capabilities/outbound/learning-workspace-context.yaml`
- `specs/routing.yaml`
- `specs/integrations-api.yaml`
- `docs/capabilities/00-overview.md`
- `docs/capabilities/inbound/sst-bend--learning-workspace-context.md`
- `docs/capabilities/outbound/learning-workspace-context.md`
- `docs/bf/03-routing.md`
- `docs/bf/06-integrations-api.md`
- `docs/bf/11-endpoints-e2e-map.md`

## sst-fend Files

- `specs/capabilities/inbound/node-auth--learning-workspace-context.yaml`
- `docs/capabilities/inbound/node-auth--learning-workspace-context.md`
- `specs/38-learning-workspace-frontend.yml`
- `docs/38-learning-workspace-frontend.md`

## Boundary

- `sst-bend` runtime and parser/import files were not modified.
- The parser/import expansion remains a separate immediate follow-up after this BFF/API connection.
