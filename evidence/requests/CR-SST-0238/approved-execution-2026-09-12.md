# Ejecución aprobada de CR-SST-0238

Fecha local de aprobación: `2026-09-12T03:27:46.2560273-03:00`.

La persona usuaria respondió `autorizo lote` a la pregunta que enumeró el lote
exacto y su ventana de 60 minutos. La aprobación comprende ambos elementos y no
amplía el alcance publicado en
`evidence/requests/CR-SST-0238/execution-gate-2026-09-12.md`.

La ventana comienza sólo después de fusionar y releer desde `origin/main` este
lifecycle `running` y el presente ledger. Expira al completar el lote, ante el
primer fallo o resultado incierto, al perder acceso requerido o a los 60
minutos de T0, lo que ocurra primero.

## Operaciones autorizadas

1. Publicar y releer `CR-SST-0238` como `running` en el control-plane.
2. Sobre `SST-131`, y sólo después de un preflight fresco:
   - agregar exactamente un comentario inicial;
   - transicionar de `Tareas por hacer` a `En curso`;
   - realizar readback después de cada escritura.
3. Crear un worktree limpio de `sst-fend` desde el `origin/develop` refrescado
   y ejecutar las cuatro correcciones, sus pruebas y documentación owner sólo
   en las rutas enumeradas por el gate.
4. Ejecutar pruebas focales y `npm.cmd run check`, commitear, publicar el branch
   y abrir un único PR owner hacia `develop`.
5. Publicar evidencia sanitizada del resultado en el control-plane y ejecutar
   su `npm.cmd run check` completo.

Comentario Jira exacto autorizado:

`CR-SST-0238 inicio: lifecycle running publicado y leído desde main antes de modificar sst-fend. Alcance limitado a corregir la entrada firstLogin hacia defaultModule/Home y los warnings React fetchPriority, findDOMNode y v7_startTransition; incluye specs/docs/tests owner. Sin merge, runtime, Docker, deployment, datos reales ni cambios Auth/Bend/Infra. ARDS/SDD conserva autoridad; Jira es espejo y queda En curso.`

## Límites

La primera escritura externa vuelve la autorización de un solo uso. Un fallo,
drift o incertidumbre consume el lote y obliga a detener nuevas escrituras,
hacer sólo reconciliación de lectura y publicar el resultado parcial.

No se autoriza merge del PR owner, ejecución o recreación de servidores o
contenedores, QA en `localhost:4090`, deployment, cambios Infra/GitOps,
credenciales de usuario, datos reales ni mutaciones en Auth/Bend u otros repos.
