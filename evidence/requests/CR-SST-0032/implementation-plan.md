# Plan De Implementacion CR-SST-0032

## Objetivo

Implementar la verificacion read-only de Jira MCP para confirmar que el
orquestador puede conectarse a Atlassian MCP y ver el project key `SST`
asociado al board `SST-Team`.

## Alcance

Incluido:

- comando `npm run jira:mcp:verify`;
- carga de config existente `environments/local/jira-mcp.local.example.yaml`;
- conexion read-only a Atlassian MCP;
- descubrimiento de tools disponibles;
- verificacion de visibilidad del project key `SST`;
- evidencia sin secretos.

Excluido:

- crear issues;
- editar issues;
- comentar issues;
- transicionar issues;
- guardar tokens, cookies, private URLs o secretos en Git;
- modificar repos funcionales.

## Pasos

1. Seleccionar el camino de cliente MCP minimo viable.
2. Implementar `scripts/jira-mcp/verify-project.js`.
3. Agregar script `jira:mcp:verify` a `package.json`.
4. Escribir evidencia en `evidence/requests/CR-SST-0032/`.
5. Validar con `npm run check`, `npm run jira:mcp:dry-run` y
   `npm run jira:mcp:verify`.

## Criterios De Aceptacion

- El comando falla de forma explicita si Atlassian MCP no esta configurado o no
  expone tools Jira.
- El comando no ejecuta ninguna escritura Jira.
- El resultado indica si `SST` es visible o no.
- La evidencia no contiene secretos.
- El control-plane mantiene 0 FAIL en validacion.
