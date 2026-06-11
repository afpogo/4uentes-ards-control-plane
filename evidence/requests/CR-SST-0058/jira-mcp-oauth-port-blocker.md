# Jira MCP OAuth Port Blocker

## Estado

- Fecha: 2026-06-08
- Request: CR-SST-0058
- Issue objetivo: SST-8
- Escritura Jira ejecutada: no
- Motivo: Atlassian MCP no pudo inicializar OAuth porque el callback registrado `127.0.0.1:39570` esta ocupado.

## Observaciones

- `mcp-remote` intento usar el puerto de callback OAuth existente `39570`.
- El proceso MCP fallo antes de listar herramientas o consultar `SST-8`.
- `netstat` observo `127.0.0.1:39570` en estado `LISTENING` con PID `28068`.
- `Get-Process -Id 28068` observo `ProcessName: node`.
- `GET /oauth/callback` sobre `127.0.0.1:39570` respondio `Error: No authorization code received`, consistente con un callback OAuth Express.
- La ejecucion con un puerto alternativo `39571` forzo re-registracion OAuth y Atlassian respondio 404, por lo que no se uso como ruta de cierre.

## Decision

No se detuvo el PID `28068` en esta ejecucion porque cerrar un proceso `node` local puede interrumpir servicios no relacionados si no hay aprobacion explicita para ese riesgo.

Para continuar el cierre de `SST-8`, se requiere aprobacion explicita para detener solo el PID `28068` que ocupa el callback OAuth de Atlassian MCP, o bien liberar manualmente ese proceso desde el sistema operativo.
