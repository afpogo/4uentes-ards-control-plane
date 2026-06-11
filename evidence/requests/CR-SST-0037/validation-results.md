# Resultados De Validacion

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0037
- Resultado general: PASS
- Escritura Jira ejecutada: no

## Checks Ejecutados

### Sintaxis JS

Comando:

```powershell
Get-ChildItem scripts\jira-mcp -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

Resultado:

- PASS
- Sin errores de sintaxis reportados.

### Doctor Read-Only

Comando:

```powershell
npm.cmd run jira:mcp:doctor -- --request-id CR-SST-0037 --output-dir evidence/requests/CR-SST-0037 --mode read-only
```

Resultado:

- PASS
- Feature states total: 14
- Feature states no done: 9
- Correction actions proposed: 8
- Correction actions blocked: 1
- External Jira write: no

### Policy Check

Comando:

```powershell
npm.cmd run jira:mcp:policy-check -- --request-id CR-SST-0037 --output-dir evidence/requests/CR-SST-0037 --expected-count 9
```

Resultado:

- PASS
- Feature payloads checked: 9
- Evidence: `evidence/requests/CR-SST-0037/jira-policy-check-summary.md`

### Control-Plane Check

Comando:

```powershell
npm.cmd run check
```

Resultado:

- PASS
- Catalog summary: 5 OK, 0 WARN, 0 FAIL
- Local bindings summary: 28 OK, 6 WARN, 0 FAIL
- State model summary: 22 OK, 5 WARN, 0 FAIL

## Warnings No Resueltos

Los warnings observados no fueron introducidos por CR-SST-0037:

- remotes de repos hijos no observables;
- algunos bugfix states sin `request_ids` o `evidence_refs`;
- `document-agent` sin `evidence_refs` para estado no terminal.
