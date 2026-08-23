# CR-HPT-0013 — reconciliación del control plane

Fecha: 2026-08-22.

## Resultado

Se recuperó selectivamente la información de `CR-HPT-0013` desde el commit
local `a0665bf` del branch cuarentenado
`agent/cr-sst-0152-sst-fend-evidence`. No se fusionó el commit completo porque
también contiene una intención SST incompatible bajo el ID canónico
`CR-SST-0207`.

El lifecycle canónico avanza de `planned` a `running`. No se adopta el archivo
`done` del branch fuente porque el commit owner `ef4f8d0` sólo está confirmado
en una branch local de `finanzas-personales`; el remoto SSH rechazó el
readback y no existe evidencia autoritativa de publicación.

## Precedencia y aislamiento

- Baseline: `origin/main` en `893ce27`.
- Fuente selectiva: `a0665bf`.
- Owner local: `finanzas-personales`, branch
  `feat/HPT-4/sst-boundary-account-scope`, commit `ef4f8d0`.
- Modificación owner durante esta reconciliación: ninguna.
- Root dirty y branch fuente: preservados sin edición, reset ni retiro.

## Estado de cierre

El contrato y sus validaciones históricas quedan preservados, pero el request
no puede cerrar hasta publicar y leer de vuelta el commit owner desde una ref
remota autoritativa. El runtime proveedor y consumidor permanece fuera de
scope.
