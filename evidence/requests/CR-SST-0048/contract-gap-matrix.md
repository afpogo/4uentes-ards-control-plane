# Contract Gap Matrix

## Status

- Date: 2026-06-07
- Request: `CR-SST-0048`
- Source contract: `CR-SST-0008`
- Runtime repos inspected: `sst-fend`, `4uentes-auth`, `sst-bend`

## Matrix

| Contract requirement | Runtime observation | Status | Evidence |
| --- | --- | --- | --- |
| Frontend can initiate Document Agent workflow | `sst-fend` dispatches `createDocumentAgentJobAction` and posts to `/articles/:id/agent-jobs`. | present | `src/store/actions/articulo.action.ts` |
| Idempotency key is produced and sent | `sst-fend` generates `idempotencyKey` and sends `Idempotency-Key`. `4uentes-auth` forwards it. `sst-bend` requires it. | present | `src/store/actions/articulo.action.ts`, `src/infrastructure/datasources/articulo.datasource.impl.ts`, `create-document-agent-job.usecase.js` |
| Correlation id is preserved end to end | Types and backend persistence support `correlationId`, but `sst-fend` does not generate it when absent; `sst-bend` generates one server-side. | partial | `ICreateDocumentAgentJobRequest`, `DocumentAgentJobSchema` |
| Tenant/account scope is validated | Runtime uses `accountId`/`x-active-account-id`, not `tenant_id`. `sst-bend` validates account membership through `resolveAccountContext`. | semantic-equivalent-partial | `resolve-account-context.middleware.js`, `getActiveAccountIdFromReq` |
| User id is present | `sst-bend` derives `requestedByUserId` from JWT/account context; frontend does not send `user_id`. | backend-derived | `verify-jwt.middleware.js`, `resolve-account-context.middleware.js` |
| Durable job is persisted before processing | `CreateDocumentAgentJobUseCase` creates the job before `DocumentAgentService.scheduleJob`. | present | `create-document-agent-job.usecase.js` |
| Retry policy is represented | Runtime has status/error/idempotent reuse, but no explicit `requested_retry_policy` field. | gap | `DocumentAgentJobSchema` |
| Audit metadata is represented | Runtime stores `metadata` and `requestedByUserId`, but not the full CR-SST-0008 `audit_metadata` shape. | partial | `DocumentAgentJobSchema` |
| Contract names use `operation_intent` and `capability_id` | Runtime names use `eventType` and `promptTemplateId`. | drift | `articulo.action.ts`, `articulo.dto.js` |
| Allowed capability ids match contract | Runtime event defaults to `document.agent_process_requested`; contract allows `document-agent.document_process` style ids. | drift | `articulo.action.ts`, `articulo.dto.js` |
| Authenticated E2E smoke proves job creation and output document | Not executed because no `SMOKE_JWT`/owner token was available. | pending | `npm.cmd run check` output |

## Decision

`CR-SST-0048` confirms a real runtime path exists, but it does not prove full
E2E success under an authenticated owner session. `document-agent` should remain
`validated-local`.

The next implementation pass should either:

- align runtime naming with the CR-SST-0008 contract; or
- revise the control-plane contract to explicitly accept the observed
  `accountId`, `eventType`, and `promptTemplateId` runtime vocabulary.
