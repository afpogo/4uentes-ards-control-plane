# CR-SST-0018 - Validation Results

Observed on: 2026-05-28

## 4uentes-auth / node-auth

Previously run after implementation:

```powershell
npm run build
npm run check
```

Result:

- Build passed.
- ARDS check passed.

Runtime checks after container restart:

- `POST /api/auth/register`: user created for local test.
- `POST /api/auth/login`: returned token and set CSRF cookie.
- `POST /api/auth/refresh` with cookie and CSRF: returned `200` and access token.
- `POST /api/auth/logout` without request body: session was revoked; refresh after logout returned `401`.
- `POST /api/auth/logout` with invalid refresh token and valid CSRF: returned `401` and sent cookie-clearing headers.
- `POST /api/auth/logout` with invalid JSON body: returned `400` with `{"error":"Invalid JSON body."}`.

Cleanup:

- The local test user `codex.session.test@example.test` was removed from Mongo.

## sst-fend

Previously run after implementation:

```powershell
npm run check
npm run build
```

Result:

- Check passed.
- Build passed.

Focused tests after restart:

```powershell
npm test -- --runTestsByPath src/__tests__/authService.refresh.test.ts src/__tests__/auth.idle.test.ts
```

Result:

- 2 test suites passed.
- 4 tests passed.

Runtime bundle checks:

- `http://localhost:4090/` returned `200`.
- `http://localhost:4090/artsst` with `Accept: text/html` returned `200`.
- Served JS bundle contains idle tracking.
- Served JS bundle does not contain logout null-body pattern.

## sst-4uentes-infra

Previously run after implementation:

```powershell
kubectl kustomize k8s-manifests\overlays\development
```

Result:

- Kustomize render passed.
- Rendered node-auth ConfigMap includes development `SESSION_IDLE_TTL`.

## Residual Notes

- Chrome DevTools MCP validation was blocked by an existing MCP profile lock.
- Controlled 400/401 auth errors still produce stack traces in node-auth logs.
