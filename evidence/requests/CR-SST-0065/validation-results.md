# CR-SST-0065 - Validation Results

Observed at: 2026-06-12

| Repo | Command | Result | Notes |
| --- | --- | --- | --- |
| `4uentes-ards-core` | `npm.cmd run mcp:build` | PASS | `tsc` completed. |
| `4uentes-ards-core` | `npm.cmd run mcp:smoke` | PASS | `ards.get_sync_contract` available; `latest` resolves to `ards-core-contract-v0.1`. |
| `4uentes-ards-core` | `npm.cmd run check` | PASS | `Total Errors: 0`; `Total Warnings: 0`. |
| `sst-fend` | `npm.cmd run check` | PASS | `[ARDS CHECK] OK`; webpack compiled; 24 suites / 142 tests passed; 22 React hook warnings. Re-run after index update also passed. |
| `sst-bend` | `npm.cmd run check` | PASS_WITH_WARNINGS | Exit code 0 and `[ARDS CHECK] OK`; protected smoke coverage remains partial without `SMOKE_JWT` or `SMOKE_JWT_OWNER`. Re-run after index update also passed. |

## Blocking Note

The original blocker was resolved after `4uentes-ards-core` was observed clean
at commit `2ad4e0f`. Child bindings now use `4uentes-ards-core@2ad4e0f`, and
both child sync reports are `synced`.
