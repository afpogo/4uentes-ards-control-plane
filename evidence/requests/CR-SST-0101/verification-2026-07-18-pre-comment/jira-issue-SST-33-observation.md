# Jira Issue Observation: SST-33

## Estado

- Fecha: 2026-07-18
- Request: CR-SST-0101
- Escritura Jira: no

## Issue

- Summary: [SST][INIT-SST-0003][CR-SST-0101] Define sst-extension CredentialedWebSource producer contract
- Status: Listo
- Status category: Listo
- Resolution: Listo
- Assignee: Fuentes Sandferand
- Updated: 2026-07-13T00:30:14.491-0300
- Labels: ards-sdd, control-plane, cr-sst-0101, credentialed-web-source, init-sst-0003, sst-extension

## Transiciones Disponibles

- Por hacer (11) -> Tareas por hacer
- En curso (21) -> En curso
- In Review (31) -> En revisión
- Listo (41) -> Finalizada

## Descripcion Sanitizada

```text
CR: CR-SST-0101  
Initiative: INIT-SST-0003  
Epic: SST-29

Purpose:

Define sst-extension as producer of CredentialedWebSource in browser-session mode without using DictionarySecret plaintext in the client.

Subtasks / checklist:

- [ ] Definir sourceType: credentialed-web.
- [ ] Definir captureMode: browser-session.
- [ ] Crear o actualizar specs/docs owner en sst-extension.
- [ ] Mapear artifacts: visualPdf, readableText y futuro rawHtml.
- [ ] Declarar que DictionarySecret SecretRef queda fuera del cliente.
- [ ] Definir provenance y preview-only gate.

Definition of Done:

- [ ] Contrato documentado sin implementar crawler.
- [ ] No hay flujo que entregue plaintext secret al frontend.
- [ ] Queda claro como entra luego a LearningWorkspace.
- [ ] sst-extension conserva autoridad documental del producer contract.

Owner documentation gate:

* sst-extension owner ARDS/SDD specs/docs must be updated for any mutated behavior, or an explicit owner-documentation exception must be recorded before closure.

Control-plane source:

* requests/planned/cr-sst-0101-TODO.yaml
* initiatives/INIT-SST-0003-sst-extension-construction.yaml
* evidence/requests/CR-SST-0095/jira-cr-backlog-candidates.md

Boundary:

* Jira is an operational mirror; ARDS/SDD remains the source of truth.
* Do not store private page content, cookies, JWTs or plaintext secrets in Jira or evidence.


```

## Evidencia

- JSON sanitizado: `evidence/requests/CR-SST-0101/verification-2026-07-18-pre-comment/jira-issue-SST-33-observation.json`
