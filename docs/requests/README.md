# Seccion Requests

## Proposito

Esta seccion agrupa documentacion sobre el comportamiento request/response del
orchestrator.

## Separacion Principal

- input de request:
  `requests/inbox/*.yaml`
- response del planner:
  `requests/planned/*.yaml`
- estados de ejecucion:
  `requests/queued/`, `requests/running/`, `requests/done/`,
  `requests/rejected/`
- evidencia de ejecucion:
  `evidence/requests/<request-id>/`

## Usar Esta Seccion Para

- reglas del request lifecycle
- significado de `planned`
- interpretacion de riesgo
- checks requeridos y reglas de evidencia

## Docs Canonicos Actuales

- [execution-model.md](execution-model.md)
- [state-read-model.md](state-read-model.md)
- [capability-state-linkage.md](capability-state-linkage.md)
- [jira-mcp-endpoint-connection-policy.md](jira-mcp-endpoint-connection-policy.md)
- [jira-mcp-ticketing-playbook.md](jira-mcp-ticketing-playbook.md)
- [jira-mcp-oauth-session-playbook.md](jira-mcp-oauth-session-playbook.md)
- [jira-feature-ticket-policy.md](jira-feature-ticket-policy.md)
- [jira-backlog-registry-policy.md](jira-backlog-registry-policy.md)
- [jira-backlog-sync-state-machine.md](jira-backlog-sync-state-machine.md)
- [deployment-request-playbook.md](../cross-repo/deployment-request-playbook.md)
- [documentation-information-architecture.md](../documentation-information-architecture.md)
