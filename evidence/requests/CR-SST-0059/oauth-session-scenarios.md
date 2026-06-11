# OAuth Session Scenarios

## Estado

- Fecha: 2026-06-08
- Request: CR-SST-0059
- Fuente inmediata: bloqueo observado durante CR-SST-0058
- Escritura externa: no

## Escenarios Cubiertos

- `local-dry-run`: scripts sin red ni OAuth.
- `mcp-read-only`: scripts con `--connect` y herramientas Jira de lectura.
- `mcp-approved-write`: scripts con `--connect --approved`.
- `oauth-init`: inicio controlado de sesion mediante `jira:mcp:verify`.
- `oauth-recovery`: recuperacion ante `EADDRINUSE`, callback ocupado, re-registro
  OAuth o 404.

## Caso Base Observado

CR-SST-0058 observo un bloqueo de callback OAuth:

- Puerto: `127.0.0.1:39570`
- Estado: `LISTENING`
- Proceso observado: `node`
- Ruta `/oauth/callback`: `Error: No authorization code received`
- Resultado: no se ejecuto transicion Jira.

El playbook incorporo este caso como escenario de recuperacion y exige
aprobacion explicita antes de detener un PID local ambiguo.
