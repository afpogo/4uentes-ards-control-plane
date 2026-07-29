CR-SST-0098 closure checkpoint.

Manual QA final result:

- `POST http://localhost:8088/api/extension/sessions`
- observed status: `201`
- SST session was created.
- tab PDFs were generated.

Implementation summary:

- sst-extension now performs tab-by-tab session capture with visual PDF snapshots.
- Original active tab is restored after capture.
- Host permission preflight is explicit for session and PDF capture paths.
- Long session capture continues in background after popup closure.
- Local queue preserves complete session metadata while outbound submit filters non-HTTP(S) tabs and removes local-only fields.
- PDF-safe text normalization prevents `pdf-lib` failures on unsupported characters.
- `unlimitedStorage` was added as a local mitigation for queued PDF artifacts.

BFF follow-up resolved:

- `CR-SST-0108` / `SST-40` fixed the node-auth request body parser limit exposed during SST-30 QA.
- `SST-40` is closed as `Listo`.
- After that fix, the real session submit passed with `201`.

Validation:

- sst-extension focal tests: PASS.
- sst-extension `pnpm check`: PASS, latest run had 25 test files and 98 tests.
- node-auth follow-up `npm.cmd run build`: PASS.
- node-auth follow-up `npm.cmd run check`: PASS.
- control-plane `npm.cmd run check`: PASS with owner-documentation gate valid for `CR-SST-0098` and `CR-SST-0108`.
- user manual QA final session submit: PASS with `201`.

Evidence:

- `requests/planned/CR-SST-0098-sst-extension-session-tab-pdf-capture.yaml`
- `evidence/requests/CR-SST-0098/implementation-summary.md`
- `evidence/requests/CR-SST-0098/changed-files-summary.md`
- `evidence/requests/CR-SST-0098/validation-results.md`
- `evidence/requests/CR-SST-0098/owner-documentation-enforcement.md`
- `evidence/requests/CR-SST-0098/manual-qa-session-capture-bug.md`
- `evidence/requests/CR-SST-0098/manual-qa-final-session-success.md`
- `evidence/requests/CR-SST-0108/manual-qa-success.md`

Boundary:

- Jira is an operational mirror; ARDS/SDD remains the source of truth.
- No private page content, real PDF bodies, cookies, JWTs, secret plaintext or sensitive screenshots were included in Jira or evidence.
