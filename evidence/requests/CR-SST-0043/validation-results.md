# Resultados De Validacion

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0043
- Resultado general: PASS
- Escritura Jira ejecutada: no

## Checks Ejecutados

```powershell
npm.cmd run check
```

Resultado:

- PASS
- Catalog summary: 5 OK, 0 WARN, 0 FAIL
- Local bindings summary: 28 OK, 6 WARN, 0 FAIL
- State model summary: 22 OK, 5 WARN, 0 FAIL

## Warnings No Resueltos

Los warnings observados no fueron introducidos por CR-SST-0043:

- remotes de repos hijos no observables;
- algunos bugfix states sin `request_ids` o `evidence_refs`;
- `document-agent` sin `evidence_refs` para estado no terminal.
