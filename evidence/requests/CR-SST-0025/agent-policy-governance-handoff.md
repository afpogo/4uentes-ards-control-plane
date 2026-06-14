# Agent Policy Governance Handoff

## Context

This evidence records the orchestrator-side capability package that prepares
future `4uentes-ards-core` adoption of the agent operating policy governance
architecture.

The work is intentionally limited to `4uentes-orchestor`.

## Task Classification

- `task_weight.classification`: `complex-high-risk-task`
- `risk_level`: `high`
- Drivers:
  - ARDS/SDD governance model handoff
  - core standard source boundary
  - future child repo inheritance
  - provider-agnostic model aliasing

## Subagent Deployment

The user explicitly requested subagent usage.

- Subagent role: repo capability pattern explorer
- Scope: read-only review of capability patterns, core handoff precedent, and
  recommended files.
- Result: subagent confirmed an outbound capability draft is the right bounded
  shape and that `4uentes-ards-core` must remain `pending-core-handoff`.

## Implemented Orchestrator Artifacts

- `specs/capabilities/outbound/00-index.yaml`
- `specs/capabilities/outbound/4uentes-orchestor--core-agent-policy-governance-handoff.yaml`
- `state/capability-links.yaml`
- `state/policy-links.yaml`
- `state/features/ards-sdd-policy-unification.current.yaml`
- `specs/00-index.yaml`

## Boundary

- `4uentes-ards-core` was not modified.
- Child repositories were not modified.
- No product runtime code was modified.
- No functional contracts, API contracts, auth, RBAC, or product capabilities
  were changed.

## Validation

Command:

```bash
npm.cmd run check
```

Result:

- 0 FAIL
- Existing warnings remain for remote observation and pre-existing state
  metadata gaps.

## Open Gaps

- Core adoption requires a future approved request in `4uentes-ards-core`.
- Child repo propagation remains future work after core adopts the contract.
- There is no dedicated validator for outbound capability shape yet.
