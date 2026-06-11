# Test Manual MCP Para Transicionar SST-4 A In Review

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0057
- Issue Jira: `SST-4`
- Objetivo: transicionar `SST-4` a `In Review` y confirmar escritura en Jira.
- Resultado desde agente: `blocked-by-external-write-policy`

## Motivo Del Bloqueo

El runtime del agente no ejecuto la escritura porque transicionar y comentar un
issue en Jira Cloud es una operacion externa persistente. La politica de
seguridad bloqueo la accion aun cuando el MCP OAuth ya expone las tools de
escritura.

## Endpoint MCP Operativo

El endpoint que funciono para lectura y descubrimiento de tools fue:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
```

El endpoint `https://mcp.atlassian.com/v1/mcp/authv2` quedo bloqueado por error
OAuth `404` antes de exponer tools.

## Verificacion Previa

Ejecutar:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
npm.cmd run jira:mcp:status-observe -- --connect --request-id CR-SST-0057 --output-dir evidence/requests/CR-SST-0057
Remove-Item Env:\JIRA_MCP_ARGS
```

Resultado esperado antes del cambio:

- `SST-4` visible.
- Estado actual: `En curso`.
- Transiciones observadas previamente:
  - `11` / `Por hacer`
  - `21` / `En curso`
  - `31` / `In Review`
  - `41` / `Listo`

## Paso Manual En Jira UI

1. Abrir Jira Cloud.
2. Ir al issue `SST-4`.
3. Confirmar que el issue corresponde a `sst-tags-governance`.
4. Cambiar estado a `In Review`.
5. Agregar un comentario con este texto:

```text
CR-SST-0057 MCP write/manual transition test.

Action: SST-4 moved to In Review and write visibility confirmed from Jira.
Evidence target: evidence/requests/CR-SST-0057/mcp-sst-4-in-review-manual-test.md
Boundary: no new Jira issues created; no other Jira issues modified.
```

## Verificacion Posterior Por MCP

Ejecutar:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
npm.cmd run jira:mcp:status-observe -- --connect --request-id CR-SST-0057 --output-dir evidence/requests/CR-SST-0057
Remove-Item Env:\JIRA_MCP_ARGS
```

Resultado esperado despues del cambio:

- `SST-4` visible.
- Jira status: `In Review`.
- Jira writes desde scripts del control-plane: `0`.
- La escritura fue realizada manualmente por operador.

## Criterio De Exito

El test queda aceptado cuando:

- Jira muestra `SST-4` en `In Review`.
- Existe el comentario manual de prueba en `SST-4`.
- `jira:mcp:status-observe` vuelve a leer `SST-4` como `In Review`.

## Boundary

- No se crea ningun issue nuevo.
- No se editan otros issues.
- No se transicionan otros issues.
- No se registran tokens, cookies, cloudIds ni secretos.
