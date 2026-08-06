# CR-SST-0020 - Reconciliacion Orchestrator vs `sst-4uentes-infra`

Observed on: 2026-06-15

## Scope

Reconcile what the orchestrator states for cluster publication and extension
access against the current `sst-4uentes-infra` repository contracts and states.

## Matched items

- `http://localhost:8088` is already the approved local smoke origin in infra
  docs and deployment contracts.
- `sst-extension` is already modeled as a browser extension outside Kubernetes,
  with `node-auth` as BFF and `/api/*` routed through the configured base URL.
- The public development edge through ngrok is already represented in infra as
  a reserved HTTPS origin with GitHub OAuth and `host_header_rewrite: localhost`.
- `specs/states/prepare-public-development-url.yaml` is already marked
  `validated-live` and carries `orchestrator_link` metadata.

## Still-open items

- `production_public.required_base_url` remains `TODO` in the extension
  deployment contract.
- `staging` and `production` environment rows remain `TODO` in infra docs.
- `run-development-smoke` still records manual follow-up for extension/browser
  validation against both the local and public development origins.
- Ngrok durability as a Windows service remains deferred.
- Production release readiness still lacks a stable HTTPS origin and
  immutable image/tag promotion criteria.

## Reconciliation note

The control-plane documentation was slightly ahead of the repo only in the
release-grade areas above. The local development origin, public development
ngrok edge, and extension contract are already implemented in infra and should
be treated as confirmed, not speculative.

