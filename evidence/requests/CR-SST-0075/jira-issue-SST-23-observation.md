# Jira Issue Observation: SST-23

## Estado

- Fecha: 2026-06-24
- Request: CR-SST-0075
- Escritura Jira: no

## Issue

- Summary: [SST-4][CR-SST-0075] Governed article tag selector UI
- Status: En curso
- Status category: En curso
- Resolution: no-detectado
- Assignee: no-asignado
- Updated: 2026-06-21T22:24:26.483-0300
- Labels: active-work, ards-sdd, control-plane, cr-sst-0075, sst-tags-governance, subtask

## Transiciones Disponibles

- Por hacer (11) -> Tareas por hacer
- En curso (21) -> En curso
- In Review (31) -> En revisión
- Listo (41) -> Finalizada

## Descripcion Sanitizada

```text
Subtask under `SST-4` for the next governed execution slice.

* CR: `CR-SST-0075`
* Scope: `sst-fend` governed selector or autocomplete for article tags.
* Source request: `requests/planned/CR-SST-0075-fend-governed-article-tag-selector.yaml`
* Goal: replace comma-separated tag input with governed search, explicit create action, dedup, and empty-state detach support.
* Dependency: backend and BFF tags endpoints from `CR-SST-0073` and `CR-SST-0074`.
* Risk: high due to frontend contract migration, autocomplete UX, and payload compatibility.

Execution guardrails:

* Keep this CR inside `sst-fend` only.
* Do not modify `sst-bend`, `4uentes-auth`, or `sst-extension` in this CR.
* Preserve the governed payload contract exposed by `SST-21` and `SST-22`.
* Keep explicit create semantics for `TagValue`; do not degrade the flow back to freeform comma-separated strings.

Canonical control-plane refs:

* docs/requests/sst-tags-governance-contract.md
* state/features/sst-tags-governance.current.yaml
* requests/planned/CR-SST-0075-fend-governed-article-tag-selector.yaml


```

## Evidencia

- JSON sanitizado: `evidence/requests/CR-SST-0075/jira-issue-SST-23-observation.json`
