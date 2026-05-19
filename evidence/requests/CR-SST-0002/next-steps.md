# CR-SST-0002 - Next Steps

## Recommended Next Phase

Fase 4 should remain request-controlled and ARDS/evidence-first. Do not modify product runtime until the control-plane can record the exact affected services, intended artifacts, validation commands, and approval decision.

## Before Fase 4

1. Create `environments/local/bindings.local.yaml` locally, ignored by Git, so future runs do not depend on inventory paths.
2. Decide whether `translations` and `aliases` are part of dictionary runtime v1 or deferred target-state.
3. Split `security/offline/encryption` into separate requests:
   - secure masking/reveal and owner-role behavior;
   - encryption-at-rest policy;
   - offline/server isolation model.
4. Decide whether extension account context is in scope before enabling `x-active-account-id` from `sst-extension`.

## Suggested Fase 4 Validation Targets

- `sst-bend`: targeted dictionary Stage 2/Stage 3 tests if safe in local environment.
- `4uentes-auth`: BFF dictionary pass-through checks.
- `sst-fend`: dictionary action/slice/page tests.
- `sst-extension`: dictionary gateway/service/message tests.
- `sst-4uentes-infra`: manual review or future infra check command, because catalog currently has `check_command: TODO`.

## Accepted Warnings

- `environments/local/bindings.local.yaml` is missing.
- Functional repo working trees were observed dirty in Phase 0 for `sst-bend`, `sst-fend`, `sst-extension`, and `sst-4uentes-infra`.
- `sst-extension` is optional-active and in bootstrap Git state.
- `sst-4uentes-infra` has no check command in the catalog.
- This dry-run did not validate live endpoints.

## Do Not Do Yet

- Do not move CR-SST-0002 to `done`.
- Do not create specs in functional repos from this dry-run.
- Do not refactor dictionary runtime.
- Do not infer encryption/offline implementation from security documentation.
