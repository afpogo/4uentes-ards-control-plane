# Plan De Recomposicion Y Promocion A Development

## Resultado Esperado

`CR-SST-0152` publicara PRs draft pequenos y auditables desde el
`origin/develop` vigente de cada repo, sin reutilizar las ramas historicas
SST-26 ni modificar sus worktrees sucios. El merge del PR del control plane
aprueba solamente el inicio de la recomposicion. Cada merge posterior conserva
un gate humano independiente.

## Gate Cero

1. Merge humano del PR del control plane con `CR-SST-0152`, su manifest y este
   plan.
2. Fetch del repo hijo y verificacion de que `origin/develop` coincide con el
   SHA base del manifest; cualquier cambio exige actualizar evidencia antes de
   reconstruir.
3. Creacion de un worktree aislado por repo y rama de release.
4. Inventario del source exacto y seleccion por archivo/hunk contra el CR owner.
5. Escaneo de secretos, owner docs y `git diff --check` antes de tests.

## Ramas Y Unidades

### sst-bend

Rama `release/CR-SST-0152/sst-bend-development-reconciliation`.

Las unidades de commit se separan en annotations de LearningWorkspace,
semantica/retiro de filtros, convergencia Plaud y cohorte preview. No se hace
cherry-pick de los commits fuente: mezclan CRs, workflows y artefactos sin
lifecycle. `CR-SST-0125`, `example.png`, el retiro de workflow sin request, el
ruido de formato y cualquier hunk no allowlisted quedan fuera.

La cohorte preview `CR-SST-0137` permanece draft hasta completar su cobertura
HTTP autenticada y probar compatibilidad serial con auth, frontend y extension.

### 4uentes-auth

Rama `release/CR-SST-0152/4uentes-auth-development-reconciliation`.

Los commits separan limites de body, passthrough LearningWorkspace, semantica
de articulos y passthrough de preview. `tmp-bf-dev.err`, `tmp-bf-dev.log`,
`.env`, keys, logs y evidencia runtime no se leen ni se copian. El workflow
SST-26 queda fuera salvo que otro lifecycle lo allowliste de forma explicita.

`CR-SST-0138` permanece draft y dependiente de `CR-SST-0137`; requiere QA de
401/403, account scope, sanitizacion upstream y preview antes de merge.

### sst-fend

Rama `release/CR-SST-0152/sst-fend-development-reconciliation`.

Los commits separan sheet/LearningWorkspace, semantica de articulos, adopcion
preview y loop de Home. Se bloquean los pilotos y bugfixes con
`request_id: TODO`, los hunks visuales no gobernados y el delta SST-26. Las
declaraciones CSS se regeneran desde el arbol recompuesto para evitar archivos
huérfanos.

`CR-SST-0149 / SST-74` usa la rama independiente
`fix/SST-74/CR-SST-0149/signup-responsive-structure` y un draft separado con
sus ocho paths observados. Se rebasa sobre el nuevo `develop` despues del tren
principal; no se mezcla con `CR-SST-0152`.

### sst-extension

Draft A usa `reconcile/SST-29/extension-governed-runtime` para captura base,
kind semantico, Web explicito y owner docs. Draft B se apila en
`feat/SST-29/private-session-hardening` para permission lease y preview
privada.

Draft B no puede mergearse hasta cerrar `CR-SST-0137`, `CR-SST-0138` y
`CR-SST-0139`, implementar resize/re-encode y validacion acotada de imagen, y
aprobar `CR-SST-0103`. La captura PNG no referenciada que contiene una URL
concreta queda excluida.

### sst-4uentes-infra

El inventario no encontro un delta infra allowlisted para `CR-SST-0152`; no se
crea un PR manual. Los commits automaticos de tags producidos por los workflows
de app se registran como evidencia de rollout. Si aparece un delta manual, debe
tener CR y allowlist propios antes de mutar infra.

## Validacion

- `sst-bend`: suites LearningWorkspace/tags/article-kind/preview/filter/Plaud,
  scripts contractuales, build, check y migraciones up/down/up en DB efimera.
- `4uentes-auth`: build, check y los scripts `verify-*` contractuales.
- `sst-fend`: tests LearningWorkspace/Articles/Home/preview, CSS types y check.
- `CR-SST-0149`: `RegisterFormLayout.test.ts` y check completo.
- `sst-extension`: test, build, check, diff check y QA especifica de permisos,
  captura, consentimiento, presupuesto y retry.
- todos: owner docs, secret scan, diff allowlist y comparacion source/candidate.
- control plane: `npm run check` antes de cualquier cierre local.

## Merge Y Rollout

El orden es backend, auth, frontend, extension A, CR-SST-0149 y finalmente
extension B cuando sus gates cierren. Antes de cada merge se solicita una nueva
aprobacion. Tras cada merge se espera workflow exitoso, imagen
`develop-<sha>`/digest, commit de tag en infra, checks infra, Argo
`Synced/Healthy`, imagen efectiva y smokes del contrato correspondiente.

No se usa `workflow_dispatch`, mutacion Kubernetes directa, sync forzado de
Argo ni recreacion del cluster.

## Rollback

Una regresion se revierte mediante cambio Git auditado de pins y reconciliacion
normal de Argo:

- bend `develop-8d36a91832a3`;
- auth `develop-82f84da4a99f`;
- frontend `develop-164c19cfcb88`.

Los fallos contractuales, de secretos, migracion o tests detienen el tren. Solo
se reintentan jobs cuando la evidencia demuestra un fallo transitorio.
