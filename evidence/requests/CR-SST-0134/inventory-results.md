# Inventario Read-only CR-SST-0134

Fecha: 2026-07-12.

No se ejecutaron escrituras, migraciones ni lectura de títulos/descripciones.
Sólo se consultaron agregados.

## Resultado

- Artículos totales: 104.
- Con payload: 81.
- Sin payload: 23.
- Con filtro: 104; sin filtro: 0.
- Payloads válidos: 66 `text`, 15 `web`.
- Mismatch `kind` / `payload_kind`: 0.
- Payloads con provider/providerRef: 0.
- Ambiguos: 23, distribuidos en 4 cuentas, creados entre 2026-04-20 y
  2026-06-24.
- Los 23 tienen URL no vacía, `filter.type=text`, preview asset y node `root`.
- Documentos: 19 sin documento, 2 con `source_pdf`, 2 con `agent_summary`.
- Ninguno tiene `article_preview_resolution` con procedencia semántica.

## Decisión

Cero filas admiten reclasificación automática segura. URL, `filter.type`,
preview, node y tipo de documento son señales operativas, no autoridad de
`payload.kind`. Las 23 filas requieren evidencia externa o revisión humana por
artículo.

