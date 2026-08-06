# Descubrimiento CR-SST-0143

Fecha: 2026-07-13.

Durante QA autenticado de `article-semantic-kind`, Home recibió correctamente
`200` con catálogo vacío (`items=[]`, `total=0`). El efecto de
`src/pages/Dashboard/pages/Home/index.tsx` vuelve a despachar mientras
`articulos.length === 0`, por lo que el estado vacío válido se interpreta como
"todavía no cargado".

DevTools observó un primer request `200` seguido por casi 2.000 revalidaciones
`304` a `GET /api/articulos?page=1&limit=10&includeTags=true`. No hubo errores
de consola, pero el resumen quedó en `00` y se violó el gate de ausencia de
requests nuevos atribuibles al cambio.

Diagnóstico: defecto owner de `sst-fend`; backend/BFF responden el contrato
paginado correcto. No se amplía silenciosamente ningún CR cerrado.

