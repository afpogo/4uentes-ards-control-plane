# Plan De Espejo Jira

Crear, despues de validar el lifecycle local:

1. Epic para `INIT-SST-0005`.
2. Tarea padre para `CR-SST-0128`, policy y gobierno del programa.
3. Subtasks para `CR-SST-0129..0135` bajo la Tarea padre.
4. Conservar `SST-56` para `CR-SST-0127` y vincularlo con `Relates` al programa.
5. Reflejar dependencias `Blocks` declaradas en los CRs.

Todos los issues nacen en Tareas por hacer. Solo el CR que comience ejecucion
puede pasar a En curso. Jira es mirror; el control-plane es source of truth.
