CR-SST-0124 runtime implementation update.

Status: implemented locally, validation passed, browser QA pending.

Implemented in sst-fend:

- Native text articles now render a runtime/app URL after creation.
- Runtime URL is derived from current SPA origin plus `/leafArticulo/:id`.
- Runtime URL is navigation-only and is not persisted as `url` or `payload.data.sourceUrl`.
- Web articles continue to use their external source URL semantics.
- Owner ARDS/SDD docs/specs were updated.

Validation:

- `npm.cmd test -- ArticleCreateFlow.test.tsx --runInBand`: PASS.
- `npm.cmd run css:types:check`: PASS.
- `npm.cmd run check` in sst-fend: PASS, 27 suites / 163 tests.
- `npm.cmd run check` in 4uentes-orchestor: PASS.

Evidence:

- `evidence/requests/CR-SST-0124/changed-files-summary.md`
- `evidence/requests/CR-SST-0124/owner-documentation-summary.md`
- `evidence/requests/CR-SST-0124/validation-results.md`
