# Jira Issue Observation: SST-6

## Estado

- Fecha: 2026-07-10
- Request: CR-SST-0125
- Escritura Jira: no

## Issue

- Summary: [SST][feature-state] Completar ruta runtime de SST Learning Content Tags
- Status: En curso
- Status category: En curso
- Resolution: no-detectado
- Assignee: Fuentes Sandferand
- Updated: 2026-07-04T14:16:11.468-0300
- Labels: ards-sdd, control-plane, feature-state, implemented-local, not-done

## Transiciones Disponibles

- Por hacer (11) -> Tareas por hacer
- En curso (21) -> En curso
- In Review (31) -> En revisión
- Listo (41) -> Finalizada

## Descripcion Sanitizada

```text
Proceso de sincronizacion:

* CR-SST-0039

Procesos origen:

* CR-SST-0015
* CR-SST-0016

Estado actual: implemented-local.

Objetivo:  
Avanzar esta funcionalidad desde el read-model del control-plane y cerrar los gaps abiertos mediante el lifecycle aprobado.

Gaps abiertos:

* Promote learning-content parser from POC module to runtime import/preview endpoint.
* Define frontend rendering for clase, nota, recordar, ejemplo, image, docs, and code blocks.
* Keep generated lab artifacts excluded from ingestion by default.

State id:

* learning-content-tags

Servicios afectados:

* sst-bend
* sst-fend

Request ids relacionados:

* CR-SST-0015
* CR-SST-0016

Fuente control-plane:

* state/features/learning-content-tags.current.yaml

Evidence refs:

* evidence/requests/CR-SST-0015/java-spring-course-structure-analysis.md
* evidence/requests/CR-SST-0015/parser-boundary-recommendation.md
* evidence/requests/CR-SST-0016/backend-poc-summary.md

Validation refs:

* ninguno

Criterio de cierre esperado:

* La decision o implementacion pendiente queda registrada en evidencia.
* Los cambios en repos funcionales, si hacen falta, entran por request aprobado.
* El feature_state se actualiza solo cuando la evidencia soporte una transicion de estado.


```

## Evidencia

- JSON sanitizado: `evidence/requests/CR-SST-0125/jira-issue-SST-6-observation.json`
