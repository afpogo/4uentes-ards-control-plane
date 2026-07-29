# Cierre Local CR-CP-0005

## Decision

CR-CP-0005 queda cerrado localmente el 2026-07-12 con resultado
`validated-local`. El orchestrator consume el canon observado
`4uentes-ards-core@f07ca6a` sin redefinirlo ni modificar core.

La revision confirma adopcion local de:

- policies comunes por referencia;
- `feature-bugfix-state-model` mediante su manifest local;
- `initiative-model` como recurso `active-core-adopted`;
- `control_plane_link`, conservando `orchestrator_link` como alias local.

## Validacion Y Boundaries

- `npm.cmd run check`: exit code `0`, `0 WARN`, `0 FAIL`.
- No se modifico `4uentes-ards-core`.
- No se modificaron repos hijos.
- `INIT-CP-0002 / ARDS-1` permanece activa.
- El rollout a repos hijos sigue siendo request-driven.

## Gaps Separados Y Handoff

- Las diferencias de metadata de clasificacion del registry core requieren un
  lifecycle separado con ownership de core.
- La promocion de `work-tracker-control-plane-authority-policy` a core requiere
  otro request.
- `CR-CP-0006` y cualquier adopcion en repos hijos permanecen fuera de scope.

## Jira

El cierre local habilita un lote nuevo, explicito y consumible limitado a
buscar exactamente `project = ARDS AND labels = "cr-cp-0005"`, confirmar que
el unico resultado sea `ARDS-6`, verificar su parent `ARDS-1`, tipo `Tarea`,
estado `En curso` y transicion `41`, transicionarlo directamente a `Listo` y
releer status, resolution, assignee y labels.

No se autorizaron comentarios, ediciones, creaciones, borrados, correcciones de
assignee ni ninguna otra transicion.

El lote fue ejecutado y consumido. La lectura posterior confirmo `ARDS-6` en
`Listo`, con resolution `Listo`, tipo `Tarea`, parent `ARDS-1`, labels esperadas
y sin assignee. El workflow no genero asignacion automatica y no se realizo
ninguna escritura correctiva. `ARDS-1` permanece `Por hacer`, sin resolution y
sin transicion; `INIT-CP-0002` permanece activa.
