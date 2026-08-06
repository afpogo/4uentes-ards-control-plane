# Observacion De Parent Jira: SST-50

## Estado

- Fecha: 2026-07-12
- Request: CR-SST-0120
- Escritura Jira: no

## Parent

- Summary: [SST][INIT-SST-0003][CR-SST-0120] Define preview image contract for session-derived articles
- Status: En curso
- Status category: En curso
- Labels: ards-sdd, control-plane, cr-sst-0120, init-sst-0003, node-auth, preview-image, sst-extension, sst-fend
- Subtasks observadas: 0

## Subtasks

- ninguna observada

## Descripcion Sanitizada

```text
CR: CR-SST-0120  
Initiative: INIT-SST-0003  
Epic: SST-29  
Discovered from: SST-32 / CR-SST-0100 manual QA

Purpose:

Define how articles generated from sst-extension session capture should carry or derive preview images when the captured artifact is textual PDF fallback.

Subtasks / checklist:

- [ ] Select the owner boundary for preview metadata: producer, ingestion, frontend rendering, or explicit cross-repo contract.
- [ ] Define behavior for visual captures: safe thumbnail, derived preview, or unavailable reason.
- [ ] Define behavior for textual fallback PDFs: generated placeholder, downstream derivation, or explicit preview-unavailable reason.
- [ ] Define persistence and privacy rules for thumbnails from private pages.
- [ ] Update owner docs/specs in every mutated repo or record approved exceptions.
- [ ] Add QA coverage that proves text-only session-derived articles do not fail silently when preview image is unavailable.

Definition of Done:

* \[ \] Session-derived articles have an explicit preview image behavior.
* \[ \] Preview unavailable is a governed state, not an ambiguous UI gap.
* \[ \] No private preview image is stored in ARDS/SDD evidence.
* \[ \] Every mutated repository has owner documentation updated or an exception recorded.
* \[ \] `npm run check` passes in control-plane plus child-repo checks required by the selected implementation boundary.

Owner documentation gate:

* Owner ARDS/SDD specs/docs must be updated in every mutated repository, or an explicit owner-documentation exception must be recorded before closure.

Control-plane source:

* requests/planned/CR-SST-0120-session-derived-article-preview-image-contract.yaml
* initiatives/INIT-SST-0003-sst-extension-construction.yaml
* evidence/requests/CR-SST-0100/manual-qa-gap-analysis.md

Boundary:

* Jira is an operational mirror; ARDS/SDD remains the source of truth.
* Do not store private page content, cookies, JWTs, raw PDFs, thumbnails from private pages, or plaintext secrets in Jira or evidence.


```

## Evidencia

- JSON sanitizado: `evidence/requests/CR-SST-0120/jira-parent-SST-50-observation.json`
