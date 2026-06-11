# Analisis De Acceso MCP Y Salud De Sincronizacion

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0043
- Escritura Jira ejecutada: no
- Feature states modificados: no
- Repos funcionales modificados: no

## Contexto

CR-SST-0042 implemento un dry-run de propuestas de transicion a partir de
observaciones Jira. El siguiente problema es saber si Jira y el control-plane
estan sincronizados cuando una persona mueve tickets en `SST-Team`.

## Decision

CR-SST-0043 define el acceso MCP en tres niveles:

1. MCP read/search para observar Jira y generar evidencia.
2. Propuestas locales sin conexion externa.
3. Escritura aprobada por writer/gateway o comandos explicitamente aprobados.

## Resultado Del Contrato

El contrato queda documentado en:

- `docs/requests/jira-mcp-access-sync-health-contract.md`

El futuro comando recomendado es:

```powershell
npm.cmd run jira:mcp:sync-health -- --request-id CR-SST-0044 --input-dir evidence/requests/CR-SST-0042 --output-dir evidence/requests/CR-SST-0044
```

## Estados De Salud Definidos

- `IN_SYNC`
- `MISSING_JIRA`
- `ORPHAN_JIRA`
- `DUPLICATE_JIRA`
- `DESCRIPTION_DRIFT`
- `LABEL_DRIFT`
- `STATUS_SIGNAL_PENDING`
- `CLOSURE_CONFLICT`
- `LOCAL_DONE_PENDING_JIRA`
- `STALE_OBSERVATION`
- `WRITE_APPROVAL_REQUIRED`

## Limites

CR-SST-0043 no implementa `sync-health`. Solo define el contrato, las fronteras
de acceso y la evolucion recomendada.

