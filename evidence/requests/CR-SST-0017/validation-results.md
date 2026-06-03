# CR-SST-0017 - Validation Results

Observed on: 2026-05-26

## 4uentes-orchestor

Command:

```powershell
npm run check
```

Result:

- Catalog validation passed: 6 service files, 1 solution file, 0 warnings, 0 failures.
- Local binding validation passed: 34 OK, 0 warnings, 0 failures.
- State model validation passed: 17 OK, 5 warnings, 0 failures.

Validated local bindings:

- `4uentes-ards-core`
- `4uentes-auth`
- `sst-fend`
- `sst-bend`
- `sst-extension`
- `sst-chatbot`
- `sst-4uentes-infra`

Warnings were pre-existing state evidence gaps:

- `state/bugfixes/login-504-proxy-timeout.current.yaml` has no request/evidence refs.
- `state/bugfixes/sst-bend-emfile-watchers.current.yaml` has no request/evidence refs.
- `state/features/document-agent.current.yaml` has no evidence refs for `implemented-local`.
