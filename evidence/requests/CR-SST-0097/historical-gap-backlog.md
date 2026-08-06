# CR-SST-0097 - Backlog Historico De Gaps Owner Docs

## Criterio

Este CR remedia `CR-SST-0092` primero. Los gaps historicos quedan registrados
para requests futuras, no mezclados en la misma ejecucion.

## Backlog

| CR | Repo | Prioridad | Motivo |
| --- | --- | --- | --- |
| `CR-SST-0072` | `sst-bend` | Alta | Migracion/modelos global tags; requiere confirmar cobertura owner posterior por `CR-SST-0073` o remediar. |
| `CR-SST-0074` | `4uentes-auth` | Alta | BFF tags governance; requiere auditoria de specs/docs owner. |
| `CR-SST-0075` | `sst-fend` | Alta | Selector UI tags; evidencia no lista claramente specs/docs owner. |
| `CR-SST-0078` | `sst-extension` | Alta | OAuth/ngrok assisted flow WIP; requiere docs/specs owner o cierre explicito. |
| `CR-SST-0080` | `sst-extension` | Media-Alta | Purga de snapshots locales; evidencia parcial y estado WIP. |
| `CR-SST-0086` | `sst-fend` | Media | Ajustes UI de secretos; auditar si docs/specs frontend quedaron alineados. |

## No Prioritarios En Este Slice

CRs con evidencia de owner docs/capabilities suficiente o sin mutacion de repo
hijo quedan fuera de la remediacion inmediata.
