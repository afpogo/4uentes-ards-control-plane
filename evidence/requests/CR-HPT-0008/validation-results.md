# CR-HPT-0008 — resultados de validación

Fecha: 2026-08-22

## Orden y autorización

- La propuesta fue aprobada explícitamente por el usuario.
- El request running y la evidencia de autorización existían antes de mutar el
  owner.
- El preflight del control plane pasó antes de la mutación hija.

## Owner

- Suite sin PostgreSQL configurado: `10 passed, 2 skipped`.
- Gate PostgreSQL 16 efímero: `2 passed, 10 deselected`.
- La primera prueba ejecutó `downgrade base` y `upgrade head`.
- La segunda ejercitó la API con PostgreSQL, ownership inyectado, cantidad
  `NUMERIC(30,10)` y dos audit events atómicos.
- `node scripts/check-contracts.js`: PASS.
- `git diff --check`: PASS.
- Harness HTTP vivo: PASS para health, readiness, OpenAPI y boundary 503.
- QA MCP Chrome DevTools: PASS parcial; ver `manual-qa-partial.md`.

PostgreSQL se ejecutó en un contenedor temporal exacto
`phinance-cr-hpt-0008-postgres`, publicado sólo en `127.0.0.1:55432`. El
contenedor y sus datos descartables fueron detenidos y eliminados luego del
gate. No se creó ni modificó infraestructura versionada.

## Resultado owner

- Commit: `b46608e`.
- El documento histórico modificado por el usuario quedó sin stage y sin
  cambios atribuibles a CR-HPT-0008.

## Control plane

`npm run check` completo y `git diff --check`: PASS.

- catálogo: 5 OK, 0 FAIL;
- bindings locales: 41 OK, 4 WARN preexistentes, 0 FAIL;
- state model: 56 OK, 0 FAIL;
- iniciativas: 22 OK, 0 FAIL;
- owner documentation: 117 OK, 0 FAIL;
- documentación visual: 10 mapas, 0 FAIL.
