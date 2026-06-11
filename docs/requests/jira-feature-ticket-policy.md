# Politica De Generacion Y Mantenimiento De Tickets Jira

## Proposito

Esta politica define como el control-plane genera, publica y mantiene tickets
Jira a partir de funcionalidades SST observadas en
`state/features/*.current.yaml`.

El objetivo es que Jira funcione como tablero operativo del trabajo abierto,
sin reemplazar el read-model del control-plane ni saltar el lifecycle de
requests.

## Ownership

- Repo responsable: `4uentes-orchestor`.
- Proyecto Jira destino: `SST`.
- Tablero Jira destino: `SST-Team`.
- Issue type por defecto: `Tarea`.
- Fuente canonica de estado: `state/features/*.current.yaml`.
- Fuente canonica de proceso: `requests/*/CR-SST-*.yaml`.
- Evidencia canonica: `evidence/requests/<request-id>/`.

Los repos funcionales no crean tickets Jira directamente desde este flujo. Si
un ticket deriva en cambios sobre repos hijos, esos cambios deben entrar por el
lifecycle normal de requests del control-plane.

## Alcance

La politica aplica a tickets generados para `feature_state` no cerrados.

Entran al flujo:

- funcionalidades con `status` distinto de `done`;
- funcionalidades con `id`, `title` y `status` legibles;
- funcionalidades donde el dry-run pueda producir un payload completo;
- funcionalidades sin duplicado Jira detectable por `state_id`.

No entran al flujo:

- funcionalidades con `status: done`;
- estados historicos que no sean `*.current.yaml`;
- `bugfixes`, salvo request explicito;
- tickets que requieran datos secretos, tokens, cookies o URLs privadas;
- tickets que no pasen busqueda de duplicados.

## Principio De Autoridad

Jira es un espejo operativo, no la fuente de verdad del control-plane.

El estado real de una funcionalidad sigue viviendo en
`state/features/*.current.yaml`. Jira sirve para organizar trabajo, asignar
responsables y hacer seguimiento visible, pero no autoriza por si solo una
transicion de estado del read-model.

Una funcionalidad solo puede pasar a `done` cuando exista evidencia local que
soporte la transicion, aunque el ticket Jira haya sido cerrado.

## Template Minimo Del Ticket

Todo ticket generado desde este flujo debe pasar por este template antes de
publicarse.

### Campos Jira

- Project key: `SST`.
- Board: `SST-Team`.
- Issue type: `Tarea`.
- Summary: `[SST][feature-state] <accion concreta sobre la funcionalidad>`.
- Labels base:
  - `ards-sdd`
  - `control-plane`
  - `feature-state`
  - `not-done`
- Label de estado: valor literal de `status`.
- Priority sugerida:
  - `runtime-partial`: `High`.
  - `implemented-local`: `Medium`.
  - `ards-documented`: `Medium`.
  - `validated-local`: `Low-Medium`.
  - `validated-live`: `Low-Medium`.

### Descripcion

La descripcion debe incluir, como minimo:

```text
Proceso de sincronizacion:
- <CR-SST-**** que dispara o gobierna la sincronizacion>

Procesos origen:
- <request_ids del feature_state o ninguno>

Estado actual:
<status>

Objetivo:
Avanzar esta funcionalidad desde el read-model del control-plane y cerrar los
gaps abiertos mediante el lifecycle aprobado.

Gaps abiertos:
- <open_gaps o ninguno>

State id:
- <id>

Servicios afectados:
- <affected_services o ninguno>

Request ids relacionados:
- <request_ids o ninguno>

Fuente control-plane:
- <state/features/*.current.yaml>

Evidence refs:
- <evidence_refs o ninguno>

Validation refs:
- <validation_refs o ninguno>

Criterio de cierre esperado:
- La decision o implementacion pendiente queda registrada en evidencia.
- Los cambios en repos funcionales, si hacen falta, entran por request aprobado.
- El feature_state se actualiza solo cuando la evidencia soporte una transicion
  de estado.
```

El campo `Proceso de sincronizacion` identifica el proceso operativo que
genero, actualizo o reconcilio el ticket Jira.

El campo `Procesos origen` identifica los requests historicos o funcionales del
feature state. Debe derivarse de `request_ids` y no debe ser reemplazado por el
proceso de sincronizacion.

`Request ids relacionados` se mantiene como seccion de compatibilidad humana en
el ticket mientras exista evidencia historica con ese formato.

## Flujo De Generacion

1. Leer `state/features/*.current.yaml`.
2. Filtrar solo funcionalidades con `status` distinto de `done`.
3. Generar dry-run local con un issue por funcionalidad.
4. Leer metadata Jira por MCP para confirmar proyecto, issue type y campos
   requeridos.
5. Buscar duplicados en Jira por `state_id`.
6. Revisar el dry-run contra el template minimo de esta politica.
7. Registrar evidencia de metadata, duplicados y payload propuesto.
8. Crear tickets solo con aprobacion humana explicita.
9. Registrar el resultado de creacion, incluyendo issue keys o bloqueo.

## Flujo De Sincronizacion De Backlog

La sincronizacion de backlog es un flujo gobernado por eventos. No debe ser una
ejecucion manual de scripts sin estado.

Eventos iniciales permitidos:

