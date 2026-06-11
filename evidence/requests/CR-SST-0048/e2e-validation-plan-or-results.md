# E2E Validation Plan Or Results

## Status

- Date: 2026-06-07
- Request: `CR-SST-0048`
- Result: partial validation
- Functional repositories modified: no
- Jira writes: no

## Executed

### Frontend

```powershell
npm.cmd run check
```

Result:

- PASS.
- 24 test suites passed.
- 142 tests passed.
- 22 existing React hook warnings.

### Auth/BF

```powershell
npm.cmd run check
```

Result:

- Initial sandboxed run failed with `EPERM` while removing `dist`.
- Approved rerun outside sandbox passed.

### Backend

```powershell
node --check src/apps/sst/application/articulos/create-document-agent-job.usecase.js
node --check src/apps/sst/application/articulos/document-agent.service.js
node --check src/apps/sst/presentation/controllers/articulos.controller.js
node --check src/apps/sst/presentation/routes/articulos.routes.js
docker compose up -d
npm.cmd run check
curl.exe -i -s -X POST http://localhost:3005/4uentes/v1/articulos/00000000-0000-0000-0000-000000000000/agent-jobs -H "Content-Type: application/json" -H "Idempotency-Key: cr-sst-0048-smoke" -d "{}"
```

Result:

- Syntax checks passed.
- Docker services started.
- `npm.cmd run check` exited PASS, but with partial protected coverage because
  `SMOKE_JWT`/`SMOKE_JWT_OWNER` was not available.
- Negative unauthenticated route smoke returned `401 AUTH_UNAUTHORIZED`.

## Not Executed

Authenticated happy-path job creation was not executed because no owner JWT or
local authenticated session token was available to the command environment.

The missing happy-path proof is:

1. Create or select an article under an owner account.
2. POST `/api/articles/:id/agent-jobs` through `4uentes-auth` with:
   - bearer token;
   - `x-active-account-id`;
   - `Idempotency-Key`;
   - `correlationId`;
   - Document Agent request body.
3. Confirm `202` with a persisted job id.
4. GET `/api/articles/:id/agent-jobs/:jobId`.
5. Confirm job reaches `ready` or `failed` deterministically.
6. Confirm output `agent_summary` document exists when ready.

## State Decision

Do not move `document-agent` to `validated-live` yet.

Keep `SST-8` open or in progress until authenticated E2E proof or an explicit
scope split is approved.
