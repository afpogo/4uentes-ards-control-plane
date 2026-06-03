# CR-SST-0020 - Estado Actual Del Cluster

Observado el: 2026-05-31

## Resumen

El contexto Kubernetes activo es `kind-sst-cluster-dev`. El namespace SST
observado es `4uentes-sst` y los workloads principales estan listos. Esta
evidencia es de solo lectura: no se aplicaron manifests ni se modificaron repos
hijos.

## Contexto Y Namespaces

- Contexto activo: `kind-sst-cluster-dev`
- Namespaces observados:
  - `4uentes-sst`
  - `default`
  - `kube-node-lease`
  - `kube-public`
  - `kube-system`
  - `local-path-storage`
  - `nginx-ingress`

## Workloads SST

Pods en `4uentes-sst`:

| Pod | Estado | Readiness | Imagen logica |
|---|---|---:|---|
| `node-auth-*` | `Running` | `1/1` | `ghcr.io/afpogo/4uentes-auth:develop` |
| `node-auth-mongo-0` | `Running` | `1/1` | `mongo:6.0.6` |
| `sst-bend-*` | `Running` | `1/1` | `ghcr.io/afpogo/sst-bend:develop` |
| `sst-bend-migrations-*` | `Completed` | `0/1` | `ghcr.io/afpogo/sst-bend:develop` |
| `sst-fend-*` | `Running` | `1/1` | `ghcr.io/afpogo/sst-fend:develop` |
| `sst-postgres-0` | `Running` | `1/1` | `postgres:11` |

Services en `4uentes-sst`:

| Service | Tipo | Puerto | Uso |
|---|---|---:|---|
| `sst-fend-service` | `ClusterIP` | `80` | UI |
| `node-auth-service` | `ClusterIP` | `4000` | BF/auth, `/api`, JWKS |
| `sst-bend-service` | `ClusterIP` | `3005` | API SST interna/debug |
| `node-auth-mongo-service` | `ClusterIP` headless | `27017` | identity store |
| `sst-postgres-service` | `ClusterIP` | `5432` | domain store |

El Ingress controller observado es `nginx-ingress/nginx-ingress`, expuesto como
`NodePort` con `80:32080` y `443:32443`.

## Ingress Actual

Ingress: `4uentes-sst/sst-ingress`

- `ingressClassName`: `nginx`
- Hosts:
  - `localhost`
  - `sst.local`
  - `sst-bend.local`
  - `node-auth.local`
  - `sst-fend.local`
- No hay `spec.tls` en el Ingress actual.
- Las reglas `localhost` y `sst.local` enrutan:
  - `/.well-known/jwks.json` -> `node-auth-service:4000`
  - `/api` -> `node-auth-service:4000`
  - `/` -> `sst-fend-service:80`
- Los hosts `sst-bend.local`, `node-auth.local` y `sst-fend.local` son utiles
  para debug/local, no para exposicion publica directa.

## Smoke Local Observado

| URL | Resultado |
|---|---|
| `http://localhost:8088/` | `200 text/html` |
| `http://localhost:8088/.well-known/jwks.json` | `200 application/json; charset=utf-8` |
| `http://localhost:8088/api/auth/extension/session` | `401 application/json; charset=utf-8` |

El `401` en `extension/session` es compatible con una ruta protegida sin
`Authorization: Bearer`; no indica falla de Ingress.

## Argo CD

Argo CD no esta observable como API/CRD en el cluster actual:

- `kubectl get crd applications.argoproj.io` devolvio `NotFound`.
- `kubectl get applications.argoproj.io -A` devolvio que el recurso no existe.
- No se observo namespace `argocd`.
- No se observaron pods `argocd-server`.

La configuracion Argo CD si existe versionada en `sst-4uentes-infra`:

- `argocd/argocd-app.yml`
- `targetRevision: develop`
- `path: k8s-manifests/overlays/development`

Conclusiones:

- El estado live actual del cluster no permite consultar sync/health de Argo CD.
- La evidencia de GitOps queda como desired state versionado, no como CRD live
  validado en este cluster.
