# Lote Jira Autorizado Del Tren Minimo

## Estado

`authorized`; autorizacion humana explicita recibida el `2026-08-10` con la
frase `Autorizo el lote Jira enumerado`.

La ventana queda limitada a la sesion de ejecucion iniciada con esa respuesta,
desde `2026-08-10T03:28:27Z` hasta `2026-08-10T05:00:00Z`, o hasta que el lote
se complete o consuma por un fallo parcial, lo que ocurra primero.

## Identidad

- Request de autoridad: `CR-SST-0152`.
- Provider/proyecto: Jira / `SST`.
- Candidato 1: Epic `[SST][INIT-SST-0004] SST Infrastructure Production Readiness`.
- Candidato 2: Tarea `[SST][CR-SST-0152] Govern minimal SST development release train`.
- Parent del candidato 2: la Epic primaria creada para `INIT-SST-0004`.
- Candidato 3: Subtask `[SST][CR-SST-0153] Separate learning preview from accepted context`.
- Parent del candidato 3: `SST-6` bajo `SST-27 / INIT-SST-0001`.
- Candidato 4: Subtask `[SST][CR-SST-0154] Classify learning source presentation types`.
- Parent del candidato 4: `SST-6` bajo `SST-27 / INIT-SST-0001`.

## Operaciones Autorizadas

1. Repetir JQL de identidad inmediatamente antes de escribir.
2. Crear exactamente la Epic enumerada.
3. Crear exactamente la Tarea enumerada bajo esa Epic.
4. Crear exactamente las dos Subtasks enumeradas bajo `SST-6`.
5. Agregar exactamente un comentario de cierre fijo a cada mirror de
   `CR-SST-0152`, `CR-SST-0153` y `CR-SST-0154`.
6. Transicionar esos tres mirrors desde su estado inicial a `Listo` usando
   solamente una transicion terminal observada por preflight.
7. Leer nuevamente las cuatro identidades y verificar tipo, parent, summary,
   estado y comentarios.
8. Verificar `SST-74` en modo read-only; no escribir sobre ese issue.

No se autorizan links, ediciones, borrados, reparenting, asignaciones,
transiciones de la Epic, comentarios adicionales, otros issues ni escrituras
wildcard. La autorizacion se consume al completar estas diez escrituras
enumeradas (`4 create + 3 comment + 3 transition`) o ante un fallo parcial.

## Comentarios Fijos

- `evidence/requests/CR-SST-0152/jira-cr-sst-0152-closure-comment.md`
- `evidence/requests/CR-SST-0152/jira-cr-sst-0153-closure-comment.md`
- `evidence/requests/CR-SST-0152/jira-cr-sst-0154-closure-comment.md`
