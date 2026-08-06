# Observacion De Parent Jira: SST-4

## Estado

- Fecha: 2026-06-21
- Request: CR-SST-0075
- Escritura Jira: no

## Parent

- Summary: [SST][feature-state] Cerrar gaps runtime-partial de SST Tags Governance
- Status: En curso
- Status category: En curso
- Labels: ards-sdd, control-plane, feature-state, not-done, runtime-partial
- Subtasks observadas: 6

## Subtasks

- `SST-19` [SST-4][CR-SST-0071] Global tag governance DB model -> Finalizada (Listo)
- `SST-20` [SST-4][CR-SST-0072] Backend global tags persistence and migration -> Finalizada (Listo)
- `SST-21` [SST-4][CR-SST-0073] Tag search and resource binding API -> Finalizada (Listo)
- `SST-22` [SST-4][CR-SST-0074] BFF tags governance facade -> Finalizada (Listo)
- `SST-23` [SST-4][CR-SST-0075] Governed article tag selector UI -> Tareas por hacer (Por hacer)
- `SST-24` [SST-4][CR-SST-0076] Dictionary adoption and global closure -> Tareas por hacer (Por hacer)

## Descripcion Sanitizada

```text
Proceso de sincronizacion:

* CR-SST-0039

Procesos origen:

* CR-SST-0010
* CR-SST-0014
* CR-SST-0015
* CR-SST-0016

Estado actual: runtime-partial.

Objetivo:  
Avanzar esta funcionalidad desde el read-model del control-plane y cerrar los gaps abiertos mediante el lifecycle aprobado.

Gaps abiertos:

* Promote article-tags from draft to an active governed SST capability.
* Adopt structured article tags in BFF and frontend create/update flows.
* Promote sst-tag-prefix-engine from backend POC to runtime preview/import endpoint.
* Keep real-time transcription as a separate future intake request.

State id:

* sst-tags-governance

Servicios afectados:

* sst-bend
* 4uentes-auth
* sst-fend
* sst-extension

Request ids relacionados:

* CR-SST-0010
* CR-SST-0014
* CR-SST-0015
* CR-SST-0016

Fuente control-plane:

* state/features/sst-tags-governance.current.yaml

Evidence refs:

* evidence/requests/CR-SST-0002/implementation-state-report.md
* evidence/requests/CR-SST-0002/findings.yaml
* evidence/requests/CR-SST-0002/runtime-readiness-summary.md
* evidence/requests/CR-SST-0014/implementation-state-analysis.md
* evidence/requests/CR-SST-0014/course-tags-analysis.md
* evidence/requests/CR-SST-0014/next-request-boundary.md
* evidence/requests/CR-SST-0015/java-spring-course-structure-analysis.md
* evidence/requests/CR-SST-0016/backend-poc-summary.md

Validation refs:

* ninguno

Criterio de cierre esperado:

* La decision o implementacion pendiente queda registrada en evidencia.
* Los cambios en repos funcionales, si hacen falta, entran por request aprobado.
* El feature_state se actualiza solo cuando la evidencia soporte una transicion de estado.


```

## Evidencia

- JSON sanitizado: `evidence/requests/CR-SST-0075/jira-parent-SST-4-observation.json`
