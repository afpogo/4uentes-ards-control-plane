# CR-SST-0208 - Readback de retiro de worktrees, lote 01

Fecha: 2026-08-22.

## Alcance ejecutado

Se retiraron exclusivamente tres worktrees terminales del control plane
asociados a `CR-SST-0125`:

| Path retirado | HEAD previo | Branch conservada |
| --- | --- | --- |
| `worktrees/cr-sst-0125-closure` | `e7bef571c2741ac1cb2bb0669c581a567a50cf09` | `agent/cr-sst-0125-sst55-closure` |
| `worktrees/cr-sst-0125-control-plane` | `7f2c09acd73b51ae1406b5293ba5c172324d02d3` | `agent/cr-sst-0125-sst55-execution-evidence` |
| `worktrees/cr-sst-0125-jira-sync` | `680ac852df986bb6e886a5a27c27acb5d159e84f` | `agent/cr-sst-0125-sst55-jira-sync` |

## Preflight y resultado

Inmediatamente antes del retiro se verificó que cada path:

- existía dentro del workspace esperado y era un worktree Git válido;
- estaba limpio;
- tenía su HEAD como ancestro de `origin/main@50f6be2`;
- no presentaba archivos `*.lock` en su gitdir;
- no estaba referenciado por procesos distintos del propio comando de
  inspección ni por mounts Docker observables.

`git worktree remove` completó sin error para los tres paths. El readback
posterior confirmó que los directorios ya no existen y que las tres branches
continúan registradas. No se borraron branches, refs ni commits.

## Recuperabilidad y siguiente lote

No había cambios sin commit. El contenido retirado se puede reconstruir desde
las branches conservadas o desde los commits indicados. Quedan 30 candidatos
estrictos del inventario anterior; cualquier lote posterior debe repetir el
preflight sobre paths exactos y publicar su propio readback.
