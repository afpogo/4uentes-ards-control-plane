# CR-SST-0208 - Readback de retiro de worktrees, lote 02

Fecha de ejecución: 2026-08-24.

## Resultado

La autorización humana `Autorizo el lote 02 de CR-SST-0208` se aplicó
exclusivamente a los siete paths enumerados en el preflight publicado por el
PR #118. Los siete worktrees fueron retirados correctamente:

| Path retirado | HEAD previo | Branch conservada |
| --- | --- | --- |
| `worktrees/CR-4UENTES-0040-control-plane` | `de0ba1904edf27597aa1a9a57b615a68cc41fa8f` | `agent/cr-4uentes-0040-adoption-readback` |
| `worktrees/cr-sst-0161-governance-adoption` | `83a3ffb4c0e72f68a39c09eb6e349b9cb27394b2` | `agent/cr-sst-0161-governance-adoption` |
| `worktrees/cr-sst-0173-closure` | `846ebb6e887da4d95651e86085b2296d59a04651` | `agent/cr-sst-0173-closure` |
| `worktrees/cr-sst-0186-adoption-readback` | `63b37863276b4beaae0d0db18f4c9d5695565d00` | `agent/cr-sst-0186-adoption-readback` |
| `worktrees/cr-sst-0187-adoption-readback` | `4874dd7cf4541b427d05893cb5df47b1f464ea61` | `agent/cr-sst-0187-adoption-readback` |
| `worktrees/CR-SST-0188-post-merge-readback` | `64eaa0d24a0b5e6aeb7b8c770cb5aa33adc04a94` | detached; commit integrado |
| `worktrees/CR-SST-0188-remediation-readback` | `851dec1246d3fa78ec477c307bf66b056f4bcad3` | `agent/cr-sst-0188-remediation-readback` |

No se borraron branches, refs ni commits.

## Preflight efectivo

La verificación destructiva refrescó referencias y usó
`origin/main@0d90c5c2db1a5076bc106743d13ff0c42f9e84c7`, que había avanzado desde el
preflight publicado. Antes de retirar cada path se volvió a probar:

- path absoluto resuelto dentro de `4uentes-orchestor/worktrees/`;
- pertenencia al registro de `git worktree list --porcelain`;
- estado Git limpio;
- HEAD alcanzable desde la ref canónica efectiva;
- cero archivos `*.lock` en el gitdir;
- cero procesos externos con referencia al path;
- cero mounts Docker activos hacia el path.

Todos los gates pasaron. El readback posterior confirmó que los siete paths ya
no existen y que las seis branches nombradas continúan disponibles. El
checkout detached de `CR-SST-0188` sigue recuperable desde su commit, que es
ancestro de `origin/main`.

## Inventario posterior

El registro posterior contiene 42 worktrees físicos relacionados con este
repositorio Git:

- 36 limpios e integrados;
- 4 limpios con HEAD no integrado;
- 1 dirty integrado: `worktrees/init-sst-0007`;
- 1 dirty no integrado: la raíz del control plane.

El archivo que estaba sin trackear en
`worktrees/CR-SST-0207-integrated-matrix` fue publicado por una ejecución
concurrente antes del retiro; el worktree ahora está limpio e integrado. No fue
modificado por este lote.

También se observó un worktree registrado fuera de la raíz controlada,
`C:/Users/andre/Desktop/4uentes/apps/lab/n8n-local/.worktrees/cr-cp-0021-control-plane`.
Queda fuera de alcance y no se retiró. Debe reconciliarse por su lifecycle y
owner antes de cualquier acción.

## Jira

No se realizó escritura Jira. `CR-SST-0208` conserva
`jira_write_allowed: false` y no registra un issue primario; el retiro local
permanece `not-applicable-no-write` para el tracker.

## Recuperabilidad

Los contenidos retirados estaban publicados y pueden reconstruirse desde las
branches conservadas o los commits enumerados. No existía información única
sin commit en los siete paths.

