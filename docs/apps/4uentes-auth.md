# 4uentes-auth

## Catalog Role

`4uentes-auth` is the shared auth and BFF boundary used by SST and planned
Fulbito flows. The local folder is still named `node-auth`, but that name is a
legacy alias and not the canonical service identity.

The control plane catalogs it as:

- service: `4uentes-auth`
- service kind: `shared-auth-provider`
- ARDS kind: `shared-auth-provider`
- solutions: `sst`, `fulbito`
- status: `active`

## Source Refs

- Catalog: `catalog/services/4uentes-auth.yaml`
- Local binding: `environments/local/bindings.local.yaml`
- Git evidence: `inventory/evidence/git/4uentes-auth.md`
- State links: `state/capability-links.yaml`

## Observed Responsibilities

- Owns identity/auth gateway behavior.
- Provides BFF/API boundary observed by `sst-fend` and `sst-extension`.
- Forwards SST domain traffic toward `sst-bend` where modeled.
- Participates in local, Docker Compose, and Kubernetes deployment targets.

## Control Plane Boundary

The control plane treats `node-auth` only as legacy evidence. New requests,
states, and capabilities should use `4uentes-auth`.

Functional changes in this repo still require an approved request and plan.
