# SST-6 Next Steps Analysis

## Status

- Date: 2026-07-03
- Jira issue: `SST-6`
- Feature state: `learning-content-tags`
- Current local status: `implemented-local`
- Jira status observed: `En curso`
- Jira source of truth: no

## Current Position

`SST-28` is closed as the backend/owner-documentation slice for
`CR-SST-0092` and `CR-SST-0097`.

`SST-6` remains active because the broader `learning-content-tags` track is not
complete. The remaining work is product-facing and should not be folded into
the already closed `SST-28` slice.

## Confirmed Runtime State

### sst-bend

Implemented:

- LearningWorkspace persistence and accepted-only context surface.
- Preview, accept and reject endpoints.
- Focused tests: `npm.cmd run test:learning-workspace` PASS 9/9.
- Tag prefix engine tests: `npm.cmd run test:tag-engine` PASS 7/7.

Remaining backend gap:

- `PreviewLearningSourceUseCase` currently takes `sourceText` and delegates to
  the tag prefix engine.
- DTO accepts `documentSelectors`, `assetSelectors`, `exclusionPolicy` and
  `prefixAliasPolicy`, but the first slice does not yet process a full
  CourseSource manifest with selector expansion or generated-lab exclusion
  enforcement.

### sst-fend

Implemented:

- `tag-prefix-engine-preview` inbound capability for article detail preview.
- `src/services/tagPrefixEngineService.ts`
- `src/services/types/tagPrefixEngine.ts`

Missing:

- No LearningWorkspace inbound capability.
- No LearningWorkspace service/types.
- No UI for source preview, accept/reject, or accepted workspace context.
- No owner docs/specs for LearningWorkspace consumer adoption.
- No dedicated rendering for `clase`, `nota`, `recordar`, `ejemplo`, `image`,
  `docs`, or `code` as LearningWorkspace blocks.

## Recommended Execution Order

### 1. Open the next request before child mutation

Reserve the next request id, likely `CR-SST-0107`, for:

```text
[SST][SST-6] Implement LearningWorkspace frontend consumer and parser/import completion readiness
```

This request should explicitly allow mutation of:

- `sst-fend` for consumer UI, services, types and owner ARDS/SDD docs.
- `sst-bend` only if the slice includes parser/import completion beyond the
  current text-only preview behavior.
- `4uentes-orchestor` for evidence, lifecycle and Jira mirror updates.

### 2. Split implementation into two gates inside the request

Gate A: `sst-fend` consumer adoption.

- Add LearningWorkspace service/types.
- Add preview/accept/reject/context UI.
- Render accepted blocks with stable treatment for learning block types.
- Add inbound capability docs/specs.
- Add tests for service mapping and block rendering.

Gate B: `sst-bend` parser/import completion readiness or implementation.

- Decide whether `CR-SST-0107` implements selector expansion or only plans it.
- If implemented, process CourseSource manifest selectors and generated-lab
  exclusions before preview materialization.
- Preserve preview-only behavior.
- Keep automatic `TagDefinition` creation forbidden.

### 3. Update Jira mirror

`SST-6` should remain `En curso`.

Update the Jira description/comment to reflect:

- `SST-28` is closed.
- `CR-SST-0092` and `CR-SST-0097` are done.
- Remaining active work is frontend consumer adoption plus parser/import
  completion.

Do not transition `SST-6` to terminal until both gates have validation
evidence.

## Owner Documentation Requirements

For `sst-fend`:

- Add or update `specs/capabilities/inbound/*learning-workspace*`.
- Add or update `docs/capabilities/inbound/*learning-workspace*`.
- Add feature/API docs that identify `sst-bend` as producer.
- Record UI behavior and fallback/degradation for preview and accepted context.

For `sst-bend` if backend parser/import is changed:

- Update LearningWorkspace API/spec docs.
- Update outbound capability docs if context shape changes.
- Re-run `npm.cmd run test:learning-workspace`, `npm.cmd run test:tag-engine`
  and `npm.cmd run check`.

For control-plane:

- Add owner-documentation gate refs in the planned request.
- Run `npm.cmd run check`, not only child repo checks.

## Acceptance Criteria For Closing SST-6

`SST-6` can be considered for closure only when:

- `sst-fend` can preview a learning source and show warnings.
- user can accept/reject a preview through the UI or an explicitly documented
  equivalent workflow.
- accepted LearningWorkspace context renders learning blocks readably.
- generated lab artifacts are excluded or explicitly warned according to the
  agreed policy.
- owner docs exist in every mutated child repo.
- control-plane lifecycle has a done request and validation evidence.
- Jira mirror is updated after local evidence, not before.
