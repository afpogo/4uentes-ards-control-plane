# CR-SST-0125 - Jira Manual Payload

## Estado

- Fecha: 2026-07-10
- Motivo: fallback MCP local bloqueado por politica de external disclosure
- Uso previsto: crear manualmente el mirror Jira si el operador decide hacerlo
  fuera de Codex.

## Issue

- Project: `SST`
- Parent: `SST-6`
- Issue type: `Sub-task` / `Subtarea`
- Summary: `[SST][CR-SST-0125] LearningWorkspace source preview/import normalization`

## Labels

```text
ards-sdd
control-plane
init-sst-0001
cr-sst-0125
sst-bend
learning-content-tags
learning-workspace
preview-import
subtask
backend
```

## Description

```text
CR: CR-SST-0125
Initiative: INIT-SST-0001
Parent: SST-6
Related: SST-53

Purpose:

Implement the next sst-bend backend slice for LearningWorkspace source
preview/import normalization. Keep the existing preview endpoint, preserve
preview-only behavior, and add warning-first handling for bounded source
payloads.

Definition of Done:

* [ ] CourseSource-style payload is normalized into previewable sourceText/materialized blocks.
* [ ] WebArticleSource/manual text payload remains bounded and does not crawl.
* [ ] Generated/excluded paths produce warnings, not silent ingestion.
* [ ] Preview response remains preview-only and non-persisted.
* [ ] Existing annotation preview/accept behavior remains valid.
* [ ] sst-bend owner docs/specs are updated.
* [ ] sst-bend and control-plane checks pass.

Control-plane evidence:

* requests/planned/CR-SST-0125-sst-bend-learning-source-preview-import-normalization.yaml
* evidence/requests/CR-SST-0125/policy-and-owner-enforcement-start.md
* evidence/requests/CR-SST-0125/implementation-analysis-start.md

Boundary:

* Jira is an operational mirror; ARDS/SDD remains the source of truth.
* Do not create TagDefinition records automatically.
* Do not perform crawler recursion, mass scraping, automatic publish or preview persistence.
* Do not store secrets, JWTs, cookies or private content in Jira or evidence.
```

## Start Comment

```text
CR-SST-0125 start checkpoint.

Scope:

* Target repo: sst-bend.
* Reuse POST /learning-workspaces/sources/preview.
* Normalize bounded CourseSource/WebArticleSource/manual text payloads before tag-prefix parsing.
* Keep persistenceMode=preview-only and no automatic TagDefinition creation.

Policies:

* Owner documentation gate is required before closure.
* Control-plane npm.cmd run check passed before Jira sync.

Evidence:

* evidence/requests/CR-SST-0125/policy-and-owner-enforcement-start.md
* evidence/requests/CR-SST-0125/implementation-analysis-start.md
```
