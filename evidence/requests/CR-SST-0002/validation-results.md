# CR-SST-0002 - Validation Results

Observed at: 2026-05-18

| Service | ARDS kind | Command | Result | Notes |
|---|---|---|---|---|
| control-plane | orchestrator | `npm run check` | PASS | Catalog OK; local bindings missing warning accepted. |
| sst-bend | backend-api | `npm run test:diccionario` | PASS | 10/10 tests. |
| sst-bend | backend-api | `npm run test:diccionario:stage2` | PASS | 9/9 tests. |
| sst-bend | backend-api | `npm run test:diccionario:stage3` | PASS | 11/11 tests. |
| 4uentes-auth | shared-auth-provider | `tsc --noEmit --pretty false` | PASS | TypeScript validation produced no errors. |
| sst-fend | frontend-web | `npm run css:types:check` | PASS | CSS module declarations are in sync. |
| sst-fend | frontend-web | focused Jest dictionary suites | PASS | 4 suites, 17 tests. |
| sst-extension | frontend-extension | `pnpm run check` | PASS | Baseline, 78 tests, WXT build passed. |
| sst-extension | frontend-extension | `pnpm run build:safe` | PASS | Safe WXT build passed. |
| sst-4uentes-infra | infra-gitops | `kubectl kustomize k8s-manifests/overlays/development` | BLOCKED | Access denied resolving overlay path. |
| sst-4uentes-infra | infra-gitops | `kubectl apply --dry-run=client -k k8s-manifests/overlays/development` | BLOCKED | Kube config access denied. |

## Skipped Validations

| Service | Command | Status | Reason |
|---|---|---|---|
| sst-bend | `npm run qa:diccionario:stage1` | SKIPPED | Requires local SST API running on port 3005. |
| sst-bend | `npm run qa:diccionario:stage2` | SKIPPED | Requires JWT/account context and mutates local DB through API. |
| sst-bend | `npm run qa:diccionario:stage3` | SKIPPED | Requires JWT/account context and mutates local DB through API. |
| sst-bend | `npm run check` | SKIPPED | Broad gate crosses non-dictionary domains and live service dependencies. |
| 4uentes-auth | `npm run check` | SKIPPED | Builds to `dist`; avoided in evidence-first pass. |
| 4uentes-auth | `npm test` | SKIPPED | Placeholder failure by design. |
| sst-fend | `npm run check` | SKIPPED | Runs build and can write/clean `dist`. |
| sst-fend | `npm run lint` | SKIPPED | Uses `--fix` and can rewrite files. |
| sst-fend | `npm run format` | SKIPPED | Uses `prettier --write`. |

## Final Interpretation

Dictionary/tag behavior has strong local test evidence across the backend API, BFF, web frontend and extension. The only blockers are infrastructure/environment blockers, not direct dictionary implementation failures.
