CR-SST-0098 / SST-30 implementation checkpoint.

This ticket is ready for review against the ARDS/SDD source of truth.

Implemented:
- `sst-extension` now restores the original active tab best-effort after session capture.
- Visual PDF capture waits for bounded tab readiness/settle before measuring and capturing.
- Per-tab scroll is restored best-effort after full-page segment capture.
- Readiness timeouts remain controlled errors and keep the existing safe fallback to textual PDF.
- Tests were added for visual capture readiness/scroll and original active-tab restoration.
- Owner documentation was updated in `sst-extension`.

Owner documentation satisfied:
- `sst-extension/specs/features/sessions.yaml`
- `sst-extension/docs/integration/node-auth-extension-session-ingestion.md`
- `sst-extension/docs/qa/session-capture-validation.md`

Validation:
- `pnpm test -- src/platform/tabs/capture-session-tab-fullpage-pdf.test.ts src/features/sessions/create-session-capture-service.test.ts`: passed, 2 files / 11 tests.
- `pnpm check` in `sst-extension`: passed, baseline + 21 test files / 86 tests + WXT build.
- `npm.cmd run check` in `4uentes-orchestor`: passed, including owner-documentation gate for `CR-SST-0098`.

Evidence:
- `evidence/requests/CR-SST-0098/implementation-summary.md`
- `evidence/requests/CR-SST-0098/changed-files-summary.md`
- `evidence/requests/CR-SST-0098/validation-results.md`

Security/evidence boundary:
- No private page content, cookies, JWTs, plaintext secrets, real PDFs from private pages, or sensitive screenshots were stored in Jira or evidence.
- No backend/BFF/API contract changes were made in this CR.
