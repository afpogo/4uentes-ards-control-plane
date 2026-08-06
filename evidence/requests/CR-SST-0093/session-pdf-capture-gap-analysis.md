# CR-SST-0093 - Analisis De Captura PDF Por Sesion

## Contexto

El objetivo funcional es capturar contenido privado que el usuario ya puede ver
en su navegador, por ejemplo paginas autenticadas, y convertirlo en un artefacto
que SST pueda previsualizar, aceptar, tratar con IA, guardar o combinar con
otros contenidos.

El flujo correcto para una sesion privada no es `text-article-pdf`. Ese flujo
sirve para una pestaña activa y genera un PDF textual desde contenido legible.
Para una sesion con varias pestañas, el flujo relevante es `sessions`.

## Fuentes Revisadas

Lectura read-only de `sst-extension`:

- `specs/features/sessions.yaml`
- `specs/features/text-article-pdf.yaml`
- `src/platform/tabs/capture-active-window-sessions.ts`
- `src/platform/tabs/capture-session-tab-fullpage-pdf.ts`
- `src/platform/pdf/materialize-session-pdf.ts`
- `src/features/sessions/create-session-capture-service.ts`
- `src/shared/sessions.ts`

No se modifico `sst-extension`.

## Hechos Observados

`text-article-pdf`:

- captura una unica pestaña activa;
- usa texto legible de la pagina;
- materializa un PDF cliente-side;
- no usa secretos del Diccionario;
- depende de que el usuario ya tenga sesion en la pagina privada si el contenido
  requiere autenticacion;
- no preserva HTML completo ni captura visual multi-pestaña.

`sessions`:

- enumera pestañas de la ultima ventana enfocada;
- limita el set a 50 pestañas;
- conserva metadata por pestaña: `id`, `windowId`, `url`, `title`,
  `selected`, `index`, `pinned`, `restorable`;
- pide permisos de origen para URLs `http` y `https`;
- itera sobre cada pestaña con `for (const tab of tabs)`;
- intenta primero `captureSessionTabAsFullPagePdf`;
- si falla la captura visual, cae a captura textual y genera un PDF textual;
- registra cada snapshot como `artifactType: "pdf"`.

`captureSessionTabAsFullPagePdf`:

- activa la pestaña objetivo con `browser.tabs.update(tab.id, { active: true })`;
- espera solo `160 ms` con `waitForTabPaint`;
- lee metricas de scroll;
- hace scroll por segmentos;
- captura cada segmento con `browser.tabs.captureVisibleTab(windowId)`;
- compone un PDF con imagenes usando `pdf-lib`;
- en `finally`, vuelve a activar la misma pestaña capturada, no la pestaña
  originalmente activa antes de la sesion.

## Gap Principal

El codigo ya intenta ir pestaña por pestaña, pero el ciclo no es todavia una
captura de sesion confiable para paginas privadas reales.

Gaps concretos:

- No hay espera explicita de `tabs.onUpdated status=complete`, `document.readyState`
  estable, quietud de layout, red minima o settle configurable por pestaña.
- La espera fija de `160 ms` puede capturar paginas a medio renderizar, pantallas
  de carga, contenido virtualizado incompleto o estados de autenticacion aun no
  aplicados.
- No se registra si el PDF final es visual o textual. El fallback textual queda
  con `artifactType: "pdf"`, igual que la captura visual.
- El fallback textual puede ocultar un fallo de captura visual si la UI o el BFF
  lo presentan como PDF de sesion exitoso.
- El `finally` restaura la pestaña capturada, no la pestaña activa original de
  la ventana. Al finalizar un lote, el usuario puede quedar parado en la ultima
  pestaña procesada.
- No se observa evidencia de QA manual que valide sesiones privadas multi-tab
  con paginas autenticadas, render lento, scroll largo, tabs fijadas y fallos
  parciales.

## Interpretacion

El problema no es que el servicio ignore todas las pestañas. La implementacion
si itera tabs y si intenta activar cada una. El problema es que la captura
multi-tab aun no esta tratada como una operacion de sesion robusta y auditable.

Para el caso de uso de `CredentialedWebSource`, este gap importa porque un PDF
parcial, textual o capturado antes de que la pagina termine de autenticarse puede
producir conocimiento incompleto o equivocado dentro de SST.

## Requisito ARDS/SDD

Antes de conectar esta ruta con `DictionarySecret` o `LearningWorkspace`, la
captura de sesion debe:

- activar cada pestaña capturable de manera explicita;
- esperar carga y settle por pestaña;
- capturar el PDF visual o marcar fallback textual como degradado;
- conservar warning/error por pestaña sin abortar toda la sesion cuando sea
  posible;
- restaurar la pestaña originalmente activa al final;
- no guardar contenido privado en evidencia;
- no usar secretos del Diccionario en el cliente.

## Decision

`text-article-pdf` queda aceptado como flujo single-tab textual.

`sessions` queda identificado como el flujo correcto para capturas privadas
multi-tab, pero requiere un CR futuro de implementacion en `sst-extension`
antes de considerarse una fuente confiable para `CredentialedWebSource`.
