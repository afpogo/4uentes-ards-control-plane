# Follow-up: create article 500 after scraper recovery

## Context

After the user logged in and confirmed scraper returned 200, article creation still produced a 500.

## Findings

- `node-auth` logs show `CustomError: Error creating articulo` in `ArticuloDatasourceImpl.handleAxiosError`.
- The stack points to the fallback branch where Axios has no `error.response`.
- That means `node-auth` did not receive an HTTP response from `sst-bend` for the create request. This is consistent with timeout, DNS/connectivity, or service unavailability, not an authorization/business response from `sst-bend`.
- `sst-bend` logs for the same time window show no article create error.
- Current cluster state shows `sst-bend`, `scrapper`, and their services/endpoints are running.
- Internal unauthenticated connectivity checks from `node-auth` now reach:
  - `sst-bend-service:3005` with HTTP 401
  - `scrapper:3200` with HTTP 404 on GET, expected because the scraper route is POST-only.

## Remediation prepared

- `node-auth` source now maps no-response downstream failures to 503/504 instead of a generic 500 for article datasource calls.
- `node-auth` source now preserves Axios response status/message for scraper datasource calls.
- Infra manifests now declare `SCRAPPER_BASE_URL=http://scrapper:3200/4uentes/v1/scrapWeb`.

## Validation

- `node-auth`: `npm run check` passed.
- `node-auth`: `npm run build` passed.
- `sst-4uentes-infra`: `npm run check` passed.

## Deployment note

The `node-auth` repo has many pre-existing dirty files. Rebuilding and loading the local image would include more than the scoped datasource changes, so runtime deployment of the code changes should be confirmed before proceeding.
