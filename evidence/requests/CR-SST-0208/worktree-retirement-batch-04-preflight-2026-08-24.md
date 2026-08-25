# CR-SST-0208 - Preflight de retiro, lote 04

Fecha observada: 2026-08-24.

## Resultado de la reconciliación

El inventario posterior al lote 03 fue reconciliado contra
`origin/main@bb628ea3e4817d3f17fa49d62abffd55498de678`. Se seleccionaron cuatro
worktrees limpios, integrados y con lifecycle `done` inequívoco.

## Lote exacto propuesto

| Path | Lifecycle terminal | Branch | HEAD | Publicación observada |
| --- | --- | --- | --- | --- |
| `worktrees/cr-sst-0184-control-plane` | `CR-SST-0199` | `agent/cr-sst-0199-development-socketio-ingress-lifecycle` | `9750e19685951918d1e66f0643afb0764d585860` | PR #33 merged |
| `worktrees/CR-SST-0210-memory-identity-scope` | `CR-SST-0210` | `agent/cr-sst-0210-memory-identity-scope-execution` | `8ae74bc9647bbe23df4c786c3aa760e120cb114b` | PRs #70, #80, #84 y #88 merged |
| `worktrees/CR-SST-0210-reservation` | `CR-SST-0210` | `agent/cr-sst-0210-memory-identity-scope-reservation` | `1df26a3f172ff6aa04ccd9d9553e34939927a01e` | PR #63 merged |
| `worktrees/CR-SST-0211-auth-retention-facade` | `CR-SST-0211` | `agent/cr-sst-0211-auth-retention-facade` | `93bed1e5bde22891cd17b0df48dfa265d9128c10` | PRs #45, #54 y #61 merged |

El nombre físico `cr-sst-0184-control-plane` es un alias histórico incorrecto:
su branch, commit y PR pertenecen a `CR-SST-0199`. El lifecycle canónico de
`CR-SST-0184` no se usa para autorizar este retiro. La correlación efectiva es
`path legado -> branch CR-SST-0199 -> PR #33 -> request CR-SST-0199 done`.

## Gates observados

Para los cuatro paths se verificó:

- `git status` limpio;
- HEAD alcanzable desde la ref canónica;
- cero locks en el gitdir;
- cero procesos Windows externos dependientes;
- cero mounts Docker activos hacia el path;
- branch y PR de publicación recuperables;
- ausencia de representación `running` para el lifecycle efectivo.

## Exclusiones explícitas

- `CR-CP-0006`, `CR-SST-0178`, `0179`, `0180`, `0181`, `0207` y `0217`
  permanecen `running`.
- `CR-SST-0218` y `0219` no tienen lifecycle `done`.
- `fend-knowledge` mezcla `CR-SST-0173 done` con `CR-SST-0174 running`.
- `INIT-SST-0010-publication` y `sst-6-jira-closure` no son requests terminales
  correlacionados de forma suficiente para este lote.
- Los dos árboles dirty y los tres HEAD no integrados permanecen preservados.
- No se modificará el worktree externo bajo `apps/lab/n8n-local`.
- No se borrarán branches, refs ni commits.

## Autorización requerida

El lote queda `ready-pending-exact-user-confirmation`. Una autorización habilita
solamente `git worktree remove` para los cuatro paths enumerados, después de
repetir los gates contra la ref vigente. Cualquier drift bloquea el path
afectado.

## Jira

No se propone escritura Jira. Los lifecycles seleccionados ya están terminales
y el retiro físico local se gobierna por `CR-SST-0208`, que conserva
`jira_write_allowed: false` y no tiene issue primario.

