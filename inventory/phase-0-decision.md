# Gate 0 Decision - Phase 0 Bootstrap

Observed at: 2026-05-17
Decision status: accepted-with-warnings

## Decision

The initial 4uentes ARDS/SDD control-plane catalog is accepted for Phase 0.

The stable catalog models logical identities only. Local absolute paths remain
evidence in inventory files and must not be used as canonical configuration.

## Accepted catalog

| Service ID | Decision | Notes |
|---|---|---|
| `4uentes-auth` | accepted | Shared auth provider for SST and planned Fulbito |
| `sst-fend` | accepted | Required SST frontend SPA |
| `sst-bend` | accepted | Required SST API/backend |
| `sst-extension` | accepted optional | Real Manifest V3 runtime, not required by default |
| `sst-4uentes-infra` | accepted | GitOps/Kubernetes deployment governance |

## Gate confirmations

| Check | Result |
|---|---|
| `4uentes-auth` kind is `shared-auth-provider` | pass |
| `node-auth` is only a legacy/local alias, not canonical identity | pass |
| `sst-extension` is optional-active or equivalent | pass |
| `sst-4uentes-infra` is infra/GitOps/deployment governance | pass |
| Stable catalog contains no absolute local paths | pass |
| `solutions/sst.yaml` references existing services | pass |
| Service files include minimum required fields | pass |

## Accepted warnings

| Warning | Reason accepted |
|---|---|
| Dirty working trees observed for `sst-fend`, `sst-bend`, and `sst-4uentes-infra` | Phase 0 records evidence only and does not freeze those changes as stable baseline |
| `sst-extension` has no valid HEAD/initial commit | Runtime and ARDS/SDD exist locally, but Git bootstrap must be resolved later |
| `sst-4uentes-infra` has no check command captured | Infra validation will be handled by later verifier work |
| Absolute paths exist in inventory evidence | They are explicitly evidence-only and not stable catalog configuration |

## Not blockers for Phase 1

- Dirty working trees in functional repos.
- Missing initial commit for `sst-extension`.
- Missing automated verifier scripts in the control-plane.

## Phase 1 entry criteria

Phase 1 may start with verifier implementation:

1. `verify-catalog` for YAML parsing, required fields, and solution references.
2. `verify-local-bindings` for evidence-only local path checks.
3. Request modeling after catalog checks are deterministic.
