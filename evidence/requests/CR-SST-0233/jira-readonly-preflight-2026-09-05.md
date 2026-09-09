# Preflight Jira de solo lectura para CR-SST-0233

## Rol, alcance y autoridad

- Rol primario: evidencia de preflight para un mirror operativo.
- Owner: `4uentes-ards-control-plane`.
- Fuente de verdad: lifecycle ARDS/SDD de `CR-SST-0233`.
- Proveedor observado: Jira, proyecto `SST`.
- Efecto de autorización: ninguno; este documento no autoriza escrituras.

La conexión Atlassian respondió correctamente el `2026-09-05T21:54:36Z` con
capacidad Jira read/write. Solamente se ejecutaron lecturas de metadata,
jerarquía y duplicados. No se creó, comentó, editó ni transicionó ningún issue.

## Resultado

| Control | Resultado |
| --- | --- |
| Proyecto | `SST` disponible |
| Epic primaria de `INIT-SST-0010` | `SST-105`, tipo `Epic`, estado `Tareas por hacer` |
| Parent del CR | `SST-122`, tipo `Tarea`, estado `En curso` |
| Jerarquía de `SST-122` | pertenece directamente a `SST-105` |
| Tipo candidato | `Subtask`, habilitado en `SST` |
| Campos requeridos | proyecto, parent, tipo, summary; reporter tiene default |
| Búsqueda por `CR-SST-0233` | 0 coincidencias |
| Búsqueda por summary exacto | 0 coincidencias |
| Búsqueda textual `migration baseline` | 0 coincidencias |
| Subtasks existentes de `SST-122` | sólo `SST-123`, correspondiente a `CR-SST-0223` |

No se observó una identidad compatible que deba reconciliarse en lugar de
crear. La jerarquía propuesta cumple `INIT-SST-0010 ↔ SST-105`,
`CR-SST-0220 ↔ SST-122` y permite que la unidad acotada `CR-SST-0233` sea una
Subtask de esa Tarea.

## Lote exacto candidato, todavía no autorizado

El lote permanece limitado por el plan publicado:

```yaml
provider: jira
project: SST
request_id: CR-SST-0233
operations:
  - action: create
    count: 1
    issue_type: Subtask
    parent: SST-122
    epic_ancestry: SST-105
    summary: "[SST][CR-SST-0233] Reconcile fresh-database migration baseline"
    expected_initial_status: "Tareas por hacer"
  - action: read-back
    target: created_issue
forbidden_operations:
  - comment
  - transition
  - link
  - post-create edit
  - write any other issue
execution_window: one tool turn after fresh explicit approval
```

La descripción propuesta debe declarar que Jira es mirror y que el
control-plane es la fuente de verdad, resumir el alcance de migraciones y
referenciar `CR-SST-0233`; no debe incluir URLs privadas, IDs de conexión,
credenciales ni evidencia sensible.

## Siguiente gate

Primero debe publicarse y releerse canónicamente esta evidencia junto con el
readback runtime. Luego se requiere una autorización humana nueva y explícita
para ejecutar exactamente el lote anterior. Llevar el issue a `En curso`,
agregar comentarios o cerrarlo son lotes posteriores y no están incluidos.
