# CR-SST-0002 - Resultados De Validacion

Observado el: 2026-05-18

| Service | ARDS kind | Command | Resultado | Notas |
|---|---|---|---|---|
| control-plane | orchestrator | `npm run check` | PASS | Catalog OK; warning aceptado por local bindings faltantes. |
| sst-bend | backend-api | `npm run test:diccionario` | PASS | 10/10 tests. |
| sst-bend | backend-api | `npm run test:diccionario:stage2` | PASS | 9/9 tests. |
| sst-bend | backend-api | `npm run test:diccionario:stage3` | PASS | 11/11 tests. |
| 4uentes-auth | shared-auth-provider | `tsc --noEmit --pretty false` | PASS | Validacion TypeScript sin errores. |
| sst-fend | frontend-web | `npm run css:types:check` | PASS | CSS module declarations sincronizadas. |
| sst-fend | frontend-web | focused Jest dictionary suites | PASS | 4 suites, 17 tests. |
| sst-extension | frontend-extension | `pnpm run check` | PASS | Baseline, 78 tests, WXT build pasado. |
| sst-extension | frontend-extension | `pnpm run build:safe` | PASS | Safe WXT build pasado. |
| sst-4uentes-infra | infra-gitops | `kubectl kustomize k8s-manifests/overlays/development` | BLOCKED | Access denied al resolver overlay path. |
| sst-4uentes-infra | infra-gitops | `kubectl apply --dry-run=client -k k8s-manifests/overlays/development` | BLOCKED | Kube config access denied. |

## Validaciones Salteadas

| Service | Command | Estado | Motivo |
|---|---|---|---|
| sst-bend | `npm run qa:diccionario:stage1` | SKIPPED | Requiere SST API local corriendo en puerto 3005. |
| sst-bend | `npm run qa:diccionario:stage2` | SKIPPED | Requiere JWT/account context y muta DB local via API. |
| sst-bend | `npm run qa:diccionario:stage3` | SKIPPED | Requiere JWT/account context y muta DB local via API. |
| sst-bend | `npm run check` | SKIPPED | Gate amplio cruza dominios no-dictionary y dependencias live service. |
| 4uentes-auth | `npm run check` | SKIPPED | Construye a `dist`; evitado en pase evidence-first. |
| 4uentes-auth | `npm test` | SKIPPED | Placeholder failure by design. |
| sst-fend | `npm run check` | SKIPPED | Ejecuta build y puede escribir/limpiar `dist`. |
| sst-fend | `npm run lint` | SKIPPED | Usa `--fix` y puede reescribir archivos. |
| sst-fend | `npm run format` | SKIPPED | Usa `prettier --write`. |

## Interpretacion Final

El comportamiento dictionary/tag tiene evidencia local fuerte de tests a traves
de backend API, BFF, web frontend y extension. Los unicos bloqueos son de
infraestructura/ambiente, no fallas directas de implementacion dictionary.
