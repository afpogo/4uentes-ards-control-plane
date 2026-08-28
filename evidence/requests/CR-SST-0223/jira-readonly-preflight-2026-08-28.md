# Preflight Jira read-only de CR-SST-0223

## Identidad y jerarquía

| Campo | Resultado observado |
|---|---|
| Proyecto | `SST` |
| Initiative / Epic | `INIT-SST-0010` / `SST-105` |
| Request contenedor | `CR-SST-0220` / `SST-122` |
| Parent propuesto | `SST-122`, tipo `Tarea`, estado `En curso`, resolución vacía |
| Tipo propuesto | `Subtask`, ID `10006`, hierarchy level `-1` |
| Duplicados por `CR-SST-0223` | `0` |

`CR-SST-0223` es una unidad owner acotada dentro del contenedor `CR-SST-0220`, por lo que el perfil de jerarquía exige una Subtask bajo `SST-122`, no otra Tarea directa bajo la Epic.

## Create metadata y workflow

Los campos requeridos son tipo, parent, proyecto, reporter con default y resumen. Una Subtask comparable en `Tareas por hacer` expone transición `21` hacia `En curso`.

## Estado

El preflight fue exclusivamente de lectura. No se creó, editó ni transitó ningún issue. Cualquier batch de creación e inicio requiere autorización exacta, repetición inmediata de duplicados y readback antes y después de la transición.
