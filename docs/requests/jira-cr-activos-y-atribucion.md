# CR Activos Y Atribucion Jira

## Resumen

Esta vista cruza el lifecycle del control plane con la atribucion explicita a
Jira.

- Corte: 2026-06-21
- CR activos unicos: 72
- CR activos con ticket atado: 8
- CR activos sin ticket atado: 64
- CR sin ticket en `planned`: 63
- CR sin ticket en `running`: 1

> Nota: `CR-SST-0074` ya no figura como activo porque `SST-22` quedo
> `Finalizada` y el cierre quedo reflejado en `requests/done/`.

## Addendum 2026-07-03

Durante la normalizacion de `INIT-SST-0001`, `CR-SST-0092` y `CR-SST-0097`
quedaron cerrados localmente y no deben contarse como CR activos aunque sus
mirrors Jira sigan pendientes de actualizacion aprobada.

| CR | Estado local | Jira issue | Jira observado | Evidencia |
|---|---|---|---|---|
| `CR-SST-0092` | `done` | `SST-28` | `Listo` | [`evidence/requests/CR-SST-0092/jira-sst-28-close-transition-summary.md`](../../evidence/requests/CR-SST-0092/jira-sst-28-close-transition-summary.md) |
| `CR-SST-0097` | `done` | `SST-28` | `Listo` | [`evidence/requests/CR-SST-0097/local-closure-2026-07-03.md`](../../evidence/requests/CR-SST-0097/local-closure-2026-07-03.md) |

`SST-6` e `INIT-SST-0001` permanecen activos por gaps de frontend/rendering y
parser flows restantes. La actualizacion de `SST-27`, `SST-6` y `SST-28` esta
preparada como dry-run en
[`jira-update-dry-run-2026-07-03.md`](../../evidence/initiatives/INIT-SST-0001/jira-update-dry-run-2026-07-03.md).

## Criterio

- `ticket atado` significa que el request declara `jira_issue_key` de forma
  explicita.
- `estado actual` se toma del request activo mas avanzado disponible en
  `requests/inbox/`, `requests/planned/`, `requests/queued/` o
  `requests/running/`.
- Cuando un mismo `CR` existe en mas de un estado activo, se conserva el estado
  mas avanzado para la lectura.

## Navegacion

