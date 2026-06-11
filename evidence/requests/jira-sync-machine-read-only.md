# Dry Run De Maquina Jira Backlog Sync

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0036
- Machine: `state/jira-backlog-sync-machine.yaml`
- Mode: `read-only`
- Transiciones declaradas: 13
- Eventos aplicados: 5
- Estado final: `ready-for-approval`
- Jira MCP: conectado para lectura
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

## Acciones Read-Only Ejecutadas

### generate_jira_payload_dry_run

- Script: `scripts/jira-mcp/generate-dry-run.js`
- Resultado: PASS
- Salida:

```text
OK: Config source: environments/local/jira-mcp.local.example.yaml
OK: Jira board: SST-Team
OK: Jira project key: SST
OK: Issue type: Tarea
OK: Non-done feature states: 9
OK: Dry-run evidence written: evidence/requests/ticket-payload-dry-run.md
```

### run_policy_check

- Script: `scripts/jira-mcp/policy-check.js`
- Resultado: PASS
- Salida:

```text
OK: Request: CR-SST-0036
OK: Jira board: SST-Team
OK: Jira project key: SST
OK: Issue type: Tarea
OK: Policy check result: PASS
OK: Feature payloads checked: 9
OK: Evidence written: evidence/requests/jira-policy-check-summary.md
```

### read_jira_metadata

- Script: `scripts/jira-mcp/read-metadata.js`
- Resultado: PASS
- Salida:

```text
OK: Project key: SST
OK: Issue type expected: Tarea
OK: Issue type found: yes
OK: Evidence written: evidence/requests/jira-required-fields-summary.md
```

### search_jira_duplicates

- Script: `scripts/jira-mcp/search-duplicates.js`
- Resultado: PASS
- Salida:

```text
OK: Duplicate search items: 9
OK: Duplicates found: 9
OK: Evidence written: evidence/requests/duplicate-search-summary.md
```

### reconcile_jira_issues

- Script: `scripts/jira-mcp/reconcile-existing-issues.js`
- Resultado: PASS
- Salida:

```text
OK: Jira issues inspected: 8
OK: Feature states reconciled: 9
OK: Exact summary matches: 8
OK: Evidence written: evidence/requests/jira-reconciliation-summary.md
```


## Decision

La maquina declarativa puede ejecutar el camino read-only hasta `ready-for-approval`. Las acciones de escritura externa quedan fuera de este runner.
