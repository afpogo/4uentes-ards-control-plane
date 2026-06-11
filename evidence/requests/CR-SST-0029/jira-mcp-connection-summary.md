# Resumen De Conexion Jira MCP

## Estado

- Fecha: 2026-06-05
- Request: CR-SST-0029
- Resultado: bloqueado antes de escritura Jira

## Observacion Del Runtime

El runtime actual de Codex no expone un namespace MCP de Atlassian/Jira. La
busqueda de tools para Jira/Atlassian MCP devolvio solo tools no Jira:

- Chrome DevTools MCP tools
- GitHub app tools
- Node REPL tools

No hubo tools Jira MCP disponibles para:

- listar proyectos Jira;
- leer metadata de issue types;
- buscar duplicados;
- crear Jira issues.

## Decision

Continuar con los pasos seguros del control-plane:

1. barrer `state/features/*.current.yaml`;
2. filtrar los nueve feature states cuyo status no es `done`;
3. generar un dry-run de payloads Jira;
4. diferir escrituras Jira hasta que el cliente MCP de Atlassian este
   configurado en el runtime operador.

## Requerido Antes De Escritura Jira

- Configurar Atlassian Rovo MCP Server en el runtime cliente.
- Confirmar project key Jira.
- Confirmar issue type.
- Leer campos requeridos por MCP.
- Buscar duplicados por MCP.
- Obtener aprobacion humana explicita para crear issues.

No se registraron credenciales, tokens, URLs privadas ni issue keys Jira.
