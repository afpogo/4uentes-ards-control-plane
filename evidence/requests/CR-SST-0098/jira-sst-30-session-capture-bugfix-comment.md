CR-SST-0098 / SST-30 QA follow-up.

Manual QA update:

* Extension login: passed.
* Article generation: passed.
* Text article PDF generation: passed.
* Session capture: failed before this follow-up. Clicking the session capture action produced no visible action and no backend URL call.

Analysis:

* The missing backend call is expected when capture fails before local handoff.
* Session capture must complete local tab capture and create a queue item before `POST /api/extension/sessions` can happen.
* The likely failure point was missing HTTP(S) host permission for tabs in the active window.

Implemented follow-up:

* Added explicit host-permission preflight from the user click path.
* Added typed failure reason `host-permission-denied`.
* Added visible UI feedback for denied permissions and for `failed` session results.
* Updated owner docs/specs and QA docs.

Validation:

* `pnpm test src/platform/runtime/session-capture-host-permissions.test.ts src/platform/tabs/capture-active-window-sessions.test.ts src/features/sessions/create-session-capture-service.test.ts`: passed, 3 files / 16 tests.
* `pnpm check` in `sst-extension`: passed, 22 files / 91 tests + WXT build.
* `npm.cmd run check` in `4uentes-orchestor`: passed, including owner-documentation gate for `CR-SST-0098`.

Decision:

* Keep `SST-30` in review.
* Do not transition to `Listo` until the rebuilt `.output/chrome-mv3` extension is refreshed in Chrome and session capture manual QA passes.

Evidence:

* `evidence/requests/CR-SST-0098/manual-qa-session-capture-bug.md`
* `evidence/requests/CR-SST-0098/validation-results.md`
* `evidence/requests/CR-SST-0098/closure-readiness.md`

Boundary:

* No private page content, cookies, JWTs, plaintext secrets, real PDFs from private pages, or sensitive screenshots were stored in Jira or ARDS/SDD evidence.
