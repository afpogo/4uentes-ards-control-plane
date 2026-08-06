# ARDS-5 / CR-CP-0004 - Resincronizacion Control-Plane

El core promovio `initiative-model` como living resource reusable en
`4uentes-ards-core@f07ca6a`.

Resincronizacion local realizada:

- `specs/ards/contract-binding.yaml` actualizado al core ref promovido.
- `specs/initiatives/initiative-model.yaml` actualizado para declarar
  `4uentes-ards-core` como source of truth del canon reusable.
- `specs/initiatives/initiative-adoption.yaml` creado para registrar adopcion
  local.
- Las instancias `INIT-*`, links a CRs, evidencia y mirrors Jira siguen bajo
  ownership local del control-plane.
- No se mutaron repos hijos.

Validacion:

- `npm.cmd run check:initiatives`: 13 OK, 0 WARN, 0 FAIL.
- `npm.cmd run check`: 0 WARN, 0 FAIL.
