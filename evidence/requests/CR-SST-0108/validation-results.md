# CR-SST-0108 - Validation results

## Completed

- `node-auth npm.cmd run build`
  - Result: PASS.
- `node-auth npm.cmd run check`
  - Result: PASS.
  - Output: `[ARDS CHECK] OK`.
- `4uentes-orchestor npm.cmd run check`
  - Result: PASS.
  - Owner-documentation gate includes `CR-SST-0108 owner_documentation gate is valid`.
- `docker build -t ghcr.io/afpogo/4uentes-auth:develop-82f84da4a99f .`
  - Result: PASS.
  - Scope: local development image for the tag currently referenced by the running Kubernetes deployment.
- `kind load docker-image ghcr.io/afpogo/4uentes-auth:develop-82f84da4a99f --name sst-cluster-dev`
  - Result: PASS.
- `kubectl rollout restart deployment/node-auth -n 4uentes-sst`
  - Result: PASS.
- `kubectl rollout status deployment/node-auth -n 4uentes-sst --timeout=180s`
  - Result: PASS.
- Synthetic smoke: `POST http://localhost:8088/api/extension/sessions` with ~200 KB JSON body and no bearer token.
  - Result: PASS.
  - Observed status: `401`.
  - Interpretation: request body passed the previous 100 KB parser ceiling and reached extension auth middleware.
- Synthetic smoke: `POST http://localhost:8088/api/extension/sessions` with ~6 MB JSON body and no bearer token.
  - Result: PASS.
  - Observed status: `413`.
  - Interpretation: route-scoped `EXTENSION_SESSION_BODY_LIMIT=5mb` is enforced with sanitized oversized-body response.
- User manual QA retry from `sst-extension` queued session.
  - Result: PASS.
  - Observed endpoint: `POST http://localhost:8088/api/extension/sessions`.
  - Observed status: `201`.
  - Outcome: SST session was created and tab PDFs were generated.

## Pending

- None for CR-SST-0108 local closure.

## Runtime deployment note

`localhost:8088` is served by the local `kind` cluster, not by docker compose in
the `node-auth` repo. The local development deployment was refreshed by loading
the rebuilt image into `kind` and restarting `deployment/node-auth`.

Synthetic payloads used only generated placeholder base64-like data and did not
contain private page content, PDFs, cookies, JWTs, or secrets.

Manual QA success evidence is recorded in
`evidence/requests/CR-SST-0108/manual-qa-success.md`.
