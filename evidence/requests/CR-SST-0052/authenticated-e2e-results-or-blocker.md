# CR-SST-0052 Authenticated E2E Results Or Blocker

Date: 2026-06-07

## Result

Authenticated happy-path E2E was not executed.

The local environment did not expose either:

- `SMOKE_JWT`
- `SMOKE_JWT_OWNER`

Without one of those values, the protected Document Agent job creation route cannot be validated as an authenticated owner flow.

## What Was Still Validated

Static and repo-local checks passed after the contract alignment changes:

- `sst-fend`: `npm.cmd run check` passed.
- `4uentes-auth`: `npm.cmd run check` passed.
- `sst-bend`: `npm.cmd run check` exited 0 and reported expected partial protected coverage because `SMOKE_JWT` was missing.

Backend JS syntax checks also passed for the modified SST backend files:

- `src/apps/sst/presentation/schemas/articulo.dto.js`
- `src/apps/sst/application/articulos/create-document-agent-job.usecase.js`
- `src/apps/sst/application/articulos/document-agent.service.js`

## Remaining External Input

To move the feature from `validated-local` to live authenticated proof, provide a valid owner smoke token and rerun the protected Document Agent E2E:

- create or select an article under an authenticated owner account;
- POST `/api/articles/:id/agent-jobs` through the frontend/BFF route;
- verify the backend job response contains `metadata.contract`;
- verify the generated output document metadata preserves the same contract projection.
