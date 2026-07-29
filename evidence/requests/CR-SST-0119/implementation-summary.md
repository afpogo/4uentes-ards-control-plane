# CR-SST-0119 - Implementation Summary

## Estado

- Fecha: 2026-07-04
- Jira: `SST-49`
- Epic: `SST-29`
- Repo owner mutado: `sst-extension`
- Control-plane: evidencia y request lifecycle.

## Resultado

Se implemento modo configurable de captura de sesiones en `sst-extension`.

Modos soportados:

- `auto`: conserva el comportamiento existente, visual-first con fallback textual.
- `visual-only`: intenta captura visual y, si falla, registra outcome diagnostico sanitizado sin leer texto de pagina como fallback silencioso.
- `text-only`: omite captura visual y genera PDF textual intencionalmente.
- `prefer-text`: usa el camino textual en esta primera version, reservado para heuristicas futuras.

## Cambios Tecnicos

- Se agrego `SessionCaptureModePreference` y nuevos outcomes locales:
  - `text-pdf`
  - `visual-capture-failed`
- La preferencia vive en `browser.storage.local` como estado local de extension.
- La UI del popup expone selector de modo antes de capturar sesion.
- Background/messaging propagan la preferencia al servicio de captura.
- El servicio de captura respeta el modo seleccionado sin cambiar el payload BFF.
- La lista de sesiones distingue `PDF visual`, `PDF textual`, `PDF textual fallback` y `Visual fallido`.
- Se agregaron pruebas de storage, branching del servicio y helpers UI.

## Boundary

- Sin cambios en `node-auth`, `sst-fend` o `sst-bend`.
- Sin cambios de contrato en `POST /api/extension/sessions`.
- No se registraron contenidos privados, raw PDFs, screenshots sensibles, cookies, JWTs ni secretos en evidencia.
- `CR-SST-0120` sigue siendo el owner del contrato de preview image para articulos derivados de sesion.

## Owner Docs Actualizadas

- `sst-extension/specs/features/sessions.yaml`
- `sst-extension/docs/00-overview.md`
- `sst-extension/docs/qa/session-capture-validation.md`

