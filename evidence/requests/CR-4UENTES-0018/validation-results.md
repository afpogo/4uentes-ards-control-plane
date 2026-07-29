# CR-4UENTES-0018 - Validation Results

## Child Repo

- Command: `npm.cmd run check`
- Result: pass after escalated rerun.

The first sandboxed run failed with Vite `EPERM` while writing
`node_modules/.vite-temp`. The rerun outside the sandbox passed:

- TypeScript: pass
- Vite production build: pass
- Generated `dist/`: pass

## Control Plane

- Command: `npm.cmd run check`
- Result: pass.

Summary:

- Catalog: 5 OK, 0 WARN, 0 FAIL
- Local bindings: 39 OK, 0 WARN, 0 FAIL
- State model: 37 OK, 0 WARN, 0 FAIL
- Initiatives: 8 OK, 0 WARN, 0 FAIL
- Owner documentation: 24 OK, 0 WARN, 0 FAIL

## Closure Decision

`CR-4UENTES-0018` is locally validated as a blocked publication gate. The
runtime remains unchanged and the CV download remains disabled until the owner
provides or approves a sanitized replacement PDF.
