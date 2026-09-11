# Autorización terminal de CR-SST-0243

Fecha local: 2026-09-11. Después de fusionar y leer desde `main` la
reconciliación del PR `#317`, el usuario autorizó expresamente «autorizo» sobre
el gate terminal exacto publicado en
`integration-deviation-and-closure-gate-2026-09-11.md`.

La autorización permite publicar y leer el ledger terminal-ready de
CR-SST-0243. El lifecycle permanece `running` hasta que el tracker esté
reconciliado, porque el validador de publicación no permite declarar `done`
antes de contar con ese resultado real.
Sólo después de ese readback comienza una ventana máxima de 30 minutos para
dos escrituras Jira sobre `SST-130`: agregar el comentario exacto cuyo SHA-256
UTF-8 es
`1572e6cf198be66f5f4733814c9b5eb7a4b855c3b8f6d3552f72f82a04ec0f28` y,
si el readback mantiene la identidad y transición esperadas, ejecutar la
transición `41` hacia `Finalizada`.

Después de cada escritura se exige readback. Fallo, incertidumbre, pérdida de
credenciales o drift consume el lote y bloquea cualquier escritura restante.
La autorización incluye publicar y leer la evidencia final en el
control-plane.

No permite otros issues, comentarios, campos, links o transiciones. Tampoco
permite cambios en Auth, Bend, Fend, Infra, runtime, rollback, migraciones,
flags, datos reales ni QA integrada.
