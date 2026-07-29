# SST-6 / SST-28 Owner Enforcement Review

Date: 2026-07-03

## Scope

Review requested for `INIT-SST-0001` after the Jira mirror showed `SST-6` and
`SST-28` as `En curso`.

ARDS/SDD source of truth:

- `initiatives/INIT-SST-0001-tags-governance-continuity.yaml`
- `state/features/learning-content-tags.current.yaml`
- `requests/planned/CR-SST-0092-sst-bend-learning-workspace-first-runtime-slice.yaml`
- `requests/planned/CR-SST-0097-sst-bend-learning-workspace-owner-docs-remediation.yaml`

Jira is mirror-only and was not treated as source of truth.

## Policy Application

Task classification:

- `task_weight`: `long-context-task`
- risk: medium/high because the review crosses child repo ownership and runtime
  documentation boundaries.
- main agent retained final decision authority.

Subagent deployment:

| Subtask | Scope | Result |
| --- | --- | --- |
| control-plane review | INIT, feature state, CRs, evidence for `SST-6`/`SST-28` | Completed read-only. |
| `sst-bend` owner review | LearningWorkspace docs/specs/code/tests | Completed read-only. |
| `sst-fend` consumer review | frontend docs/specs/code for learning content | Completed read-only. |

The delegated work was read-only and did not transfer architecture, security, or
ownership decisions.

## Current State

### SST-6

`SST-6` remains the active Jira mirror for the `learning-content-tags` track.

Local source state:

- `state/features/learning-content-tags.current.yaml`
- status: `implemented-local`
- active gaps:
  - promote remaining parser flows beyond the first `LearningWorkspace` slice;
  - define frontend rendering for `clase`, `nota`, `recordar`, `ejemplo`,
    `image`, `docs`, and code blocks;
  - keep generated lab artifacts excluded from ingestion by default.

Jira observation evidence from `CR-SST-0091` shows `SST-6` as `En curso`, but
that observation predates the later `CR-SST-0092`/`CR-SST-0097` evidence.

### SST-28

`SST-28` is the Jira mirror for `CR-SST-0092`.

Local source state:

- `CR-SST-0092` implemented the first `sst-bend` LearningWorkspace runtime
  slice.
- `CR-SST-0097` remediated owner ARDS/SDD documentation in `sst-bend`.
- `CR-SST-0104` later validated owner-documentation gate coverage for
  `CR-SST-0092` and `CR-SST-0097`.

Runtime implemented in `sst-bend`:

- `GET /4uentes/v1/learning-workspaces/me`
- `GET /4uentes/v1/learning-workspaces/context`
- `POST /4uentes/v1/learning-workspaces/sources/preview`
- `POST /4uentes/v1/learning-workspaces/sources/:previewId/accept`
- `POST /4uentes/v1/learning-workspaces/sources/:previewId/reject`

Validation evidence:

- `evidence/requests/CR-SST-0092/validation-results.md`
- `evidence/requests/CR-SST-0097/validation-results.md`

## Owner Enforcement Performed

Producer owner repo: `sst-bend`.

Updated owner artifacts during this review:

- `specs/capabilities/outbound/learning-workspace-context.yaml`
- `docs/capabilities/outbound/learning-workspace-context.md`
- `httpPruebas/LearningWorkspace-http/sst.learning-workspaces.http`

Corrections:

- set `orchestrator_link.correlation_id` to `SST-28`;
- documented the mapping between control-plane feature track
  `learning-content-tags` and producer capability `learning-workspace-context`;
- created the manual HTTP QA file referenced by `CR-SST-0097` evidence.

Consumer owner repos:

- `sst-fend` was reviewed read-only and not mutated.
- No frontend LearningWorkspace UI or owner docs exist yet.
- No consumer adoption is implied by the `sst-bend` outbound draft capability.

## Remaining Gaps

- Lifecycle drift: several request YAML files remain `planned`/`decision:
  pending` even though execution evidence exists.
- `INIT-SST-0001` remains `planned` while Jira epic `SST-27` is observed as
  `En curso`.
- `SST-6` mirror description is stale relative to current ARDS/SDD evidence.
- `sst-fend` still needs a future request for LearningWorkspace or
  learning-content UI owner docs/specs before implementation.
- `sst-chatbot`, `4uentes-auth`, and `sst-extension` still have no consumer
  adoption for `learning-workspace-context`.

## Enforcement Validation

Required gates after this review:

- run focused `sst-bend` checks for LearningWorkspace owner/runtime surface;
- run full control-plane `npm.cmd run check` so the owner documentation
  validator remains authoritative.

No secrets, tokens, JWTs, cookies, or authorization headers were written to this
evidence.
