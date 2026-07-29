# Alcance De La Iniciativa Portfolio Publication Readiness

## Proposito

`INIT-PORTFOLIO-0001` agrupa el trabajo no-SST de estabilizacion y readiness de
publicacion para `4uentes-portfolio`.

La iniciativa existe para mantener el trabajo del portfolio separado de SST,
mientras usa el `4uentes-orchestor` compartido para catalogo, requests, state,
evidence, validacion y owner-documentation gates.

## Fundacion Completada

- `CR-4UENTES-0001`: establecio la particion de scope multi-solucion.
- `CR-4UENTES-0002`: reconcilio owner docs ARDS/SDD del portfolio.
- `CR-4UENTES-0003`: agrego baseline de estabilizacion local y
  `npm run check`.
- `CR-4UENTES-0004`: registro evidencia de smoke de rutas.
- `CR-4UENTES-0005`: corrigio fallback SPA de preview local para rutas
  directas.
- `CR-4UENTES-0006`: elimino ruido de validacion de remotes locales y warning
  de chunk en Vite.

## Baseline Actual

- `4uentes-portfolio` esta modelado bajo la solucion `4uentes`, no `sst`.
- `npm.cmd run check` pasa en el repo hijo.
- Las rutas directas de preview devuelven HTTP 200 con el shell de la app.
- `npm.cmd run check` del control-plane pasa sin warnings.

## Siguientes Candidatos

- Agregar evidencia con screenshots o Lighthouse cuando el browser tooling este
  disponible.
- Aplicar el posicionamiento `employment-first` y la taxonomia de evidencia al
  repo hijo.
- Seleccionar deploy target y validar fallback de rutas en produccion.
- Decidir el minimo mobile aceptable antes de promocion publica.
