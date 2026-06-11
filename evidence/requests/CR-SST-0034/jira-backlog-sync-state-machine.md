# Maquina De Sincronizacion Jira Backlog

## Estado

- Fecha: 2026-06-06
- Request: CR-SST-0034
- Resultado: `DRAFT_READY`
- Escritura Jira: no

## Artefactos

- `state/jira-backlog-sync-machine.yaml`
- `docs/requests/jira-backlog-sync-state-machine.md`

## Decision

El orquestador queda preparado para tratar la sincronizacion Jira como una
maquina de estados gobernada por eventos, guards y acciones.

La primera version es declarativa. XState queda como candidato de runtime para
una fase posterior, cuando el control-plane necesite ejecutar transiciones en
memoria o en un proceso interno autorizado.

## Estados Principales

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

## Boundary

Las acciones read-only pueden ejecutarse desde el control-plane:

- leer estados locales;
- generar dry-run;
- correr policy-check;
- leer metadata Jira;
- buscar duplicados;
- registrar evidencia.

Las acciones de escritura Jira requieren aprobacion separada y pueden ser
bloqueadas por el runtime:

- crear issues;
- actualizar descripciones;
- comentar;
- transicionar;
- cerrar.
