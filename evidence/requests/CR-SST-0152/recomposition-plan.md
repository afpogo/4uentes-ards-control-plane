# Plan Del Tren SST Estable Sin Extension Ni Preview

## Resultado Esperado

`CR-SST-0152` publica un tren minimo `sst-bend -> 4uentes-auth -> sst-fend`.
Los drafts se pueden preparar en paralelo despues del merge humano de la
enmienda del control plane, pero se fusionan y despliegan en forma serial.
`sst-extension`, `CR-SST-0120`, `CR-SST-0137` a `CR-SST-0140` y toda migracion,
DTO, contrato o UI preview quedan diferidos. `CR-SST-0149` se publica aparte al
final.

## Desviacion De Orden

El PR #3 ya fue fusionado antes de registrar esta reduccion de alcance. No se
reescribe historia: la desviacion queda documentada y una nueva enmienda del
control plane debe recibir merge humano antes de mutar repos hijos. El merge de
#3 no habilita extension ni preview y no reemplaza las aprobaciones por merge.

## Gate Cero

1. Validar y fusionar humanamente la enmienda del tren minimo.
2. Repetir el preflight Jira y obtener autorizacion para un lote enumerado antes
   de crear o transicionar issues.
3. Fetch de cada repo hijo y comparacion de `origin/develop` con el SHA del
   manifest.
4. Si una base cambio, crear un worktree nuevo y recomponer; no rebasar
   worktrees historicos sucios.
5. Preservar el worktree parcial de extension sin commit, push, borrado ni
   limpieza.

## Jira Propuesto

El lote requiere autorizacion explicita y no incluye comentarios, links,
reparenting, cierres ni transiciones adicionales:

1. Epic de `INIT-SST-0004`.
2. Tarea de `CR-SST-0152` bajo esa Epic y transicion a `En curso`.
3. Subtask de `CR-SST-0153` bajo `SST-6` y transicion a `En curso`.
4. Subtask de `CR-SST-0154` bajo `SST-6` y transicion a `En curso`.

Jira sigue siendo espejo; el control plane es source of truth.

## Ramas Y Commits

### sst-bend

Rama `release/CR-SST-0152/sst-bend-development-reconciliation`.

Los commits separan Learning annotations, semantica/retiro de `/filterArts` y
convergencia Plaud. Quedan fuera `CR-SST-0125`, preview `CR-SST-0137`, su
migracion, workflows historicos, `example.png` y ruido de `package.json`.

### 4uentes-auth

Rama `release/CR-SST-0152/4uentes-auth-development-reconciliation`.

Se conserva el commit local seguro de body limits y se agregan unidades de
Learning passthrough y article semantics. Quedan fuera `CR-SST-0138`, logs,
env, keys y workflows historicos.

### sst-fend

Rama `release/CR-SST-0152/sst-fend-development-reconciliation`.

Los commits separan sheet/Learning base, `CR-SST-0153`, `CR-SST-0154`, article
semantics y Home loop. Los dos task reports de los fixes deben reemplazar
`request_id: TODO` por su lifecycle real. Quedan fuera preview
`CR-SST-0120/0140`, `SstInfoPill`, hunks de formato y artefactos sin lifecycle.

### CR-SST-0149

Solo despues del merge del frontend principal se crea
`fix/SST-74/CR-SST-0149/signup-responsive-structure` desde el nuevo `develop`.
El draft captura exclusivamente las ocho rutas inventariadas en el manifest.

## Validacion Antes De Cada Draft

- `sst-bend`: LearningWorkspace, tag engine, article-kind, retiro de filtros,
  scripts semanticos de extension, atomicidad/convergencia Plaud, build, check y
  migraciones up/down/up en DB efimera.
- `4uentes-auth`: build, check y scripts de Text/Web nativo, semantica de
  sesiones, quick-save y retiro de legacy filters.
- `sst-fend`: suites LearningWorkspace, ArticleCreateFlow, Articles y Home,
  `css:types:check` y check completo.
- `CR-SST-0149`: `RegisterFormLayout.test.ts` y check completo.
- Todos: owner docs, comparacion source/candidate, `git diff --check`, escaneo
  de secretos y commits Conventional con footers `Refs` y `CR`.

## Merge Y Rollout

Cada paso requiere aprobacion humana independiente:

1. `sst-bend`;
2. `4uentes-auth`;
3. `sst-fend`;
4. `CR-SST-0149`.

Tras cada merge se verifica workflow de push a `develop`, imagen
`develop-<sha>` y digest, commit automatico de tag en infra, Argo CD
`Synced/Healthy`, imagen efectiva y smokes aplicables: health, JWKS/401,
login-refresh-logout, BFF a backend, Learning accept/context, article semantics,
filtro retirado y UI objetivo.

No se crea PR infra manual, no se usa `workflow_dispatch`, no se muta
Kubernetes directamente y no se fuerza Argo.

## Interfaces

No se disenan APIs nuevas. Se preserva
`POST /4uentes/v1/learning-workspaces/sources/preview` y la separacion entre
preview, accept y accepted context. `CR-SST-0153` modifica solo presentacion y
estado frontend. `CR-SST-0154` usa los tipos existentes `manual_text`,
`article_draft` y `article`; no cambia DTOs ni endpoints.

## Cierre Y Rollback

`CR-SST-0153`, `CR-SST-0154` y `CR-SST-0152` se cierran solo despues del rollout
y E2E live. Las transiciones Jira a `Listo` necesitan otro lote aprobado. El PR
final del control plane registra PRs, SHAs, workflows, imagenes, infra, Argo,
smokes y rollback.

Los pins auditados son:

- bend `develop-8d36a91832a3`;
- auth `develop-82f84da4a99f`;
- frontend `develop-164c19cfcb88`.

`CR-SST-0125` continua aparte desde el `develop` reconciliado.
