# CR-SST-0098 - Analisis preliminar

## Estado

- Fecha: 2026-07-03
- Initiative: `INIT-SST-0003`
- Jira epic mirror: `SST-29`
- Jira issue mirror: `SST-30`
- Modo: analisis y planificacion; sin mutacion de `sst-extension`

## Intencion

El primer corte de `INIT-SST-0003` debe estabilizar la captura visual PDF de
sesiones en `sst-extension`. El objetivo es que la extension capture pestania por
pestania de forma robusta, espere carga/settle cuando corresponda, preserve la
experiencia del usuario restaurando la pestania original, y registre fallos
parciales sin exponer contenido privado en Jira ni en evidencia ARDS/SDD.

## Flujo observado

- La UI dispara `sessions.captureCurrentWindow` desde `QuickSaveSurface`.
- El background registra el handler e inyecta `captureActiveWindowSessionTabs`,
  `captureSessionTabAsFullPagePdf`, `materializeSessionPdf` y
  `restoreSessionTabs`.
- `captureActiveWindowSessionTabs()` lee hasta 50 tabs de la ultima ventana
  enfocada y solicita permisos HTTP(S) por origin.
- `captureCurrentWindow()` recorre tabs secuencialmente: intenta PDF visual por
  tab y cae a PDF textual si la captura visual falla.
- `captureSessionTabAsFullPagePdf()` activa la tab, espera 160 ms, mide scroll,
  hace scroll por segmentos y usa `captureVisibleTab` para construir PDF.
- La sesion se guarda localmente como `pending_local` antes del handoff a
  `node-auth`.

## Hallazgos preliminares

- Restauracion de foco: el capturador activa cada tab y en `finally` vuelve a
  activar la misma tab capturada. No hay restauracion explicita de la tab activa
  original al terminar un lote multi-tab.
- Ready/settle: la espera actual es un `waitForTabPaint(160)` fijo. No hay
  espera por `tabs.onUpdated`, `document.readyState`, estabilidad de layout,
  lazy-load o timeout gobernado.
- Scroll inicial: el flujo desplaza la pagina para capturar segmentos, pero no
  documenta ni garantiza restauracion del scroll inicial por tab.
- Permisos: la solicitud de permisos de origins HTTP(S) no documenta todavia una
  degradacion visible cuando el usuario deniega permisos.
- Fallo parcial: si la captura visual falla, existe fallback textual por tab; si
  la materializacion final de un tab falla, puede abortar la captura completa
  antes de persistir un resultado parcial.
- Cobertura: existen tests de servicio para captura/fallback y restore, pero no
  se observo test directo del capturador visual ni tests especificos para foco
  original, ready/settle, permiso denegado o fallo de activacion final.

## Rutas tecnicas candidatas

- `sst-extension/src/platform/tabs/capture-session-tab-fullpage-pdf.ts`
- `sst-extension/src/platform/tabs/capture-active-window-sessions.ts`
- `sst-extension/src/features/sessions/create-session-capture-service.ts`
- `sst-extension/src/platform/tabs/restore-session-tabs.ts`
- `sst-extension/src/features/sessions/create-session-capture-service.test.ts`
- `sst-extension/src/platform/tabs/capture-active-window-sessions.test.ts`
- `sst-extension/src/platform/tabs/restore-session-tabs.test.ts`
- Nueva cobertura esperada para `capture-session-tab-fullpage-pdf.ts`

## Rutas owner ARDS/SDD candidatas

- `sst-extension/specs/features/sessions.yaml`
- `sst-extension/docs/integration/node-auth-extension-session-ingestion.md`
- `sst-extension/specs/integration/node-auth-extension-session-ingestion.yaml`
  si cambia la semantica de snapshots o request shape.
- `sst-extension/specs/integration/inbound/node-auth--browser-extension-session-ingestion.yaml`
  si cambia la adopcion inbound declarada.
- `sst-extension/docs/integration/inbound/node-auth--browser-extension-session-ingestion.md`
  si cambia la adopcion inbound humana.
- `sst-extension/docs/qa/session-capture-validation.md` como evidencia owner de
  QA sanitizada; la ruta aun no existe.

## Limites

- No se modifica `sst-bend`, `sst-fend`, `4uentes-auth` ni contratos API en este
  corte.
- No se introduce uso de secretos del Diccionario en runtime.
- No se guardan paginas privadas, cookies, JWTs, secretos en claro, PDFs reales
  sensibles ni screenshots sensibles en Jira o evidencia.
- Jira es espejo operacional; ARDS/SDD sigue siendo fuente de verdad.

## Decision preliminar

El caso es viable como primer CR de la iniciativa. El plan debe empezar por
actualizar la spec owner de sesiones y documentacion QA de `sst-extension`; luego
implementar restauracion de foco, wait strategy y degradacion parcial; finalmente
validar con tests unitarios, build/check del repo hijo y `npm.cmd run check` del
control-plane.
