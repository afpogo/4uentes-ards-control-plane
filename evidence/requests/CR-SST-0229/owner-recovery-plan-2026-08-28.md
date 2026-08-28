# CR-SST-0229: plan de recuperación del owner

Fecha: 2026-08-28  
Estado: `approved-for-plan-publication-only`  
Owner: `sst-4uentes-infra`

## Decisión

La recuperación debe hacerse mediante un port semántico y selectivo hacia un
worktree owner limpio. No se debe commitear, limpiar, resetear, cambiar de
branch, hacer stash, rebase, merge completo ni cherry-pick completo sobre el
árbol histórico.

El objetivo es recuperar la configuración durable de la API de kind en
`127.0.0.1:16443` y del ingress en `127.0.0.1:8088 -> 32080`, preservando la
procedencia histórica sin adoptar cambios ajenos que comparten el mismo árbol.

## Tres estados que no deben confundirse

1. El árbol histórico está en
   `fix/SST-26/CR-SST-0086/development-gitops-readiness@f3f2737` y contiene
   cambios staged, unstaged y sin trackear.
2. GitHub reportó `develop@5a21935` como rama activa de integración; los PRs
   recientes del owner se fusionan allí.
3. El `origin/develop` local apuntó a un commit distinto del leído mediante la
   API de GitHub. Ese remote-tracking ref local no prueba por sí solo cuál es la
   base remota actual.

Aunque GitHub declara `main` como default branch, `main@176f0f4` permanece en
el commit inicial. Usarlo como base descartaría la evolución real de
infraestructura. Antes de ejecutar se debe volver a leer el SHA vivo de
`develop`; ningún SHA de este plan se trata como permanente.

## Clasificación de archivos

Cuatro rutas tienen cambios tanto en el árbol histórico como entre su HEAD y
el `develop` observado. Requieren merge semántico manual:

- `argocd/argocd-project.yml`;
- `docs/runbooks/argocd-kind-development.md`;
- `specs/infra/clusters/sst-dev-kind.yaml`;
- `specs/states/00-index.yaml`.

Cuatro rutas no mostraron cambio upstream desde el HEAD histórico, pero aun
así deben revisarse hunk por hunk:

- `k8s-manifests/bootstrap/kind/sst-cluster-dev.kind.yml`;
- `specs/infra/clusters/00-index.yaml`;
- `docs/runbooks/ngrok-durable-development.md`;
- `specs/states/stabilize-kind-api-server-port.yaml`, actualmente sin trackear.

`docs/runbooks/argocd-kind-development.md` tiene cambios staged y unstaged. La
recuperación deberá considerar el resultado combinado frente a `HEAD`, sin
alterar el index histórico.

El resto de los archivos dirty queda expresamente excluido. Incluye cambios de
environments, GHCR, overview y otros estados que pertenecen a intenciones
distintas. La coincidencia temporal no los incorpora a `CR-SST-0229`.

## Identidad y documentación owner

El contenido portado utilizará `CR-SST-0229` en `orchestrator_link` y en la
evidencia nueva. `CR-SST-0210` se conservará sólo como
`historical_execution_label` o como nota explícita de la desviación de orden.
No se hará un reemplazo ciego que finja que la ejecución original ya tenía la
identidad nueva.

Las specs y runbooks del owner seguirán siendo la autoridad técnica. El
control-plane registrará coordinación, autorización, rutas y readback, pero no
copiará patches completos ni sustituirá la documentación owner.

## Secuencia de ejecución futura

1. Publicar y releer este plan.
2. Publicar un lifecycle `running` que enumere las rutas owner exactas.
3. Volver a leer GitHub `develop` y crear un worktree owner limpio desde ese
   SHA, sin tocar el árbol histórico.
4. Revisar y portar solamente los hunks de estabilización; resolver
   manualmente las cuatro rutas con cambios concurrentes.
5. Confirmar que el diff candidato no contiene rutas excluidas, secretos,
   URLs privadas, backups ni paths locales.
6. Ejecutar `npm run check` y `git diff --check` en el owner. Los dry-runs de
   cliente permitidos por el check no autorizan un `kubectl apply` real.
7. Publicar el owner mediante PR a `develop` y realizar readback remoto.
8. Ejecutar, bajo un gate posterior, probes read-only separados de host,
   Docker, Kubernetes, Argo CD, ingress, workloads y HTTP.
9. Publicar evidencia terminal y recién entonces preparar una corrección Jira
   exacta para `SST-119`.

## Regla contra falsos positivos

La disponibilidad no se probará con una única señal:

- un listener no prueba que el mapping Docker sea correcto;
- un mapping Docker no prueba que Kubernetes esté Ready;
- nodos Ready no prueban que nginx y los Ingress funcionen;
- Argo `Synced/Healthy` no prueba el contrato HTTP;
- un HTTP 200 aislado no prueba root, health, JWKS y el negative path;
- la existencia de archivos locales no prueba su publicación en `develop`.

Cada capa tendrá resultado propio y el cierre exigirá que todas las capas
aplicables coincidan.

## Límites de este gate

Este plan no modifica `sst-4uentes-infra`, GitHub owner, Docker, kind,
Kubernetes, Argo CD, el host ni Jira. No accede a Secrets, backups o contenido
de datastores. `robots.txt` y `llms.txt` permanecen fuera del alcance SST.

El operador autorizó únicamente la publicación Git y el readback de este plan
en el control-plane. La mutación owner seguirá bloqueada hasta publicar y
releer un lifecycle `running` con un lote exacto autorizado.
