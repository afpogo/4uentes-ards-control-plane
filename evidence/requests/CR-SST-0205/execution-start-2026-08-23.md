# Inicio de ejecución de CR-SST-0205

## Autorización y frontera

El usuario autorizó explícitamente el 2026-08-23 iniciar `CR-SST-0205`.
La autorización permite mutar únicamente `sst-4uentes-infra` para preparar el
runtime Redis de development mediante GitOps.

No autoriza escrituras Jira, cambios en repos funcionales, producción, datos
productivos, `kubectl apply`, sincronización Argo CD ni otra acción directa
sobre un cluster.

## Gates previos

- `CR-SST-0202` y `CR-SST-0204` están `done` en el control plane.
- El contrato owner de retención y degradación pertenece a `sst-bend`; Infra
  debe consumirlo sin redefinir claves, TTL ni semántica funcional.
- El checkout canónico observado en `4uentes-infra/sst-4uentes-infra` contiene
  cambios ajenos y debe preservarse intacto.
- Este lifecycle `running` debe publicarse y pasar `npm run check` antes de
  cualquier mutación del repo hijo.

## Aislamiento requerido

- Owner: `sst-4uentes-infra`.
- Base: último `origin/develop` observado después de `fetch`.
- Branch: `feat/CR-SST-0205/development-redis-runtime`.
- Worktree: `4uentes-orchestor/worktrees/CR-SST-0205-infra-owner`.

## Gate de cierre owner

Se requieren specs y documentación owner, render Kustomize, dry-run client,
scan de secretos/exposición y `npm run check` del repo owner. El control plane
debe ejecutar además su `npm run check` completo antes de publicar o cerrar.
