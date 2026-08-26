# Publicacion De Infraestructura Y Preflight Live De CR-HPT-0021

Fecha: 2026-08-25.

## Publicacion Owner De Infraestructura

- Base canonica: `sst-4uentes-infra origin/develop@126f25eeed4d20b7ecba35036a7e35530482c946`.
- Worktree aislado: `worktrees/CR-HPT-0021-infra-owner`.
- Commits owner: `76811733d3f07d9f506cda806b914fd808910265`,
  `439a48f` y `b8d79014e81d7c881b58932f78284d1f5f33e27e`.
- Pull request: `afpogo/sst-4uentes-infra#18`.
- Merge owner: `f6dc7088a90c578e379c0ded43e02f32e56c98c0`.
- Los cuatro checks remotos (`validate-desired-state`, dos ejecuciones de
  `validate-manifests` y `validate-repository`) aprobaron el head final.

El primer modelo fue corregido antes del merge para evitar que publicar el PR
activara automaticamente el runtime. El diff neto deja byte por byte sin
cambios el `kustomization.yml` y el patch de SST consumidos por el overlay
development activo. Los manifests, la imagen inmutable y
`PHINANCE_PROXY_ENABLED=true` existen solamente en
`k8s-manifests/preview/phinance-development`.

## Validacion Del Desired State

- `npm run check`: aprobado.
- El overlay development activo no renderiza `phinance-api`,
  `phinance-postgres` ni `PHINANCE_PROXY_ENABLED`.
- El preview renderiza API, PostgreSQL efimero, migracion Alembic, proxy e
  imagen `ghcr.io/mena28/phinance-api:develop-c4b66e06c749297f268e60ac986613bebd8750ef`.
- El preview contiene cero documentos Ingress de Phinance.
- El dry-run client del preview fue aprobado.

## Preflight Read-only Del Cluster

- Contexto: `kind-sst-cluster-dev`.
- Nodos `sst-cluster-dev-control-plane` y `sst-cluster-dev-worker`: `Ready`,
  Kubernetes `v1.32.0`.
- Argo CD `argocd/sst-app`: `Synced`, `Healthy`, revision observada
  `126f25eeed4d20b7ecba35036a7e35530482c946`. Esta es la revision de rollback
  previa a la publicacion del preview.
- `ghcr-pull-secret` existe como `kubernetes.io/dockerconfigjson`; se verifico
  unicamente la key `.dockerconfigjson` y el enlace desde el service account
  `default`. No se leyo ni imprimio su valor.
- `phinance-postgres-secret` no existe.
- Kindnet corre en ambos nodos. La inspeccion read-only de nftables confirmo la
  tabla `kindnet-network-policies` y las cadenas que envian trafico a enforcement
  en ambos nodos. Esto es consistente con el soporte NetworkPolicy incorporado
  por kind desde v0.24.0, documentado en
  `https://github.com/kubernetes-sigs/kind/releases/tag/v0.24.0`.

## Estado De La Compuerta

No hubo mutacion del cluster, Secret ni reconciliacion de Argo CD. La prueba de
pull de la imagen privada y la activacion siguen bloqueadas hasta disponer del
Secret efimero de PostgreSQL por el mecanismo operator aprobado. La solicitud
vigente prohibe cambiar valores de Secret y registra su provision fuera de Git,
por lo que el agente no lo crea implicitamente.
