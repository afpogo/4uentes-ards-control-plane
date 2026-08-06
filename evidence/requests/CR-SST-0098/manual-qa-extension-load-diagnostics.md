# CR-SST-0098 - Extension load diagnostics

## Estado

- Fecha: 2026-07-03
- Objetivo: confirmar si `sst-extension` puede cargarse y probarse en Chrome para
  QA manual de `SST-30`.

## Instancia Chrome MCP acotada

- El usuario cargo la carpeta unpacked y Chrome mostro `Extension loaded`.
- La UI inspeccionada de `chrome://extensions` no mostro la tarjeta de
  `sst-extension`.
- El usuario confirmo que no encontro el icono de `sst-extension` en la ventana
  Chrome MCP.
- La navegacion directa a `chrome-extension://.../popup.html` y `options.html`
  fue bloqueada con `ERR_BLOCKED_BY_CLIENT`.

## Instancia Chrome QA separada

Se abrio una instancia Chrome separada con perfil temporal y remote debugging:

```text
--user-data-dir=C:\Users\andre\AppData\Local\Temp\sst-extension-qa-chrome-profile
--remote-debugging-port=9223
--load-extension=C:\Users\andre\Desktop\4uentes\apps\4uentes-sst\sst-extension\.output\chrome-mv3
--disable-extensions-except=C:\Users\andre\Desktop\4uentes\apps\4uentes-sst\sst-extension\.output\chrome-mv3
```

Resultado:

- `chrome://version` confirmo que los flags fueron aplicados.
- `/json/list` no mostro `sst-extension`.
- Solo aparecieron extensiones internas/componentes de Chrome.

Se reintento con:

```text
--disable-features=DisableLoadExtensionCommandLineSwitch
```

Resultado:

- `sst-extension` tampoco aparecio en `/json/list`.
- El service worker observado correspondia a `Google Network Speech`, no a
  `sst-extension`.

## Conclusión

No se pudo obtener una instancia Chrome controlable por MCP/DevTools donde la
accion de toolbar de `sst-extension` quede visible y ejecutable.

El QA manual funcional de captura de sesion sigue bloqueado. Para cerrar
`SST-30`, se requiere una de estas alternativas:

- probar manualmente en una instancia Chrome normal donde el icono de
  `sst-extension` sea visible y reportar resultado; o
- aprobar una excepcion explicita de QA manual y cerrar con enforcement
  automatizado (`pnpm check` + `npm.cmd run check`) como evidencia principal.

## Boundary

No se registro contenido privado, cookies, JWTs, secretos en claro, PDFs reales
sensibles ni screenshots sensibles.
