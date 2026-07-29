INIT-SST-0003 ARDS/SDD sync checkpoint.

`CR-SST-0098` / `SST-30` completed its implementation slice and is ready for review.

Current INIT/Epic mapping:
- ARDS/SDD initiative: `INIT-SST-0003`
- Jira epic mirror: `SST-29`
- First implemented CR: `CR-SST-0098`
- Jira ticket mirror: `SST-30`

Implemented scope:
- Stabilized `sst-extension` session tab-by-tab visual PDF capture.
- Restores original active tab best-effort after the capture batch.
- Adds bounded ready/settle before visual capture.
- Restores per-tab scroll best-effort.
- Keeps visual capture timeout/degradation on the existing safe fallback path.
- Updated owner documentation in `sst-extension`.

Validation:
- `sst-extension`: `pnpm check` passed.
- `4uentes-orchestor`: `npm.cmd run check` passed.
- Owner-documentation gate passed for `CR-SST-0098`.

Evidence:
- `evidence/requests/CR-SST-0098/implementation-summary.md`
- `evidence/requests/CR-SST-0098/changed-files-summary.md`
- `evidence/requests/CR-SST-0098/validation-results.md`

Boundary:
- Jira remains an operational mirror.
- ARDS/SDD remains the source of truth.
- No private page content, cookies, JWTs, plaintext secrets, real PDFs from private pages, or sensitive screenshots were stored in Jira or evidence.
