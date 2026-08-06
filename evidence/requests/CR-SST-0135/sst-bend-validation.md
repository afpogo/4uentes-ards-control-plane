# Validación Sst-bend CR-SST-0135

Fecha: 2026-07-12.

- `npm.cmd run test:filterarts-retired`: PASS.
- Cubre 404 para GET/POST colección y GET/PATCH/DELETE item legacy.
- Cubre 401 sin token para GET/PATCH/validate-active canónicos y confirma sus
  middlewares de JWT/contexto de cuenta.
- `npm.cmd run check`: PASS (`[ARDS CHECK] OK`).
- Warnings protegidos preexistentes por ausencia de `SMOKE_JWT`.

