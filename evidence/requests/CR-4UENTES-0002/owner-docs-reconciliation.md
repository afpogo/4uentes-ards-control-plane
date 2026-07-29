# Owner Docs Reconciliation - CR-4UENTES-0002

## Purpose

Reconcile `4uentes-portfolio` owner ARDS/SDD documentation with the
control-plane scope partition recorded in `CR-4UENTES-0001`.

## Updated Owner Docs

- `4uentes-portfolio/docs/integration/4uentes-control-plane.md`
- `4uentes-portfolio/specs/ards/contract-binding.yaml`

## Boundary

This is documentation-only. No runtime, dependency, deployment, routing, or
product-code behavior is in scope.

## Expected Reconciliation

- Remove stable-doc dependency on workstation absolute paths.
- Replace obsolete local binding example reference with the actual control-plane
  local binding path.
- Reference `CR-4UENTES-0001`, `CR-4UENTES-0002`, and
  `multi-solution-scope-partition` as the current non-SST integration track.
- Preserve the child repo as `frontend-web`, not a control-plane.

## Result

Completed. The child repo owner docs now reference the current control-plane
request lifecycle and feature state, preserve the non-SST scope boundary, and
avoid stable documentation dependency on local workstation paths.
