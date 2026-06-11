# Jira Sync Doctor

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0038
- Mode: `read-only`
- Escritura Jira: no
- Jira project key: `SST`
- Jira board: `SST-Team`

## Feature States

- Total: 14
- Done: 5
- No done: 9
- runtime-partial: 2
- implemented-local: 4
- ards-documented: 1
- validated-local: 1
- validated-live: 1

## Comandos Jira MCP

- Total package scripts: 10
- Read-only/local: 7
- External write: 2
- Legacy/special: 1

### External Write Commands

- `jira:mcp:update-existing`: `node scripts/jira-mcp/update-existing-issues.js`
- `jira:mcp:create`: `node scripts/jira-mcp/create-issues.js`

## Maquina

- Definition: `state/jira-backlog-sync-machine.yaml`
- Definition status: `draft`
- Updated at: `2026-06-06`
- Last observed run: `ready-for-approval` via evidence/requests/CR-SST-0036/jira-sync-machine-read-only.md

## Reconciliacion Jira

- Evidence found: si
- Evidence ref: `evidence/requests/CR-SST-0036/jira-reconciliation-results.json`
- Issues observed: 8
- Feature states reconciled: 9

## Correction Plan Preview

- Proposed description updates: 8
- Proposed issue creates: 1
- No action: 0
- Blocked: 0
- Applied to Jira: no

## Lifecycle Snapshot

- CR-SST-0034: inbox=si, planned=si
- CR-SST-0035: inbox=si, planned=si
- CR-SST-0036: inbox=si, planned=si
- CR-SST-0037: inbox=si, planned=si
- CR-SST-0038: inbox=si, planned=si

## Findings

- WARNING WRITE_COMMANDS_EXPOSED: External write commands are present and must remain behind explicit approval.
- INFO MACHINE_NOT_ACTIVE: Machine definition status is draft.
- INFO REQUEST_EXISTS_IN_INBOX_AND_PLANNED: CR-SST-0034 exists in both inbox and planned lifecycle folders.
- INFO REQUEST_EXISTS_IN_INBOX_AND_PLANNED: CR-SST-0035 exists in both inbox and planned lifecycle folders.
- INFO REQUEST_EXISTS_IN_INBOX_AND_PLANNED: CR-SST-0036 exists in both inbox and planned lifecycle folders.
- INFO REQUEST_EXISTS_IN_INBOX_AND_PLANNED: CR-SST-0037 exists in both inbox and planned lifecycle folders.
- INFO REQUEST_EXISTS_IN_INBOX_AND_PLANNED: CR-SST-0038 exists in both inbox and planned lifecycle folders.

## Decision

El doctor queda limitado a diagnostico, verificacion y preview de correccion. Las escrituras Jira deben ejecutarse en una fase separada con aprobacion explicita.
