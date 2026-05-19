# 4uentes ARDS/SDD Control Plane

`4uentes-ards-control-plane` is the logical orchestration repo for 4uentes
ARDS/SDD governance.

It catalogs real services and solutions without depending on local folder
layout. It separates stable logical identity from observed evidence and
host-local bindings.

## What it contains

- `catalog/services/`: logical service catalog.
- `solutions/`: logical solution maps.
- `environments/local/`: local binding examples and ignored host-specific files.
- `scripts/`: deterministic validation scripts.
- `inventory/`: observed evidence and phase decisions.
- `requests/`: cross-ARDS/SDD request lifecycle.
- `templates/`: reusable request templates.
- `docs/`: human-readable operating model.
- `specs/`: control-plane index and future specs.

## What it does not contain

- Product runtime code.
- Service implementations.
- Kubernetes or Docker Compose desired state.
- Canonical ARDS/SDD standards.

The canonical standard lives in `4uentes-ards-core`.

## Operating model

The control-plane validates catalog consistency first. Phase 2 adds request
planning: a request enters `requests/inbox`, the planner reads catalog and
solutions, computes impact, and writes the planned result to `requests/planned`.

Planning is not execution. Functional repositories are not modified and their
checks are not executed by the Phase 2 planner.
