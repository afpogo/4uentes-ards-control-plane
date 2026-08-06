# Implementación CR-SST-0129

Fecha: 2026-07-11.

Se implementó el contrato transversal de tipo semántico de artículo sin migrar
ni reclasificar datos históricos:

- `sst-bend` publica `payloadKind` como `web`, `text`, `transcript` o
  `unclassified`, derivado únicamente de `payload.kind`, y publica
  `filterType` por separado desde `filter.type`.
- `node-auth` preserva esa separación, aplica fallback a `payload.kind` y luego
  a `unclassified`, y elimina ambos campos derivados de escrituras upstream.
- `sst-fend` consume el contrato estricto, muestra `Unclassified` de forma
  explícita y no habilita edición ni `validate-active` mediante heurísticas de
  URL o filtro.

No se agregaron migraciones, escrituras masivas ni inferencias históricas.

