# CR-SST-0016 - sst-chatbot Control Plane Onboarding

Observed on: 2026-05-26

## Summary

`sst-chatbot` is now modeled as a logical SST service in the control plane.

The repository is an independent Git repo with remote:

```text
git@github.com:afpogo/sst-chatbot.git
```

It owns agent runtime ARDS/SDD contracts and publishes structured handoff
capabilities that `4uentes-orchestor` can consume.

## Control Plane Changes

- Added `catalog/services/sst-chatbot.yaml`.
- Added `sst-chatbot` to `solutions/sst.yaml`.
- Added local binding example and local ignored binding.
- Added Git/ARDS evidence under `inventory/evidence/git/sst-chatbot.md`.
- Added app documentation under `docs/apps/sst-chatbot.md`.
- Added cross-repo handoff documentation under
  `docs/cross-repo/sst-chatbot-orchestrator-handoff.md`.
- Added inbound capability
  `specs/capabilities/inbound/4uentes-orchestor--sst-chatbot-agent-handoff.yaml`.
- Linked the capability in `state/capability-links.yaml`.
- Updated `state/features/sst-chatbot.current.yaml`.

## Child Repo Validation

The child repo check passed:

- ARDS/SDD check passed.
- Pytest collected 45 tests.
- 45 tests passed.

## Remaining Gap

The child repo still needs explicit `orchestrator_link` metadata adoption before
the catalog contract can move from `pending-child-adoption` to `adopted`.
