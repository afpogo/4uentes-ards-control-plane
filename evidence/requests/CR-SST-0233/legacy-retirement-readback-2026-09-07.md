# Retiro controlado del worktree legacy de CR-SST-0233

## Rol y autoridad

Evidencia de ejecución del control-plane, vinculada al request `CR-SST-0233`
y a `INIT-SST-0010`. Registra el lote propuesto en
[el preflight](pr-270-merge-and-cleanup-preflight-2026-09-05.md), aceptado por
el usuario con «ok avancemos con el siguiente gate de forma ordenada».
La autorización queda consumida por este retiro; no habilita otros cleanups.

## Preflight y preservación

Se refrescó `origin/main` a `d84d1f672efae0acfa94d1dab4626b8d2f85230a`
y se integró en la branch de seguimiento sin conflictos. El PR 270 y su
evidencia recuperada continúan en la historia canónica.

El target resuelto fue exclusivamente
`worktrees/CR-SST-0233-migration-reconciliation`, dentro del repositorio.
Su branch era `agent/cr-sst-0233-migration-reconciliation` y su HEAD previo
`799b7d5383af7f8cca35b99319a0c9b6a7c59e87`, con `0 ahead / 187 behind`.
El inventario coincidió con las seis unidades de la clasificación publicada;
no se detectaron archivos ignorados adicionales, procesos que mencionaran la
ruta ni montajes Docker dependientes, incluidos contenedores detenidos.

Se preservaron las seis unidades en el commit local
`2808791853a70edc95c09b1f14e3f97f896fb45c`:

| Unidad | Blob preservado |
| --- | --- |
| Iniciativa INIT-SST-0010 | `65af7682e288a619da0770f610ac4c1ee36297ec` |
| Diagnóstico histórico de base vacía | `a9165c69cfd2614e9d439d0a1ad797d5655a0492` |
| Plan histórico | `bd2163331763d23f69ceda00f909736c78fd5da5` |
| Preflight Jira histórico | `aff87ddf956df69733adeda7b5f4b04f28e87048` |
| Snapshot inbox | `90017b8c79bee8eebc89ad0781a40cf3958dbdf9` |
| Snapshot planned | `1042f40fc92d471febbe97984d526107ca71fb32` |

El archivo preserva procedencia histórica; sus snapshots no reemplazan el
lifecycle canónico ni se destinan a merge o publicación.

## Retiro y recuperación

Después del commit se verificó `git status --porcelain --untracked-files=all`
vacío. Se ejecutó `git worktree remove` sobre el target resuelto, sin force.
El readback confirmó que el directorio ya no existe y que la branch local
conserva el commit de archivo. La relación posterior fue `1 ahead / 187 behind`.

La recuperación es posible creando un worktree desde
`agent/cr-sst-0233-migration-reconciliation`. No se borró la branch ni se
publicó su commit. No hubo escrituras Jira, cambios owner ni cambios runtime.

## Siguiente gate

Validación local: `npm run check` completo terminó con código 0 y sin FAIL;
persisten el warning histórico de CR-SST-0016 y el aviso de bindings locales
opcionales ausentes. `git diff --check` también pasó.

Publicar este readback y evaluar el lifecycle terminal. `SST-125` mantiene
como última observación `Tareas por hacer`; su sincronización requiere un lote
posterior al cierre canónico. Los otros worktrees quedan fuera de este lote.
La tabla documenta preservación; no cambia relaciones ni requiere un mapa nuevo.
