# CR-SST-0208 - Readback de retiro histórico, lote 03

Fecha de ejecución: 2026-08-24.

## Resultado

La autorización `Autorizo el lote 03 de CR-SST-0208` se aplicó solamente a
los siete paths publicados en el preflight del PR #124. Todos fueron retirados
correctamente:

| Path retirado | HEAD previo | Branch conservada |
| --- | --- | --- |
| `worktrees/CR-HPT-0015-control-plane-recovery` | `40f30c960811577dfc9384e2fb2746a85297a2a0` | `agent/cr-hpt-0015-control-plane-recovery` |
| `worktrees/CR-SST-0194-chatbot-memory-integration` | `17d1cd2c553dc032f6e88afae344fd74b8b31bb6` | `docs/CR-SST-0194/final-readback` |
| `worktrees/cr-sst-0202-consent-chat-retention` | `0cac7b15d7d1fa8a7be486096b90c6f7d86e0cfd` | `agent/cr-sst-0202-consent-chat-retention` |
| `worktrees/CR-SST-0204-bend-retention` | `9856df4147ba60e3d253b27888a7b0ccc29a2d2c` | `agent/cr-sst-0204-bend-retention-execution` |
| `worktrees/CR-SST-0206-closure` | `c9e5b5dcbb4c84564c477bcfc4dd6879727604b7` | `agent/cr-sst-0206-closure` |
| `worktrees/CR-SST-0206-jira-final-readback` | `a7e1be950a3e38a0a8362c98701d8691b5158c3a` | `agent/cr-sst-0206-jira-final-readback` |
| `worktrees/system-feature-studies` | `d78dc62b255ff78b89c4963105d3f5ade13dbe7b` | `agent/cr-sst-0206-rendered-qa-readback` |

No se borraron branches, refs ni commits.

## Preflight efectivo

La ejecución refrescó referencias y utilizó
`origin/main@f25809c06d443eb574b18a74238d6ec2da08d37e`. Para cada target se verificó
inmediatamente antes de `git worktree remove`:

- path resuelto dentro de la raíz autorizada `4uentes-orchestor/worktrees/`;
- pertenencia al registro Git de worktrees;
- estado limpio;
- HEAD alcanzable desde `origin/main`;
- ausencia de archivos `*.lock`;
- ausencia de procesos externos dependientes;
- ausencia de mounts Docker hacia el path.

Los siete paths pasaron todos los gates. El readback posterior confirmó su
ausencia en disco y en el registro, además de la presencia de las siete
branches enumeradas.

## Inventario posterior

El registro bajó de 42 a 35 worktrees:

- 30 limpios e integrados;
- 3 limpios con HEAD no integrado;
- 1 dirty integrado: `worktrees/init-sst-0007`;
- 1 dirty no integrado: la raíz del control plane.

Los tres árboles limpios no integrados son
`CR-HPT-0016-jira-lifecycle-execution`,
`cr-sst-0178-public-qa-reconciliation` y el worktree externo
`apps/lab/n8n-local/.worktrees/cr-cp-0021-control-plane`. Permanecen
preservados y fuera de este lote.

## Jira y recuperabilidad

No hubo escritura Jira. El retiro local no reabre ni modifica mirrors
históricos cerrados y `CR-SST-0208` conserva `jira_write_allowed: false`.

Todo el contenido retirado estaba publicado y es recuperable desde las
branches o commits enumerados. Ninguno de los siete paths contenía información
única sin commit.

