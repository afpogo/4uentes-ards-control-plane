# Readback de runtime de desarrollo de CR-SST-0234

## Resultado

Resultado: `PASS` para promoción, GitOps, rollout, schema y frontera HTTP;
`PENDING` para QA positiva autenticada del flujo Learning.

## Branches y refs actualizadas

- Control plane: `origin/main@5d903e89228f737a0bf815845d003e8c364ffe88`.
- `sst-bend`: `origin/develop@fdc753ff0bf96e8b8b5f603a9aae11503aa2ace1`.
- Infra: `origin/develop@c1588779eeafddf19d888fa1142923faa0e214da`.

El remote local de Infra usa SSH y no había credencial disponible. La ref se
refrescó mediante HTTPS sin modificar la configuración del remote. Su checkout
primario contiene cambios ajenos y se preservó sin checkout, merge ni edición.

## GitOps y workload

- Contexto: `kind-sst-cluster-dev`.
- Argo Application: `sst-app`.
- Sync: `Synced`.
- Health: `Healthy`.
- Revision: `c1588779eeafddf19d888fa1142923faa0e214da`.
- Rollout: `deployment/sst-bend successfully rolled out`.
- Deployment `sst-bend`: `1/1` disponible.
- Pod: `sst-bend-5b4c699c44-86jxr`, `2/2 Running`, `0` restarts.
- Imagen declarada: `ghcr.io/afpogo/sst-bend:develop-fdc753ff0bf9`.
- Image ID observado:
  `ghcr.io/afpogo/sst-bend@sha256:59406118cb5c5298bb6f92071270dabbd934156cee01cf890ab8ce14de8e0343`.

El deployment `scrapper` también usa el tag `develop-fdc753ff0bf9` y está
disponible `1/1`.

## Schema

La inspección read-only de `learning_source_refs` confirmó:

- `snapshot_id varchar(64)`;
- `snapshot_version varchar(255)`;
- `snapshot_content_hash varchar(64)`;
- `snapshot_captured_at timestamptz`;
- índice `learning_source_refs_snapshot_identity_idx` sobre
  `(workspace_id, snapshot_id)`.

La presencia conjunta de columnas e índice prueba que la migración
`20260905200000-add-learning-source-snapshot-identity.js` fue aplicada por el
hook GitOps. No se consultaron filas de negocio.

## HTTP

Probes contra el ingress local con `Host: sst-bend.local`:

```text
GET  /4uentes/v1/public/gallery                         -> 200
GET  /4uentes/v1/learning-workspaces/me                 -> 401 sin JWT
POST /4uentes/v1/learning-workspaces/sources/preview    -> 401 sin JWT
```

El `200` prueba disponibilidad HTTP. Los `401` prueban que las rutas Learning
están montadas y conservan el boundary JWT; no sustituyen una prueba funcional
positiva.

## Gap restante

Falta QA autenticada owner con fixtures sintéticos para resolver `article`,
`article_document` y `agent_output`, revisar snapshot y ejecutar
preview/accept/context. No se buscó ni utilizó un JWT existente porque eso
ampliaría el gate hacia credenciales y datos.

Jira tampoco se modificó: sigue requiriendo el lote exacto previamente
identificado.
