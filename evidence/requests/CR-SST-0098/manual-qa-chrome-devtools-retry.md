# CR-SST-0098 - Chrome DevTools manual QA retry

## Estado

- Fecha: 2026-07-03
- Objetivo: reintentar QA manual con Chrome DevTools MCP despues de liberar la
  instancia Chrome previa.
- Resultado: MCP operativo, QA funcional de extension aun pendiente.

## Verificaciones ejecutadas

### MCP disponible

- `mcp__chrome_devtools.list_pages` respondio correctamente.
- Pagina inicial observada: `about:blank`.

### Navegacion HTTP(S) no sensible

- Se abrio `https://example.com/`.
- Se abrio `https://www.iana.org/help/example-domains`.
- Se tomo snapshot accesible de `Example Domains`.
- Consola sin mensajes registrados en la pagina inspeccionada.

### Chrome Extensions

- Se abrio `chrome://extensions/`.
- Se habilito `Developer mode`.
- La pantalla mostro acciones `Load unpacked`, `Pack extension` y `Update`.
- Despues de cargar unpacked manualmente, Chrome mostro el mensaje
  `Extension loaded`.
- La entrada de preferencias del perfil MCP contiene un registro para
  `sst-extension` con ID `kmholoiofpjmflcbmnnkehhidflchboi` y path
  `C:\Users\andre\Desktop\4uentes\apps\4uentes-sst\sst-extension\.output\chrome-mv3`.
- Sin embargo, la UI acotada de `chrome://extensions` no muestra la tarjeta de
  `sst-extension`, incluso abriendo `chrome://extensions/?id=kmholoiofpjmflcbmnnkehhidflchboi`.
- El icono de `sst-extension` no esta visible en la ventana Chrome MCP para el
  usuario.
- Evidencia visual: `evidence/requests/CR-SST-0098/chrome-devtools-extensions-developer-mode.png`.
- Evidencia visual adicional:
  `evidence/requests/CR-SST-0098/chrome-devtools-extension-not-visible.png`.

## Bloqueo restante

El MCP disponible no expone una herramienta para completar el dialogo nativo de
`Load unpacked` y seleccionar:

```text
C:\Users\andre\Desktop\4uentes\apps\4uentes-sst\sst-extension\.output\chrome-mv3
```

Aunque Chrome reporto `Extension loaded`, la instancia acotada del MCP no expone
la tarjeta ni el icono de accion de la extension. Ademas, la navegacion directa a
`chrome-extension://kmholoiofpjmflcbmnnkehhidflchboi/popup.html` y
`chrome-extension://kmholoiofpjmflcbmnnkehhidflchboi/options.html` devolvio
`ERR_BLOCKED_BY_CLIENT`.

Con estas restricciones no se puede ejecutar el QA funcional de:

- capturar sesion desde popup/sidepanel;
- verificar restauracion de la pestania activa original tras captura;
- verificar restauracion best-effort de scroll;
- confirmar degradacion visual/textual desde la UI real.

## Decision

- No transicionar `SST-30` a `Listo` con esta evidencia.
- Mantener `SST-30` en `En revision`.
- Para cierre final se requiere:
- ejecutar Chrome/MCP con una instancia que exponga extensiones unpacked y su
    accion de toolbar, o reintentar con un perfil aislado/configurado para
    extensiones; o
  - aprobar explicitamente una excepcion de QA manual y cerrar solo con
    enforcement automatizado.

## Boundary

No se registro contenido privado, cookies, JWTs, secretos en claro, PDFs reales
sensibles ni screenshots sensibles.
