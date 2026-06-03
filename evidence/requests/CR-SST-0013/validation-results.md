# CR-SST-0013 - Resultados De Validacion

Observado el: 2026-05-24

## Comandos Ejecutados

| Repo | Comando | Resultado | Notas |
|---|---|---|---|
| `4uentes-auth` | `npm.cmd run check` | PASS | `[ARDS CHECK] OK` |
| `sst-fend` | `npm.cmd run check` | PASS | CSS OK, webpack OK, 23 suites / 139 tests PASS; 21 lint warnings existentes. |
| `sst-bend` | `npm.cmd run check` | PASS | Exit code 0; protected smoke parcial por falta de `SMOKE_JWT`. |
| `sst-extension` | `pnpm.cmd run check` | PASS | Baseline OK, 19 test files / 78 tests PASS, WXT build OK. |
| `sst-4uentes-infra` | `kubectl kustomize k8s-manifests\\overlays\\development` | PASS | Renderizo manifests development correctamente. |
| `4uentes-orchestor` | `npm.cmd run check` | PASS | Catalog OK, local bindings warning aceptado, state validator OK; 9 capability links validos. |

## Warnings Aceptados

- `sst-fend` conserva 21 warnings `react-hooks/exhaustive-deps` previos/no
  bloqueantes.
- `sst-bend` no ejecuto coverage protegida completa por falta de
  `SMOKE_JWT`/`SMOKE_JWT_OWNER`; el check del repo lo reporta como parcial y
  termina con exit code 0.
- `sst-4uentes-infra` sigue sin comando unico de check; se uso el render de
  Kustomize como validacion manual disponible.
