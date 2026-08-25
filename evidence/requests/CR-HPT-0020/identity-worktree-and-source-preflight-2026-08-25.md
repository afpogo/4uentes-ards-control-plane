# Preflight De Identidad, Worktrees Y Fuentes De CR-HPT-0020

Fecha: 2026-08-25.

## Resultado

`CR-HPT-0020` no existía en `origin/main`, branches, worktrees ni el mirror Jira
al realizar el preflight. La reserva mínima se publicó mediante el PR `#133` y
fue integrada en `origin/main` por el merge `55e17df`. El readback confirmó el
inbox canónico antes de abrir el worktree de ejecución.

## Worktrees HPT Observados

| Worktree | Branch | Estado observado | Disposición |
| --- | --- | --- | --- |
| `worktrees/CR-HPT-0016-jira-lifecycle-execution` | `agent/cr-hpt-0016-jira-lifecycle-execution` | limpio, un commit no integrado y 128 commits detrás del canon observado | preservar; pertenece a `INIT-HPT-0001` y no es base de este CR |
| `worktrees/CR-HPT-0020-reservation` | `agent/cr-hpt-0020-reservation` | limpio, mergeado y releído | retirado después del readback de la reserva |
| `worktrees/CR-HPT-0020-read-model-reconciliation` | `agent/cr-hpt-0020-read-model-reconciliation` | limpio desde `origin/main@55e17df` | único worktree activo de ejecución para este CR |

El commit único de `CR-HPT-0016` contiene una reconciliación histórica de
`INIT-HPT-0001` y un lote Jira que nunca fue autorizado dentro de ese árbol.
No se portó, fusionó ni descartó: su branch conserva la información y su retiro
queda fuera del alcance de `CR-HPT-0020`.

## Fuentes De Autoridad

La precedencia aplicada es:

1. `origin/main` del control plane;
2. lifecycles `done` y evidencia publicada de `CR-SST-0216`, `CR-HPT-0017`,
   `CR-HPT-0018` y `CR-HPT-0019`;
3. owner publication readbacks registrados por esos requests;
4. Jira `HPT-5` y `HPT-7` como mirror operativo de sólo lectura.

Los roots locales de `finanzas-personales` y `sst-bend` contienen cambios ajenos
y branches históricas. Se observaron únicamente para confirmar que no son una
base canónica segura; no se modificaron ni se usarán para producir claims de
HEAD remoto actual.

## Drift A Reconciliar

| Superficie | Claim anterior | Evidencia publicada |
| --- | --- | --- |
| catálogo backend | `draft`, HEAD observado en julio | FastAPI owner publicado, verificador RS256/JWKS y aislamiento owner-local validados |
| solución | consumo directo `sst-fend -> backend` con contrato pendiente | navegador protegido por SST; `sst-bend` produce principal y usa el grant M2M exacto hacia Phinance |
| feature state | mecanismo SST todavía pendiente | trust chain feature-gated publicada y QA integrada de aislamiento aprobada |
| Initiative | varios gaps de adapter anteriores | queda pendiente activación por ambiente, owners operativos, taxonomía y corrección/reversión |

## Límites

Este preflight no autoriza escrituras Jira, mutación de repos hijos, activación
de `PHINANCE_PROXY_ENABLED`, cambios de secretos, infraestructura o despliegue.
La reconciliación describe únicamente hechos ya publicados y conserva la
activación de development como un lifecycle posterior.
