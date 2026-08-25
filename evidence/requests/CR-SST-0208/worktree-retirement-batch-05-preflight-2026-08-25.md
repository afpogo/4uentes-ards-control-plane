# CR-SST-0208 - Preflight de retiro por fase supersedida, lote 05

Fecha observada: 2026-08-25.

## Objetivo

Retirar checkouts históricos cuya fase concreta ya fue publicada o
supersedida, sin declarar terminales las iniciativas o requests que todavía
siguen activos.

El preflight fue repetido después de un reinicio de la máquina y utiliza
`origin/main@6b014ff05b362ffd6d52eed629d5d3a0ec00d817`.

## Lote exacto propuesto

| Path | Fase completada o supersedida | Branch | HEAD | Publicación |
| --- | --- | --- | --- | --- |
| `worktrees/INIT-SST-0010-publication` | Publicación inicial de la iniciativa; la ejecución posterior continúa por CRs dedicados | `agent/init-sst-0010-memory-workspace-publication` | `3b573ba757838b2c0bdad4170e9c4aa34d946eb4` | PR #59 merged |
| `worktrees/sst-6-jira-closure` | Cierre Jira de `SST-6` y cierre de `CR-SST-0173` ya leídos como terminales | `agent/sst-6-jira-closure` | `1ad099d949f3729186b491482cbb8eaa0e64b234` | PR #17 merged |
| `worktrees/CR-SST-0219-paragraph-derivation-contract` | Plan publicado; ejecución transferida al worktree `CR-SST-0219-running` | `agent/cr-sst-0219-paragraph-derivation-contract-plan` | `6d05f6087aa12cc4e0d32e6f2cfcba308e85420b` | PR #122 merged |

`INIT-SST-0010` y `CR-SST-0219` siguen activos. Este lote no cambia sus
estados: retira solamente checkouts de publicación o planificación cuyo
contenido ya está en la ref canónica. El worktree
`worktrees/CR-SST-0219-running` existe, está limpio y conserva la branch remota
de ejecución.

## Gates observados

Antes y después del reinicio se comprobó para los tres paths:

- estado Git limpio;
- HEAD alcanzable desde `origin/main`;
- cero archivos `*.lock` en el gitdir;
- cero procesos Windows externos con referencia al path;
- Docker operativo y cero mounts activos hacia el path;
- PR merged y branch recuperable;
- existencia del worktree sucesor cuando el lifecycle continúa.

## Exclusiones y recuperación pendiente

- Los worktrees `running` de `CR-SST-0207`, `0217`, `0218` y `0219` no se
  retiran.
- Los cinco checkouts históricos de `CR-SST-0178` y los árboles `0179`, `0180`
  y `0181` permanecen asociados a lifecycles activos.
- `fend-knowledge` sigue mezclando `CR-SST-0173 done` con `CR-SST-0174 running`.
- La raíz e `init-sst-0007` permanecen dirty.
- `CR-HPT-0016` y `cr-sst-0178-public-qa-reconciliation` conservan commits
  únicos no integrados.
- El worktree externo `CR-CP-0021` conserva varios commits no integrados y no
  tiene lifecycle canónico `CR-CP-0021` en `origin/main`; requiere recuperación
  y owner readback separados.
- No se borrarán branches, refs ni commits.

## Autorización requerida

El lote queda `ready-pending-exact-user-confirmation`. La autorización habilita
solamente `git worktree remove` para los tres paths enumerados, después de
repetir todos los gates contra la ref vigente. Cualquier drift bloquea el path
afectado.

## Jira

No se propone escritura Jira. `SST-6` ya tiene readback terminal; la iniciativa
y `CR-SST-0219` mantienen sus mirrors sin cambios. `CR-SST-0208` conserva
`jira_write_allowed: false`.

