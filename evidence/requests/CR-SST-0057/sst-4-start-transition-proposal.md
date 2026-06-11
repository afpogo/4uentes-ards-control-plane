# SST-4 Start Transition Proposal

Date: 2026-06-07
Request: `CR-SST-0057`

## Target

- Jira issue: `SST-4`
- Feature state: `sst-tags-governance`
- Current local feature status: `runtime-partial`
- Current Jira status observed: `Tareas por hacer`
- Proposed Jira action: move `SST-4` to `En curso`
- Jira write executed: no
- Local automatic transition executed: no

## Governing Request

Use `CR-SST-0057` as the current governing request for this operational
transition.

The historical CR-SST requests remain provenance only:

- `CR-SST-0010`
- `CR-SST-0014`
- `CR-SST-0015`
- `CR-SST-0016`

## Recommendation

Proceed with a controlled Jira transition for `SST-4` to the workflow's active
work status.

Preferred target status:

1. `En curso`
2. `In Progress`

If Jira requires assignment before transition, assign to the operator taking the
work and then move to `En curso`.

## Evidence Basis

`SST-4` represents the active feature-state ticket for `sst-tags-governance`.
The state is still `runtime-partial` and has open gaps:

- Promote article-tags from draft to an active governed SST capability.
- Adopt structured article tags in BFF and frontend create/update flows.
- Promote sst-tag-prefix-engine from backend POC to runtime preview/import
  endpoint.
- Keep real-time transcription as a separate future intake request.

Supporting evidence:

- `state/features/sst-tags-governance.current.yaml`
- `evidence/requests/CR-SST-0055/unified-jira-radar.md`
- `evidence/requests/CR-SST-0057/transition-scope-review.md`
- `evidence/requests/CR-SST-0057/involved-cr-sst-matrix.md`

## Suggested Jira Comment

```text
Tomamos SST-4 como trabajo activo bajo CR-SST-0057.

SST-4 representa `sst-tags-governance`, actualmente en `runtime-partial`.

CR-SST historicos relacionados:
- CR-SST-0010
- CR-SST-0014
- CR-SST-0015
- CR-SST-0016

Esos CRs quedan como evidencia/provenance. El request vigente para esta toma de trabajo es CR-SST-0057.

La transicion a En curso no cambia por si sola el feature_state local; el estado se actualizara solo con evidencia local de implementacion/validacion.
```

## Guardrails

Before executing a real Jira transition:

- confirm the available Jira active-work transition for `SST-4`;
- do not transition other SST issues in the same operation;
- do not mark `state/features/sst-tags-governance.current.yaml` as done from
  Jira status alone;
- record the post-transition Jira observation as evidence.
