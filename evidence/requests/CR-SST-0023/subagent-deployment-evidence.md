# CR-SST-0023 Subagent Deployment Evidence

Date: 2026-06-02

Task classification: `complex-high-risk-task`

Policy reference: `docs/ai/model-selection-policy.md`

Primary profile selected: `gpt-5.5`

Reason: The investigation crosses frontend, backend API authorization, shared auth, scraper runtime behavior, and local infrastructure routing.

Planned roles:

- `security-contract-reviewer`: inspect auth/session/API contract behavior.
- `cross-repo-impact-reviewer`: inspect involved repos, infra wiring, docker/local routing, and service impact.
- `validation-reviewer`: inspect Chrome DevTools network/console and runtime validation evidence.

Runtime status:

- Subagent tool discovered through deferred tool search.
- Exact model alias `gpt-5.5` is available in the subagent runtime metadata.
- Agents to be spawned after lifecycle entry is present.
