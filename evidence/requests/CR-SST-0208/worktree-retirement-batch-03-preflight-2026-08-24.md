# CR-SST-0208 - Preflight de retiro histórico, lote 03

Fecha observada: 2026-08-24.

## Objetivo

Continuar el retiro controlado de worktrees históricos del control plane sin
afectar lifecycles activos, información local única, repositorios hijos ni
branches recuperables.

El preflight se ejecutó contra
`origin/main@e7f0523db8de3a6cbe2469e345ab765694f9ec3b` después de refrescar las
referencias remotas.

## Lote exacto propuesto

| Path | Lifecycle terminal | Branch | HEAD | Publicación observada |
| --- | --- | --- | --- | --- |
| `worktrees/CR-HPT-0015-control-plane-recovery` | `CR-HPT-0015` | `agent/cr-hpt-0015-control-plane-recovery` | `40f30c960811577dfc9384e2fb2746a85297a2a0` | PRs #46, #48 y #49 merged |
| `worktrees/CR-SST-0194-chatbot-memory-integration` | `CR-SST-0194` | `docs/CR-SST-0194/final-readback` | `17d1cd2c553dc032f6e88afae344fd74b8b31bb6` | PR #116 merged |
| `worktrees/cr-sst-0202-consent-chat-retention` | `CR-SST-0202` | `agent/cr-sst-0202-consent-chat-retention` | `0cac7b15d7d1fa8a7be486096b90c6f7d86e0cfd` | PR #37 merged |
| `worktrees/CR-SST-0204-bend-retention` | `CR-SST-0204` | `agent/cr-sst-0204-bend-retention-execution` | `9856df4147ba60e3d253b27888a7b0ccc29a2d2c` | PRs #47 y #52 merged |
| `worktrees/CR-SST-0206-closure` | `CR-SST-0206` | `agent/cr-sst-0206-closure` | `c9e5b5dcbb4c84564c477bcfc4dd6879727604b7` | PR #93 merged |
| `worktrees/CR-SST-0206-jira-final-readback` | `CR-SST-0206` | `agent/cr-sst-0206-jira-final-readback` | `a7e1be950a3e38a0a8362c98701d8691b5158c3a` | PR #94 merged |
| `worktrees/system-feature-studies` | `CR-SST-0206` | `agent/cr-sst-0206-rendered-qa-readback` | `d78dc62b255ff78b89c4963105d3f5ade13dbe7b` | PR #89 merged |

Los siete lifecycles tienen representación `done` en el árbol canónico. No
coexiste un archivo `running` para esos IDs.

## Gates observados

Para cada path se comprobó:

- estado Git limpio;
- HEAD ancestro de la ref canónica refrescada;
- cero archivos `*.lock` en su gitdir;
- cero procesos Windows externos con referencia al path;
- cero mounts Docker activos hacia el path;
- PR de publicación merged y branch todavía recuperable.

El path histórico `system-feature-studies` había sido ambiguo en el inventario
del 2026-08-22. Su branch y contenido actuales ya no corresponden al PR #39
colisionado: el HEAD observado publica el QA renderizado de `CR-SST-0206` por
el PR #89 y está integrado. Esta trazabilidad permite incluir el path sin
adoptar ni reabrir la intención histórica incompatible.

## Exclusiones

- `CR-SST-0178`, `CR-SST-0179`, `CR-SST-0180` y `CR-SST-0181` quedan fuera
  porque conservan lifecycle `running`.
- La raíz e `init-sst-0007` continúan dirty y en cuarentena.
- Los cuatro HEAD no integrados del inventario actual quedan fuera.
- `fend-knowledge`, `sst-6-jira-closure`, los coordinadores `CR-CP-0006` y los
  worktrees recientes `CR-SST-0207+` requieren readback separado.
- El worktree externo bajo `apps/lab/n8n-local` no pertenece a la raíz
  autorizada y no será modificado.
- No se borrarán branches, refs ni commits.

## Autorización requerida

El lote queda `ready-pending-exact-user-confirmation`. La autorización habilita
únicamente `git worktree remove` para los siete paths enumerados, después de
repetir limpieza, ancestry, locks, procesos y mounts contra la ref canónica
vigente. Cualquier drift bloquea el path afectado.

## Jira

Este retiro se ejecuta bajo `CR-SST-0208`, que declara
`jira_write_allowed: false` y no registra issue primario. Los mirrors ya
cerrados de los lifecycles históricos no se reabren ni se modifican por una
limpieza local de worktrees.

