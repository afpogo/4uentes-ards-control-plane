# Write Command Contract

## Comando

```powershell
npm.cmd run jira:mcp:backlog-create -- --connect --approved --request-id CR-SST-0050 --output-dir evidence/requests/CR-SST-0050
```

## Precondiciones

- Debe existir `evidence/requests/CR-SST-0050/backlog-ticket-payload-dry-run.json`.
- El payload debe declarar `requestId: CR-SST-0050`.
- El payload debe declarar `externalWrite: false`.
- Cada payload debe incluir `backlogId`, `projectKey`, `issueType`, `summary`,
  `description` y labels.
- Cada `summary` debe incluir el `backlogId`.
- Cada `backlogId` debe existir en `state/jira-backlog-registry.yaml`.
- El comando debe recibir `--connect`.
- El comando debe recibir `--approved`.

## Acciones Permitidas

- Crear tickets Jira con `createJiraIssue`.
- Saltar backlog items que ya tengan `jira_issue_key`.
- Escribir `evidence/requests/CR-SST-0050/backlog-create-summary.md`.
- Actualizar `jira_issue_key` en `state/jira-backlog-registry.yaml` cuando la
  respuesta MCP permita detectar la key del issue.
- Detener la ejecucion si Jira crea un issue pero la respuesta MCP no permite
  detectar la key, para evitar duplicados en reintentos.

## Acciones Prohibidas

- Asignar o modificar `assigned_cr_sst`.
- Crear o reservar CR-SST para backlog diferido.
- Modificar repos funcionales.
- Escribir Jira sin `--connect --approved`.
- Leer payloads de otro request.
- Persistir secretos, tokens, cookies, URLs privadas Jira o cloudId en Git.
- Reintentar automaticamente despues de una creacion sin key detectada.
