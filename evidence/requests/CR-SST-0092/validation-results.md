# CR-SST-0092 - Resultados De Validacion

Validado parcialmente el 2026-06-30.

## Control-Plane

| Comando | Resultado | Notas |
| --- | --- | --- |
| `npm.cmd run check:initiatives` | PASS | `verify-initiatives` valido 3 initiatives con 5 OK, 0 WARN, 0 FAIL. |

## sst-bend

| Comando | Resultado | Notas |
| --- | --- | --- |
| `npm.cmd run test:learning-workspace` | PASS | `Learning workspace tests passed: 9/9`. |
| `npm.cmd run test:tag-engine` | PASS | `Tag engine tests passed: 7/7`. |
| `npm.cmd run build` | PASS | `tsc --noEmit` completo sin errores. |
| `npm.cmd run check` | PASS con coverage parcial reportado | Exit code 0. `ards-check` paso, pero reporto protected coverage 50% por falta de `SMOKE_JWT` y skips protegidos preexistentes. |
| `node -e "require('./db/models')"` | PASS | `models index ok`. |
| `node -e "require('./src/apps/sst/presentation/routes/learning-workspaces.routes')"` | PASS | `learning routes ok`. |

## Observaciones

- `npm.cmd run check` no cubrio endpoints protegidos porque no habia
  `SMOKE_JWT`/`SMOKE_JWT_OWNER`.
- La advertencia de coverage protegida no es especifica de
  `LearningWorkspace`; corresponde al baseline operativo del repo cuando no se
  provee JWT de smoke.
