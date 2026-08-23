# CR-HPT-0014 - Preflight de identidad y fuente

Fecha observada: 2026-08-23.

## Identidad

El ID `CR-HPT-0014` no aparece como lifecycle reservado en
`origin/main@53d24e42babda3cee2c43dae98ef6d481b786b40` ni tiene un PR propio en el
control-plane. Las coincidencias canónicas existentes son referencias de
dependencia que anticipan este adapter; no constituyen otra solicitud.

El lifecycle completo sólo existe en la branch en cuarentena
`agent/cr-sst-0152-sst-fend-evidence`. Por tanto, se conserva el ID y se publica
primero este inbox desde un worktree limpio. No se hizo consulta Jira live ni
se autorizó escritura: Jira sigue siendo mirror, no fuente de identidad.

## Fuente preservada

- plan histórico del control-plane: commit `48776c6`;
- cierre histórico del control-plane: commit `df733c5`;
- implementación owner de Finanzas: commit `daa66e5`;
- branch fuente: `agent/cr-sst-0152-sst-fend-evidence`;
- raíz dirty: preservada sin staging, reset, merge ni limpieza.

La implementación owner ocurrió antes de publicar el lifecycle canónico. La
desviación de orden se registrará explícitamente al promover el request a
`planned`/`running`; no se considerará cerrada hasta publicar y leer de vuelta
el commit owner desde el remoto actual.

## Decisión

Se reserva `CR-HPT-0014` mediante el inbox canónico. El plan, la ejecución y el
cierre se publicarán en pasos posteriores, y el commit owner se portará por
patch a una branch limpia basada en el `main` vigente de Finanzas.
