# sst-fend

## Catalog Role

`sst-fend` is the SST frontend web SPA. It owns web UI flows and consumes backend
behavior through the observed `4uentes-auth` BFF/API boundary.

The control plane catalogs it as:

- service: `sst-fend`
- service kind: `frontend-spa`
- ARDS kind: `frontend-web`
- solution: `sst`
- status: `active`

## Source Refs

- Catalog: `catalog/services/sst-fend.yaml`
- Local binding: `environments/local/bindings.local.yaml`
- Git evidence: `inventory/evidence/git/sst-fend.md`
- State links: `state/capability-links.yaml`

## Observed Responsibilities

- Owns SST web application UI.
- Consumes auth and domain APIs through `4uentes-auth`.
- Owns article, dashboard, modal, finder, and frontend store behavior observed in the current working tree.
- Participates in local, Docker Compose, and Kubernetes deployment targets.

## Control Plane Boundary

Direct backend-api consumption from the frontend is an architecture exception
and must be documented explicitly. The current preferred path remains backend
API to auth/BFF to frontend.
