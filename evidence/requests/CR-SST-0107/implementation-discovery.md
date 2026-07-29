# CR-SST-0107 - Implementation Discovery

## Status

- Date: 2026-07-03
- Request: `CR-SST-0107`
- Mode: frontend implementation discovery
- Child repo mutation executed: no
- Subagent deployment: started for UI discovery and owner contract discovery

## Local Repository Mapping

The local `sst-bend` checkout is under:

- `C:\Users\andre\Desktop\4uentes\apps\4uentes-sstbend\sst-bend`

The local `sst-fend` checkout is under:

- `C:\Users\andre\Desktop\4uentes\apps\sst-fend`

## Producer Contract Observed

`sst-bend` publishes the draft outbound capability:

- `docs/capabilities/outbound/learning-workspace-context.md`
- `specs/capabilities/outbound/learning-workspace-context.yaml`
- `docs/api/26-learning-workspaces.md`

Runtime routes observed:

- `GET /4uentes/v1/learning-workspaces/me`
- `GET /4uentes/v1/learning-workspaces/context`
- `POST /4uentes/v1/learning-workspaces/sources/preview`
- `POST /4uentes/v1/learning-workspaces/sources/:previewId/accept`
- `POST /4uentes/v1/learning-workspaces/sources/:previewId/reject`

Contract rules to preserve in `sst-fend`:

- preview output is review-only;
- preview responses must not be shown as accepted context;
- accepted context must come from `GET /context`;
- accept and reject are explicit user decisions;
- accept/reject require owner runtime permissions;
- LearningWorkspace must not create `TagDefinition` records automatically;
- the frontend must not imply backend CourseSource selector expansion is complete.

## Frontend Patterns Observed

`sst-fend` currently routes application surfaces through:

- `src/components/Routes/index.tsx`
- `src/App/routes.tsx`
- `src/components/SSTLayout/index.tsx`

Current app routes include:

- `/artsst`
- `/dictionary`

Relevant existing sheet pattern:

- `src/pages/Articles/components/ArticleSheetWorkspace/index.tsx`
- `src/pages/Articles/components/ArticleSheetWorkspace/styles.module.scss`

Current LearningWorkspace gap:

- no `LearningWorkspace` service exists;
- no Learning Sheet page exists;
- no inbound LearningWorkspace capability docs/specs exist;
- no feature docs/specs exist for a Learning Sheet surface.

## First Implementation Shape

Recommended first slice:

- add a `LearningSheet` page under `src/pages/LearningSheet`;
- add an app route such as `/learning-sheet`;
- add `learningWorkspaceService` and typed request/response DTOs;
- keep draft sheet edits in frontend state until preview;
- provide write/paste/import text entry;
- model relevance intent by line, paragraph, line range, paragraph range, line plus paragraph, document, document header, document footer, semantic block and selection;
- render preview materialization, warnings and tag suggestions separately from accepted context;
- provide explicit accept/reject controls;
- fetch accepted context separately after accept.

## Owner Documentation Expected

`sst-fend` should add at least:

- `specs/capabilities/inbound/node-auth--learning-workspace-context.yaml`
- `docs/capabilities/inbound/node-auth--learning-workspace-context.md`
- `specs/features/learning-workspace-sheet.yaml`
- `docs/features/learning-workspace-sheet.md`

The owner documentation must state that this is a consumer adoption of the
producer draft and must keep the parser/import expansion out of scope.

## Immediate Follow-Up Kept Separate

The backend parser/import request remains a separate next CR, expected as
`CR-SST-0108`.

That request should cover:

- CourseSource manifest processing;
- `documentSelectors` expansion;
- `assetSelectors` expansion;
- generated lab artifact exclusion;
- richer backend parser/import warnings.

