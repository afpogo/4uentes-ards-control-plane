# CR-SST-0002 - Cross-Repo Capabilities Handoff Map

Observed at: 2026-05-18

## Canonical Flow

```text
sst-bend backend-api
  outbound dictionary capability
    -> 4uentes-auth shared-auth-provider/BFF
      inbound from sst-bend
      outbound BFF facade
        -> sst-fend frontend-web inbound
        -> sst-extension frontend-extension inbound optional
```

The canonical service identity is `4uentes-auth`. The local/legacy producer or repo label `node-auth` appears in child repo capability artifacts for compatibility and must not become the canonical service identity in the control-plane catalog.

## Capability Families

| Capability | Producer | Producer artifact | BFF adoption | BFF facade | Consumers |
|---|---|---|---|---|---|
| `dictionary-legacy-read` | `sst-bend` | `sst-bend:specs/capabilities/outbound/dictionary-legacy-read.yaml` | `4uentes-auth:specs/capabilities/inbound/sst-bend--dictionary-legacy-read.yaml` | `4uentes-auth:specs/capabilities/outbound/dictionary-legacy-read.yaml` | `sst-fend` implemented; `sst-extension` draft/no functional wiring |
| `dictionary-domain-read-v1` | `sst-bend` | `sst-bend:specs/capabilities/outbound/dictionary-domain-read-v1.yaml` | `4uentes-auth:specs/capabilities/inbound/sst-bend--dictionary-domain-read-v1.yaml` | `4uentes-auth:specs/capabilities/outbound/dictionary-domain-read-v1.yaml` | `sst-fend` implemented; `sst-extension` covered by dictionary management subset where applicable |
| `dictionary-domain-management-v1` | `sst-bend` | `sst-bend:specs/capabilities/outbound/dictionary-domain-management-v1.yaml` | `4uentes-auth:specs/capabilities/inbound/sst-bend--dictionary-domain-management-v1.yaml` | `4uentes-auth:specs/capabilities/outbound/dictionary-domain-management-v1.yaml` | `sst-fend` implemented; `sst-extension` implemented optional-active |
| `dictionary-domain-v1` | `sst-bend` | `sst-bend:specs/capabilities/outbound/dictionary-domain-v1.yaml` | Conceptual/seed capability | Not a primary current facade | Used as target-state/context, not as the execution gate |
| `article-tags` | `sst-bend` | `sst-bend:specs/capabilities/outbound/article-tags.yaml` | TODO/not part of CR-SST-0002 validation | TODO | Adjacent tag capability; not promoted as CR-SST-0002 completion evidence |

## Consumer Artifacts

### sst-fend

- `sst-fend:specs/capabilities/inbound/node-auth--dictionary-legacy-read.yaml`
- `sst-fend:specs/capabilities/inbound/node-auth--dictionary-domain-read-v1.yaml`
- `sst-fend:specs/capabilities/inbound/node-auth--dictionary-domain-management-v1.yaml`
- `sst-fend:docs/capabilities/inbound/node-auth--dictionary-legacy-read.md`
- `sst-fend:docs/capabilities/inbound/node-auth--dictionary-domain-read-v1.md`
- `sst-fend:docs/capabilities/inbound/node-auth--dictionary-domain-management-v1.md`

### sst-extension

- `sst-extension:specs/integration/inbound/node-auth--dictionary-domain-management-v1.yaml`
- `sst-extension:docs/integration/inbound/node-auth--dictionary-domain-management-v1.md`
- `sst-extension:specs/integration/inbound/node-auth--dictionary-legacy-read.yaml`
- `sst-extension:docs/integration/inbound/node-auth--dictionary-legacy-read.md`

## Current Adoption Status

| Edge | Status | Evidence |
|---|---|---|
| `sst-bend -> 4uentes-auth` dictionary legacy read | implemented | BFF inbound capability and route proxy exist. |
| `sst-bend -> 4uentes-auth` dictionary domain read | implemented | BFF inbound capability and route proxy exist. |
| `sst-bend -> 4uentes-auth` dictionary management | implemented | BFF inbound capability and route proxy exist. |
| `4uentes-auth -> sst-fend` dictionary legacy/domain/management | implemented | Frontend inbound capabilities, service layer, Redux and UI tests exist. |
| `4uentes-auth -> sst-extension` dictionary management | implemented optional-active | Extension feature/integration specs, messages, gateway and tests/build passed. |
| `4uentes-auth -> sst-extension` dictionary legacy | draft/no functional wiring | Documented as not wired functionally. |
| `sst-4uentes-infra -> SST services` deployment governance | partial/blocked | Deployment contracts exist, but local kube/GitOps checks are blocked by environment access. |

## Gate 4 Conclusion For Capabilities

The dictionary handoff is modeled and locally validated for the main path:

```text
sst-bend -> 4uentes-auth -> sst-fend
```

The optional extension path is also modeled and validated for dictionary management:

```text
sst-bend -> 4uentes-auth -> sst-extension
```

Do not close `article-tags`, translations/aliases, final encryption-at-rest, offline mode, or extension account-context wiring as completed by this request. They require separate requests.
