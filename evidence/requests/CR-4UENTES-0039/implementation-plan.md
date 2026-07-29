# Plan de implementacion CR-4UENTES-0039

Fecha: 2026-07-10

## Intencion

Estabilizar la base de publicacion del repo hijo Portfolio antes de intentar
publicar cambios pequenos de Experience, Projects o Home.

## Evidencia de origen

Durante la preparacion de publicacion de CR-4UENTES-0036 se probaron cortes
limpios contra `origin/main` y `origin/develop`.

- El corte control-plane solo Portfolio empezo a requerir reconciliacion de
  estado ajena a Portfolio si se tomaba desde `origin/main`.
- El corte Portfolio solo Experience no compilo contra `origin/develop` por
  dependencias Sass/Vite acumuladas.

Referencia: `evidence/requests/CR-4UENTES-0036/github-publication-readiness.md`.

## Alcance

- Separar la publicacion base de Portfolio de los cambios visibles posteriores.
- Estabilizar build tooling y Sass base.
- Confirmar owner docs/specs del repo hijo.
- Revalidar `npm.cmd run build`.
- Revalidar QA visual de rutas principales.

## Fuera de alcance

- Activar descarga de CV.
- Agregar backend, BFF, auth o analytics.
- Reconciliar backlog SST/control-plane no relacionado a Portfolio.
- Publicar CR-4UENTES-0036 como PR aislado mientras falle contra
  `origin/develop`.

