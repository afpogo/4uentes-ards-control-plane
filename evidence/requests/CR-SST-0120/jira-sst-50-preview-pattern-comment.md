CR-SST-0120 / SST-50 - intencion de diseno asentada

Nueva intencion:

Definir un patron reusable para conservar o generar `preview image` en articulos SST creados desde URL, foto/imagen provista, captura de `sst-extension` o PDF/text article derivado de una web.

Patron propuesto:

- `ArticlePreviewResolver`
- Entrada: URL fuente, imagen provista, thumbnail de productor, capture mode y politica de privacidad.
- Salida: `status`, `source`, `image_ref`/`image_url`, `reason` y `provenance`.

Orden recomendado:

1. Usar imagen provista si existe y es valida.
2. Usar thumbnail visual producido por `sst-extension` si existe.
3. Resolver metadata publica desde URL cuando la politica lo permita: `og:image`, `twitter:image`, favicon.
4. Para URLs privadas, permitir thumbnail local solo con politica explicita.
5. Si no hay imagen segura, generar placeholder gobernado y persistir `preview_unavailable_reason`.

Aplicacion prevista:

- Primero en `sst-extension` como productor opcional de preview cuando ya captura una web.
- Luego en SST frontend como consumidor consistente del contrato, evitando previews vacios ambiguos.

Boundary:

- Jira es mirror operativo; ARDS/SDD permanece como fuente de verdad.
- No se incluye contenido privado, raw PDFs, screenshots privadas, cookies, JWTs ni secretos.
- La evidencia de diseno queda en `evidence/requests/CR-SST-0120/preview-image-design-pattern.md`.
