# CR-SST-0098 - Chrome DevTools manual QA attempt

## Estado

- Fecha: 2026-07-03
- Initiative: `INIT-SST-0003`
- Jira epic mirror: `SST-29`
- Jira ticket mirror: `SST-30`
- Objetivo: QA manual previo a cierre usando Chrome DevTools MCP.

## Resultado

El QA manual con Chrome DevTools MCP no pudo ejecutarse en esta corrida porque
el MCP no pudo adjuntarse ni abrir pagina nueva con el perfil configurado.

Respuesta observada del MCP:

```text
The browser is already running for C:\Users\andre\.cache\chrome-devtools-mcp\chrome-profile.
Use --isolated to run multiple browser instances.
Cause: The browser is already running for C:\Users\andre\.cache\chrome-devtools-mcp\chrome-profile.
Use a different userDataDir or stop the running browser first.
```

## Diagnostico local

- `mcp__chrome_devtools.list_pages` no devolvio paginas por perfil bloqueado.
- `mcp__chrome_devtools.new_page` tampoco pudo abrir `about:blank`.
- Se observaron multiples procesos `chrome`.
- No se pudo identificar con seguridad el proceso asociado al perfil MCP porque
  `Get-CimInstance Win32_Process` devolvio `Acceso denegado`.
- No se detuvieron procesos Chrome para evitar cerrar sesiones del usuario o
  perfiles no relacionados.

## Impacto en cierre

Este intento no valida QA manual. Por lo tanto:

- `SST-30` no debe transicionarse a `Listo` solamente con esta evidencia.
- El cierre queda preparado, pero pendiente de QA manual con Chrome DevTools MCP
  desbloqueado o de una excepcion explicita aprobada.
- El enforcement automatizado sigue valido y registrado en
  `evidence/requests/CR-SST-0098/validation-results.md`.

## Proximo intento sugerido

- Liberar el perfil `C:\Users\andre\.cache\chrome-devtools-mcp\chrome-profile`
  cerrando la instancia Chrome asociada al MCP, o iniciar el MCP con perfil
  aislado si la herramienta lo permite.
- Reintentar:
  - abrir dos paginas HTTP(S) sinteticas;
  - cargar/usar `sst-extension` build `chrome-mv3`;
  - ejecutar captura de sesion;
  - confirmar que la tab original queda activa;
  - confirmar que no se registran PDFs/contenido privado en evidencia.
