CR-SST-0108 closure checkpoint.

Manual QA result:

- `POST http://localhost:8088/api/extension/sessions`
- observed status: `201`
- SST session was created.
- tab PDFs were generated.

Implementation summary:

- node-auth now keeps the global BF body parser limit unchanged.
- `/api/extension/sessions` has a route-scoped JSON parser with `EXTENSION_SESSION_BODY_LIMIT`, default `5mb`.
- oversized bodies now return sanitized `413 Request body too large` instead of generic 500.
- node-auth owner ARDS/SDD docs/specs were updated.
- local kind deployment was rebuilt/reloaded/restarted for validation.

Validation:

- node-auth `npm.cmd run build`: PASS.
- node-auth `npm.cmd run check`: PASS.
- synthetic ~200 KB session body without bearer returns `401`, proving it passes the previous 100 KB parser ceiling and reaches auth.
- synthetic ~6 MB session body returns `413`.
- control-plane `npm.cmd run check`: PASS, including owner-documentation gate for CR-SST-0108.
- user manual QA real session submit: PASS with `201`.

Evidence:

- `requests/planned/CR-SST-0108-node-auth-extension-session-body-limit.yaml`
- `evidence/requests/CR-SST-0108/payload-limit-analysis.md`
- `evidence/requests/CR-SST-0108/changed-files-summary.md`
- `evidence/requests/CR-SST-0108/validation-results.md`
- `evidence/requests/CR-SST-0108/manual-qa-success.md`

Boundary:

- Jira is an operational mirror; ARDS/SDD remains the source of truth.
- No private page content, real PDF bodies, cookies, JWTs or plaintext secrets were included in evidence.
