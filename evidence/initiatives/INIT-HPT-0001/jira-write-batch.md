# Autorizacion De Lote Jira INIT-HPT-0001

Fecha: 2026-07-12
Ventana: turno manual actual
Proveedor: Jira
Proyecto: `HPT`

## Fuente De Autorizacion

El usuario solicito explicitamente vincular el proyecto `HPT`, generar una Epic
atada a una Initiative y generar los primeros CRs y sus mirrors Jira.

## Creaciones Enumeradas

1. Epic para `INIT-HPT-0001`.
2. Tarea para `CR-HPT-0001` bajo la Epic creada o reconciliada.
3. Tarea para `CR-HPT-0002` bajo la misma Epic.
4. Tarea para `CR-HPT-0003` bajo la misma Epic.

## Operaciones Permitidas

- Buscar duplicados con JQL.
- Crear exactamente la Epic y las tres Tareas enumeradas si no existen.
- Asociar cada Tarea a la Epic como parent.
- Releer los cuatro issues para verificar keys, types, parent y status.
- Actualizar artefactos locales con las keys observadas.

## Operaciones No Permitidas

- Transiciones de estado.
- Asignacion de usuarios.
- Comentarios, borrados o ediciones no necesarias para la creacion.
- Creacion de issues adicionales.

La autorizacion se consume al completar este lote o al finalizar el turno.

## Resultado Del Lote

- Estado: consumido.
- Epic: `HPT-1`.
- Tareas: `HPT-2`, `HPT-3`, `HPT-4`.
- Operaciones adicionales: ninguna.
- Evidencia: `evidence/initiatives/INIT-HPT-0001/jira-epic-and-task-sync-summary.md`.
