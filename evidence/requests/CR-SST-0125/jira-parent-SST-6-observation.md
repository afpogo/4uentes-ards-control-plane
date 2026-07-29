# Observacion De Parent Jira: SST-6

## Estado

- Fecha: 2026-07-10
- Request: CR-SST-0125
- Escritura Jira: no

## Parent

- Summary: [SST][feature-state] Completar ruta runtime de SST Learning Content Tags
- Status: En curso
- Status category: En curso
- Labels: ards-sdd, control-plane, feature-state, implemented-local, not-done
- Subtasks observadas: 11

## Subtasks

- `SST-41` [SST][CR-SST-0111] Define ArticleTag and LearningContentTag intent contract -> Finalizada (Listo)
- `SST-42` [SST][CR-SST-0112] Define annotable text entry UX contract -> Finalizada (Listo)
- `SST-43` [SST][CR-SST-0113] Implement first editable text sheet in sst-fend -> Finalizada (Listo)
- `SST-44` [SST][CR-SST-0114] Implement contextual tagging over text selection -> Finalizada (Listo)
- `SST-45` [SST][CR-SST-0115] Define annotated selection BFF/API contract -> Finalizada (Listo)
- `SST-46` [SST][CR-SST-0116] Persist accepted annotated text context -> Finalizada (Listo)
- `SST-47` [SST][CR-SST-0117] Render Markdown/template view from annotated text -> Finalizada (Listo)
- `SST-48` [SST][CR-SST-0118] Validate annotable text entry end-to-end -> Finalizada (Listo)
- `SST-51` [SST][CR-SST-0122] Fix LearningWorkspace accept by annotationIds -> Finalizada (Listo)
- `SST-52` [SST][CR-SST-0123] Fix LearningWorkspace annotated context render -> Finalizada (Listo)
- `SST-53` [SST][CR-SST-0124] Native SST article runtime URL -> Finalizada (Listo)

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

- JSON sanitizado: `evidence/requests/CR-SST-0125/jira-parent-SST-6-observation.json`
