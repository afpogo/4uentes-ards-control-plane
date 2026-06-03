# AI Policy

## Anti-hallucination rules

- Do not invent services, repos, dependencies, remotes, or paths.
- If information is missing, write `TODO`.
- Read the catalog and solution files before planning changes.
- Use `4uentes-ards-core` as the source for ARDS kinds and profiles.
- Do not redefine the core standard inside the control-plane.

## Functional repo boundary

Do not modify functional repositories without an approved request and plan.

Functional repositories include, but are not limited to:

- `4uentes-auth`
- `sst-fend`
- `sst-bend`
- `sst-extension`
- `sst-4uentes-infra`

## Identity rules

- Do not use absolute local paths as service identity.
- Do not treat legacy aliases as canonical identity.
- `node-auth` is a legacy/local alias of `4uentes-auth`.
- `service_id` and `canonical_identity` are the stable identity fields.

## Local paths

Absolute paths may appear only in:

- `inventory/` evidence
- ignored `environments/local/bindings.local.yaml`

They must not appear in `catalog/` or `solutions/`.

## Model selection annex

Model and subagent selection is documented in
`docs/ai/model-selection-policy.md`. This annex complements these AI rules and
does not redefine ARDS/SDD contracts.
