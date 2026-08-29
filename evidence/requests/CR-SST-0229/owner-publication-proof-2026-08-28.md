# CR-SST-0229: evidencia de publicación owner

Fecha: 2026-08-28
Owner: `sst-4uentes-infra`
Resultado: `merged-and-read-back`

## Autorización

La instrucción `ok apruebo y continuemos` habilitó un worktree owner limpio,
el port selectivo del lote publicado, validaciones no mutantes y publicación
Git mediante commit, PR, merge y readback. No habilitó aplicar manifests,
recrear kind, reiniciar host/Docker/workloads, consultar Secrets o backups,
ejecutar probes runtime ni escribir Jira.

## Baseline y preservación

El worktree limpio se creó desde el `develop` leído directamente en GitHub:
`620c42ce9f1e2b7f2dfc81180a0409ec31d032a6`.

El árbol histórico permaneció en
`fix/SST-26/CR-SST-0086/development-gitops-readiness@f3f2737`, conservando sus
cambios staged, unstaged y sin trackear. No se limpió, stasheó, reseteó,
rebasó, cambió de branch, commiteó ni retiró.

## Resultado del port

El diff owner incluyó siete rutas:

- `docs/runbooks/argocd-kind-development.md`;
- `docs/runbooks/ngrok-durable-development.md`;
- `k8s-manifests/bootstrap/kind/sst-cluster-dev.kind.yml`;
- `specs/infra/clusters/00-index.yaml`;
- `specs/infra/clusters/sst-dev-kind.yaml`;
- `specs/states/00-index.yaml`;
- `specs/states/stabilize-kind-api-server-port.yaml`.

La octava ruta permitida, `argocd/argocd-project.yml`, quedó sin delta porque
`networking.k8s.io/NetworkPolicy` ya estaba publicada en `develop`. No se creó
una entrada duplicada ni se amplió la allowlist.

Las nueve rutas excluidas permanecieron fuera del diff. Tampoco se añadieron
referencias a `robots.txt` o `llms.txt`.

La identidad nueva usa `CR-SST-0229` como link canónico y conserva
`CR-SST-0210` sólo como procedencia histórica explícita. Los resultados
runtime del 24 y 25 de agosto se documentaron como evidencia histórica, no
como prueba de salud actual.

## Validaciones

- `sst-4uentes-infra npm run check`: PASS;
- gates estáticos de cifrado key-free: PASS;
- renders y `kubectl apply --dry-run=client`: PASS;
- `git diff --check`: PASS;
- parseo de cinco YAML modificados/agregados: PASS;
- scan focalizado de firmas sensibles: sin coincidencias;
- auditoría de rutas del PR: siete autorizadas, cero adicionales;
- `4uentes-orchestor npm run check` desde checkout limpio: PASS, incluido el
  validator de documentación owner.

GitHub ejecutó y aprobó cuatro checks del owner:

- `validate-repository`;
- `validate-desired-state`;
- `validate-manifests` de SST-Fend;
- `validate-manifests` de SST-Bend.

## Publicación y readback

- commit owner: `2b5a9bb8edd6df06a73a32554550d2ddbfb9d3ae`;
- PR owner: `#21`;
- merge owner: `d672fc463d268b99049f87373d5d2439b1fa38b9`;
- `develop` observado después del merge:
  `d672fc463d268b99049f87373d5d2439b1fa38b9`;
- el commit candidato es ancestro de `develop`;
- `specs/states/stabilize-kind-api-server-port.yaml` fue leído desde GitHub en
  `develop` después del merge.

El worktree owner limpio fue retirado después del readback. La branch y los
commits se conservaron.

## Estado restante

El owner está publicado, pero `CR-SST-0229` continúa `running`. Faltan una
matriz runtime read-only vigente, la publicación terminal del control plane y,
si se autoriza después, la corrección independiente de `SST-119` en Jira.
