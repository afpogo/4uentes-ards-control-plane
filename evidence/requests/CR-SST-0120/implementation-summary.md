# CR-SST-0120 - Implementation summary

## Estado

- Fecha: 2026-07-05
- Jira: `SST-50`
- Epic: `SST-29`
- Boundary ejecutado: `sst-fend` frontend consumer slice
- Estado: implementado localmente, pendiente de cierre formal y de slices
  productores/BFF futuros si se decide persistir thumbnails.

## Intencion

Adoptar en `sst-fend` el patron `ArticlePreviewResolver` para que los articulos
SST tengan una presentacion gobernada de preview image, incluso cuando el
origen sea una captura textual o PDF textual generado desde `sst-extension`.

## Cambios Implementados

- Se agrego un contrato frontend defensivo `ArticlePreviewResult` con
  `status`, `source`, `imageRef`, `imageUrl`, `reason` y `provenance`.
- Se incorporo un resolver puro en `Articles` para normalizar:
  - preview disponible;
  - preview pendiente;
  - preview no disponible;
  - preview rechazada por politica;
  - placeholder deterministico por host/tipo.
- `ArticlesList` y `ArticleFormView` consumen el resolver antes de llamar al
  endpoint legacy de preview blob.
- El endpoint legacy `/preview-image` se conserva para compatibilidad cuando no
  existe contrato explicito que indique `unavailable` o `rejected`.
- Los articulos text-only muestran razon funcional en UI en lugar de un vacio
  ambiguo.

## Boundary

No se modificaron:

- `sst-extension`
- `node-auth`
- `sst-bend`
- contratos API upstream
- persistencia de previews

La implementacion es consumidora y defensiva: si un productor futuro publica
metadata de preview, `sst-fend` ya puede renderizar estados gobernados sin
romper compatibilidad actual.

## Archivos Owner Actualizados

- `specs/33-articles-frontend.yml`
- `docs/33-articles-frontend.md`
- `docs/tasks/2026-07-05-cr-sst-0120-article-preview-resolution-ui.md`

## Guardrails

- No se guardaron screenshots privados en ARDS/SDD ni Jira.
- No se registraron URLs privadas completas en evidencia nueva.
- No se agregaron secrets, cookies, JWTs, raw PDFs ni contenido privado.
- La generacion/persistencia de thumbnails privados queda fuera de este CR.
