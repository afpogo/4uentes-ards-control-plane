# Clasificación no destructiva del worktree legacy de CR-SST-0233

## Rol, alcance y autoridad

- Rol primario: evidencia de clasificación y procedencia.
- Worktree observado: `worktrees/CR-SST-0233-migration-reconciliation`.
- Branch: `agent/cr-sst-0233-migration-reconciliation`.
- Head: `799b7d5383af7f8cca35b99319a0c9b6a7c59e87`.
- Baseline comparada: `origin/main@371ef18ec358b306f69a431730bc014a61396205`.
- Efecto de autorización: ninguno; no autoriza borrar, resetear, mover ni
  retirar el worktree o su branch.

El worktree estaba 140 commits detrás de `origin/main`, sin commits propios por
delante. Conservaba una modificación trackeada y cinco archivos no trackeados.
Se comparó cada unidad con la autoridad canónica antes de decidir su
disposición.

## Inventario y disposición

| Unidad | Estado frente a `origin/main` | Disposición |
| --- | --- | --- |
| `initiatives/INIT-SST-0010-personal-knowledge-and-memory-workspace.yaml` | modificación basada en una revisión histórica | superseded; la iniciativa canónica ya contiene el request y el readback actual `SST-125` |
| `evidence/requests/CR-SST-0233/fresh-database-drift-observation-2026-08-29.md` | ausente y con diagnóstico histórico único | recuperada selectivamente en la branch actual con rol y autoridad explícitos |
| `evidence/requests/CR-SST-0233/implementation-plan.md` | existe con blob canónico diferente y más reciente | superseded por el plan canónico publicado |
| `evidence/requests/CR-SST-0233/jira-readonly-preflight-2026-08-29.md` | ausente, pero sus claims fueron renovados | superseded por el preflight del 5 de septiembre y el readback de `SST-125` |
| `requests/inbox/CR-SST-0233-reconcile-fresh-database-migration-baseline.yaml` | existe con lifecycle canónico posterior | superseded; no portar |
| `requests/planned/CR-SST-0233-reconcile-fresh-database-migration-baseline.yaml` | existe con lifecycle canónico posterior | superseded; no portar |

Los blobs locales observados fueron:

| Path | Blob local | Blob canónico |
| --- | --- | --- |
| `fresh-database-drift-observation-2026-08-29.md` | `a9165c69cfd2614e9d439d0a1ad797d5655a0492` | ausente |
| `implementation-plan.md` | `bd2163331763d23f69ceda00f909736c78fd5da5` | `bd0b15f73ad3af298f2f570cb31a9d2b4b08832f` |
| `jira-readonly-preflight-2026-08-29.md` | `aff87ddf956df69733adeda7b5f4b04f28e87048` | ausente |
| request `inbox` | `90017b8c79bee8eebc89ad0781a40cf3958dbdf9` | `f41482064c97464c3fd3f9ece5ef1777f6f39e85` |
| request `planned` | `1042f40fc92d471febbe97984d526107ca71fb32` | `44265ca64e74f696b399c9301bd81572069c07a7` |

## Resultado y stop condition

La única información que requería recuperación fue el diagnóstico original de
base vacía. El resto queda clasificado como superseded, sin promover snapshots
viejos sobre el lifecycle canónico.

El worktree permanece físicamente intacto. Su retiro sólo puede ocurrir en un
gate posterior que confirme:

- publicación canónica de la evidencia recuperada y esta clasificación;
- estado exacto del worktree inmediatamente antes del retiro;
- ausencia de procesos o dependencias sobre el path;
- autorización explícita para retirar el worktree;
- disposición independiente de la branch, sin borrarla implícitamente.

No se requiere un mapa adicional: el documento clasifica unidades en una tabla
y no modifica relaciones normativas, secuencias operacionales ni topología.
