# CR-SST-0023 Runtime Service State

Date: 2026-06-02

Observed before remediation:

- `node-auth`, `node-auth-mongo`, `sst-bend`, `sst-fend`, `sst-postgres`, and migration job existed in namespace `4uentes-sst`.
- No Kubernetes `scrapper` pod or service existed.
- `localhost:8088` was mapped through kind to nginx ingress and the frontend loaded.
- `node-auth` logs showed:
  - repeated `CustomError: Unauthorized` from `ArticuloDatasourceImpl`;
  - `CustomError: Internal Server Error` from `ScrapperDatasourceImpl`;
  - `CustomError: Refresh token invalido o expirado.`;
  - a secondary logout parse error from request body `null`.

Applied runtime remediation:

- Applied `k8s-manifests/overlays/development`.
- Created `service/scrapper` and `deployment/scrapper`.
- Updated `sst-bend-config` with:
  - `JWKS_URL=http://node-auth-service:4000/.well-known/jwks.json`
  - `JWT_ISSUER=sst-auth`
  - `JWT_AUDIENCE=sst-api`
- Restarted `deployment/sst-bend` so the ConfigMap changes were read.

Observed after remediation:

- `deployment/sst-bend` rolled out successfully.
- `deployment/scrapper` rolled out successfully.
- `pod/scrapper-*` was `1/1 Running`.
- `pod/sst-bend-*` was `1/1 Running`.
- `service/scrapper` existed on port `3200`.
- `curl http://localhost:8088/.well-known/jwks.json` returned HTTP `200`.
- `sst-bend` pod env confirmed:
  - `JWKS_URL=http://node-auth-service:4000/.well-known/jwks.json`
  - `JWT_ISSUER=sst-auth`
  - `JWT_AUDIENCE=sst-api`
- `scrapper` pod env confirmed:
  - `JWKS_URL=http://node-auth-service:4000/.well-known/jwks.json`
  - `JWT_ISSUER=sst-auth`
  - `JWT_AUDIENCE=scrapper-api`
