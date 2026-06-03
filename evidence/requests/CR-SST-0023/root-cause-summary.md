# CR-SST-0023 Root Cause Summary

Date: 2026-06-02

Findings:

1. Unauthorized article/resource calls have two contributing causes:
   - The active browser session was stale: `/api/auth/refresh` returned `401` with `Refresh token invalido o expirado.`
   - Some frontend resource instances requested `useToken: true`, but the legacy axios factory ignored that option and did not attach `Authorization`.

2. Article list/create contract:
   - `sst-fend` calls `node-auth` through `/api/*`.
   - `node-auth` forwards `Authorization` to `sst-bend` when present.
   - `sst-bend` protects article list/create routes with JWT validation.
   - Cookies alone are not a downstream article authorization mechanism.

3. Kubernetes JWT verifier risk:
   - `sst-bend` defaulted to a Docker Compose JWKS host (`fuentes:4000`) when `JWKS_URL` was not configured.
   - Kubernetes development now explicitly points `sst-bend` to `node-auth-service:4000`.

4. Scraper 500 cause:
   - `node-auth` hardcodes scraper upstream as `http://scrapper:3200/4uentes/v1/scrapWeb`.
   - The Kubernetes development namespace did not have a `scrapper` Service/Deployment.
   - `node-auth` maps scraper downstream/network failures to generic HTTP 500, making the browser symptom opaque.

Fixes made:

- `sst-fend`: legacy axios instance factory now honors `useToken` and attaches `Authorization: Bearer <token>` when a token is available.
- `sst-4uentes-infra`: Kubernetes development config now supplies `JWKS_URL`, `JWT_ISSUER`, and `JWT_AUDIENCE` for `sst-bend`.
- `sst-4uentes-infra`: Kubernetes development now includes a `scrapper` Deployment and Service named `scrapper` on port `3200`.

Remaining user action for browser verification:

- Clear stale browser session or log out/log in again at `http://localhost:8088`.
- The frontend code fix is validated locally but not deployed to the running `sst-fend` image because rebuilding that image requires approved build-time crypto args.
