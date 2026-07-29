CR-SST-0100 start checkpoint.

This starts the next scoped slice under INIT-SST-0003 after CR-SST-0099 / SST-31
was closed.

Intent:

- Add visible session capture progress and degradation feedback in `sst-extension`.
- Use local snapshot metadata from CR-SST-0099 (`outcome`, `captureMode`,
  `warnings`) instead of inspecting private page content.
- Preserve retry, restore and delete actions.
- Keep backend/BFF contracts unchanged.

Guardrails:

- Do not store private page content, real PDF bodies, cookies, JWTs, secrets or
  plaintext credentials in Jira/evidence.
- Do not mutate `node-auth`, `sst-bend` or backend contracts in this CR.
- Owner documentation in `sst-extension` must be updated before closure, or an
  explicit exception must be recorded.
- Control-plane owner-documentation enforcement must pass before closure.

Evidence:

- `requests/planned/CR-SST-0100-sst-extension-session-ui-progress.yaml`
- `evidence/requests/CR-SST-0100/jira-issue-SST-32-observation.md`

Boundary:

- Jira is an operational mirror; ARDS/SDD remains the source of truth.
