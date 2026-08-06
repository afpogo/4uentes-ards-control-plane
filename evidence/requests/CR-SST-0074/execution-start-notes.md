# CR-SST-0074 Execution Start Notes

## Status

- Date: 2026-06-20
- Request: CR-SST-0074
- Scope: `4uentes-auth` authenticated BFF facade for governed SST tags endpoints

## Current Upstream State

Observed upstream readiness from `sst-bend`:

- `CR-SST-0071`: done
- `CR-SST-0072`: done
- `CR-SST-0073`: implemented locally and Jira `SST-21` currently in `En revisión`
- `CR-SST-0079`: done with reproducible `.http` QA and duplicate-request hardening

The backend governance endpoints already exist in `sst-bend`:

- `GET /4uentes/v1/tags/definitions`
- `GET /4uentes/v1/tags/values`
- `POST /4uentes/v1/tags/values`
- `PUT /4uentes/v1/tags/resources/:resourceType/:resourceId`

## Local BF Baseline

`4uentes-auth` already exposes a similar authenticated pass-through for:

- `POST /api/tags/prefix-engine/preview`

Relevant local pattern:

- route mount under `/api/tags`
- controller strips middleware-injected fields before forwarding
- datasource derives sibling SST `/tags/*` URL from `SST_BASE_URL`
- BF forwards `Authorization`, `x-active-account-id` and `x-account-id`
- BF preserves upstream response shape and status codes

References:

- `src/presentation/tag-prefix-engine/controller.ts`
- `src/infrastructure/datasources/tag-prefix-engine.datasource.impl.ts`
- `docs/capabilities/inbound/sst-bend--tag-prefix-engine-preview.md`

## Implementation Direction

Use the existing tag-prefix-engine pass-through shape as the base for governed
tags BFF routes.

Expected minimal work units:

1. Add authenticated BF routes for:
   - `GET /api/tags/definitions`
   - `GET /api/tags/values`
   - `POST /api/tags/values`
   - `PUT /api/tags/resources/:resourceType/:resourceId`
2. Reuse the same forwarding rules:
   - preserve `Authorization`
   - preserve `x-active-account-id` / `x-account-id`
   - strip `user` and `authTokenPayload` from forwarded JSON bodies
3. Keep BF validation minimal and structural only:
   - do not reinterpret domain semantics
   - do not degrade governed tags to `string[]`
4. Publish inbound capability adoption and any downstream capability impact for
   `sst-fend`

## Known Risks

- Shared auth provider boundary: incorrect route or validation changes impact all SST consumers.
- Semantic drift risk: BF must not rewrite governance payloads or invent local tag rules.
- Query propagation risk: `scope`, `resourceType`, `definitionKey`, `q`, `limit`, `offset` must survive unchanged.

## Immediate Next Check

Before touching `4uentes-auth`, inspect current article/tag DTOs and routes in
the local `node-auth` repo to determine whether the new governance endpoints
should live beside the existing tag-prefix-engine preview routes or in a new
governed-tags module under `/api/tags`.
