CR-SST-0120 / SST-50 - inicio de trabajo

Se inicia el analisis del contrato reusable de preview image para articulos SST creados desde URL, imagen provista, captura de `sst-extension` o PDF/text article derivado de una web.

Alcance inicial:

- Formalizar `ArticlePreviewResolver`.
- Definir owner boundary entre productor (`sst-extension`), ingestion (`node-auth`) y consumidor (`sst-fend`).
- Evitar previews vacios ambiguos mediante `available`, `pending`, `unavailable` o `rejected` con `reason` gobernado.

Boundary:

- Este inicio no implementa aun cambios en todos los repos.
- Toda mutacion futura de repo hijo requiere owner docs y enforcement.
- No se incluyen screenshots privadas, raw PDFs, cookies, JWTs ni secretos.

Evidencia inicial:

- `evidence/requests/CR-SST-0120/preliminary-analysis.md`
- `evidence/requests/CR-SST-0120/preview-image-design-pattern.md`

Jira es mirror operativo; ARDS/SDD permanece como fuente de verdad.
