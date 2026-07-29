# Jira Issue Observation: SST-31

## Estado

- Fecha: 2026-07-04
- Request: CR-SST-0099
- Escritura Jira: no

## Issue

- Summary: [SST][INIT-SST-0003][CR-SST-0099] Add session snapshot outcomes and warnings
- Status: Listo
- Status category: Listo
- Resolution: Listo
- Assignee: Fuentes Sandferand
- Updated: 2026-07-04T14:34:13.729-0300
- Labels: ards-sdd, control-plane, cr-sst-0099, init-sst-0003, session-capture, sst-extension

## Transiciones Disponibles

- Por hacer (11) -> Tareas por hacer
- En curso (21) -> En curso
- In Review (31) -> En revisión
- Listo (41) -> Finalizada

## Descripcion Sanitizada

```text
CR: CR-SST-0099  
Initiative: INIT-SST-0003  
Epic: SST-29

Purpose:

Add explicit session snapshot outcome and warning metadata for visual capture, textual fallback, unsupported URLs, permissions, timeouts and failures.

Subtasks / checklist:

- [ ] Definir snapshot.captureMode o snapshot.outcome.
- [ ] Definir warnings\[\] por tab.
- [ ] Actualizar specs/docs owner de sst-extension.
- [ ] Actualizar normalizadores de storage.
- [ ] Actualizar payload hacia node-auth sin romper compatibilidad.
- [ ] Agregar tests de migracion/normalizacion.

Definition of Done:

- [ ] PDF visual y PDF textual fallback son distinguibles.
- [ ] Warnings son per-tab y sanitizados.
- [ ] Payload antiguo sigue normalizando de forma compatible.
- [ ] Evidencia central lista rutas owner actualizadas o excepcion aprobada.

Owner documentation gate:

* sst-extension owner ARDS/SDD specs/docs must be updated for any mutated behavior, or an explicit owner-documentation exception must be recorded before closure.

Control-plane source:

* requests/planned/cr-sst-0099-TODO.yaml
* initiatives/INIT-SST-0003-sst-extension-construction.yaml
* evidence/requests/CR-SST-0095/jira-cr-backlog-candidates.md

Boundary:

* Jira is an operational mirror; ARDS/SDD remains the source of truth.
* Do not store private page content, cookies, JWTs or plaintext secrets in Jira or evidence.


```

## Evidencia

- JSON sanitizado: `evidence/requests/CR-SST-0099/jira-issue-SST-31-observation.json`
