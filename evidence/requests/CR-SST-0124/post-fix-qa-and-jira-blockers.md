# CR-SST-0124 - Post Fix QA And Jira Blockers

## Estado

- Fecha: 2026-07-07
- Fix local: implementado y validado en `node-auth`
- QA autenticado final: bloqueado por tooling local
- Jira mirror: no actualizado en este turno

## Browser QA

Intento 1: browser plugin via Node REPL.

Resultado: BLOCKED.

```text
Mcp error: -32602: js: codex/sandbox-state-meta: missing field `sandboxPolicy`
```

La falla se reprodujo incluso con una celda trivial `nodeRepl.write('ready')`,
por lo que no fue una falla de la app ni del flujo `/artsst`.

Intento 2: Chrome DevTools MCP.

Resultado: BLOCKED.

```text
The browser is already running for C:\Users\andre\.cache\chrome-devtools-mcp\chrome-profile.
Use --isolated to run multiple browser instances.
```

El MCP no pudo listar paginas ni navegar a `http://localhost:4090/artsst`
porque no pudo adjuntarse al perfil Chrome existente.

## Jira

No se comento ni transiciono `SST-53` en este turno.

Motivo:

- La evidencia local guarda `cloudId` y URLs privadas sanitizadas.
- Atlassian Search devolvio 403:

```text
Access denied. You don't have permission to search content.
The app is not installed on this instance.
```

Sin `cloudId`/site verificable no se invoco `addCommentToJiraIssue` para evitar
escribir contra un destino inferido.

## Decision

`SST-53` no debe moverse a `Listo` hasta completar la QA autenticada real:

- crear articulo `Text` sin `Source reference`;
- confirmar `POST /api/articulos` retorna `201`;
- confirmar que no persiste URL falsa ni `payload.data.sourceUrl`;
- abrir `/leafArticulo/:id`;
- confirmar que no se dispara scraping ni LearningWorkspace automaticamente.
