# CR-SST-0053 Secret Handling Note

Date: 2026-06-07

## Rules Applied

- The JWT was captured only in a local PowerShell variable.
- The JWT was not printed.
- The JWT was not written to any file.
- `Authorization` headers were not written to evidence.
- Refresh token cookies were not captured or persisted.
- Private key files were not opened for evidence.
- Passwords were not written into evidence.
- After the protected gate, `SMOKE_JWT`, `SMOKE_JWT_OWNER`, and `SMOKE_REQUIRE_AUTH` were removed from the process environment.

## Token Source

The passing E2E used a real local `node-auth` login response, not the helper token file.

The helper `.runtime/smoke-token.js` was reviewed as a fallback option, but it was not needed for the final passing E2E.
