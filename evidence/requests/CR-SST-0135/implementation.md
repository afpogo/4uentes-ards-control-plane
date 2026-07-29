# Implementación CR-SST-0135

Fecha: 2026-07-12.

Se retiró únicamente el import y mount público `/filterArts`. Permanecen el
router, controller, DTO, casos de uso y repositorio compartidos porque las
rutas canónicas por artículo siguen utilizándolos.

Reemplazos documentados:

- `GET /articulos` con filtros de query.
- `GET/PATCH /articulos/:id/filter`.
- `POST /articulos/:id/filter/validate-active`.

No se hallaron consumidores runtime en `sst-fend` ni `node-auth`. El harness
manual conserva sólo las rutas canónicas y señala el retiro.

