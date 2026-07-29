CR-SST-0098 / SST-30 session capture follow-up.

Manual QA found that clicking session capture activates tabs, closes the popup/devtools surface, and no session remains visible afterward.

Implemented follow-up:

* `sessions.captureCurrentWindow` now returns a fast `capturing` result from background.
* The long-running tab-by-tab capture continues in background after popup closure.
* `session.lastResult` persists `capturing`, then final `saved` or `failed`.
* Popup/sidepanel render `capturing` so the operator can re-open the extension and inspect progress/result.
* Manifest now includes `unlimitedStorage` as a mitigation while PDF artifacts remain in local extension queue storage.
* Owner docs/specs updated for async capture, popup closure behavior, and storage mitigation.

Validation:

* `pnpm check` in `sst-extension`: passed, 22 test files / 92 tests + WXT build.
* Generated manifest includes `unlimitedStorage`.
* `npm.cmd run check` in `4uentes-orchestor`: passed, owner-documentation gate valid for `CR-SST-0098`.

Decision:

* Keep `SST-30` in review.
* Do not close until the rebuilt extension is refreshed from `.output/chrome-mv3` and session capture manual QA is repeated.

Evidence:

* `evidence/requests/CR-SST-0098/manual-qa-session-capture-bug.md`
* `evidence/requests/CR-SST-0098/validation-results.md`
* `evidence/requests/CR-SST-0098/changed-files-summary.md`

Boundary:

* No private page content, cookies, JWTs, plaintext secrets, real PDFs from private pages, or sensitive screenshots were stored in Jira or ARDS/SDD evidence.
