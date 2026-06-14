# CR-SST-0065 - Changed Files Summary

Observed at: 2026-06-12

## 4uentes-orchestor

- `requests/inbox/CR-SST-0065-child-contract-binding-adoption.yaml`
- `requests/planned/CR-SST-0065-child-contract-binding-adoption.yaml`
- `evidence/requests/CR-SST-0065/intake-and-execution-notes.md`
- `evidence/requests/CR-SST-0065/sst-fend-child-sync-diff.yaml`
- `evidence/requests/CR-SST-0065/sst-bend-child-sync-diff.yaml`
- `evidence/requests/CR-SST-0065/validation-results.md`
- `evidence/requests/CR-SST-0065/changed-files-summary.md`

## sst-fend

Added by this request:

- `specs/ards/contract-binding.yaml`
- `specs/features/00-index.yaml`
- `specs/states/00-index.yaml`
- `specs/00-index.yaml`
- `docs/architecture/README.md`

Pre-existing unrelated changes were observed in UI styles and capability docs.
They were not reverted or edited by this request.

## sst-bend

Added by this request:

- `specs/ards/contract-binding.yaml`
- `specs/00-index.yaml`

## Core

No files were modified in `4uentes-ards-core` by this request. The core was
later observed clean at commit `2ad4e0f`, which is now used as the binding
`core_ref`.
