# CR-SST-0053 Authenticated E2E Results

Date: 2026-06-07

## Result

PASS.

The SST Document Agent authenticated E2E path was validated through the BFF route:

`node-auth login -> POST /api/articles -> POST /api/articles/:id/agent-jobs -> GET /api/articles/:id/agent-jobs/:jobId -> GET /api/articles/:id/documents`

## Token Handling

The access token was obtained from the real local `node-auth` login endpoint and used only in memory.

No JWT, refresh token, cookie, password, private key, or `Authorization` header was written to evidence.

## Runtime Results

| Check | Result |
| --- | --- |
| `POST /api/auth/login` returned access token | PASS |
| `POST /api/articles` via BFF | PASS |
| `POST /api/articles/:id/agent-jobs` via BFF | PASS |
| Job reached `ready` | PASS |
| Job response preserved `idempotencyKey` | PASS |
| Job response preserved `correlationId` | PASS |
| Job response included `metadata.contract` | PASS |
| `metadata.contract.operationIntentId` matched request | PASS |
| `metadata.contract.capabilityId` was `document-agent.document_process` | PASS |
| `metadata.contract.tenantId` present | PASS |
| `metadata.contract.userId` present | PASS |
| `metadata.contract.requestedRetryPolicy` present | PASS |
| `metadata.contract.auditMetadata` present | PASS |
| Generated output document was listed as `ready` | PASS |
| Generated output document metadata preserved contract projection | PASS |

## Sanitized Runtime Identifiers

- Article ID: `4803994b-c497-4c36-9d32-cb3dc9b76ebb`
- Job ID: `0a2ffcf2-dfb2-4ec0-9a18-29043c13b587`
- Output document ID: `1af84aea-be1b-4d6a-810e-81b9fe6ef915`

## Local Runtime Setup

The first authenticated job attempt exposed that the local PostgreSQL database did not yet have `document_agent_jobs`.

The missing local table was resolved with:

`npm.cmd run migration:run`

The migration applied:

`20260524120000-create-document-agent-jobs`

After migration, the authenticated E2E passed.
