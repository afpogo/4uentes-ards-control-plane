# Refresh del preflight Jira de CR-SST-0234

## Readback read-only

El 2026-09-07 se repitió la búsqueda estructurada por los identificadores
`CR-SST-0232` y `CR-SST-0234`. Jira devolvió cero issues. También se leyó la
jerarquía comparable sin modificarla:

- `SST-105` es la Epic de `INIT-SST-0010`, en `Tareas por hacer` y sin
  resolución;
- `SST-122` es una Tarea bajo `SST-105`;
- `SST-123` es una Subtask bajo `SST-122`.

El preflight omite cloud ID, identidades personales, tokens y URLs privadas.

## Batch exacto requerido

La policy viva exige que una autorización de escritura enumere el lote y la
ventana de ejecución. El batch candidato sigue siendo exactamente:

1. crear una Tarea Jira para `CR-SST-0232` bajo la Epic `SST-105`;
2. crear una Subtask Jira para `CR-SST-0234` bajo la nueva Tarea;
3. transicionar únicamente ambos issues a `En curso`;
4. leer de vuelta key, parent, tipo, estado y resolución.

No se autoriza comentario, edición adicional, cambio de la Epic ni transición
de terceros. La instrucción de avanzar con “modificación en Jira” no enumera
por sí sola esas cuatro operaciones, por lo que en este gate no se realizó
ningún write.

Jira continúa siendo mirror; el lifecycle ARDS/SDD del control plane conserva
la autoridad.
