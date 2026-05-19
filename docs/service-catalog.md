# Service Catalog

## Service

A service is a logical unit that the control-plane can catalog, validate, and
reference from a solution.

A service may be a frontend, backend API, BFF, browser extension, shared auth
provider, or infrastructure governance repo.

## Minimum fields

Each `catalog/services/*.yaml` should include:

- `service_id`
- `canonical_identity`
- `kind`
- `status`
- `repo.remote` or explicit `TODO`
- `ards.kind`
- `ards.status`
- `validation.check_command` or explicit `TODO`

## Identity terms

- `service_id`: stable logical identity used by the control-plane.
- `repo.remote`: Git remote observed or expected for the canonical repo.
- `local_binding`: host-specific path resolved outside the stable catalog.
- `legacy_alias`: historical name that must not become canonical identity.

## Path rule

Stable catalog files must not contain absolute local paths. Local paths belong
only in `environments/local/bindings.local.yaml` or `inventory/` evidence.

## ARDS kind

`ards.kind` must match a kind from `4uentes-ards-core`:

- `backend-api`
- `backend-bff`
- `frontend-web`
- `frontend-extension`
- `infra-gitops`
- `shared-auth-provider`
