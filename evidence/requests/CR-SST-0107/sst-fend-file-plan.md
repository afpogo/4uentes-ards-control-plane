# CR-SST-0107 - sst-fend File Plan

## Status

- Date: 2026-07-03
- Request: `CR-SST-0107`
- Mode: file-plan after subagent discovery
- Child repo mutation executed: no

## Subagent Inputs

Two read-only subagents were deployed:

- `sst-fend-ui-discovery`: mapped route, page, reusable component and test
  patterns.
- `learning-sheet-ux-contract`: mapped inbound owner docs/specs, producer
  contract limits and validation checks.

No subagent edited files.

## Planned Frontend Files

Runtime/UI:

- `src/pages/LearningWorkspace/index.tsx`
- `src/pages/LearningWorkspace/styles.module.scss`
- `src/pages/LearningWorkspace/styles.module.scss.d.ts`
- `src/pages/LearningWorkspace/__tests__/LearningWorkspace.test.tsx`
- `src/pages/LearningWorkspace/components/*`
- `src/services/learningWorkspaceService.ts`
- `src/services/types/learningWorkspace.ts`
- `src/services/constants/servicePaths.ts`
- `src/components/Routes/index.tsx`
- `src/pages/Dashboard/pages/Home/constants.tsx`

Owner ARDS/SDD:

- `specs/capabilities/inbound/node-auth--learning-workspace-context.yaml`
- `docs/capabilities/inbound/node-auth--learning-workspace-context.md`
- `specs/capabilities/inbound/00-index.yaml`
- `docs/capabilities/00-overview.md`
- `specs/features/learning-workspace-sheet.yaml`
- `docs/features/learning-workspace-sheet.md`
- `specs/features/00-index.yaml`
- `specs/00-index.yaml`
- `docs/00-overview.md`
- `docs/tasks/2026-07-03-cr-sst-0107-learning-workspace-sheet-adoption.md`

## Route Shape

Preferred route:

- `/learning`

The route should be registered in `src/components/Routes/index.tsx`.

Visible entry should be added from the dashboard home quick links, not by
mutating the global `Header` unless a later navigation decision requires it.

## UI Shape

The first implementation should use the local SST design language:

- `SstPageShell`
- `SstSectionHeader`
- `SstPaperSurface`
- `SstButton`
- `SstSignalTag`
- `SstContentListItem`

It may reuse the structural idea from:

- `src/pages/Articles/components/ArticleSheetWorkspace/*`

But the Learning Sheet must remain a LearningWorkspace surface, not an
Article-specific creation flow.

## Contract Boundary

`sst-bend` producer runtime exists under `/4uentes/v1/learning-workspaces`.

`sst-fend` should consume LearningWorkspace through `node-auth` BFF/pass-through
when that upstream route exists. If `node-auth` has not yet published the
outbound LearningWorkspace route, the inbound owner doc must record
`upstream_ref: TODO` and the implementation must avoid claiming a finalized BFF
contract.

Producer operations to preserve:

- `GET /learning-workspaces/me`
- `GET /learning-workspaces/context`
- `POST /learning-workspaces/sources/preview`
- `POST /learning-workspaces/sources/:previewId/accept`
- `POST /learning-workspaces/sources/:previewId/reject`

Rules:

- `sourceText` is required and bounded from 1 to 524288 characters.
- `previewId` is a 64-character hex value.
- preview returns `persistenceMode=preview-only` and `persisted=false`.
- accepted context is read from context only.
- accept/reject are explicit actions.
- reject does not add accepted context.
- no `TagDefinition` CRUD or automatic creation is part of this CR.
- no `sst-bend` mutation is allowed in this CR.

## Test Plan

Expected `sst-fend` checks after implementation:

- `npm.cmd run check`
- `npm.cmd run test -- --runInBand`
- `npm.cmd run build`

Expected control-plane check:

- `npm.cmd run check`

