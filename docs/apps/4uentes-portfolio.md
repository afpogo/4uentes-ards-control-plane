# 4uentes Portfolio

## Catalog Role

`4uentes-portfolio` is the public professional portfolio frontend for Andres Pogo Fuentes under the 4uentes company context. It presents professional narrative, services intent, code evidence, certificates, CV, and employer/client contact paths.

The control plane catalogs it as:

- service: `4uentes-portfolio`
- service kind: `frontend-spa`
- ARDS kind: `frontend-web`
- solution: `4uentes`
- status: `active`

## Source Refs

- Catalog: `catalog/services/4uentes-portfolio.yaml`
- Local binding: `environments/local/bindings.local.yaml`
- Git evidence: `inventory/evidence/git/4uentes-portfolio.md`
- Local ARDS/SDD binding: `specs/ards/contract-binding.yaml` in the child repo

## Observed Responsibilities

- Owns static public portfolio UI and content presentation.
- Owns professional evidence surfaces: projects, skills, certificates, CV, contact paths, and narrative.
- Does not own backend, BFF, auth, SST runtime, or company-wide control-plane rules.
- May later use GitHub MCP as an editorial or build-time evidence enrichment source after owner review.

## Control Plane Boundary

The portfolio is governed as a child repo by `4uentes-orchestor`. It can propose evidence/status through local `orchestrator_link` metadata, but the control-plane remains authoritative for requests, state, catalog, and cross-repo reconciliation.

## Scope Partition

`4uentes-portfolio` belongs to the `4uentes` solution, not to `sst`.

Its integration scope is public professional presentation and curated evidence
for the user. It must not inherit SST roadmap, SST runtime responsibilities, or
SST deployment assumptions unless a future request explicitly defines a shared
capability or dependency.

Related control-plane rule:

- [control-plane-scope-partition.md](../cross-repo/control-plane-scope-partition.md)
