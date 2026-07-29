CR-SST-0099 start checkpoint.

This starts the next scoped slice under INIT-SST-0003 after CR-SST-0098 / SST-30 was closed.

Purpose:

- Add explicit session snapshot outcomes and warnings in sst-extension.
- Preserve compatibility with existing local queue data.
- Keep node-auth and SST backend contracts unchanged.
- Prepare a clean data surface for the later UI progress/degradation work in CR-SST-0100 / SST-32.

Initial outcome/warning taxonomy to validate in code:

- visual PDF capture
- textual PDF fallback
- skipped / unsupported URL
- host permission denied
- tab load timeout
- capture timeout
- PDF materialization failure
- storage warning

Guardrails:

- Do not store private page content, real PDF bodies, cookies, JWTs or plaintext secrets in Jira/evidence.
- Do not change sst-bend or node-auth in this CR.
- Owner documentation in sst-extension must be updated before closure.
- Control-plane owner-documentation enforcement must pass before closure.

Evidence:

- `requests/planned/CR-SST-0099-sst-extension-session-outcomes-warnings.yaml`
- `evidence/requests/CR-SST-0099/preliminary-analysis.md`
- `evidence/requests/CR-SST-0099/subagent-atomized-plan.md`

Boundary:

- Jira is an operational mirror; ARDS/SDD remains the source of truth.
