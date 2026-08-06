# Análisis del comentario inicial faltante

Fecha: 2026-08-04

La lectura live de `SST-74` confirmó que el issue estaba `En curso`, tenía la
descripción gobernada y responsable asignado, pero no contenía comentarios.

La causa no fue un error del conector: el lote inicial de `CR-SST-0149`
autorizó únicamente editar la descripción, asignar al usuario Jira conectado y
transicionar a `En curso`. La operación `add-initial-plan-comment` no estaba
enumerada y, por policy, no podía ejecutarse.

El usuario autorizó un segundo lote independiente y acotado:

- request: `CR-SST-0149`;
- provider/proyecto: Jira / `SST`;
- issue: `SST-74`;
- operación única: `add-initial-plan-comment`;
- parent/tipo/estado esperados: `SST-72` / `Error` / `En curso`;
- ventana: turno actual de corrección del comentario inicial.

Este lote no autoriza cambios de descripción, summary, responsable, estado,
tipo, parent, prioridad, labels, links ni otros issues.
