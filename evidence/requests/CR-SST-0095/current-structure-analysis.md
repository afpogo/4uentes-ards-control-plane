# CR-SST-0095 - Analisis De Estructura Actual De `sst-extension`

## Contexto

`INIT-SST-0003` ya existe como programa de construccion de `sst-extension` y su
Epic Jira mirror es `SST-29`. Esta evidencia analiza la estructura actual antes
de nombrar CRs/tickets de implementacion.

La inspeccion de `sst-extension` fue read-only. No se modifico el repo hijo.

## Fuentes Revisadas

- `sst-extension/AGENTS.md`
- `sst-extension/specs/00-index.yaml`
- `sst-extension/specs/features/sessions.yaml`
- `sst-extension/specs/features/text-article-pdf.yaml`
- `sst-extension/specs/integration/node-auth-extension-session-ingestion.yaml`
- `sst-extension/docs/architecture/source-layout.md`
- `sst-extension/src/features/sessions/create-session-capture-service.ts`
- `sst-extension/src/platform/tabs/capture-active-window-sessions.ts`
- `sst-extension/src/platform/tabs/capture-session-tab-fullpage-pdf.ts`
- `sst-extension/src/platform/pdf/materialize-session-pdf.ts`
- `sst-extension/src/ui/quick-save/QuickSaveSurface.tsx`
- `sst-extension/src/shared/sessions.ts`

## Estructura Observada

La arquitectura local esta bien separada:

- `src/entrypoints/`: bootstrap y wiring de `background`, `popup`, `sidepanel`
  y `options`.
- `src/features/`: casos de uso funcionales (`quick-save`, `sessions`,
  `dictionary`, `text-article-pdf`, `node-auth-session`).
- `src/platform/`: adapters tecnicos para browser APIs, tabs, storage, PDF,
  messaging y BFF/node-auth.
- `src/ui/`: superficie visual y componentes de extension.
- `src/shared/`: tipos y utilidades transversales.

Esta estructura debe conservarse. El primer fix no deberia mover ownership de
grafo hacia la extension ni introducir content scripts persistentes sin spec.

## Sesiones

La spec `sessions` ya declara:

- accion explicita del usuario;
- captura de hasta 50 tabs de la ultima ventana enfocada;
- intento por tab de PDF visual full-page;
- fallback a materializacion textual cuando la captura visual no esta
  disponible;
- cola local con estados `pending_local`, `syncing`, `synced`, `sync_failed`;
- handoff a `node-auth`;
- restore local mediante `restoreTabs`.

El runtime actual ya tiene piezas reales:

- `captureActiveWindowSessionTabs` enumera tabs y pide permisos por origen;
- `captureSessionTabAsFullPagePdf` activa la tab, hace scroll por segmentos,
  usa `captureVisibleTab` y compone PDF con `pdf-lib`;
- `createSessionCaptureService` itera tabs, intenta visual PDF y cae a PDF
  textual;
- `QuickSaveSurface` expone vista `sessions`, retry, restore y delete.

## Text Article PDF

`text-article-pdf` es una capacidad separada:

- trabaja sobre una sola pestaña activa;
- captura texto legible;
- genera un PDF textual cliente-side;
- vive en una cola separada;
- no preserva HTML completo ni representa una sesion multi-tab.

Debe mantenerse separado. No conviene usarlo como arreglo de session capture.

## Bugs / Gaps Confirmados

1. Captura visual multi-tab poco robusta:
   - activa cada tab, pero usa espera fija corta;
   - no espera carga/settle por tab;
   - no restaura la tab originalmente activa al final del lote.

2. Fallback textual indistinguible:
   - snapshot visual y snapshot textual usan `artifactType: "pdf"`;
   - la UI/consumer no puede saber si el PDF fue captura visual o degradacion
     textual.

3. Falta estado por tab:
   - no hay outcome explicito por tab;
   - errores como permiso, URL no soportada, tab demasiado larga o timeout no
     quedan como warning granular.

4. UI sin progreso/degradaciones por tab:
   - el usuario ve la sesion y acciones de cola, pero no una lectura clara de
     "captura visual", "fallback textual" o "fallo parcial".

5. QA insuficiente para paginas privadas:
   - hay tests unitarios de servicio, storage y gateway;
   - falta QA manual/automatica de tabs autenticadas, paginas lentas, scroll
     largo, permisos denegados y restauracion de foco.

## Organizacion Recomendada

Atacar en CRs chicos:

1. Primero corregir la captura visual tab-by-tab.
2. Despues formalizar metadata de outcome y warnings.
3. Luego mejorar UI/progreso.
4. Recien despues modelar `CredentialedWebSource` producido por extension.
5. Finalmente integrar con `LearningWorkspace` y QA mas amplia.

No conviene mezclar `DictionarySecret` backend capture en el primer fix. La
primera version privada debe usar la sesion del navegador del usuario.
