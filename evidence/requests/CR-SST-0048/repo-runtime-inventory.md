# Repo Runtime Inventory

## Status

- Date: 2026-06-07
- Request: `CR-SST-0048`
- Scope: `sst-fend`, `4uentes-auth`, `sst-bend`
- Functional repositories modified: no
- Jira writes: no

## Baseline

All three functional repositories had dirty working trees before this runtime
inventory. Existing user or prior-agent changes were preserved.

| Repo | Baseline observation |
| --- | --- |
| `sst-fend` | Dirty working tree with existing Document Agent UI/action changes. |
| `4uentes-auth` | Dirty working tree with existing Document Agent facade/use-case changes. |
| `sst-bend` | Dirty working tree with existing Document Agent job, migration, and service changes. |

## `sst-fend`

Observed runtime surface:

- `src/pages/Articles/components/ArticleDocumentsPanel/ArticleDocumentsPanel.tsx`
  dispatches Document Agent job creation and polling.
- `src/store/actions/articulo.action.ts` defines:
  - `createDocumentAgentJobAction`
  - `getDocumentAgentJobsAction`
- `src/services/articuloService.ts` defines:
  - `ICreateDocumentAgentJobRequest`
  - `IDocumentAgentJob`

Observed behavior:

- Frontend posts to `/articles/:id/agent-jobs`.
- Frontend generates and sends `idempotencyKey`.
- Frontend sends `Idempotency-Key` header.
- Frontend supports optional `correlationId` in the request type.
- Frontend does not currently generate `correlationId` when absent.
- Frontend does not explicitly include `tenant_id` or `user_id`; user/account
  scope is expected from auth/session headers and backend JWT context.

Validation:

- `npm.cmd run check`: PASS.
- Result included 22 existing React hook warnings and 24 passing test suites.

## `4uentes-auth`

Observed runtime surface:

- `src/presentation/routes.ts` mounts `ArticuloRoutes` under:
  - `/api/articulos`
  - `/api/articles`
- `src/presentation/articulo/routes.ts` exposes:
  - `POST /:id/agent-jobs`
  - `GET /:id/agent-jobs`
  - `GET /:id/agent-jobs/:jobId`
- `src/presentation/articulo/controller.ts` forwards:
  - bearer auth
  - `x-active-account-id`
  - `Idempotency-Key`
  - request body
- `src/infrastructure/datasources/articulo.datasource.impl.ts` forwards the
  request to SST as `${SST_BASE_URL}/${id}/agent-jobs`.

Observed behavior:

- Auth/BF preserves `Authorization`.
- Auth/BF preserves `x-active-account-id` when present.
- Auth/BF preserves `Idempotency-Key`.
- Auth/BF does not create its own `correlationId`; it forwards one if present
  in the body.

Validation:

- First `npm.cmd run check` failed with `EPERM` while cleaning `dist`.
- Retried outside sandbox with approval.
- `npm.cmd run check`: PASS.

## `sst-bend`

Observed runtime surface:

- `src/apps/sst/presentation/routes/articulos.routes.js` exposes:
  - `POST /:id/agent-jobs`
  - `GET /:id/agent-jobs`
  - `GET /:id/agent-jobs/:jobId`
- Routes are protected with:
  - `verifyJWT`
  - `resolveAccountContext`
  - `requireAccountRole(["owner"])` for job creation.
- `src/apps/sst/application/articulos/create-document-agent-job.usecase.js`
  requires `accountId` and `idempotencyKey`.
- `db/models/document-agent-job.js` persists:
  - `accountId`
  - `articleId`
  - `idempotencyKey`
  - `correlationId`
  - `requestedByUserId`
  - status timestamps and metadata.
- `src/apps/sst/application/articulos/document-agent.service.js` schedules a
  deterministic async job and writes an `agent_summary` article document.

Observed behavior:

- Backend generates `correlationId` if absent.
- Backend de-duplicates by `accountId + idempotencyKey`.
- Backend persists the job before scheduling processing.
- Backend stores `requestedByUserId` from `req.accountContext.userId`.

Validation:

- `node --check` passed for key Document Agent JS files.
- `docker compose up -d` started local `postgres`, `sst`, `scrapper`, and
  `pgadmin`.
- `npm.cmd run check`: PASS exit code, with partial protected coverage because
  `SMOKE_JWT` or `SMOKE_JWT_OWNER` was not available.
- Negative smoke:
  `POST /4uentes/v1/articulos/00000000-0000-0000-0000-000000000000/agent-jobs`
  without auth returned `401 AUTH_UNAUTHORIZED`, confirming the route exists
  and is protected.
