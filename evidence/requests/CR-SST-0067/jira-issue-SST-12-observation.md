# Jira Issue Observation: SST-12

## Estado

- Fecha: 2026-06-12
- Request: CR-SST-0067
- Escritura Jira: no

## Issue

- Summary: [SST][feature-state] Promover SST Tag Prefix Engine de POC a boundary runtime
- Status: En curso
- Status category: En curso
- Resolution: no-detectado
- Assignee: Fuentes Sandferand
- Updated: 2026-06-07T23:52:15.655-0300
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

* CR-SST-0016

Estado actual: implemented-local.

Objetivo:  
Avanzar esta funcionalidad desde el read-model del control-plane y cerrar los gaps abiertos mediante el lifecycle aprobado.

Gaps abiertos:

* Expose parser preview or import runtime endpoint in a later request.
* Decide when TagDefinition moves from code registry to persisted DB governance.
* Adopt reference-chip rendering in BFF/frontend after runtime API is published.

State id:

* sst-tag-prefix-engine

Servicios afectados:

* sst-bend

Request ids relacionados:

* CR-SST-0016

Fuente control-plane:

* state/features/sst-tag-prefix-engine.current.yaml

Evidence refs:

* evidence/requests/CR-SST-0016/backend-poc-summary.md

Validation refs:

* ninguno

Criterio de cierre esperado:

* La decision o implementacion pendiente queda registrada en evidencia.
* Los cambios en repos funcionales, si hacen falta, entran por request aprobado.
* El feature_state se actualiza solo cuando la evidencia soporte una transicion de estado.


```

## Evidencia

- JSON sanitizado: `evidence/requests/CR-SST-0067/jira-issue-SST-12-observation.json`
