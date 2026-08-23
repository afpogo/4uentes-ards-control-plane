# Publicacion owner draft de CR-SST-0206

## Resultado

La implementacion quedo publicada como PR draft
`afpogo/sst-fend#17` desde
`feat/CR-SST-0206/chat-retention-consent-ux@e69521beec10f88bbb74cedceed5c0e788f69e67`,
basada en `origin/develop@44e1c2a`.

El checkout canonico sucio de `sst-fend` se preservo intacto. Todo el trabajo
owner ocurrio en el worktree limpio
`worktrees/CR-SST-0206-fend-retention-consent`.

## Slice implementado

- Estado visible `Temporal` / `Guardada en SST`.
- Guardado durable solo mediante accion explicita y clave de idempotencia.
- Limpiar este dispositivo sin llamada de borrado al servidor.
- Finalizar temporal y eliminar guardada como acciones separadas, destructivas
  y confirmadas.
- Recuperacion bajo demanda de conversaciones guardadas a traves de
  `node-auth`; no hay HTTP directo a `sst-bend`.
- Mensajes solo en memoria de aplicacion; `sessionStorage` conserva unicamente
  el ID opaco de conversacion.
- Owner specs, capability inbound, privacidad y tarea documentados en
  `sst-fend`.

## Validacion

- `npm run check`: PASS.
- Policy check y CSS module declarations: PASS.
- Lint: 0 errores; 22 warnings preexistentes fuera del slice.
- Build de produccion: PASS.
- Tests: 36 suites y 240 tests PASS; 6 cubren especificamente consentimiento,
  almacenamiento, clear local, confirmaciones y recuperacion.
- `git diff --check`: PASS antes del commit.
- GitHub readback final: PR abierta, draft y mergeable; el check del commit
  final `build-publish-update` paso en 5m36s. Paso repository check, build frontend y
  build de imagen. Login a GHCR, push de imagen, checkout de Infra y update de
  tag fueron omitidos por tratarse de un evento `pull_request`.

## QA renderizada

El navegador integrado no logro inicializarse, por lo que se uso Chrome
headless local con un preview y una clave de persistencia efimeros. La primera
captura detecto que la clase global `sr-only` no existia y desplazaba el label,
input y boton del composer. Se reemplazo por una clase CSS Module de ocultacion
visual accesible en `e69521b`.

Readback posterior a la correccion:

- Desktop `1440x1000`: PASS.
- Mobile `390x844`: PASS.
- Ancho de documento igual al viewport en ambas resoluciones: sin overflow
  horizontal.
- Botones de 44px e input de 46px; label `Mensaje` asociado y accesible.
- Cero excepciones de runtime.
- Preview, perfiles, capturas y clave efimera retirados antes del gate final.

El full check owner se repitio despues de la correccion y mantuvo 36 suites / 240
tests, build y ARDS check en verde.

## Limites

No se fusiono el PR, no se activo `CHAT_RETENTION_V1_ENABLED`, no se desplego y
no se modificaron Auth, Bend, Extension, Chatbot, Infra, produccion ni Jira.
El workflow disparado por `pull_request` compila la imagen con `push: false`;
solo el evento `push` sobre `develop` puede publicar imagen o actualizar Infra.
La PR permanece draft y su merge requiere autorizacion explicita posterior.