- `BACKLOG_SYNC_REQUESTED`: inicia una corrida de sincronizacion.
- `CONTROL_PLANE_STATE_COLLECTED`: los estados locales fueron leidos.
- `POLICY_CHECK_PASSED`: el batch cumple la politica local.
- `JIRA_METADATA_CONFIRMED`: proyecto, tablero, issue type y campos requeridos
  fueron confirmados por MCP.
- `JIRA_DUPLICATES_SEARCHED`: se ejecuto busqueda de duplicados o
  reconciliacion read-only.
- `JIRA_WRITE_APPROVED`: una persona aprobo una escritura externa concreta.
- `JIRA_WRITE_BLOCKED`: el runtime o la politica bloquearon la escritura.
- `JIRA_ISSUE_CREATED`: Jira devolvio issue key creado.
- `JIRA_ISSUE_UPDATE_PROPOSED`: existe una actualizacion candidata.
- `JIRA_ISSUE_UPDATED`: Jira confirmo una actualizacion.
- `PROCESS_MARKED_DONE`: el proceso local paso a `done`.

Estados minimos del sync:

- `idle`
- `collecting-control-plane-state`
- `policy-checking`
- `reading-jira-metadata`
- `reconciling-jira`
- `ready-for-approval`
- `writing-jira`
- `blocked`
- `synced`
- `done`

La primera version del orquestador puede modelar esta maquina de forma
declarativa. XState puede incorporarse cuando el runtime necesite ejecutar
transiciones, guards y acciones en memoria o como servicio.

## Flujo De Mantenimiento

El mantenimiento de tickets debe ejecutarse como reconciliacion controlada, no
como sincronizacion ciega.

Para cada funcionalidad no cerrada:

- si no existe ticket Jira, se puede proponer creacion;
- si existe ticket Jira, se debe evitar crear duplicado;
- si existe ticket Jira sin `Proceso de sincronizacion`, se puede proponer
  actualizacion de descripcion para agregar el proceso vigente;
- si existe ticket Jira sin `Procesos origen`, se puede proponer actualizacion
  de descripcion para separar origen funcional de sincronizacion;
- si el `status` cambio, se puede proponer actualizacion de labels y
  descripcion;
- si los `open_gaps` cambiaron, se puede proponer actualizacion de descripcion;
- si la funcionalidad paso a `done`, se puede proponer cierre o comentario en
  Jira, pero solo con aprobacion humana explicita;
- si Jira esta cerrado pero el feature state no esta `done`, el control-plane
  debe conservar el estado abierto hasta que exista evidencia local.

Las ediciones, comentarios, transiciones y cierres en Jira son acciones de
escritura externa. Requieren request, evidencia, busqueda de impacto y
aprobacion humana.

## Politica De Duplicados

Antes de crear tickets, el flujo debe buscar duplicados con una consulta que
incluya el `state_id`.

Si hay duplicado:

- no se crea un ticket nuevo;
- se registra el issue key observado;
- se decide si el ticket existente se mantiene, se actualiza o se ignora;
- cualquier actualizacion requiere aprobacion humana.

Si no hay duplicado:

- el ticket queda elegible para creacion;
- la evidencia debe indicar que la busqueda fue ejecutada.

## Politica De Evidencia

Cada request que cree o mantenga tickets debe guardar evidencia no secreta.

Evidencia minima:

- metadata Jira observada;
- campos requeridos del issue type;
- resultado de busqueda de duplicados;
- dry-run o payload propuesto;
- resumen de tickets creados, saltados o bloqueados;
- comandos de validacion ejecutados;
- resultado de `npm run check`.

La evidencia no debe incluir:

- tokens;
- cookies;
- `cloudId`;
- URLs privadas del sitio Atlassian;
- datos de autenticacion OAuth;
- informacion sensible no necesaria para operar el ticket.

## Gating De Publicacion

Un batch de tickets puede publicarse solo si:

- existe request `planned`;
- la politica esta referenciada en el request;
- el proyecto `SST` y tablero `SST-Team` fueron confirmados;
- el issue type `Tarea` fue confirmado;
- los campos requeridos fueron observados;
- el dry-run paso por el template minimo;
- la busqueda de duplicados no encontro conflictos o el manejo fue decidido;
- el payload incluye `Proceso de sincronizacion`;
- el payload incluye `Procesos origen`;
- el usuario aprobo la escritura externa en Jira.

## Aplicacion Para CR-SST-0033

Para `CR-SST-0033`, el batch actual contiene 9 funcionalidades no cerradas.

La publicacion queda permitida solamente despues de pasar por esta politica y
mantener la evidencia del batch en `evidence/requests/CR-SST-0033/`.

La aprobacion humana cubre la creacion inicial de issues para esas 9
funcionalidades, no cubre ediciones futuras, comentarios, transiciones ni
cierres.

## Ideas Para Evolucion

- Agregar un comando `jira:mcp:policy-check` que valide el dry-run contra esta
  politica antes de publicar.
- Adoptar una maquina XState para ejecutar los eventos de backlog sync cuando
  el modelo declarativo quede validado.
- Guardar el issue key creado como evidencia y, si se decide mas adelante,
  enlazarlo desde el feature state mediante un campo controlado.
- Agregar reconciliacion read-only para detectar tickets Jira cerrados mientras
  el feature state sigue abierto.
- Agregar una politica separada para `bugfixes` si el tablero empieza a manejar
  incidentes o correcciones operativas.
- Agregar aprobaciones por tipo de escritura: crear, editar, comentar,
  transicionar y cerrar.
