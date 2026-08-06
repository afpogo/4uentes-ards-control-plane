# CR-SST-0093 - Plan Futuro De Implementacion

## Objetivo

Abrir un CR posterior para corregir la captura de sesion en `sst-extension` y
dejarla lista como primer productor confiable de `CredentialedWebSource` en modo
`browser-session`.

## Repo Objetivo Futuro

Servicio: `sst-extension`.

Archivos candidatos:

- `specs/features/sessions.yaml`
- `src/platform/tabs/capture-active-window-sessions.ts`
- `src/platform/tabs/capture-session-tab-fullpage-pdf.ts`
- `src/features/sessions/create-session-capture-service.ts`
- `src/platform/pdf/materialize-session-pdf.ts`
- `src/shared/sessions.ts`
- `src/platform/storage/extension-storage.ts`
- `src/platform/api/node-auth-client.ts`
- tests de `sessions`, storage, gateway y messaging.

## Cambios Funcionales Esperados

- Guardar la pestaña activa original antes del lote.
- Procesar pestañas capturables una por una.
- Activar cada pestaña y esperar:
  - `tabs.onUpdated` con `status=complete` cuando aplique;
  - `document.readyState` en `interactive` o `complete`;
  - settle minimo configurable posterior al render;
  - timeout por pestaña con warning.
- Restaurar scroll original por pestaña cuando sea posible.
- Restaurar la pestaña activa original al finalizar el lote.
- Registrar resultado por pestaña:
  - `visual_pdf_captured`;
  - `text_pdf_fallback`;
  - `unsupported_url`;
  - `permission_denied`;
  - `too_long`;
  - `capture_failed`.
- Diferenciar `artifactKind` o metadata de snapshot para no confundir PDF visual
  con PDF textual de fallback.
- Permitir fallo parcial sin perder toda la sesion.
- Mantener limite de tabs y controles de permiso.

## Contrato De UX

- El usuario debe iniciar la captura explicitamente.
- La UI debe mostrar progreso por pestaña.
- La UI debe informar degradaciones y fallos parciales.
- La UI no debe sugerir que un PDF textual fallback es una captura visual fiel.
- La captura no debe ejecutarse en background silencioso sobre ventanas que el
  usuario no eligio.

## QA Minimo

- Sesion con 3 pestañas `http/https` simples.
- Sesion con una pestaña privada donde el usuario ya esta autenticado.
- Pagina lenta con render tardio.
- Pagina con scroll largo dentro del limite.
- Pagina demasiado larga que active warning.
- URL no soportada.
- Permiso denegado para un origen.
- Fallo parcial donde las demas pestañas siguen capturadas.
- Confirmar restauracion de pestaña activa original.
- Confirmar que evidencia no contiene contenido privado real.

## Validaciones Esperadas

En `sst-extension`:

- `pnpm run test`
- `pnpm run build`
- `pnpm run check` si existe en el repo
- QA manual con extension instalada

En control-plane:

- evidencia de archivos cambiados;
- evidencia de QA sanitizada;
- `npm.cmd run check`.

## Dependencias

Este fix debe preceder cualquier integracion que trate la captura multi-tab
como fuente confiable para:

- `CredentialedWebSource`;
- `LearningWorkspace`;
- agentes IA;
- backend `SecretRef` capture;
- merge de contenidos privados.
