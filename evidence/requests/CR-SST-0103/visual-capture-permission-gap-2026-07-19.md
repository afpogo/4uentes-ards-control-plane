# Hallazgo De Permiso Para Captura Visual Multi-Pestana

## Observacion Reproducible

La captura manual en modo `auto` proceso cinco pestanas, conservo la sesion y
la envio, pero todas degradaron a PDF textual. Un probe ejecutado por el usuario
en el service worker devolvio solamente el error sanitizado:

```text
Either the '<all_urls>' or 'activeTab' permission is required.
```

No se registro imagen, URL, contenido, cookie, token ni credencial.

## Causa

El manifest declara `activeTab`, `scripting`, `tabs` y permisos host opcionales
por origen. `activeTab` se obtiene para la pestana donde el usuario invoca la
extension. Cuando la captura activa otras pestanas mediante codigo, esas
pestanas no reciben una nueva invocacion del usuario.

Chrome documenta que `captureVisibleTab` requiere especificamente
`<all_urls>` o `activeTab`. El permiso por sitio permite inyectar y leer la
pagina, por eso el fallback textual funciona, pero no satisface la captura de
imagen en las pestanas activadas programaticamente.

Referencias oficiales:

- https://developer.chrome.com/docs/extensions/reference/api/tabs
- https://developer.chrome.com/docs/extensions/develop/concepts/activeTab
- https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions

## Opciones Funcionales

### Opcion A: Consentimiento Global Efimero Por Captura

- Declarar `<all_urls>` como permiso host opcional.
- Solicitarlo solo al iniciar una captura visual de sesion.
- Explicar en UI que Chrome autorizara temporalmente capturar las pestanas
  visibles de la ventana.
- Remover el permiso al terminar o fallar la captura.
- Mantener el toggle de preview privada separado: ese toggle decide si se envia
  una miniatura, no si se genera el PDF visual local.

Ventaja: conserva una sola accion para toda la ventana. Costo: Chrome muestra
una advertencia de permiso amplia en cada captura si se revoca al finalizar.

### Opcion B: Confirmacion Humana Por Pestana

- Mantener `activeTab` sin `<all_urls>`.
- Pedir al usuario que invoque la extension o un comando en cada pestana que
  quiera capturar visualmente.
- Consolidar la sesion solo despues de esas confirmaciones.

Ventaja: menor autoridad global. Costo: elimina la experiencia de capturar una
ventana completa con un solo clic y agrega estado/UX considerable.

### Opcion C: Solo Texto Para Sesiones Multi-Pestana

- Declarar que la sesion multi-pestana no ofrece captura visual.
- Reservar la captura visual para la pestana activa o para otro flujo explicito.

Ventaja: no amplia permisos. Costo: contradice la funcionalidad visual y de
previews ya planificada.

## Recomendacion

Adoptar la opcion A dentro de `CR-SST-0121`, con permiso opcional, explicacion
visible, remocion best-effort en `finally` y pruebas de consentimiento,
denegacion y worker MV3. No implementar este cambio dentro del CR de QA sin una
decision explicita, porque modifica el alcance de permisos del producto.
