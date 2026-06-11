# Dry Run De Maquina Jira Backlog Sync

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0035
- Machine: `state/jira-backlog-sync-machine.yaml`
- Mode: `dry-run`
- Transiciones declaradas: 13
- Eventos aplicados: 5
- Estado final: `ready-for-approval`
- Jira MCP: no conectado
- Escritura Jira: no

## Trace

- `idle` --`BACKLOG_SYNC_REQUESTED`--> `collecting-control-plane-state`
  - Actions: `collect_feature_states`, `collect_request_lifecycle`
- `collecting-control-plane-state` --`CONTROL_PLANE_STATE_COLLECTED`--> `policy-checking`
  - Actions: `generate_jira_payload_dry_run`, `run_policy_check`
- `policy-checking` --`POLICY_CHECK_PASSED`--> `reading-jira-metadata`
  - Guards: `policy_passed`, `no_secret_material`
- `reading-jira-metadata` --`JIRA_METADATA_CONFIRMED`--> `reconciling-jira`
  - Actions: `search_jira_duplicates`
- `reconciling-jira` --`JIRA_DUPLICATES_SEARCHED`--> `ready-for-approval`
  - Guards: `no_duplicate_conflict`

## Decision

La maquina declarativa puede ejecutar el camino read-only hasta `ready-for-approval`. Las acciones de escritura externa quedan fuera de CR-SST-0035.
