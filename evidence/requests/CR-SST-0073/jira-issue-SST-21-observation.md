# Observacion De Issue Jira: SST-21

## Estado

- Fecha: 2026-06-20
- Request: CR-SST-0073
- Escritura Jira: no

## Issue

- Summary: [SST-4][CR-SST-0073] Tag search and resource binding API
- Status: En revision
- Status category: En curso
- Resolution: no-detectado
- Assignee: Fuentes Sandferand
- Updated: 2026-06-18T20:58:24.108-0300
- Labels: active-work, ards-sdd, control-plane, cr-sst-0073, in-review, sst-tags-governance, subtask

## Transiciones Disponibles

- Por hacer (11) -> Tareas por hacer
- En curso (21) -> En curso
- In Review (31) -> En revision
- Listo (41) -> Finalizada

## Descripcion Sanitizada

```text
Subtask under `SST-4` for the next governed execution slice.

* CR: `CR-SST-0073`
* Scope: `sst-bend` governed tags search, explicit value creation, and resource binding API.
* Source request: `requests/planned/CR-SST-0073-sst-tags-search-and-resource-binding-api.yaml`
* Goal: expose `GET /tags/definitions`, `GET /tags/values`, `POST /tags/values`, and `PUT /tags/resources/:resourceType/:resourceId` on top of the global persistence model delivered in `CR-SST-0072`.
* Risk: high due to public backend API contract, attach/detach semantics, and future BFF/frontend adoption.

Execution guardrails:

* Keep this CR inside `sst-bend` only.
* Do not modify `4uentes-auth`, `sst-fend`, or `sst-extension` in this CR.
* Do not change existing public dictionary/article response shapes unless explicitly required by the contract.
* Preserve `dictionary-tags` validated-live behavior while introducing governed tag API surfaces.

Canonical control-plane refs:

* docs/requests/sst-tags-governance-contract.md
* state/features/sst-tags-governance.current.yaml
* requests/planned/CR-SST-0073-sst-tags-search-and-resource-binding-api.yaml
```

## Evidencia

- JSON sanitizado: `evidence/requests/CR-SST-0073/jira-issue-SST-21-observation.json`
