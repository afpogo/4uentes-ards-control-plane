# CR-SST-0219 - Autorización Del Lote Jira De Inicio

Estado: `approved-and-consumed`.

## Lote Exacto

Provider/proyecto: Jira / `SST`.

Candidato único:

- summary: `[SST][INIT-SST-0010][CR-SST-0219] Adopt paragraph-sequential derivation contract`;
- type: `Tarea`;
- parent: `SST-105`;
- description: `jira-description-draft.md`;
- estado inicial esperado: `Tareas por hacer`;
- estado de inicio esperado: `En curso`.

Operaciones permitidas después de la autorización:

1. Repetir la búsqueda JQL de duplicados inmediatamente antes de escribir.
2. Crear exactamente la Tarea enumerada.
3. Leer nuevamente identidad, description, type, parent y status.
4. Consultar las transiciones disponibles del issue creado.
5. Aplicar exactamente una transición cuyo destino sea `En curso`.
6. Leer nuevamente el issue y verificar el estado.

No se autorizan comments, links, labels, assignee, borrados, ediciones
posteriores, cambios en `SST-105`, otros issues ni operaciones wildcard. La
ventana comenzará con la respuesta humana que autorice este lote y finalizará
al completar las dos escrituras o ante el primer fallo parcial.

## Autorización

- Estado: `consumed`.
- Aprobador: `4uentes`.
- Fecha: `2026-08-25`.
- Texto: `ok autorizo`.
- Resultado: `SST-120` fue creado, leído, movido una vez a `En curso` y leído nuevamente.
- Evidencia: `jira-start-batch-result-2026-08-25.md`.
- Autorización vigente para nuevas escrituras: `false`.
