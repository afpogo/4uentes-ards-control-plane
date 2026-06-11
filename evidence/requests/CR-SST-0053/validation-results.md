# CR-SST-0053 Validation Results

Date: 2026-06-07

## Checks

| Service | Check | Result | Notes |
| --- | --- | --- | --- |
| `4uentes-auth` | `POST /api/auth/login` | PASS | Token obtained from real local login; token redacted. |
| `4uentes-auth` | BFF article + agent-job route forwarding | PASS | `POST /api/articles` and `POST /api/articles/:id/agent-jobs` succeeded. |
| `sst-bend` | Local migration | PASS | `20260524120000-create-document-agent-jobs` applied. |
| `sst-bend` | Document Agent protected job creation | PASS | Job reached `ready` and persisted `metadata.contract`. |
| `sst-bend` | Generated output document metadata | PASS | Output document metadata preserved contract projection. |
| `sst-bend` | `SMOKE_REQUIRE_AUTH=true npm.cmd run check` | PASS | Protected coverage `50/50` endpoints, 100%. |

## Non-Blocking Notes

`npm.cmd run check` still skipped member-role negative checks because `SMOKE_JWT_MEMBER` was not provided.

That omission does not block CR-SST-0053 because the remaining Document Agent gap required an authenticated owner happy-path proof.
