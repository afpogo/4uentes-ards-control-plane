# CR-SST-0100 - Manual QA gap analysis

Fecha: 2026-07-04

Observacion reportada:

- En `Sesiones(1)`, varias URLs aparecen con `captura visual no disponible -
  fallback PDF textual`.
- En SST todos los items tienen PDF, pero algunos PDFs son capturas visuales y
  otros son PDFs textuales.
- QA manual posterior: la sesion genero articulos de tipo texto con PDFs
  textuales, pero sin `preview image`; SST muestra preview no disponible.
- Los PDFs textuales contienen texto de la web, pero no imagenes de la pagina.

Analisis:

- El artifact final siempre es PDF (`application/pdf`) tanto para captura visual
  como para fallback textual.
- El tipo funcional de PDF se distingue por metadata local:
  - `outcome: visual-pdf`
  - `outcome: text-pdf-fallback`
  - `captureMode`
  - `warnings`
- El payload actual hacia `node-auth` no envia esos campos porque `CR-SST-0099`
  preservo compatibilidad backend/BFF.
- Por eso SST puede mostrar PDFs sin distinguir aun si vienen de imagen visual o
  texto materializado.
- Cuando el artifact es textual fallback, no existe una imagen visual confiable
  para usar como preview. Esto debe tratarse como contrato de preview, no solo
  como problema de UI local de extension.

Ajuste aplicado en CR-SST-0100:

- Los warnings locales dejan de ser solamente genericos.
- El fallback textual conserva reason codes cerrados cuando el browser expone una
  causa:
  - `unsupported-url`
  - `tab-readiness-timeout`
  - `visual-capture-too-long`
  - `visual-capture-metrics-unavailable`
  - `visual-capture-empty-image`
  - `visual-capture-unavailable`
  - `pdf-materialization-fallback`
- La UI muestra labels sanitizados, no mensajes crudos ni contenido privado.

Follow-up reservado:

- `CR-SST-0119`: configurable session capture mode.
- Motivo: la parametrizacion (`auto`, `solo visual`, `solo texto`,
  `preferir texto`) cambia comportamiento funcional y debe quedar fuera del
  cierre de `SST-32`.
- `CR-SST-0120`: preview image contract for session-derived articles.
- Motivo: SST necesita una decision explicita para preview image en articulos
  derivados de sesion textual: thumbnail visual, derivacion downstream o razon
  `preview unavailable` persistida.
