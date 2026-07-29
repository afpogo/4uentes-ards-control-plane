# Jira Issue Observation: SST-53

## Estado

- Fecha: 2026-07-07
- Request: CR-SST-0124
- Escritura Jira: no

## Issue

- Summary: [SST][CR-SST-0124] Native SST article runtime URL
- Status: En curso
- Status category: En curso
- Resolution: no-detectado
- Assignee: Fuentes Sandferand
- Updated: 2026-07-07T18:10:39.962-0300
- Labels: ards-sdd, control-plane, cr-sst-0124, frontend, init-sst-0001, learning-content-tags, runtime-url, sst-fend, subtask

## Transiciones Disponibles

- Por hacer (11) -> Tareas por hacer
- En curso (21) -> En curso
- In Review (31) -> En revisión
- Listo (41) -> Finalizada

## Descripcion Sanitizada

```text
CR: CR-SST-0124  
Initiative: INIT-SST-0001  
Parent: SST-6  
Related: SST-52 / CR-SST-0123

Purpose:

Implement the MVP for native SST text articles to expose a browser-openable runtime URL derived from the article id and current SST origin, without storing a fake external source URL.

Definition of Done:

- [ ] Text article creation remains valid with no external URL.
- [ ] Created native text article exposes an app/runtime open action.
- [ ] Runtime URL opens the article in localhost/browser context.
- [ ] Runtime URL is not persisted as article url or payload.data.sourceUrl.
- [ ] Existing web/source article URL behavior remains unchanged.
- [ ] Owner ARDS/SDD docs/specs and control-plane evidence are updated.

Control-plane evidence:

* `requests/planned/CR-SST-0124-sst-fend-native-article-runtime-url.yaml`
* `evidence/requests/CR-SST-0124/policy-and-owner-enforcement-start.md`
* `evidence/requests/CR-SST-0124/implementation-analysis-start.md`

Boundary:

* Jira is an operational mirror; ARDS/SDD remains the source of truth.
* Internal runtime URLs must not be treated as scrapeable external source URLs.
* Do not store secrets, JWTs, cookies or private content in Jira or evidence.


```

## Evidencia

- JSON sanitizado: `evidence/requests/CR-SST-0124/jira-issue-SST-53-observation.json`
