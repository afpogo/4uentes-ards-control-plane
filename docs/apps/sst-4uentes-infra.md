# sst-4uentes-infra

## Catalog Role

`sst-4uentes-infra` is the SST GitOps infrastructure repository. It owns desired
Kubernetes and Argo CD state for SST deployment targets.

The control plane catalogs it as:

- service: `sst-4uentes-infra`
- service kind: `gitops-infrastructure`
- ARDS kind: `infra-gitops`
- solution: `sst`
- status: `active`

## Source Refs

- Catalog: `catalog/services/sst-4uentes-infra.yaml`
- Local binding: `environments/local/bindings.local.yaml`
- Git evidence: `inventory/evidence/git/sst-4uentes-infra.md`
- Cluster dependency map: `docs/cross-repo/sst-cluster-dependency-map.md`

## Observed Responsibilities

- Owns Argo CD and Kustomize desired state.
- Models Kubernetes workloads for `sst-fend`, `sst-bend`, and `4uentes-auth`.
- Owns environment and deployment manifests for the SST cluster path.
- Participates in Kubernetes, Argo CD, and kind deployment targets.

## Control Plane Boundary

This repo controls desired infrastructure state. Functional application runtime
changes belong in the application repos, not here.

The catalog still records `validation.check_command: TODO`; until that is
resolved, validation requires manual infra review or a concrete Kustomize check.
