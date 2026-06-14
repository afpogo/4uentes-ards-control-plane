# CR-SST-0077 Policy Links State Update Summary

## Purpose

Record how `CR-SST-0077` changed the control-plane view of agent operating
policy adoption.

## Updates

- `agent-model-selection-policy` -> `linked`
- `agent-resource-degradation-policy` -> `linked`
- `agent-task-atomization-policy` -> `linked`
- `agent-delegation-policy` -> `linked`
- `agent-context-management-policy` -> `linked`
- `agent-architecture-boundary-policy` -> `linked`

## Meaning

These six policies are no longer tracked as `pending-core-handoff` in the
orchestrator. The core now exposes the canonical policy registry and the SST
child repos expose the minimum local adoption artifacts required by the sync
contract.

## Remaining Open Items

- `human-doc-language` still needs a separate core handoff decision.
- Broader rollout beyond the SST solution remains future work.
- Some repo-level validation commands still fail and are tracked separately in
  `evidence/requests/CR-SST-0077/validation-results.md`.
