# CR-SST-0019 - Subagent Deployment Evidence

Observed on: 2026-05-28

## Task Weight

Classification:

- `complex-high-risk-task`

Drivers:

- multi-service scope
- shared auth provider in affected services
- infra scope
- child-repo policy propagation
- planner behavior change
- existing dirty working trees in affected repos

## Model Selection

Primary profile:

- `gpt-5.5`

Fallback:

- highest available reasoning profile if exact alias is unavailable

## Subagent Used

Agent id:

- `019e703d-3cb3-7991-af5e-d3b721ca1264`

Role:

- `policy-audit-explorer`

Model:

- `gpt-5.5`

Assigned task:

- inspect the orchestrator policy, execution model, request template, and
  planner
- return the fields/rules needed to make subagent deployment auditable

Contribution:

- confirmed the planned-request checklist:
  - `task_weight.classification`
  - `task_weight.risk_level`
  - `task_weight.drivers`
  - `model_selection.policy_ref`
  - `model_selection.primary_profile`
  - `model_selection.fallback_profile`
  - `model_selection.reason`
  - `subagent_deployment_plan.required`
  - `subagent_deployment_plan.parallelizable`
  - `subagent_deployment_plan.roles`
  - `subagent_deployment_plan.fallback`
  - `subagent_deployment_plan.evidence_required`

Integration:

- The checklist was incorporated into policy docs, request template, planner
  output, and evidence requirements.

Fallback:

- Not used. Subagent deployment was available and executed.
