# ARDS-5 / CR-CP-0004 - Cierre

Se cierra `CR-CP-0004`.

Resultado:

- `initiative-model` fue promovido en `4uentes-ards-core` como living resource reusable.
- El control-plane resincronizo su binding a `4uentes-ards-core@f07ca6a`.
- El control-plane registro adopcion local en `specs/initiatives/initiative-adoption.yaml`.
- Las instancias `INIT-*`, links a CRs, evidencia y mirrors Jira permanecen bajo ownership local del control-plane.
- Jira se mantiene como mirror operativo con `source_of_truth: false`.
- No se mutaron repos hijos.

Validacion:

- Core: `npm.cmd run check` con 0 errores / 0 warnings y `npm.cmd run build` exitoso.
- Control-plane: `npm.cmd run check:initiatives` con 13 OK, 0 WARN, 0 FAIL.
- Control-plane: `npm.cmd run check` con 0 WARN, 0 FAIL.

Siguiente trabajo:

- `CR-CP-0005 / ARDS-6`: revisar adopcion local de recursos vivos del core en el orchestrator.
