# Preview exacto de lote Jira — CR-SST-0220

## Objetivo

Crear el espejo Jira de `CR-SST-0220` bajo la Epic `SST-105`, verificarlo y moverlo una sola vez a `En curso`. Este documento es un preview: no autoriza ni ejecuta escrituras.

## Payload fijo de creación

- Proyecto: `SST` (`10001`).
- Issue type: `Tarea` (`10008`).
- Parent: `SST-105` (`10217`).
- Summary: `[SST][INIT-SST-0010][CR-SST-0220] Generalize agent processing modes for articles`.
- Description: contenido sanitizado de `evidence/requests/CR-SST-0220/jira-description-draft.md`.
- Reporter: default del usuario conectado; no se fija ni registra account ID.
- Estado inicial esperado: `Tareas por hacer` (`10005`).

## Lote exacto propuesto

1. Repetir inmediatamente la consulta de duplicados; abortar si aparece cualquier coincidencia.
2. Crear exactamente una `Tarea` con el payload fijo.
3. Leer de vuelta key, ID, summary, description, type, parent, status y resolution.
4. Si y sólo si el readback coincide y el estado es `Tareas por hacer`, aplicar exactamente la transición `21` a `En curso`.
5. Leer de vuelta key, status `En curso` (`10006`) y resolution nula.

## Exclusiones

- No crear issues para `CR-SST-0223` a `CR-SST-0227` bajo este lote.
- No editar `SST-105` ni otros issues existentes.
- No agregar comentarios, links, labels, assignee, attachments ni worklogs.
- No ejecutar una segunda transición.
- No reutilizar la autorización después del primer intento, incluso si el lote falla parcialmente.

## Gate de autorización

Estado: `READY-NOT-AUTHORIZED`.

La autorización debe enumerar las cinco operaciones anteriores y ser independiente de la futura reserva de lifecycles hijos.
