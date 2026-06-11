# Resumen De Busqueda De Duplicados

## Estado

- Fecha: 2026-06-05
- Request: CR-SST-0029
- Resultado: no ejecutado

## Motivo

La busqueda de duplicados requiere una conexion Atlassian/Jira MCP operativa.
El runtime actual no expone tools Jira MCP, por lo que la busqueda todavia no
pudo ejecutarse.

## Estrategia Prevista

Para cada ticket del dry-run, buscar en Jira por:

- `state_id`;
- summary exacto o aproximado;
- labels `ards-sdd`, `control-plane`, `feature-state`, `not-done`;
- request ids cuando existan.

## Follow-Up Requerido

Despues de configurar MCP, ejecutar duplicate search antes de cualquier
escritura Jira. Los tickets no deben crearse hasta revisar duplicados o aceptar
explicitamente su creacion.
