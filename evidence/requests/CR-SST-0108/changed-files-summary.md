# CR-SST-0108 - Changed files summary

## Planned child repo

- `4uentes-auth` / legacy alias `node-auth`.

## Runtime changes

- `src/configs/env.ts`
  - Adds `EXTENSION_SESSION_BODY_LIMIT`, default `5mb`.
- `src/presentation/server.ts`
  - Adds route-scoped JSON parser for `/api/extension/sessions` before the global parser.
- `src/presentation/middlewares/error.handler.ts`
  - Maps JSON/body-parser `entity.too.large` failures to HTTP 413.

## Owner docs

- `specs/integrations-api.yaml`
- `specs/capabilities/outbound/browser-extension-session-ingestion.yaml`
- `specs/routing.yaml`
- `docs/capabilities/outbound/browser-extension-session-ingestion.md`
- `docs/bf/03-routing.md`
- `docs/bf/07-error-handling.md`

## Config docs

- `.env.example`
  - Documents `EXTENSION_SESSION_BODY_LIMIT=5mb`.

## Control-plane files

- `requests/inbox/CR-SST-0108-node-auth-extension-session-body-limit.yaml`
- `requests/planned/CR-SST-0108-node-auth-extension-session-body-limit.yaml`
- `evidence/requests/CR-SST-0108/payload-limit-analysis.md`
- `evidence/requests/CR-SST-0108/changed-files-summary.md`
- `evidence/requests/CR-SST-0108/validation-results.md`

## Unrelated local files observed

- `tmp-bf-dev.err`
- `tmp-bf-dev.log`

These were already modified in the child repo worktree context and were not
changed or reverted by this CR.
