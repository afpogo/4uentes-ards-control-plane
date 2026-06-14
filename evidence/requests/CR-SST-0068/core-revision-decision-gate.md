# CR-SST-0068 Gate De Decision De Revision Core

## Proposito

Este gate decide si una observacion de repositorio hijo debe quedar como follow-up local del repo hijo o escalar a revision de `4uentes-ards-core`.

CR-SST-0068 no autoriza cambios en `4uentes-ards-core`. Solo define cuando debe abrirse un request futuro para core.

## Valores De Decision

- `no-core-change-needed`: el repositorio hijo esta sincronizado con el contrato core resuelto.
- `needs-core-review`: el repositorio hijo expuso un gap de standard o un problema de contrato reutilizable que podria pertenecer a core.
- `needs-child-request`: el problema es local al repositorio hijo y debe manejarse con un request de lifecycle del repo hijo.
- `unknown-needs-sync-diff`: no hay evidencia de sync actual suficiente para clasificar el repositorio.

## Senales Que Requieren Revision Core

Escalar a `needs-core-review` cuando aparezca al menos una de estas senales:

- `candidate_for_core > 0`
- `conflicts > 0` y el conflicto esta causado por semantica faltante o ambigua del contrato core.
- Un servicio necesita un ARDS kind, profile, capability template, schema o handoff rule que no esta representado por el standard core actual.
- Un binding local valido no puede expresar la relacion del repositorio hijo bajo el contrato core actual.
- TODOs o excepciones repetidas aparecen en varios repositorios y apuntan a un standard faltante, no a drift local de un repo.
- Un repo hijo implementa una convencion ARDS/SDD reutilizable que deberia normalizarse entre repositorios.

## Senales Que No Requieren Revision Core Por Si Solas

No escalar a core solo por:

- Working tree dirty en un repo hijo.
- Falta de ejecucion de validacion local.
- Archivos requeridos faltantes en un solo repositorio hijo.
- Un TODO del repo hijo que puede resolverse localmente.
- Drift optional o infrastructure sin conflicto explicito de contrato.
- Conteos vivos que cambian entre refreshes.

## Baseline Core Actual De SST

| Servicio | Evidencia Mas Reciente | Sync Status | Candidate For Core | Conflicts | Decision |
| --- | --- | --- | ---: | ---: | --- |
| `sst-fend` | `evidence/requests/CR-SST-0065/sst-fend-child-sync-diff.yaml` | `synced` | 0 | 0 | `no-core-change-needed` |
| `sst-bend` | `evidence/requests/CR-SST-0065/sst-bend-child-sync-diff.yaml` | `synced` | 0 | 0 | `no-core-change-needed` |
| `4uentes-auth` | `evidence/requests/CR-SST-0070/4uentes-auth-child-sync-diff.yaml` | `synced` | 0 | 0 | `no-core-change-needed` |
| `sst-extension` | `evidence/requests/CR-SST-0070/sst-extension-child-sync-diff.yaml` | `synced` | 0 | 0 | `no-core-change-needed` |
| `sst-chatbot` | `evidence/requests/CR-SST-0070/sst-chatbot-child-sync-diff.yaml` | `synced` | 0 | 0 | `no-core-change-needed` |
| `sst-4uentes-infra` | `evidence/requests/CR-SST-0070/sst-4uentes-infra-child-sync-diff.yaml` | `synced` | 0 | 0 | `no-core-change-needed` |

## Proximo Paso Operativo

La evidencia `ards_child_sync_diff` ya existe para los seis servicios de la solucion SST. El siguiente paso operativo es que el read model de observabilidad consuma estos reportes para calcular el estado por repo, por solucion y global.

## Limite

Si algun repositorio se clasifica como `needs-core-review`, abrir un request separado para la revision core antes de modificar `4uentes-ards-core`.
