# Resultados De Validacion CR-SST-0032

## Comandos Ejecutados

| Comando | Resultado | Nota |
| --- | --- | --- |
| `npm.cmd run jira:mcp:verify` | PASS | Ejecutado en modo preflight, sin red ni OAuth. |
| `npm.cmd run jira:mcp:verify -- --connect` | PARTIAL_PASS | Jira `SST` visible; Confluence space `SST` no visible. |
| `npm.cmd run jira:mcp:dry-run` | PASS | Regenero el dry-run de 9 feature states no `done`. |
| `npm.cmd run check` | PASS | 0 FAIL. Conserva warnings preexistentes no relacionados. |

## Correccion Windows

Tras observar `spawn npx ENOENT` en Windows, se ajusto el comando por defecto a
`npx.cmd` cuando `process.platform` es `win32`. Luego se repitio:

| Comando | Resultado | Nota |
| --- | --- | --- |
| `npm.cmd run jira:mcp:verify` | PASS | Preflight vuelve a generar evidencia correctamente. |
| `npm.cmd run check` | PASS | 0 FAIL. |

## Resultado De `jira:mcp:verify`

- Modo final probado: `connect`
- Resultado final probado: `PARTIAL_PASS`
- Board esperado: `SST-Team`
- Project key esperado: `SST`
- Jira project key visible: si
- Confluence space key visible: no
- Escritura Jira: no
- Evidencia: `evidence/requests/CR-SST-0032/jira-mcp-project-verification.md`
- Preflight local: `evidence/requests/CR-SST-0032/jira-mcp-preflight.md`

## Warnings Preexistentes

`npm run check` conserva warnings no relacionados con CR-SST-0032:

- remotos no observables para repos locales;
- dos bugfix states sin `request_ids` o `evidence_refs`;
- `document-agent` sin `evidence_refs` para estado no terminal.

## Conclusion

CR-SST-0032 queda validado para conectividad read-only con Atlassian MCP. Jira
`SST` fue verificado. Confluence MCP esta disponible como toolset, pero el
space key `SST` no fue visible para el usuario autenticado o no existe con esa
clave.
