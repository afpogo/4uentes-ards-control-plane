# Jira Epic Sync Summary

## Resultado

Se creo el mirror Jira definitivo para `INIT-CP-0002` en el proyecto `ARDS`
(`4uentes-ARDS-SDD`).

- Epic: `ARDS-1`
- Proyecto: `ARDS`
- Tipo: `Epic`
- Estado observado: `Por hacer`
- Epic relacionada: `SST-36`
- Link Jira: `Relates`
- Mirror temporal reemplazado: `PORT-12`

## Tareas Creadas

- `CR-CP-0001` -> `ARDS-2`
- `CR-CP-0002` -> `ARDS-3`
- `CR-CP-0003` -> `ARDS-4`
- `CR-CP-0004` -> `ARDS-5`
- `CR-CP-0005` -> `ARDS-6`

## Validacion MCP

- Se valido acceso Jira con scope read/write.
- Se valido que el proyecto `4uentes-ARDS-SDD` usa key `ARDS`.
- Se valido que `ARDS` admite `Epic` y `Tarea`.
- Se valido que `ARDS` no tenia issues previos.
- Se valido `SST-36` como Epic existente de `INIT-CP-0001`.
- Se consultaron link types y se uso `Relates`.
- Se consulto JQL final:
  `project = ARDS AND (key = ARDS-1 OR parent = ARDS-1) ORDER BY key ASC`.

## Correccion De Mirror Temporal

Antes de existir el proyecto `ARDS`, se creo temporalmente `PORT-12` con
tareas `PORT-13`..`PORT-17` en el proyecto `PORT`. Ese mirror fue identificado
como ubicacion incorrecta porque el alcance no pertenece a Portfolio producto.

`PORT-12` fue comentado y enlazado con `ARDS-1` como artefacto reemplazado. No
debe usarse para planificacion durable.

## Boundary

Jira es mirror operativo. La fuente de verdad sigue siendo ARDS/SDD local:

- `initiatives/INIT-CP-0002-core-living-resource-standardization.yaml`
- `requests/planned/CR-CP-0001-core-common-policy-canon.yaml`
- `requests/planned/CR-CP-0002-core-child-control-plane-reconciliation-link.yaml`
- `requests/planned/CR-CP-0003-core-state-read-model.yaml`
- `requests/planned/CR-CP-0004-core-initiative-model.yaml`
- `requests/planned/CR-CP-0005-orchestrator-core-living-resource-adoption-review.yaml`
