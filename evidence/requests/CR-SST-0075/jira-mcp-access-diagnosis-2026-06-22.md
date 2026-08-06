# CR-SST-0075 - Diagnostico de acceso Jira MCP

## Estado

- Fecha: 2026-06-22
- Request: `CR-SST-0075`
- Objetivo: distinguir si el bloqueo actual afecta toda la conexion Jira MCP o
  solamente ciertas tools del stack Atlassian/Rovo.

## Evidencia ejecutada

- `npm.cmd run mcp:auth:connect`
- `npm.cmd run jira:mcp:verify -- --connect --request-id CR-SST-0075 --output-dir evidence/requests/CR-SST-0075`
- `node scripts/jira-mcp/observe-issue.js --connect --request-id CR-SST-0075 --output-dir evidence/requests/CR-SST-0075 --issue-key SST-23`
- Prueba directa Codex MCP: `mcp__atlassian.search` con query `SST-23`

## Resultado

- El bootstrap remoto reconecto `codex:atlassian` con `tools=31`.
- La verificacion read-only del repo quedo en `PARTIAL_PASS`.
- El proyecto Jira `SST` es visible por MCP.
- Existe al menos un recurso Atlassian accesible con `cloudId` resoluble.
- La lectura directa del issue `SST-23` funciona por `getJiraIssue`.
- El issue `SST-23` sigue observado en estado `En curso`.
- La tool `search` sigue fallando con `403` y mensaje:
  `The app is not installed on this instance`.

## Interpretacion operativa

- No hay evidencia de caida total de Jira MCP.
- El acceso base de Jira por `cloudId` esta operativo para lectura directa.
- El fallo actual parece acotado a la superficie `search` de Atlassian/Rovo o a
  sus permisos sobre la instancia objetivo.
- En este entorno no conviene usar `search` como health check exclusivo.
- Para `SST-23` conviene operar con lectura/escritura dirigida por issue key y
  `cloudId` resuelto por las tools/script locales del repo.

## Artefactos relacionados

- `evidence/requests/CR-SST-0075/jira-mcp-project-verification.md`
- `evidence/requests/CR-SST-0075/jira-issue-SST-23-observation.md`
- `evidence/requests/CR-SST-0075/jira-sst-23-start-transition-summary.md`

## Siguiente paso recomendado

- Si se necesita comentar o transicionar `SST-23`, usar el flujo dirigido por
  issue key del repo o las tools Jira especificas, sin depender de `search`.
