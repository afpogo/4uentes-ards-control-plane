# CR-SST-0019 - Validation Results

Observed on: 2026-05-28

## 4uentes-orchestor

Planner command:

```powershell
npm run plan:change -- requests/inbox/CR-SST-0019-agentic-model-deployment-policy.yaml
```

Result:

- Planned request generated successfully.
- Affected services: `4uentes-auth`, `sst-fend`, `sst-bend`,
  `sst-extension`, `sst-chatbot`, `sst-4uentes-infra`.
- Risk: high.
- Planned output includes `task_weight`, `model_selection`, and
  `subagent_deployment_plan`.

Full check:

```powershell
npm run check
```

Result:

- Passed.
- Catalog validation passed with 0 failures.
- Local binding validation passed with 0 failures.
- State model validation passed with 0 failures.
- 5 pre-existing warnings remain for older state files without complete
  request/evidence refs.

## 4uentes-auth / node-auth

Command:

```powershell
npm run check
```

Result:

- Passed.
- `[ARDS CHECK] OK`

## sst-fend

Command:

```powershell
npm run check
```

Result:

- Passed.
- Build compiled successfully.
- 24 test suites passed.
- 142 tests passed.
- 22 existing React hook warnings remain.

## sst-bend

Command:

```powershell
npm run check
```

Result:

- Exit code 0.
- `[ARDS CHECK] OK`
- Protected smoke coverage remains partial because `SMOKE_JWT` was not set.

## sst-extension

Command:

```powershell
pnpm run check
```

Result:

- Baseline check passed.
- 19 test files passed.
- 78 tests passed.
- Production build completed.

## sst-chatbot

Command:

```powershell
.\\.venv\\Scripts\\python.exe scripts\\check.py
```

Result:

- ARDS/SDD check passed.
- 45 pytest tests passed.
- Repository check passed.

## sst-4uentes-infra

Planner result:

- `required_checks.command: TODO`
- `fallback: manual-review`

Reason:

- The service catalog currently does not define an automated check command for
  this repo.
