# CR-CP-0004 / ARDS-5 - Resincronizacion Del Control-Plane

## Motivo

`4uentes-ards-core` promovio `initiative-model` como living resource reusable.
El control-plane ya usa `initiatives/`, por lo tanto no requiere migracion de
instancias. Requiere registrar adopcion local y actualizar el binding al core.

## Core Validado

- Core ref: `4uentes-ards-core@f07ca6a`
- Evidencia core: `C:\Users\andre\Desktop\4uentes\apps\4uentes-core\admin\evidence\CR-CP-0004\core-validation.md`
- Resultado core informado: `npm.cmd run check` con 0 errores / 0 warnings y `npm.cmd run build` exitoso.

## Cambios Locales

- `specs/ards/contract-binding.yaml` apunta a `4uentes-ards-core@f07ca6a`.
- `specs/initiatives/initiative-model.yaml` declara el canon como `4uentes-ards-core`.
- `specs/initiatives/initiative-adoption.yaml` registra adopcion local.

## Boundary

- No se mutaron repos hijos.
- No se copiaron IDs locales al core.
- Las instancias `INIT-*`, links a CRs, evidencia y mirrors Jira siguen siendo ownership local del control-plane.
- Jira sigue siendo mirror operativo con `source_of_truth: false`.