- [CR activos con ticket atado](#cr-activos-con-ticket-atado)
- [CR activos sin ticket atado](#cr-activos-sin-ticket-atado)
  - [Running sin ticket](#running-sin-ticket)
  - [Planned sin ticket](#planned-sin-ticket)

## CR activos con ticket atado

| CR | Estado actual | Jira issue | Jira observado | Request activo |
|---|---|---|---|---|
| `CR-SST-0057` | `planned` | `SST-4` | `En curso` | [`requests/planned/CR-SST-0057-sst-4-work-start-transition.yaml`](../../requests/planned/CR-SST-0057-sst-4-work-start-transition.yaml) |
| `CR-SST-0058` | `planned` | `SST-8` | `Finalizada` | [`requests/planned/CR-SST-0058-sst-8-jira-close-transition-execution.yaml`](../../requests/planned/CR-SST-0058-sst-8-jira-close-transition-execution.yaml) |
| `CR-SST-0060` | `planned` | `SST-4` | `En curso` | [`requests/planned/CR-SST-0060-sst-tags-governance-article-tags-runtime-gap-closure.yaml`](../../requests/planned/CR-SST-0060-sst-tags-governance-article-tags-runtime-gap-closure.yaml) |
| `CR-SST-0064` | `planned` | `SST-10` | `En curso` | [`requests/planned/CR-SST-0064-dictionary-tags-validated-live-closure.yaml`](../../requests/planned/CR-SST-0064-dictionary-tags-validated-live-closure.yaml) |
| `CR-SST-0066` | `planned` | `SST-10` | `En curso` | [`requests/planned/CR-SST-0066-sst-10-jira-status-reconciliation.yaml`](../../requests/planned/CR-SST-0066-sst-10-jira-status-reconciliation.yaml) |
| `CR-SST-0067` | `planned` | `SST-12` | `En curso` | [`requests/planned/CR-SST-0067-sst-tag-prefix-engine-runtime-boundary.yaml`](../../requests/planned/CR-SST-0067-sst-tag-prefix-engine-runtime-boundary.yaml) |
| `CR-SST-0069` | `inbox` | `SST-12` | `En curso` | [`requests/inbox/CR-SST-0069-sst-tag-prefix-engine-consumer-introduction.yaml`](../../requests/inbox/CR-SST-0069-sst-tag-prefix-engine-consumer-introduction.yaml) |
| `CR-SST-0075` | `in_progress` | `SST-23` | `En curso` | [`requests/planned/CR-SST-0075-fend-governed-article-tag-selector.yaml`](../../requests/planned/CR-SST-0075-fend-governed-article-tag-selector.yaml) |
| `CR-SST-0083` | `planned` | `SST-7` | `Tareas por hacer` | [`requests/planned/CR-SST-0083-select-runtime-transport-for-sst-chatbot-handoff.yaml`](../../requests/planned/CR-SST-0083-select-runtime-transport-for-sst-chatbot-handoff.yaml) |

## CR activos sin ticket atado

### Running sin ticket

| CR | Estado actual | Request activo | Nota |
|---|---|---|---|
| `CR-SST-0078` | `running` | [`requests/planned/CR-SST-0078-sst-extension-oauth-ux-assisted-flow.yaml`](../../requests/planned/CR-SST-0078-sst-extension-oauth-ux-assisted-flow.yaml) | Tiene version `inbox` y `planned`; el estado activo mas avanzado es `running`. |

### Planned sin ticket

<details>
<summary>Ver los 63 CR en planned sin ticket</summary>

| CR | Estado actual | Request activo | Nota |
|---|---|---|---|
| `CR-SST-0002` | `planned` | [`requests/planned/CR-SST-0002-tags-dictionary-implementation-review.yaml`](../../requests/planned/CR-SST-0002-tags-dictionary-implementation-review.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0003` | `planned` | [`requests/planned/CR-SST-0003-backend-deployment-workflows-and-manifests.yaml`](../../requests/planned/CR-SST-0003-backend-deployment-workflows-and-manifests.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0004` | `planned` | [`requests/planned/CR-SST-0004-argocd-self-heal-investigation.yaml`](../../requests/planned/CR-SST-0004-argocd-self-heal-investigation.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0005` | `planned` | [`requests/planned/CR-SST-0005-argocd-prune-investigation.yaml`](../../requests/planned/CR-SST-0005-argocd-prune-investigation.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0006` | `planned` | [`requests/planned/CR-SST-0006-robots-cross-repo-investigation.yaml`](../../requests/planned/CR-SST-0006-robots-cross-repo-investigation.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0007` | `planned` | [`requests/planned/CR-SST-0007-sst-chatbot-capabilities-trace.yaml`](../../requests/planned/CR-SST-0007-sst-chatbot-capabilities-trace.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0008` | `planned` | [`requests/planned/CR-SST-0008-sst-document-agent-workflows.yaml`](../../requests/planned/CR-SST-0008-sst-document-agent-workflows.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0010` | `planned` | [`requests/planned/CR-SST-0010-sst-tags-governance-review.yaml`](../../requests/planned/CR-SST-0010-sst-tags-governance-review.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0013` | `planned` | [`requests/planned/CR-SST-0013-adopt-orchestrator-rules-in-child-repos.yaml`](../../requests/planned/CR-SST-0013-adopt-orchestrator-rules-in-child-repos.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0014` | `planned` | [`requests/planned/CR-SST-0014-sst-tags-dictionary-articles-deep-analysis.yaml`](../../requests/planned/CR-SST-0014-sst-tags-dictionary-articles-deep-analysis.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0015` | `planned` | [`requests/planned/CR-SST-0015-java-spring-course-tag-grammar-analysis.yaml`](../../requests/planned/CR-SST-0015-java-spring-course-tag-grammar-analysis.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0016` | `planned` | [`requests/planned/CR-SST-0016-sst-tag-prefix-engine-poc.yaml`](../../requests/planned/CR-SST-0016-sst-tag-prefix-engine-poc.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0018` | `planned` | [`requests/planned/CR-SST-0018-auth-session-recovery.yaml`](../../requests/planned/CR-SST-0018-auth-session-recovery.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0019` | `planned` | [`requests/planned/CR-SST-0019-agentic-model-deployment-policy.yaml`](../../requests/planned/CR-SST-0019-agentic-model-deployment-policy.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0020` | `planned` | [`requests/planned/CR-SST-0020-cluster-publication-ngrok-domain.yaml`](../../requests/planned/CR-SST-0020-cluster-publication-ngrok-domain.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0021` | `planned` | [`requests/planned/CR-SST-0021-ards-core-memory-runtime-phases.yaml`](../../requests/planned/CR-SST-0021-ards-core-memory-runtime-phases.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0022` | `planned` | [`requests/planned/CR-SST-0022-local-fake-orchestrator-handoff-adapter.yaml`](../../requests/planned/CR-SST-0022-local-fake-orchestrator-handoff-adapter.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0023` | `planned` | [`requests/planned/CR-SST-0023-local-infra-auth-scraper-errors.yaml`](../../requests/planned/CR-SST-0023-local-infra-auth-scraper-errors.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0024` | `planned` | [`requests/planned/CR-SST-0024-unified-ards-sdd-policy-model.yaml`](../../requests/planned/CR-SST-0024-unified-ards-sdd-policy-model.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0025` | `planned` | [`requests/planned/CR-SST-0025-ards-sdd-policies-first-class-model.yaml`](../../requests/planned/CR-SST-0025-ards-sdd-policies-first-class-model.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0026` | `planned` | [`requests/planned/CR-SST-0026-user-ards-sdd-product-model.yaml`](../../requests/planned/CR-SST-0026-user-ards-sdd-product-model.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0027` | `planned` | [`requests/planned/CR-SST-0027-paragraph-sequential-ards-derivation.yaml`](../../requests/planned/CR-SST-0027-paragraph-sequential-ards-derivation.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0028` | `planned` | [`requests/planned/CR-SST-0028-user-ards-intelligence-ui-and-persistence.yaml`](../../requests/planned/CR-SST-0028-user-ards-intelligence-ui-and-persistence.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0029` | `planned` | [`requests/planned/CR-SST-0029-jira-mcp-ticketing-integration.yaml`](../../requests/planned/CR-SST-0029-jira-mcp-ticketing-integration.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0030` | `planned` | [`requests/planned/CR-SST-0030-sst-user-internal-memory-boundary.yaml`](../../requests/planned/CR-SST-0030-sst-user-internal-memory-boundary.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0031` | `planned` | [`requests/planned/CR-SST-0031-sst-user-internal-memory-first-runtime-slice.yaml`](../../requests/planned/CR-SST-0031-sst-user-internal-memory-first-runtime-slice.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0032` | `planned` | [`requests/planned/CR-SST-0032-jira-mcp-read-only-verification.yaml`](../../requests/planned/CR-SST-0032-jira-mcp-read-only-verification.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0033` | `planned` | [`requests/planned/CR-SST-0033-jira-create-feature-state-issues.yaml`](../../requests/planned/CR-SST-0033-jira-create-feature-state-issues.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0034` | `planned` | [`requests/planned/CR-SST-0034-control-plane-jira-backlog-sync-state-machine.yaml`](../../requests/planned/CR-SST-0034-control-plane-jira-backlog-sync-state-machine.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0035` | `planned` | [`requests/planned/CR-SST-0035-jira-backlog-sync-machine-dry-runner.yaml`](../../requests/planned/CR-SST-0035-jira-backlog-sync-machine-dry-runner.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0036` | `planned` | [`requests/planned/CR-SST-0036-jira-backlog-sync-machine-read-only-actions.yaml`](../../requests/planned/CR-SST-0036-jira-backlog-sync-machine-read-only-actions.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0037` | `planned` | [`requests/planned/CR-SST-0037-jira-sync-doctor-and-write-gating.yaml`](../../requests/planned/CR-SST-0037-jira-sync-doctor-and-write-gating.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0038` | `planned` | [`requests/planned/CR-SST-0038-resolve-sst-tag-prefix-engine-jira-ambiguity.yaml`](../../requests/planned/CR-SST-0038-resolve-sst-tag-prefix-engine-jira-ambiguity.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0039` | `planned` | [`requests/planned/CR-SST-0039-apply-jira-sync-correction-plan.yaml`](../../requests/planned/CR-SST-0039-apply-jira-sync-correction-plan.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0040` | `planned` | [`requests/planned/CR-SST-0040-jira-control-plane-status-sync-policy.yaml`](../../requests/planned/CR-SST-0040-jira-control-plane-status-sync-policy.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0041` | `planned` | [`requests/planned/CR-SST-0041-jira-status-event-transition-proposal-flow.yaml`](../../requests/planned/CR-SST-0041-jira-status-event-transition-proposal-flow.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0042` | `planned` | [`requests/planned/CR-SST-0042-jira-status-transition-proposals-dry-run.yaml`](../../requests/planned/CR-SST-0042-jira-status-transition-proposals-dry-run.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0043` | `planned` | [`requests/planned/CR-SST-0043-jira-mcp-access-sync-health-contract.yaml`](../../requests/planned/CR-SST-0043-jira-mcp-access-sync-health-contract.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0044` | `planned` | [`requests/planned/CR-SST-0044-jira-sync-health-dry-run.yaml`](../../requests/planned/CR-SST-0044-jira-sync-health-dry-run.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0045` | `planned` | [`requests/planned/CR-SST-0045-jira-status-signal-approval-intake-flow.yaml`](../../requests/planned/CR-SST-0045-jira-status-signal-approval-intake-flow.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0046` | `planned` | [`requests/planned/CR-SST-0046-control-plane-jira-mcp-deferred-backlog.yaml`](../../requests/planned/CR-SST-0046-control-plane-jira-mcp-deferred-backlog.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0047` | `planned` | [`requests/planned/CR-SST-0047-jira-backlog-registry-and-cr-allocation-policy.yaml`](../../requests/planned/CR-SST-0047-jira-backlog-registry-and-cr-allocation-policy.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0048` | `planned` | [`requests/planned/CR-SST-0048-document-agent-runtime-e2e-validation.yaml`](../../requests/planned/CR-SST-0048-document-agent-runtime-e2e-validation.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0049` | `planned` | [`requests/planned/CR-SST-0049-jira-backlog-ticket-format-dry-run.yaml`](../../requests/planned/CR-SST-0049-jira-backlog-ticket-format-dry-run.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0050` | `planned` | [`requests/planned/CR-SST-0050-jira-backlog-create-writer.yaml`](../../requests/planned/CR-SST-0050-jira-backlog-create-writer.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0051` | `planned` | [`requests/planned/CR-SST-0051-jira-backlog-mirror-ticket-policy.yaml`](../../requests/planned/CR-SST-0051-jira-backlog-mirror-ticket-policy.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0052` | `planned` | [`requests/planned/CR-SST-0052-document-agent-contract-e2e-gap-closure.yaml`](../../requests/planned/CR-SST-0052-document-agent-contract-e2e-gap-closure.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0053` | `planned` | [`requests/planned/CR-SST-0053-document-agent-authenticated-e2e-smoke.yaml`](../../requests/planned/CR-SST-0053-document-agent-authenticated-e2e-smoke.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0054` | `planned` | [`requests/planned/CR-SST-0054-jira-backlog-sync-next-issue-review.yaml`](../../requests/planned/CR-SST-0054-jira-backlog-sync-next-issue-review.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0055` | `planned` | [`requests/planned/CR-SST-0055-unified-jira-radar-next-issue-review.yaml`](../../requests/planned/CR-SST-0055-unified-jira-radar-next-issue-review.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0056` | `planned` | [`requests/planned/CR-SST-0056-sst-8-jira-close-resolution-proposal.yaml`](../../requests/planned/CR-SST-0056-sst-8-jira-close-resolution-proposal.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0059` | `planned` | [`requests/planned/CR-SST-0059-operational-mcp-oauth-session-playbook.yaml`](../../requests/planned/CR-SST-0059-operational-mcp-oauth-session-playbook.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0061` | `planned` | [`requests/planned/CR-SST-0061-jira-mcp-endpoint-connection-policy.yaml`](../../requests/planned/CR-SST-0061-jira-mcp-endpoint-connection-policy.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0062` | `planned` | [`requests/planned/CR-SST-0062-control-plane-jira-live-review.yaml`](../../requests/planned/CR-SST-0062-control-plane-jira-live-review.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0063` | `planned` | [`requests/planned/CR-SST-0063-sst-tags-governance-execution-order.yaml`](../../requests/planned/CR-SST-0063-sst-tags-governance-execution-order.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0065` | `planned` | [`requests/planned/CR-SST-0065-child-contract-binding-adoption.yaml`](../../requests/planned/CR-SST-0065-child-contract-binding-adoption.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0068` | `planned` | [`requests/planned/CR-SST-0068-ards-sdd-system-observability-admin-runtime.yaml`](../../requests/planned/CR-SST-0068-ards-sdd-system-observability-admin-runtime.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0070` | `planned` | [`requests/planned/CR-SST-0070-sync-remaining-sst-child-contract-bindings.yaml`](../../requests/planned/CR-SST-0070-sync-remaining-sst-child-contract-bindings.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0071` | `planned` | [`requests/planned/CR-SST-0071-sst-tags-governance-global-db-model.yaml`](../../requests/planned/CR-SST-0071-sst-tags-governance-global-db-model.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0072` | `planned` | [`requests/planned/CR-SST-0072-sst-tags-persistence-backend-model.yaml`](../../requests/planned/CR-SST-0072-sst-tags-persistence-backend-model.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0076` | `in_progress` | [`requests/planned/CR-SST-0076-dictionary-adoption-and-governed-closure.yaml`](../../requests/planned/CR-SST-0076-dictionary-adoption-and-governed-closure.yaml) | Jira `SST-24`, transicionado a `En curso` con evidencia en `evidence/requests/CR-SST-0076/jira-sst-24-start-transition-summary.md`. |
| `CR-SST-0077` | `planned` | [`requests/planned/CR-SST-0077-sst-policy-adoption-sync-rollout.yaml`](../../requests/planned/CR-SST-0077-sst-policy-adoption-sync-rollout.yaml) | Sin `jira_issue_key`. |
| `CR-SST-0079` | `planned` | [`requests/planned/CR-SST-0079-sst-tags-governance-reproducible-api-qa.yaml`](../../requests/planned/CR-SST-0079-sst-tags-governance-reproducible-api-qa.yaml) | Sin `jira_issue_key`; esta entrada aparece tambien en `inbox` como semilla del mismo CR. |

</details>
