# sst-bend

## Catalog Role

`sst-bend` is the SST backend API. It owns SST domain behavior, persisted data
contracts, migrations, and backend capabilities consumed through the auth/BFF
boundary and other SST participants.

The control plane catalogs it as:

- service: `sst-bend`
- service kind: `api`
- ARDS kind: `backend-api`
- solution: `sst`
- status: `active`

## Source Refs

- Catalog: `catalog/services/sst-bend.yaml`
- Local binding: `environments/local/bindings.local.yaml`
- Git evidence: `inventory/evidence/git/sst-bend.md`
- State links: `state/capability-links.yaml`

## Observed Responsibilities

- Owns SST API behavior and backend domain workflows.
- Owns backend data model and migration artifacts.
- Publishes backend capabilities such as dictionary/tags governance.
- Participates in local, Docker Compose, and Kubernetes deployment targets.

## Control Plane Boundary

Requests that modify `sst-bend` must be planned before repo changes. The current
working tree is dirty and has one stash, so observed Git state must not be
treated as a clean baseline.
