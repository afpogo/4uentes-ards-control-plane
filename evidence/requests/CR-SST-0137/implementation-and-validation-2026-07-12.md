# CR-SST-0137 - Implementacion Y Validacion

## Implementacion

Repo owner: `sst-bend`.

- Tabla 1:1 `article_preview_resolutions` con migracion reversible.
- Assets binarios permanecen en `article_assets`; no se usa
  `article_documents` para thumbnails.
- `previewCandidate` opcional en articulos y tabs de sesion.
- Validacion server-side de base64, magic bytes PNG/JPEG/WebP, 96 KiB,
  dimensiones, tamaño y SHA-256.
- Resolver con degradacion a estados gobernados; las fallas de preview no
  revierten articulo o sesion.
- `preview`, `previewAssetId` y `tabs[].preview` quedan publicados.
- La URL `browser-session` no se vuelve a navegar desde backend.

## Owner Docs

- `specs/features/article-preview-resolution.yaml`
- `docs/features/article-preview-resolution.md`
- `specs/capabilities/outbound/article-preview-resolution-v1.yaml`
- `docs/capabilities/outbound/article-preview-resolution-v1.md`
- `specs/capabilities/outbound/browser-extension-session-ingestion.yaml`
- `docs/api/19-browser-extension-sessions.md`

## Validacion

- `npm.cmd run test:article-preview-resolution`: PASS.
- `npm.cmd run build`: PASS.
- Migracion `up`: PASS.
- Migracion `down` seguida de `up`: PASS; la DB queda migrada.
- `npm.cmd run check`: PASS con cobertura protegida parcial por ausencia de
  `SMOKE_JWT`; el propio gate reporta 50% y omite los smokes autenticados.

## Pendiente Antes De Cierre

- Ejecutar coverage HTTP autenticada con JWT owner/user sanitizados.
- Ejecutar `npm.cmd run check` del control plane despues de la reconciliacion.

No se guardaron URLs privadas, contenido, cookies, JWT, PDF, thumbnails ni
secretos en esta evidencia.
