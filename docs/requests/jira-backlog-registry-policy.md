# Politica De Registro Backlog Jira Y Asignacion CR-SST

## Proposito

Esta politica separa los pendientes diferidos de los procesos reales del
control-plane.

```text
backlog_id != CR-SST
```

Un `backlog_id` identifica trabajo diferido. Un `CR-SST-****` identifica un
proceso real activo, planificado o cerrado.

## Regla Principal

Los pendientes diferidos no reservan numeros `CR-SST`.

El control-plane asigna un `CR-SST` solo cuando el pendiente pasa a prioridad
activa y se crea su request real.

## Identidades

| Identidad | Ejemplo | Responsable | Uso |
|---|---|---|---|
| Backlog local | `SST-BL-JIRA-001` | control-plane | Pendiente estable diferido |
| Proceso real | `CR-SST-0047` | control-plane | Ejecucion auditada |
| Ticket Jira | `SST-123` | Jira | Visibilidad, prioridad y asignacion |

## Tipo Operativo De Ticket

El tipo operativo para los tickets Jira que representan backlog diferido del
control-plane es:

```text
Jira Backlog Mirror Ticket
```

Un `Jira Backlog Mirror Ticket` es un ticket Jira de visibilidad y
priorizacion. No es el proceso real de ejecucion y no reemplaza al request
`CR-SST-****`.

Reglas:

- La identidad primaria es `backlog_id`.
- El issue Jira es el espejo operativo del backlog item.
- El registry local sigue siendo la fuente de verdad.
- Jira guarda visibilidad, prioridad, discusion y asignacion operativa.
- Jira no asigna `CR-SST`.
- El campo `assigned_cr_sst` solo cambia cuando el control-plane activa el
  backlog item mediante un request real.

## Estados De Backlog

| Estado | Significado |
|---|---|
| `deferred` | Documentado, no activo |
| `candidate` | Puede priorizarse |
| `selected` | Elegido para activacion |
| `assigned` | Tiene `assigned_cr_sst` real |
| `planned` | Tiene request planned |
| `in-progress` | En ejecucion |
| `done` | Cerrado |
| `superseded` | Reemplazado por otro item |

## Regla Para Agentes

Los agentes no deben tomar pendientes por un numero CR-SST estimado.

El orden correcto es:

```text
priority + status + assigned_cr_sst
```

Si `assigned_cr_sst` es `null`, el item no tiene proceso real y no debe
implementarse.

Cuando existan varios pasos aceptados pero diferidos, los agentes deben
registrarlos como backlog items y asegurar que cada uno tenga un
`Jira Backlog Mirror Ticket` antes de cerrar el lote de planificacion, salvo que
el usuario indique explicitamente que el pendiente no debe salir a Jira.

El orden de trabajo se decide por:

```text
priority + status + jira_issue_key + assigned_cr_sst
```

Interpretacion:

- `priority` ordena la importancia.
- `status` indica si el backlog item sigue diferido o ya fue seleccionado.
- `jira_issue_key` confirma que existe visibilidad Jira.
- `assigned_cr_sst` indica que ya fue promovido a proceso real.

## Jira

Jira puede reflejar backlog items en una fase futura, pero no asigna ni reserva
`CR-SST`.

Los tickets de este grupo se denominan `Jira Backlog Mirror Ticket`.

Si un backlog item se publica en Jira, el summary debe incluir siempre el
`backlog_id`:

```text
[SST][backlog][SST-BL-JIRA-001] Generic Jira writer not limited to CR-SST-0039
```

Si el item tiene `assigned_cr_sst`, el CR puede agregarse al summary para
lectura rapida, pero no reemplaza el `backlog_id`:

```text
[SST][backlog][SST-BL-JIRA-001][CR-SST-####] Generic Jira writer not limited to CR-SST-0039
```

El ticket debe incluir:

```text
Backlog id:
- SST-BL-JIRA-001

Assigned CR-SST:
- ninguno

Backlog status:
- deferred
```

Cuando el control-plane active el item, se actualiza `assigned_cr_sst` y luego
se puede sincronizar Jira por el circuito aprobado.

Cuando un backlog item ya tenga ticket Jira, `jira_issue_key` debe permanecer
registrado en `state/jira-backlog-registry.yaml`.

Labels minimos para backlog diferido:

```text
control-plane
jira-mcp
backlog
deferred
no-cr-assigned
```

Labels minimos para backlog asignado:

```text
control-plane
jira-mcp
backlog
selected
cr-assigned
CR-SST-####
```

## Registro Canonico

El registro canonico local es:

- `state/jira-backlog-registry.yaml`

El comando de revision local es:

```powershell
npm.cmd run jira:mcp:backlog-review -- --request-id CR-SST-0047 --output-dir evidence/requests/CR-SST-0047
```

Ese comando no conecta con Jira, no escribe Jira y no modifica feature states.

El comando de dry-run de tickets backlog es:

```powershell
npm.cmd run jira:mcp:backlog-dry-run -- --request-id CR-SST-0049 --output-dir evidence/requests/CR-SST-0049
```

Ese comando genera payloads propuestos y tampoco conecta con Jira.

## Publicacion Jira Backlog

Cuando la publicacion Jira del backlog diferido esta aprobada por un request
activo, primero se debe generar el dry-run en la evidencia de ese request:

```powershell
npm.cmd run jira:mcp:backlog-dry-run -- --request-id CR-SST-0050 --output-dir evidence/requests/CR-SST-0050
```

Luego se puede ejecutar la escritura explicita:

```powershell
npm.cmd run jira:mcp:backlog-create -- --connect --approved --request-id CR-SST-0050 --output-dir evidence/requests/CR-SST-0050
```

El writer crea tickets Jira para items sin `jira_issue_key`, escribe evidencia
local y actualiza solo `jira_issue_key` en `state/jira-backlog-registry.yaml`.
No asigna ni modifica `assigned_cr_sst`.

## Regla De Sincronizacion Obligatoria

Para trabajo aceptado que queda diferido:

1. Crear o actualizar el backlog item en `state/jira-backlog-registry.yaml`.
2. Generar el dry-run de tickets backlog en la evidencia del request activo.
3. Publicar el `Jira Backlog Mirror Ticket` con el writer aprobado cuando Jira
   sea el tablero de seguimiento operativo.
4. Registrar `jira_issue_key` en el registry.
5. Mantener `assigned_cr_sst: null` hasta que el item sea seleccionado para
   ejecucion real.

Para trabajo seleccionado:

1. Asignar el siguiente `CR-SST-****` real desde el lifecycle del control-plane.
2. Actualizar `assigned_cr_sst`.
3. Sincronizar el ticket Jira existente para que refleje el CR asignado.
4. Ejecutar el trabajo desde el request `CR-SST-****`, no desde el backlog id.

El control-plane esta desincronizado si:

- existe backlog item diferido sin `jira_issue_key` y Jira es el tablero
  operativo;
- existe ticket Jira backlog sin `backlog_id` en el summary o descripcion;
- existe `assigned_cr_sst` en Jira pero no en el registry;
- existe `assigned_cr_sst` en el registry pero el ticket Jira no lo refleja.
