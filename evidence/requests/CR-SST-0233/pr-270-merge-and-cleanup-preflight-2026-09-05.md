# Readback del PR 270 y preflight de retiro del worktree legacy

## Rol, alcance y autoridad

- Rol primario: evidencia de publicación y preflight no destructivo.
- Request: `CR-SST-0233`.
- Owner: `4uentes-ards-control-plane`.
- Worktree evaluado: `worktrees/CR-SST-0233-migration-reconciliation`.
- Branch evaluada: `agent/cr-sst-0233-migration-reconciliation`.
- Efecto de autorización: ninguno; este documento no autoriza commits sobre la
  branch legacy, retiro del worktree, borrado de branches ni escrituras Jira.

## Readback de publicación

El PR `afpogo/4uentes-ards-control-plane#270` quedó fusionado y fue releído
contra el remoto canónico:

| Campo | Resultado |
| --- | --- |
| Estado | `MERGED` |
| Head publicado | `714ec4f23457d01f555566a5339799314e4fbcd9` |
| Merge commit | `5d903e89228f737a0bf815845d003e8c364ffe88` |
| Fecha de merge | `2026-09-06T01:34:05Z` |
| Ref canónica observada | `origin/main@5d903e89228f737a0bf815845d003e8c364ffe88` |

El merge contiene el readback de creación de `SST-125`, el diagnóstico
histórico recuperado y la clasificación no destructiva del worktree legacy.
Con esto se satisface la condición de publicación previa al retiro, pero no la
autorización destructiva separada.

## Preflight inmediato del worktree

El path absoluto fue resuelto dentro del repositorio como
`C:\Users\andre\Desktop\4uentes\apps\4uentes-orchestor\worktrees\CR-SST-0233-migration-reconciliation`.
El readback previo a cualquier mutación confirmó:

| Condición | Resultado |
| --- | --- |
| Head | `799b7d5383af7f8cca35b99319a0c9b6a7c59e87` |
| Relación con `origin/main` | `0` ahead, `176` behind |
| Head ancestro de `origin/main` | sí |
| Estado local | una modificación trackeada y cinco archivos no trackeados |
| Evidencia recuperada publicada | sí |
| Clasificación publicada | sí |
| Procesos con el path en su línea de comando | ninguno detectado |
| Montajes Docker originados en el path | ninguno detectado |

Las seis unidades locales coinciden con el inventario clasificado: la
iniciativa modificada, tres archivos de evidencia, y los snapshots `inbox` y
`planned`. Como el worktree sigue dirty, la policy prohíbe retirarlo de manera
directa o mediante `--force`.

## Lote propuesto para autorización

El siguiente lote preserva el estado antes de retirar el checkout:

1. crear un commit local en `agent/cr-sst-0233-migration-reconciliation` que
   incluya exactamente las seis unidades clasificadas;
2. verificar que el worktree quede limpio;
3. retirar únicamente el worktree con `git worktree remove`, sin `--force`;
4. conservar la branch local y el commit de archivo, sin push, merge ni borrado;
5. releer el resultado y registrarlo en el lifecycle antes de evaluar el gate
   terminal.

El lote no incluye cambios en repositorios hijo, runtime, Jira, branches
remotas ni otros worktrees. Requiere una autorización explícita que enumere el
commit de archivo y el retiro del path exacto.

No se agrega un mapa: este gate no cambia topología, ownership ni relaciones
normativas; la secuencia y sus límites quedan expresados de forma reproducible
en la lista anterior.
