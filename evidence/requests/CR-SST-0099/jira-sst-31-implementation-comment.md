CR-SST-0099 implementation checkpoint.

Implemented in `sst-extension`:

- Added local per-tab snapshot outcome metadata: `visual-pdf` and `text-pdf-fallback`.
- Added local capture mode metadata: `visual-pdf` and `textual-pdf`.
- Added sanitized warning codes for local diagnostics:
  `visual-capture-unavailable`, `unsupported-url`, `tab-readiness-timeout`,
  `pdf-materialization-fallback`.
- Preserved existing node-auth payload compatibility: extension-only fields are
  not sent to `POST /api/extension/sessions`.
- Added storage normalization so legacy local queue items remain valid.
- Updated owner ARDS/SDD docs for `sst-extension`.

Validation:

- `pnpm.cmd check` in `sst-extension`: PASS.
- `npm.cmd run check` in `4uentes-orchestor`: PASS.
- `CR-SST-0099 owner_documentation gate is valid`.

Evidence:

- `evidence/requests/CR-SST-0099/implementation-summary.md`
- `evidence/requests/CR-SST-0099/validation-results.md`
- `evidence/requests/CR-SST-0099/owner-documentation-enforcement.md`

Boundary:

- No backend/BFF contract change.
- No `node-auth` or `sst-bend` mutation.
- Jira remains an operational mirror; ARDS/SDD remains the source of truth.
- Evidence does not include private page content, real PDFs, cookies, JWTs,
  secrets, or plaintext credentials.
