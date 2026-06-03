# CR-SST-0023 Browser Network And Console Summary

Date: 2026-06-02

Entry point inspected: `http://localhost:8088/`

Chrome DevTools observations:

- App loaded and rendered the SST frontend shell.
- Console showed `BASE_URI:` followed by failed resources:
  - `POST http://localhost:8088/api/auth/refresh` returned `401`.
  - `POST http://localhost:8088/api/auth/logout` returned `500`.
- The refresh response body was `{"error":"Refresh token invalido o expirado."}`.
- The browser had a refresh cookie and CSRF cookie, but the refresh token was rejected by `node-auth`.

Interpretation:

- The visible unauthorized article/resource behavior is consistent with a stale or invalid browser session. The frontend cannot obtain a fresh access token, so downstream article/resource requests either carry no bearer or a bad bearer.
- `node-auth` does not convert browser cookies into downstream SST authorization for article routes. It forwards `Authorization` only when the frontend sends a bearer.
- `sst-bend` protects article list/create routes with JWT validation, so missing or invalid bearer returns unauthorized.

Safety note:

- Full request dumps containing browser cookies or JWT material were not recorded in evidence.
