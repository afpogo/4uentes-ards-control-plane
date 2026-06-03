# sst-extension

## Catalog Role

`sst-extension` is the optional SST browser extension runtime. It supports
extension-based SST workflows while remaining separate from the web frontend.

The control plane catalogs it as:

- service: `sst-extension`
- service kind: `browser-extension`
- ARDS kind: `frontend-extension`
- solution: `sst`
- status: `optional-active`

## Source Refs

- Catalog: `catalog/services/sst-extension.yaml`
- Local binding: `environments/local/bindings.local.yaml`
- Git evidence: `inventory/evidence/git/sst-extension.md`
- State links: `state/capability-links.yaml`

## Observed Responsibilities

- Owns Manifest V3 extension runtime behavior.
- Owns popup, background, side panel/options, storage, and messaging boundaries.
- Participates in quick-save, sessions, dictionary, and text-article-pdf flows.
- Delegates auth and ingestion boundaries to `4uentes-auth`.

## Control Plane Boundary

`sst-extension` is optional-active. It should be included in impact analysis when
requests affect extension-visible SST flows, but it is not required for the
default SST service baseline.
