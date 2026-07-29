CR-SST-0108 implementation checkpoint.

This ticket was opened as the node-auth follow-up discovered during SST-30 manual QA.

Completed locally:

- Confirmed `POST /api/extension/sessions` was failing in node-auth before the handler with `PayloadTooLargeError`.
- Kept the global BF body parser limit unchanged for unrelated routes.
- Added route-scoped JSON parsing for `/api/extension/sessions`.
- Added `EXTENSION_SESSION_BODY_LIMIT`, default `5mb`.
- Normalized oversized body parser errors to sanitized `413 Request body too large`.
- Updated node-auth owner ARDS/SDD docs/specs for routing, integration, capability and error handling.
- Built and loaded the current node-auth image into the local kind cluster.
- Restarted `deployment/node-auth` and confirmed rollout success.

Validation:

- node-auth `npm.cmd run build`: PASS.
- node-auth `npm.cmd run check`: PASS.
- synthetic ~200 KB session body without bearer now reaches auth and returns `401`.
- synthetic ~6 MB session body returns `413`.
- control-plane `npm.cmd run check`: PASS, including owner-documentation gate for CR-SST-0108.

Pending before closure:

- User manual retry from the existing sst-extension queued session against `localhost:8088`.
- If the retry still fails after node-auth accepts the body, inspect downstream SST logs for contract/storage errors.

Boundary:

- Jira is an operational mirror; ARDS/SDD remains the source of truth.
- No private page content, real PDF bodies, cookies, JWTs or plaintext secrets were included in evidence.
