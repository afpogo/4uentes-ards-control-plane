# Jira Issue Observation: SST-30

## Estado

- Fecha: 2026-07-03
- Request: CR-SST-0098
- Escritura Jira: no

## Issue

- Summary: [SST][INIT-SST-0003][CR-SST-0098] Fix sst-extension session tab-by-tab visual PDF capture
- Status: En revisión
- Status category: En curso
- Resolution: no-detectado
- Assignee: Fuentes Sandferand
- Updated: 2026-07-03T02:29:50.084-0300
- Labels: ards-sdd, control-plane, cr-sst-0098, init-sst-0003, session-capture, sst-extension

## Transiciones Disponibles

- Por hacer (11) -> Tareas por hacer
- En curso (21) -> En curso
- In Review (31) -> En revisión
- Listo (41) -> Finalizada

## Descripcion Sanitizada

```text
CR: CR-SST-0098  
Initiative: INIT-SST-0003  
Epic: SST-29

Purpose:

Fix robust visual PDF capture for each session tab, including tab focus, ready/settle wait, partial failure handling, and original active tab restoration.

Subtasks / checklist:

- [ ] Actualizar spec sessions con carga, settle y restauracion de foco.
- [ ] Actualizar docs owner de sst-extension afectadas por el cambio.
- [ ] Capturar y restaurar tab activa original.
- [ ] Agregar wait strategy por tab: tabs.onUpdated, document.readyState, settle y timeout.
- [ ] Preservar scroll inicial por tab cuando sea posible.
- [ ] Mantener fallo parcial sin abortar todo el lote.
- [ ] Agregar unit tests de tab activation, timeout y restore original.
- [ ] Ejecutar pnpm test, pnpm build y pnpm check.

Definition of Done:

- [ ] La tab original queda activa al terminar.
- [ ] Tabs lentas no se capturan antes de ready/settle o producen warning.
- [ ] Una tab fallida no invalida necesariamente toda la sesion.
- [ ] No se introducen content scripts persistentes sin spec.
- [ ] Evidencia central lista rutas owner actualizadas en sst-extension.

Owner documentation gate:

* sst-extension owner ARDS/SDD specs/docs must be updated for any mutated behavior, or an explicit owner-documentation exception must be recorded before closure.

Control-plane source:

* requests/planned/cr-sst-0098-TODO.yaml
* initiatives/INIT-SST-0003-sst-extension-construction.yaml
* evidence/requests/CR-SST-0095/jira-cr-backlog-candidates.md

Boundary:

* Jira is an operational mirror; ARDS/SDD remains the source of truth.
* Do not store private page content, cookies, JWTs or plaintext secrets in Jira or evidence.


```

## Evidencia

- JSON sanitizado: `evidence/requests/CR-SST-0098/jira-issue-SST-30-observation.json`
