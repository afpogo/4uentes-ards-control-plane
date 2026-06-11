# Resultados De Validacion

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0047
- Resultado general: PASS
- Escritura Jira ejecutada: no

## Checks Ejecutados

```powershell
node --check scripts/jira-mcp/backlog-review.js
npm.cmd run jira:mcp:backlog-review -- --request-id CR-SST-0047 --output-dir evidence/requests/CR-SST-0047
npm.cmd run check
```

Resultado:

- PASS
- Backlog items: 6
- Items con `assigned_cr_sst`: 0
- Items con `jira_issue_key`: 0
- Findings: 0
- Escrituras Jira: 0
- Transiciones locales automaticas: 0
- Catalog summary: 5 OK, 0 WARN, 0 FAIL
- Local bindings summary: 28 OK, 6 WARN, 0 FAIL
- State model summary: 22 OK, 5 WARN, 0 FAIL

## Warnings No Resueltos

Los warnings observados no fueron introducidos por CR-SST-0047:

- remotes de repos hijos no observables;
- algunos bugfix states sin `request_ids` o `evidence_refs`;
- `document-agent` sin `evidence_refs` para estado no terminal.
