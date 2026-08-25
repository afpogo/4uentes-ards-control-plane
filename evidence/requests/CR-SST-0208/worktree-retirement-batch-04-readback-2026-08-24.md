# CR-SST-0208 - Readback de retiro, lote 04

Fecha de ejecución: 2026-08-24.

## Resultado

La autorización `Autorizo el lote 04 de CR-SST-0208` se aplicó únicamente a
los cuatro paths publicados en el PR #127. Todos fueron retirados:

| Path retirado | Lifecycle efectivo | HEAD previo | Branch conservada |
| --- | --- | --- | --- |
| `worktrees/cr-sst-0184-control-plane` | `CR-SST-0199` | `9750e19685951918d1e66f0643afb0764d585860` | `agent/cr-sst-0199-development-socketio-ingress-lifecycle` |
| `worktrees/CR-SST-0210-memory-identity-scope` | `CR-SST-0210` | `8ae74bc9647bbe23df4c786c3aa760e120cb114b` | `agent/cr-sst-0210-memory-identity-scope-execution` |
| `worktrees/CR-SST-0210-reservation` | `CR-SST-0210` | `1df26a3f172ff6aa04ccd9d9553e34939927a01e` | `agent/cr-sst-0210-memory-identity-scope-reservation` |
| `worktrees/CR-SST-0211-auth-retention-facade` | `CR-SST-0211` | `93bed1e5bde22891cd17b0df48dfa265d9128c10` | `agent/cr-sst-0211-auth-retention-facade` |

No se borraron branches, refs ni commits.

## Preflight efectivo

La ejecución refrescó referencias y utilizó
`origin/main@bb199518bc7d5d48290da8760b34667336eaabed`. Para cada path se volvió
a verificar:

- resolución absoluta dentro de `4uentes-orchestor/worktrees/`;
- registro Git vigente;
- estado limpio y HEAD integrado;
- ausencia de locks, procesos dependientes y mounts Docker.

Los cuatro targets pasaron todos los gates. El readback posterior confirmó su
ausencia y la conservación de las cuatro branches.

## Inventario posterior

El registro contiene 32 worktrees:

- 25 limpios e integrados;
- 5 limpios con HEAD no integrado;
- 1 dirty integrado: `worktrees/init-sst-0007`;
- 1 dirty no integrado: la raíz del control plane.

Durante el frente aparecieron o avanzaron worktrees concurrentes de los
lifecycles activos `CR-SST-0218` y `CR-SST-0219`. Sus branches `running`
quedaron por delante de la ref observada y se preservaron. Esta actividad
explica que el conteo no sea una resta estática del snapshot anterior y no fue
modificada por el lote 04.

Los otros HEAD no integrados siguen siendo `CR-HPT-0016`, el diagnóstico
selectivo de `CR-SST-0178` y el worktree externo `CR-CP-0021` bajo
`apps/lab/n8n-local`.

## Jira y recuperabilidad

No se realizó escritura Jira. `CR-SST-0208` conserva
`jira_write_allowed: false`; retirar checkouts locales no reabre mirrors
terminales.

Todo el contenido retirado estaba publicado y continúa recuperable desde las
branches o commits enumerados. Ningún target contenía información única sin
commit.

