# ARDS-5 / CR-CP-0004

Inicio `CR-CP-0004` para promover el modelo `Initiative` al core ARDS/SDD.

Contexto:

- ARDS-4 promovio `feature-bugfix-state-model` como living resource del core.
- ARDS-5 continua con `initiative-model` como living resource reusable.
- No se crea una policy nueva.
- `4uentes-orchestor` queda como origin repo del modelo observado.
- `4uentes-ards-core` debe quedar como canonical owner del canon reusable.
- Jira se mantiene como mirror operativo, no source of truth.

Boundary clave:

- `Initiative ~= Jira Epic`.
- `CR ~= Jira Task / Story / Subtask`.
- Una Epic paraguas no reemplaza la Epic propia de una Initiative.
- No se mutan repos hijos.

Evidencia local:

- `evidence/requests/CR-CP-0004/ards-5-context-summary.md`
- `evidence/requests/CR-CP-0004/jira-mirror-boundary-decision.md`
