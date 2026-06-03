# CR-SST-0019 - Implementation Summary

Observed on: 2026-05-28

## Scope

This request makes the model-selection policy executable and auditable. The
policy now requires a deployment decision for subagents when task weight
justifies it.

Affected repositories:

- `4uentes-orchestor`
- `4uentes-auth` (`node-auth` local alias)
- `sst-fend`
- `sst-bend`
- `sst-extension`
- `sst-chatbot`
- `sst-4uentes-infra`

## Orchestrator Changes

- `docs/ai/model-selection-policy.md`
  - added task-weight analysis
  - added expected deployment behavior per classification
  - added fallback rules when subagents or aliases are unavailable
- `docs/requests/execution-model.md`
  - added `task_weight`, `model_selection`, and `subagent_deployment_plan` as
    required planned-request output
- `AGENTS.md`
  - requires planned work to make classification auditable
- `templates/change-request.template.yaml`
  - added task-weight, model-selection, and subagent-deployment sections
- `scripts/plan-change.js`
  - now emits `task_weight`
  - now emits `model_selection`
  - now emits `subagent_deployment_plan`

## Child Repo Changes

Updated model-selection annexes and AGENTS guidance so repo-local work also
requires a deployment decision when the task weight calls for subagents.

Updated repositories:

- `4uentes-auth`
- `sst-fend`
- `sst-bend`
- `sst-extension`
- `sst-chatbot`
- `sst-4uentes-infra`

## Runtime Context

The user provided:

- `http://localhost:8088/`

Observed result:

- `GET http://localhost:8088/` returned `200`
- response contained an app root

This URL was recorded as runtime context only; CR-SST-0019 is a documentation
and orchestration-policy change.
