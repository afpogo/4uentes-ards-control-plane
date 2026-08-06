# ARDS-5 / CR-CP-0004 - Avance

Avance local del control-plane:

- Se genero el mapping `initiative-model -> core-profile-scoped-living-resource`.
- Se dejo handoff para ejecutar la promocion canonica en `4uentes-ards-core`.
- Se actualizo `specs/initiatives/initiative-model.yaml` con `core_promotion_request: CR-CP-0004`.
- Se mantuvo Jira como mirror operativo, con `source_of_truth: false`.
- No se mutaron repos hijos.

Validacion local:

- `npm.cmd run check:initiatives`: 13 OK, 0 WARN, 0 FAIL.
- `npm.cmd run check`: 0 WARN, 0 FAIL en todos los bloques.

Boundary:

La escritura canonica del core queda pendiente para ejecutarse desde el workspace
de `4uentes-ards-core`, usando el handoff de este CR como entrada.
