# CR-SST-0208 - Readback Jira en vivo

Fecha: 2026-08-22.

Estado: readback histórico anterior al merge del PR #37. El mapa vigente está
registrado en `post-pr37-canonical-readback-2026-08-22.md`; las correcciones
propuestas al final de este documento quedaron supersedidas y no se ejecutan.

La consulta fue read-only y no conservó URL, cloud ID, account ID ni
credenciales.

## Estado observado

| Issue | Identidad observada | Tipo y parent | Estado |
| --- | --- | --- | --- |
| `SST-86` | `INIT-SST-0007` | Epic | Tareas por hacer |
| `SST-89` | `INIT-SST-0008` | Epic | Tareas por hacer |
| `SST-113` | `CR-SST-0202` retención | Tarea bajo `SST-86` | Tareas por hacer |
| `SST-114` | `CR-SST-0203` Bend/retención | Subtask bajo `SST-113` | Tareas por hacer |
| `SST-115` | `CR-SST-0204` Redis | Subtask bajo `SST-113` | Tareas por hacer |
| `SST-116` | `CR-SST-0205` UX | Subtask bajo `SST-113` | Tareas por hacer |
| `SST-117` | `CR-SST-0206` QA | Subtask bajo `SST-113` | Tareas por hacer |

La jerarquía física de retención es válida. Las identidades `0202` y `0203`
no lo son globalmente porque colisionan con lifecycles locales de mayor
precedencia.

## Corrección propuesta, no ejecutada

- `SST-113`: cambiar referencias `CR-SST-0202` por `CR-SST-0208`.
- `SST-114`: cambiar referencias `CR-SST-0203` por `CR-SST-0209`.
- Mantener tipos, parents y estados.
- Mantener `SST-115` a `SST-117` con sus IDs actuales.
- No transicionar, crear ni reparentar issues en el lote de identidad.

La corrección requiere preflight fresco y autorización enumerada separada.
