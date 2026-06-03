# CR-SST-0017 - Local Bindings, Git Evidence, And App Docs

Observed on: 2026-05-26

## Summary

The control plane now has complete local bindings for:

- `4uentes-ards-core`
- `4uentes-auth`
- `sst-fend`
- `sst-bend`
- `sst-extension`
- `sst-chatbot`
- `sst-4uentes-infra`

The local bindings file remains ignored by Git:

```text
environments/local/bindings.local.yaml
```

## Git Evidence Added Or Refreshed

- `inventory/evidence/git/4uentes-ards-core.md`
- `inventory/evidence/git/4uentes-auth.md`
- `inventory/evidence/git/sst-bend.md`
- `inventory/evidence/git/sst-fend.md`
- `inventory/evidence/git/sst-extension.md`
- `inventory/evidence/git/sst-4uentes-infra.md`
- `inventory/evidence/git/sst-chatbot.md`

## App Documentation Added

- `docs/apps/4uentes-ards-core.md`
- `docs/apps/4uentes-auth.md`
- `docs/apps/sst-bend.md`
- `docs/apps/sst-fend.md`
- `docs/apps/sst-extension.md`
- `docs/apps/sst-4uentes-infra.md`
- `docs/apps/sst-chatbot.md`

## Catalog Metadata Refreshed

Observed Git metadata was refreshed for:

- `catalog/services/4uentes-auth.yaml`
- `catalog/services/sst-bend.yaml`
- `catalog/services/sst-fend.yaml`
- `catalog/services/sst-extension.yaml`
- `catalog/services/sst-4uentes-infra.yaml`

`4uentes-ards-core` remains outside `catalog/services` because it is the
standard source consumed by this control plane, not an SST product service.
