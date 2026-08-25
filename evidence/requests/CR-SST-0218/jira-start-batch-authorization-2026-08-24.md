# Autorización exacta del lote Jira de inicio de CR-SST-0218

Fecha: 2026-08-24.

## Identidad y jerarquía esperadas

- request: `CR-SST-0218`;
- provider/proyecto: Jira / `SST`;
- iniciativa/Epic esperada: `INIT-SST-0007` / `SST-86`;
- parent Task: `SST-113`;
- candidato: una única `Subtask`;
- summary exacto:
  `[CR-SST-0218] Propagar eventos terminales de retencion a sesiones activas`;
- estado final esperado del lote: `En curso`, sin resolución.

## Operaciones permitidas

1. Después del merge/readback de `running`, ejecutar búsqueda JQL por request
   ID y summary, y leer `SST-113` con su jerarquía bajo `SST-86`.
2. Si no existe un mirror compatible, crear exactamente una Subtask con el
   parent y summary enumerados.
3. Si existe un único mirror compatible, reconciliarlo sin crear duplicado.
4. Transicionar únicamente el issue resuelto a `En curso`.
5. Ejecutar readback de key, type, parent, status y resolution.

No se autorizan comentarios, links, labels, assignee, edición de descripción,
borrados ni escrituras sobre otro issue.

## Ventana y consumo

La autorización corresponde a un único lote posterior al readback de
`running` del 2026-08-24. Se consume con el readback exitoso. Un error parcial
permite sólo reconciliación read-only; cualquier retry que amplíe operaciones
o cambie identidad requiere una nueva autorización.

## Precondición bloqueante

Atlassian OAuth debe volver a funcionar y el preflight read-only debe aprobar
duplicado y jerarquía. Mientras eso no ocurra, no hay permiso operativo para
intentar la escritura.

