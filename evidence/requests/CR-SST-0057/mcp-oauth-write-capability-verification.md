# Verificacion MCP OAuth De Capacidades Jira

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0057
- Modo: connect
- Endpoint funcional observado: `https://mcp.atlassian.com/v1/mcp`
- Endpoint configurado por default: `https://mcp.atlassian.com/v1/mcp/authv2`
- Resultado: `PARTIAL_PASS_WITH_WRITE_TOOLS_EXPOSED`

## Comandos Ejecutados

```powershell
npm.cmd run jira:mcp:verify -- --connect
```

Resultado con endpoint default:

- Resultado: `BLOCKED`
- Motivo: el proceso `mcp-remote` recibio un `404` HTML durante OAuth dynamic client registration contra `authv2`.
- Tools descubiertas: ninguna.

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
npm.cmd run jira:mcp:verify -- --connect
Remove-Item Env:\JIRA_MCP_ARGS
```

Resultado con override operativo:

- Resultado: `PARTIAL_PASS`
- Jira project key `SST`: visible.
- Confluence space key `SST`: no visible.
- Tools Jira descubiertas:
  - `getJiraIssue`
  - `createJiraIssue`
  - `editJiraIssue`
  - `getTransitionsForJiraIssue`
  - `transitionJiraIssue`
  - `addCommentToJiraIssue`
  - `searchJiraIssuesUsingJql`
  - `createIssueLink`
  - `addWorklogToJiraIssue`

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
npm.cmd run jira:mcp:metadata -- --connect --request-id CR-SST-0057 --output-dir evidence/requests/CR-SST-0057
Remove-Item Env:\JIRA_MCP_ARGS
```

- Project key: `SST`
- Issue type esperado: `Tarea`
- Issue type encontrado: si.

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
npm.cmd run jira:mcp:duplicates -- --connect --request-id CR-SST-0057 --output-dir evidence/requests/CR-SST-0057
npm.cmd run jira:mcp:reconcile -- --connect --request-id CR-SST-0057 --output-dir evidence/requests/CR-SST-0057
npm.cmd run jira:mcp:status-observe -- --connect --request-id CR-SST-0057 --output-dir evidence/requests/CR-SST-0057
npm.cmd run jira:mcp:backlog-observe -- --connect --request-id CR-SST-0057 --output-dir evidence/requests/CR-SST-0057
Remove-Item Env:\JIRA_MCP_ARGS
```

- Duplicates: 9 items, 9 encontrados.
- Reconcile: 9 issues inspeccionados, 9 feature states reconciliados.
- Status observe: 9 observaciones, 0 transiciones locales automaticas.
- Backlog observe: 6 observaciones backlog, 0 escrituras Jira.

## Prueba No Destructiva Sobre SST-4

Se ejecuto una llamada MCP read-only directa para:

- resolver recursos Atlassian accesibles;
- leer `SST-4` con `getJiraIssue`;
- obtener transiciones de `SST-4` con `getTransitionsForJiraIssue`.

Resultado:

- `SST-4` legible: si.
- Transiciones visibles: 4.
- Transiciones devueltas:
  - `11` / `Por hacer`
  - `21` / `En curso`
  - `31` / `In Review`
  - `41` / `Listo`

## Interpretacion

El MCP OAuth ya expone tools Jira de escritura y transicion cuando el cliente
usa `https://mcp.atlassian.com/v1/mcp`.

Esto confirma capacidad MCP observable para crear, editar, comentar, linkear,
registrar worklogs y transicionar issues. No confirma por si solo una escritura
real exitosa, porque no se ejecuto ninguna operacion destructiva o persistente.

Para confirmar escritura efectiva se requiere una operacion aprobada, por
ejemplo crear un issue controlado o editar/comentar un issue de prueba.

## Boundary

- No se crearon Jira issues.
- No se editaron Jira issues.
- No se comentaron Jira issues.
- No se transicionaron Jira issues.
- No se registraron tokens, cookies, cloudIds ni secretos.
