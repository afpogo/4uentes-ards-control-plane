# CR-SST-0018 - Implementation Summary

Observed on: 2026-05-28

## Scope

Services affected:

- `4uentes-auth` (`node-auth` local alias)
- `sst-fend`
- `sst-4uentes-infra`

Model-selection classification:

- `complex-high-risk-task`

Reason:

- The change involved authentication, refresh tokens, cookies, CSRF, frontend
  session recovery, API behavior, and infra runtime contracts.

## Implemented Behavior

### 4uentes-auth / node-auth

- Added `SESSION_IDLE_TTL` with default `5h`.
- Login and refresh now store refresh-token `expiresAt` according to
  `SESSION_IDLE_TTL`.
- Refresh cookie max age follows `SESSION_IDLE_TTL`.
- Logout clears session cookies even when the session is stale or invalid.
- Invalid JSON bodies now return `400` with `Invalid JSON body.` instead of
  surfacing as an internal error.
- `specs/auth.yaml` documents cryptographic refresh TTL versus idle session TTL.

### sst-fend

- Logout no longer sends JSON literal `null` as request body.
- Added frontend idle-session tracking with default `5h`.
- Added refresh/logout guard behavior for idle-expired client sessions.
- Added focused tests for logout body and idle timeout behavior.
- `specs/31-auth-frontend.yml` documents the frontend idle policy.

### sst-4uentes-infra

- Added `SESSION_IDLE_TTL` to node-auth runtime config.
- Development overlay documents short idle smoke value.
- Deployment contracts and outbound capability documentation describe session
  recovery and build-time frontend idle configuration.

## Runtime Evidence

Local containers were restarted by the user before validation.

Observed runtime:

- `node-auth-fuentes-1` exposed `localhost:4000`
- `sst-bend-sst-1` exposed `localhost:3005`
- `sst-fend` dev server exposed `localhost:4090`

HTTP validation confirmed:

- login creates token and CSRF cookie
- refresh with cookie and CSRF returns an access token
- logout without JSON body revokes the session
- refresh after logout returns `401`
- stale logout with invalid refresh token returns `401` and clears cookies
- invalid JSON returns `400 Invalid JSON body.`

Frontend served bundle confirmed:

- BF target includes `localhost:4000`
- idle tracking key `sst.auth.lastActivityAt` is present
- logout null-body pattern is not present
