# CR-SST-0116 - Jira Transition Fallback

Fecha: 2026-07-04

## Intento MCP

Se intento usar el conector Atlassian/Jira desde Codex.

Resultado:

- `mcp__atlassian.search` fallo con `403`:
  `The app is not installed on this instance`.
- `getTransitionsForJiraIssue` usando `https://4uentes.atlassian.net` como
  `cloudId` fallo con `404`:
  `Failed to fetch tenant info`.

## Estado Local ARDS/SDD

Segun cierre local validado:

- `CR-SST-0114` esta `done`, Jira mirror `SST-44`, estado observado anterior
  `Por hacer`.
- `CR-SST-0115` esta `done`, Jira mirror `SST-45`, estado observado anterior
  `Por hacer`.
- `CR-SST-0116` esta `done`, Jira mirror `SST-46`, estado observado anterior
  `Por hacer`.
- `CR-SST-0117` esta `planned`, Jira mirror `SST-47`, estado observado anterior
  `Por hacer`.

## Transiciones Que Corresponden

Cuando Jira vuelva a estar disponible:

- Transicionar `SST-44` a `Listo`.
- Transicionar `SST-45` a `Listo`.
- Transicionar `SST-46` a `Listo`.
- Transicionar `SST-47` a `En curso` si se inicia `CR-SST-0117`.
- Mantener `SST-6` en `En curso`; todavia quedan `CR-SST-0117` y
  `CR-SST-0118`.

## Comentario Recomendado Para Jira

```text
ARDS/SDD local sync 2026-07-04:

CR-SST-0114 closed locally: contextual tagging over text selection.
CR-SST-0115 closed locally: annotated selection BFF/API contract.
CR-SST-0116 closed locally: accepted annotated text context persistence through sst-bend + node-auth BFF.

Validation:
- sst-fend check passed for CR-SST-0114.
- sst-bend migration/test/check passed for CR-SST-0116.
- node-auth check passed for CR-SST-0116.
- 4uentes-orchestor npm.cmd run check passed with owner enforcement.

Jira remains operational mirror; ARDS/SDD is source of truth.
```

## Blocker

No se pudo ejecutar la transicion por MCP desde Codex porque el conector
Atlassian no tiene acceso al tenant actual.
