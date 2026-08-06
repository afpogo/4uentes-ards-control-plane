# Validación CR-SST-0129

Fecha: 2026-07-11.

## Resultados

- `sst-bend`: `npm.cmd run test:article-kind-contract` PASS.
- `sst-bend`: `npm.cmd run check` PASS (`[ARDS CHECK] OK`).
- `node-auth`: `npm.cmd run check` PASS (`[ARDS CHECK] OK`).
- `sst-fend`: tests focalizados PASS, 3 suites y 21 tests.
- `sst-fend`: `npm.cmd run check` PASS; build Webpack correcto, 29 suites y
  179 tests.

## Warnings existentes

- `sst-bend` no ejecutó smokes protegidos por ausencia de `SMOKE_JWT`; el
  verificador reportó cobertura parcial protegida.
- `sst-fend` conserva 22 warnings históricos de hooks y warnings deprecados de
  Ant Design/React en tests; cero errores de lint.
- Algunos tests de Dictionary intentan HTTP local a `::1:80` y registran
  `ECONNREFUSED`, pero la suite completa finalizó PASS.

## Gate de restauración resuelto

El 2026-07-12 se confirmó que `node-auth-fuentes-1`, `sst-fend` y `sst-bend-sst-1`
estaban activos. `sst-fend` respondió HTTP 200 y el JWKS público de `node-auth`
respondió HTTP 200. El control plane finalizó con 59 gates owner-documentation
válidos, cero warnings y cero fallas.
