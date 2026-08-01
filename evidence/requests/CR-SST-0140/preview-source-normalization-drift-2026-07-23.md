# CR-SST-0140 - drift de normalización de fuentes de preview

Fecha: 2026-07-23  
Estado: corrección owner-scoped validada

Durante la preparación del QA integrado se comparó el contrato declarado con
el normalizador runtime de `sst-fend`.

## Hallazgo

El tipo frontend y la evidencia de implementación reconocen las fuentes
`extension-thumbnail` y `video-poster`, pero
`normalizePreviewSource` no las conserva y las degrada a `none`. Los tests del
mapper tampoco cubren esos dos valores.

## Disposición

La corrección permanece dentro de `CR-SST-0140 / SST-70`, cuyo owner y límite
de mutación es `sst-fend`:

- aceptar ambas fuentes en el normalizador;
- agregar cobertura focalizada para evitar la regresión;
- ejecutar el check completo de `sst-fend`;
- corregir la evidencia anterior, que no debe considerarse prueba suficiente
  hasta que el test pase.

Los owner docs ya describen el contrato deseado; el defecto está en la adopción
runtime, no en una nueva decisión funcional.

## Resultado

- `normalizePreviewSource` conserva `extension-thumbnail` y `video-poster`.
- Se agregó un test parametrizado para ambas fuentes.
- Test focalizado: 17/17 PASS.
- `npm.cmd run check`: PASS, 30 suites y 189 tests.
- El check mantiene 22 warnings preexistentes de hooks y 0 errores.
- No fue necesario cambiar owner docs porque ya expresaban el contrato correcto.
