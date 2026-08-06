# CR-SST-0117 - Analisis Pre Implementacion

Fecha: 2026-07-04

## Estado Confirmado

- `CR-SST-0116` dejo persistencia de anotaciones aceptadas en `sst-bend`.
- El BFF expone la superficie `LearningWorkspace` consumida por `sst-fend`.
- `sst-fend` ya tenia:
  - captura local de anotaciones en la tab `Texto`;
  - preview/accept/reject en `LearningWorkspaceSheet`;
  - contexto aceptado mostrado como JSON.

## Brecha

La tab `Texto` capturaba anotaciones locales, pero no las enviaba al preview de
`LearningWorkspace`. Por eso el flujo no podia aceptar anotaciones por
`annotationIds` ni renderizar una vista final basada en contexto anotado
aceptado.

## Corte Seleccionado

Implementar en `sst-fend`:

- DTOs frontend para `annotations[]`, `serverAnnotationId` y `annotationIds`.
- Paso de anotaciones locales desde `ArticleCreateFlow` hacia
  `LearningWorkspaceSheet`.
- Preview con `annotations[]` por el BFF.
- Accept/reject con `annotationIds` cuando el backend los devuelve.
- Vista `Template renderizado` Markdown-like desde contexto aceptado.

## Boundaries

- No llamar directo a `sst-bend`.
- No agregar dependencia Markdown externa.
- No crear contrato backend de Markdown armado.
- No mezclar ArticleTag con LearningContentTag.
