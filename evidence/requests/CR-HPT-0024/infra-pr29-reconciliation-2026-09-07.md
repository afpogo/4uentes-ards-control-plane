# Reconciliación de la remediación ClamAV ya integrada

Rol: evidencia de integración. Owner: control plane para el lifecycle;
`sst-4uentes-infra` conserva la autoridad sobre manifests y documentación.
Fecha: 2026-09-07. Estado: integración Git confirmada, aceptación runtime pendiente.

La autorización «autorizo» habilita preparar y publicar el PR de memoria sin
merge ni modificación del clúster. El preflight encontró ese trabajo ya
implementado en el worktree owner existente, limpio, y fusionado remotamente.
Se reutilizó su evidencia y no se creó un PR owner duplicado.

## Integración observada

- Control plane [PR #274](https://github.com/afpogo/4uentes-ards-control-plane/pull/274):
  merge `d84d1f672efae0acfa94d1dab4626b8d2f85230a`.
- Infra [PR #29](https://github.com/afpogo/sst-4uentes-infra/pull/29):
  head `b654f1ae2210c471c53f0db49da6cb40bd276fb8`, merge
  `a3522df6fcefcda116af3a776ad2b45130f69125`, fusionado a las
  `2026-09-07T23:19:13Z`. Ese merge es la punta remota observada de `develop`.
- El head local está contenido en el merge remoto. El worktree está limpio.
- El merge precede a esta autorización; el readback registra el hecho sin
  conceder autorización retroactiva para merge o runtime.

El diff contiene exactamente siete paths owner:

1. `k8s-manifests/overlays/development/sst-bend/receipt-malware-scanner.patch.yml`.
2. `specs/infra/deployment-contracts/receipt-custody-platform.yaml`.
3. `specs/states/deploy-private-receipt-object-platform.yaml`.
4. `docs/infra/receipt-custody-delivery-plan.md`.
5. `docs/infra/receipt-custody-platform.md`.
6. `docs/playbooks/receipt-custody-adoption.md`.
7. `docs/runbooks/receipt-custody-development.md`.

El único cambio ejecutable es memoria de `receipt-clamav`: request de `768Mi`
a `3Gi` y límite de `1536Mi` a `4Gi`. Se conservan imagen, CPU, entrypoint,
probes, socket, volúmenes y restricciones de seguridad. Las specs y guías
incluyen el objetivo y mantienen pendiente la actualización real de firmas.

## Validación y límites

Los cuatro checks del PR pasaron. Los cuatro workflows posteriores al merge
también finalizaron con éxito sobre `a3522df`:

- `GitOps Desired State Validation`: run `34169637440`.
- `Validate SST-Bend GitOps`: run `34169637427`.
- `Validate SST-Fend GitOps`: run `34169637463`.
- `ARDS Infra Validation`: run `34169637438`.

`git diff --check` del cambio owner pasó. `npm run check` de Infra pasó
(exit 0), incluidos renders y `kubectl apply --dry-run=client`, sin aplicar
recursos. El check completo del control plane pasó con cero fallos.

## Observación runtime sin mutaciones

La consulta a Argo muestra `sst-app` `Synced/Healthy` en el merge `a3522df`.
El pod `sst-bend-78887f869-k6wbj` tiene `receipt-clamav` Ready, cero reinicios,
request `3Gi` y límite `4Gi`; arrancó a las `2026-09-07T23:22:34Z`.

El log de FreshClam muestra actualización de `daily.cld` desde `28102` a
`28116` con `Database test passed`. No se observa OOM en este contenedor.
La descarga funcionó en este arranque; esto no demuestra una remediación DNS
durable. FreshClam también registró que no pudo notificar a `clamd` porque
`/tmp/clamd.sock` aún no existía. Posteriormente apareció el socket.

Por tanto, la actualización en disco y el arranque están observados, pero falta
verificar qué versión cargó `clamd` y una recarga exitosa. No se ejecutó ningún
comando dentro del contenedor ni se disparó una actualización o reinicio.

La validación de manifests no demuestra que Argo haya convergido ni que las
firmas estén actualizadas. El siguiente paso es observar esos hechos. Una
actualización activa de firmas, restart, sync manual o remediación DNS requiere
alcance separado. El CR continúa `running`; no se escribieron comentarios,
links ni transiciones Jira en este gate.
