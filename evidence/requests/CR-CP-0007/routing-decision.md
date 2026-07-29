# Decision De Routing CR-CP-0007

## Resultado

- Fecha: 2026-07-10
- Request: `CR-CP-0007`
- Initiative local: `INIT-CP-0002`
- Jira Epic mirror objetivo: `ARDS-1`
- Proyecto Jira objetivo: `ARDS`
- Escritura Jira ejecutada: no

## Decision

La policy nueva pertenece al flujo `CR-CP-*`, no al flujo `CR-SST-*`.

Motivo:

- El alcance gobierna tratamiento del control-plane y canon core.
- `INIT-CP-0002` ya modela `project_key: ARDS`, `issue_key: ARDS-1` y
  `related_epic_key: SST-36`.
- `CR-CP-0001` a `CR-CP-0005` usan `ARDS-1` como Epic mirror para promocion de
  recursos vivos al core.
- `CR-CP-0006` ya esta reservado como candidato para rollout posterior de
  adopcion en repos hijos, por lo que `CR-CP-0007` evita pisar esa semantica.

## Evidencia MCP

Se observo `ARDS-1` por MCP local con evidencia sanitizada:

- `evidence/requests/CR-CP-0007/jira-issue-ARDS-1-observation.md`

Resultado observado:

- Issue: `ARDS-1`
- Estado: `Por hacer`
- Labels: `ai-develop-driven`, `ards-sdd`, `control-plane`, `core`,
  `init-cp-0002`

## Boundary

Jira sigue siendo mirror operacional. ARDS/SDD local conserva la fuente de
verdad del request, la policy, la evidencia y el scope de core promotion.
