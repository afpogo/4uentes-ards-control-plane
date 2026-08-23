# Publicacion owner draft de CR-SST-0206

## Resultado

La implementacion quedo publicada como PR draft
`afpogo/sst-fend#17` desde
`feat/CR-SST-0206/chat-retention-consent-ux@890af538de58ba2d53ca2a2acf474847d721f5ee`,
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
- GitHub readback final: PR abierta, draft y mergeable; el check
  `build-publish-update` paso en 5m23s. Paso repository check, build frontend y
  build de imagen. Login a GHCR, push de imagen, checkout de Infra y update de
  tag fueron omitidos por tratarse de un evento `pull_request`.

La QA renderizada desktop/mobile no se pudo ejecutar porque el navegador
integrado no logro inicializarse en el entorno de automatizacion. La deuda esta
registrada tambien en la documentacion owner y bloquea declarar el request
cerrado, pero no la publicacion del draft.

## Limites

No se fusiono el PR, no se activo `CHAT_RETENTION_V1_ENABLED`, no se desplego y
no se modificaron Auth, Bend, Extension, Chatbot, Infra, produccion ni Jira.
El workflow disparado por `pull_request` compila la imagen con `push: false`;
solo el evento `push` sobre `develop` puede publicar imagen o actualizar Infra.
