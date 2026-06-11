# CR-SST-0052 Runtime Contract Alignment Summary

Date: 2026-06-07

## Scope

CR-SST-0052 advanced the Document Agent runtime contract alignment across:

- `sst-fend`
- `4uentes-auth`
- `sst-bend`

The request was executed after CR-SST-0048 identified two gaps blocking closure confidence for CR-SST-0008:

- runtime vocabulary drift from the CR-SST-0008 contract;
- missing authenticated E2E proof due unavailable local smoke JWT.

## Contract Gap Closed

The runtime now carries an explicit contract projection in addition to the existing operational fields.

Frontend request creation now generates/preserves:

- `idempotencyKey`
- `correlationId`
- `operationIntentId`
- `capabilityId`
- `preferredExecutionWindow`
- `priority`
- `requestedRetryPolicy`
- `auditMetadata`

The BFF contract type accepts the same optional fields and continues forwarding the request body and auth headers.

The SST backend now validates the fields and persists a canonical projection under `metadata.contract`:

- `operationIntentId`
- `capabilityId`
- `tenantId`
- `userId`
- `preferredExecutionWindow`
- `priority`
- `requestedRetryPolicy`
- `auditMetadata`

The backend `inputSnapshot.contract` also records the CR-SST-0008 vocabulary aliases:

- `operation_intent`
- `capability_id`
- `tenant_id`
- `user_id`

The generated agent document metadata now carries the runtime contract metadata from the source job.

## Files Touched

`sst-fend`:

- `src/services/articuloService.ts`
- `src/store/actions/articulo.action.ts`

`4uentes-auth`:

- `src/domain/constants/articulo.constants.ts`

`sst-bend`:

- `src/apps/sst/presentation/schemas/articulo.dto.js`
- `src/apps/sst/application/articulos/create-document-agent-job.usecase.js`
- `src/apps/sst/application/articulos/document-agent.service.js`

## Compatibility Notes

The changes are backward-compatible:

- existing `eventType`, `promptTemplateId`, `accountId`, `idempotencyKey`, and `correlationId` behavior remains;
- new request fields are optional;
- server defaults populate missing contract fields;
- no database migration was required because `metadata` and `inputSnapshot` already support JSON payloads.

The repos had pre-existing dirty worktrees. CR-SST-0052 changed only the files listed above.
