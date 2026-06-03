# CR-SST-0020 - Analisis De Branch E Imagenes

Observado el: 2026-05-31

## Estado GitOps Versionado

La configuracion versionada en `sst-4uentes-infra` declara:

- Argo CD Application: `argocd/argocd-app.yml`
- `repoURL`: `https://github.com/afpogo/sst-4uentes-infra.git`
- `targetRevision`: `develop`
- `path`: `k8s-manifests/overlays/development`

El cluster actual no expone CRD/API de Argo CD, por lo que esta observacion es
de desired state versionado, no de sync live.

## Imagenes Del Overlay Actual

`k8s-manifests/overlays/development/kustomization.yml` declara:

| Componente | Imagen |
|---|---|
| `sst-fend` | `ghcr.io/afpogo/sst-fend:develop` |
| `sst-bend` | `ghcr.io/afpogo/sst-bend:develop` |
| `4uentes-auth` / `node-auth` | `ghcr.io/afpogo/4uentes-auth:develop` |

El cluster observado ejecuta esos mismos tags logicos en deployments y job de
migraciones.

## Riesgo De Tags Mutables

`develop` es un tag mutable. Si se usa como referencia runtime directa para una
URL publica, el cluster puede cambiar de artefacto sin que el desired state en
Git cambie de forma auditable.

Riesgos:

- drift entre branch, imagen publicada y pod real;
- rollback dificil si el tag fue sobrescrito;
- evidencia de release incompleta;
- confundir `main` como fuente de verdad con `main` como tag runtime mutable.

## Main Vs Develop

No se recomienda cambiar el cluster a `main` como tag runtime directo. `main`
puede ser fuente de releases o integracion, pero el cluster no deberia ejecutar
`ghcr.io/afpogo/*:main` como referencia mutable.

Modelo recomendado:

1. Cada repo de app produce una imagen por commit/release.
2. La imagen se publica con tag inmutable, por ejemplo `release-<version>` o
   `<short_sha>`.
3. La fase de promocion resuelve el digest de GHCR.
4. `sst-4uentes-infra` actualiza el overlay con tag inmutable o, mejor, digest
   `image@sha256:<digest>`.
5. Argo CD reconcilia desde un commit auditable de infra.

## Politica Recomendada

- `main`: fuente de release/integracion, no tag mutable runtime directo.
- `develop`: ambiente de desarrollo, no evidencia suficiente para publicacion
  productiva.
- Runtime publico controlado: tag de release o digest inmutable.
- Rollback: revertir commit GitOps o restaurar digest/tag anterior.

## Repos Afectados En La Siguiente Fase

- `sst-4uentes-infra`: desired state, Ingress, image refs, validation.
- `sst-fend`: build de imagen y smoke UI.
- `sst-bend`: build de imagen, migraciones y smoke funcional.
- `4uentes-auth`: build de imagen, cookies/auth/JWKS y smoke de sesion.

`sst-extension` queda fuera del cluster en esta fase, pero debe entrar en la
validacion si el dominio publico cambia su base URL o sus permisos de origin.
