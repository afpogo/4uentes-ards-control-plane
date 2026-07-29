# CR-SST-0119 - Preliminary analysis

## Estado

- Fecha: 2026-07-04
- Request: `CR-SST-0119`
- Jira: `SST-49`
- Epic: `SST-29`
- Decision: iniciar como primer cambio ejecutable posterior a `SST-32`.

## Intencion

Agregar un modo configurable de captura de sesion en `sst-extension`:

- `auto`: comportamiento actual, intenta PDF visual y degrada a PDF textual.
- `visual-only`: intenta solo visual; si falla, marca fallo/degradacion sin
  materializar PDF textual silenciosamente.
- `text-only`: no intenta captura visual y materializa PDF textual.
- `prefer-text`: prioriza texto para paginas privadas/largas y evita trabajo
  visual innecesario.

## Observaciones De Codigo

- La captura actual vive en
  `src/features/sessions/create-session-capture-service.ts`.
- La decision actual esta fija dentro de `captureSessionTabSnapshot`: siempre
  intenta `captureTabAsFullPagePdf` y luego cae a `materializePdf`.
- Los tipos actuales viven en `src/shared/sessions.ts`:
  - `SessionSnapshotOutcome`
  - `SessionSnapshotCaptureMode`
  - `SessionSnapshotWarningCode`
- La UI de calidad vive en:
  - `src/ui/quick-save/session-queue-helpers.ts`
  - `src/ui/quick-save/QuickSaveSurface.tsx`
- La normalizacion local vive en
  `src/platform/storage/extension-storage.ts`.

## Boundary

- Este CR muta `sst-extension` y control-plane.
- No debe mutar `node-auth`, `sst-fend` ni `sst-bend`.
- La preferencia debe ser local a la extension en esta primera version.
- El payload hacia `node-auth` no debe cambiar salvo contrato explicito futuro.
- No se registran contenidos privados, raw PDFs, screenshots sensibles, cookies,
  JWTs ni secretos en evidencia.

## Plan Tecnico

1. Extender tipos owner con `SessionCaptureModePreference`.
2. Agregar preferencia local en storage o estado UI segun patron existente.
3. Pasar la preferencia al servicio de captura desde background/UI.
4. Cambiar `captureSessionTabSnapshot` para respetar el modo:
   - `auto`: visual con fallback textual.
   - `visual-only`: visual o snapshot fallido/controlado.
   - `text-only`: textual directo.
   - `prefer-text`: textual directo para esta primera version, con TODO si luego
     se decide heuristica por URL/longitud.
5. Mostrar el modo elegido en la UI de sesiones sin agrandar filas ni exponer
   contenido privado.
6. Actualizar specs/docs owner:
   - `specs/features/sessions.yaml`
   - `docs/00-overview.md`
   - `docs/qa/session-capture-validation.md`
7. Agregar tests de service, storage y helpers.
8. Ejecutar `pnpm check` en `sst-extension` y `npm.cmd run check` en control-plane.

## Riesgos

- Regresion de comportamiento actual si `auto` no queda como default.
- Confusion UX si `visual-only` falla sin indicar causa.
- Incremento de storage si se agregan snapshots extra.
- Exposicion accidental de contenido privado en labels o evidencia.

## Relacion Con SST-50

`SST-49` no resuelve preview image. Solo controla el modo de captura. La
generacion/conservacion de preview queda en `CR-SST-0120` / `SST-50`.
