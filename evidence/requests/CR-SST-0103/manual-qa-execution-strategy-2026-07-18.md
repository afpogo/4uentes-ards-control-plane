# Estrategia De QA Manual Para Captura De Paginas Privadas

## Decision

La proxima ejecucion de `CR-SST-0103 / SST-35` se hara en Chrome local con un
perfil de QA aislado y una extension WXT cargada desde su directorio de salida.
No depende del navegador integrado de Codex ni de su puente de DevTools.

Esta evidencia es una preparacion: no se inicio Chrome, no se cargo la
extension, no se inicio sesion y no se capturo contenido durante este analisis.

## Por Que DevTools No Es El Bloqueante Del Producto

La sesion anterior no pudo controlar el navegador integrado de Codex porque su
puente de automatizacion no recibio la configuracion interna esperada. Ese
fallo ocurre antes de acceder a Chrome, al popup o a `sst-extension`; por lo
tanto no demuestra un defecto de la extension.

Chrome dispone de una ruta independiente para desarrollo de extensiones:

- cargar la salida desempaquetada en `chrome://extensions` con modo desarrollador;
- abrir `Inspect views` del service worker para revisar errores y logs;
- inspeccionar el popup y la pagina objetivo por separado cuando corresponda.

DevTools no debe permanecer abierto para validar el comportamiento normal de
la extension. En Manifest V3, inspeccionar el service worker lo mantiene vivo;
la prueba debe incluir una pasada con DevTools cerrado para comprobar que la
captura no depende de que ese proceso permanezca abierto.

Referencias de investigacion:

- Chrome: https://developer.chrome.com/docs/extensions/get-started/tutorial/debug
- Ciclo de vida MV3: https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle
- WXT E2E/salida de extension: https://wxt.dev/guide/essentials/e2e-testing
- WXT modos de salida: https://wxt.dev/guide/resources/upgrading

## Metodo Manual Propuesto

### Precondiciones

1. Ejecutar las verificaciones automatizadas de `sst-extension` y los servicios
   requeridos por el flujo antes de abrir Chrome.
2. Preparar un usuario y una pagina autenticada ficticios o locales. No usar una
   cuenta real ni una pagina privada real.
3. Generar la salida Chrome MV3 de WXT. Confirmar el directorio real en
   `.output/` antes de cargarlo: una salida de produccion suele ser
   `chrome-mv3`; una salida de desarrollo actual puede ser `chrome-mv3-dev`.
4. Abrir una ventana de Chrome con un perfil exclusivo de QA. El usuario inicia
   sesion por si mismo; nunca entrega contrasenas, cookies, tokens ni valores
   de sesion al agente ni a la evidencia.

### Ejecucion Cuando Se Autorice El QA

1. Activar modo desarrollador en `chrome://extensions` y cargar la carpeta de
   salida desempaquetada.
2. Confirmar que la extension esta habilitada y que no hay errores de carga.
3. Abrir la pagina autenticada ficticia, accionar la captura explicitamente
   desde el popup y reabrirlo si Chrome lo cierra durante el cambio de pestana.
4. Usar DevTools de forma acotada para revisar el service worker, el popup y la
   consola de la pagina. Cerrar DevTools antes de la pasada de resiliencia MV3.
5. Registrar solo resultados, codigos de estado, nombres de advertencia y
   capturas redactadas. No guardar el contenido capturado, PDF, HTML, URLs
   privadas completas, cookies, JWT ni secretos.

### Matriz Minima De Aceptacion

| Caso | Resultado que se debe observar |
| --- | --- |
| Usuario no autenticado o sin permiso host | fallo visible y tipado; no se afirma captura |
| Pagina ficticia autenticada, captura explicita | sesion/articulo creado o advertencia tipada sin perder la sesion |
| Preview privada desactivada | no se envia thumbnail privada |
| Preview privada habilitada | preview consentida o degradacion explicita dentro de limites |
| Pagina textual sin imagen | placeholder/razon, sin intentar forzar thumbnail |
| Presupuesto excedido | sesion valida y `session-preview-budget-exceeded` |
| DevTools cerradas durante la pasada final | el flujo no depende de mantener vivo al worker |

## Limites De La Prueba

- No valida inicio de sesion autonomo del producto.
- No valida guardar, revelar ni transmitir contrasenas.
- No valida captura de HTML completo.
- No autoriza procesar paginas privadas sin una accion de captura del usuario.
- No cambia el contrato de `CredentialedWebSource v1`; solo valida su modo
  actual `browser-session` bajo datos ficticios.

## Cierre Esperado

Al ejecutar la QA en el futuro, el resultado debe separar con claridad:

- comportamiento funcional de `sst-extension`;
- salud de los servicios locales;
- fallas del puente de automatizacion de Codex, si reaparecen;
- observaciones de Chrome/MV3.

Una falla del puente de Codex debe registrarse como limitacion de herramienta,
no como resultado funcional de la extension, salvo que se reproduzca tambien
en el Chrome de QA independiente.
