# Maquina De Sincronizacion Jira Backlog

## Proposito

Este documento define el primer modelo de sincronizacion entre el control-plane
y el backlog Jira del proyecto `SST`.

La idea es que el orquestador deje de ejecutar scripts Jira como pasos sueltos
y empiece a tratarlos como eventos de una maquina de estados auditable.

## Principio Central

Jira es el backlog operativo. El control-plane es la fuente de verdad.

Eso significa:

- Jira puede mostrar prioridad, asignacion y seguimiento;
- Jira puede recibir tickets creados o actualizados desde el control-plane;
- Jira no decide por si solo que un proceso local esta `done`;
- el cierre real del proceso vive en `requests/done/` y en la evidencia local.

## Procesos CR-SST En Jira

Cada ticket generado o mantenido por el control-plane debe incluir:

```text
Proceso de sincronizacion:
- CR-SST-****

Procesos origen:
- CR-SST-****
```

`Proceso de sincronizacion` identifica el proceso que genero, actualizo o
reconcilio el ticket.

`Procesos origen` conserva los `request_ids` historicos del feature state.

CR-SST-0034 es un proceso de sincronizacion. No convierte cada CR-SST en un
ticket Jira propio ni reemplaza los procesos origen de las funcionalidades.

## Modelo De Estados

El contrato declarativo vive en:

- `state/jira-backlog-sync-machine.yaml`

Estados principales:

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

## Eventos Principales

- `BACKLOG_SYNC_REQUESTED`
- `CONTROL_PLANE_STATE_COLLECTED`
- `POLICY_CHECK_PASSED`
- `POLICY_CHECK_FAILED`
- `JIRA_METADATA_CONFIRMED`
- `JIRA_DUPLICATES_SEARCHED`
- `JIRA_WRITE_APPROVED`
- `JIRA_WRITE_BLOCKED`
- `JIRA_ISSUE_CREATED`
- `JIRA_ISSUE_UPDATED`
- `PROCESS_MARKED_DONE`

## Relacion Con XState

XState es una opcion razonable para ejecutar este modelo en runtime porque
permite:

- declarar estados;
- controlar transiciones;
- separar eventos de acciones;
- agregar guards;
- registrar estados bloqueados;
- extender el flujo a futuras operaciones externas.

La primera version queda como YAML auditable. La adopcion de XState debe venir
despues, cuando el orquestador necesite ejecutar transiciones en memoria o en
un proceso interno autorizado.

## Dry-Run Local

CR-SST-0035 agrega un primer runner local sin escritura Jira:

```bash
npm run jira:mcp:sync-machine -- --request-id CR-SST-0035 --output-dir evidence/requests/CR-SST-0035 --mode dry-run
```

El runner ejecuta el camino read-only desde `idle` hasta
`ready-for-approval` y registra la traza en evidencia.

CR-SST-0036 conecta ese runner con acciones read-only reales:

```bash
npm run jira:mcp:sync-machine -- --connect --request-id CR-SST-0036 --output-dir evidence/requests/CR-SST-0036 --mode read-only
```

El modo `read-only` ejecuta `policy-check`, lectura de metadata Jira, busqueda
de duplicados y reconciliacion. No ejecuta creacion, edicion, comentarios ni
transiciones Jira.

## Doctor De Sincronizacion

CR-SST-0037 agrega un doctor local/read-only para estabilizar el flujo antes de
seguir escribiendo en Jira:

```bash
npm run jira:mcp:doctor -- --request-id CR-SST-0037 --output-dir evidence/requests/CR-SST-0037 --mode read-only
```

El doctor sirve para:

- analizar el estado de `state/features/*.current.yaml`;
- verificar la superficie de comandos Jira MCP;
- revisar el estado declarativo de la maquina;
- leer la ultima reconciliacion disponible;
- generar un `correction-plan-preview` para descripciones Jira;
- persistir un `machine-run-state.yaml` de la corrida de diagnostico.

El doctor no crea, edita, comenta, transiciona ni cierra issues Jira. Las
correcciones reales deben ejecutarse en una fase de escritura separada con
aprobacion humana explicita y evidencia previa.

## Acciones De Lectura

Estas acciones son read-only o locales:

- leer `state/features/*.current.yaml`;
- leer `requests/*/CR-SST-*.yaml`;
- generar dry-run;
- ejecutar `policy-check`;
- leer metadata Jira por MCP;
- buscar duplicados Jira por MCP;
- escribir evidencia no secreta.

## Acciones De Escritura Jira

Estas acciones son escritura externa y requieren aprobacion separada:

- crear issue Jira;
- actualizar descripcion de issue Jira;
- comentar issue Jira;
- transicionar issue Jira;
- cerrar issue Jira.

Cada una debe pasar por un evento explicito y quedar registrada en evidencia.

Los comandos operativos Jira deben recibir siempre `--request-id` y
`--output-dir`. Esto evita que una corrida deje evidencia en un CR equivocado o
use defaults historicos.

## Primer Uso En CR-SST-0034

CR-SST-0034 prepara el orquestador para:

- extender el template Jira con `Proceso de sincronizacion`;
- separar `Proceso de sincronizacion` de `Procesos origen`;
- reconciliar tickets existentes;
- proponer actualizaciones de descripcion;
- preparar el camino para un runtime XState futuro;
- mantener bloqueos de escritura externa como evidencia, no como fallas ocultas.
