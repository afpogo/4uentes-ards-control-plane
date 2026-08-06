# CR-CP-0002 Resumen De Inicio En Jira

## Issue Jira

- Jira issue: `ARDS-3`
- Project: `ARDS`
- Epic: `ARDS-1`
- Summary: `[CP][CR-CP-0002] Define child-to-control-plane reconciliation link policy and template`

## Sincronizacion De Inicio

- Asignado a: `Fuentes Sandferand`
- Assignee account id: `712020:9116451a-a17e-4191-bdb0-6430d5e849e1`
- Transicionado a: `En curso`
- Transition id: `21`
- Start comment id: `10127`

## Intencion

Iniciar `CR-CP-0002` para promover el patron local `orchestrator_link` como
policy/template generico de core para reconciliacion de repos hijos con un
control-plane adoptante.

Scope inicial de analisis:

- `specs/states/capability-state-linkage.yaml`
- `docs/requests/capability-state-linkage.md`
- `docs/cross-repo/child-repo-orchestrator-link-rule.md`
- `templates/child-orchestrator-link-rule.md`
- `state/capability-links.yaml`

Limite:

- No hard-codear `4uentes-orchestor` en core.
- Mantener `orchestrator_link` como alias/adopcion local hasta que un rollout
  separado migre o alias los repos hijos.
- No mutar repos hijos en este CR.
- Jira permanece como mirror; el request/evidence local sigue siendo el source
  of truth durable.
