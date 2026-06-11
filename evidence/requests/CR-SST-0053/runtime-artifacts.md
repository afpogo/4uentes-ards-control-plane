# CR-SST-0053 Runtime Artifacts

Date: 2026-06-07

Sanitized result object from the passing Document Agent smoke:

```json
{
  "smoke": "CR-SST-0053",
  "route": "BFF /api/articles -> /api/articles/:id/agent-jobs",
  "tokenSource": "node-auth login response, redacted",
  "login": {
    "ok": true,
    "tokenPresent": true
  },
  "migration": {
    "command": "npm.cmd run migration:run",
    "documentAgentJobsTableCreated": true
  },
  "article": {
    "createStatus": 200,
    "id": "4803994b-c497-4c36-9d32-cb3dc9b76ebb"
  },
  "job": {
    "createStatus": 200,
    "id": "0a2ffcf2-dfb2-4ec0-9a18-29043c13b587",
    "status": "ready",
    "outputDocumentId": "1af84aea-be1b-4d6a-810e-81b9fe6ef915",
    "idempotencyKeyMatches": true,
    "correlationIdMatches": true,
    "contractPresent": true,
    "operationIntentIdMatches": true,
    "capabilityId": "document-agent.document_process",
    "tenantIdPresent": true,
    "userIdPresent": true,
    "requestedRetryPolicyPresent": true,
    "auditMetadataPresent": true
  },
  "generatedDocument": {
    "documentsListStatus": 200,
    "id": "1af84aea-be1b-4d6a-810e-81b9fe6ef915",
    "status": "ready",
    "outputDocumentMetadataContractPresent": true
  }
}
```

No token, cookie, refresh token, password, private key, or authorization header is present in this artifact.
