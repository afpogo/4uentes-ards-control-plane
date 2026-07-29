# Implementación CR-SST-0130

Fecha: 2026-07-12.

- `sst-fend` centraliza el request de creación nativa. Para Text envía
  `payload.kind=text`, `data:{}` cuando no existe source URL, y omite URL vacía.
- El thunk conserva el payload Text solicitado sólo cuando una respuesta válida
  lo omite, evitando el fallback histórico a Web.
- `node-auth` normaliza URL/sourceUrl vacíos a ausentes únicamente para Text,
  preserva `payload.kind=text` y no serializa propiedades vacías upstream.
- Web y extensión quedaron fuera del alcance. El defecto Web descubierto se
  reservó por separado como `CR-SST-0141 / SST-71`.

