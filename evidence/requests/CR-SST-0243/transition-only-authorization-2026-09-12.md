# Autorización del lote de transición de CR-SST-0243

Fecha local: 2026-09-12.

## Decisión

Después de fusionar y leer desde `main` el fail-stop del lote anterior mediante
el PR `#323`, el usuario indicó expresamente «avancemos con el lote» sobre el
gate propuesto de una sola escritura Jira y su publicación final.

La autorización queda acotada a `CR-SST-0243`, provider Jira, proyecto `SST` e
issue primario `SST-130`. Sólo después de fusionar y leer canónicamente este
ledger comienza una ventana máxima de 30 minutos.

## Precondiciones

El preflight inmediatamente anterior a la escritura debe confirmar:

- una única coincidencia de `CR-SST-0243` en el proyecto `SST`;
- issue `SST-130`, id `10291`, tipo `Subtask` y parent `SST-128` bajo la Epic
  `SST-127` de `INIT-SST-0011`;
- estado `En curso`, resolución nula y comentario exacto `10441` presente;
- vínculo `10093` con el bloqueante `SST-129` intacto;
- transición `41` disponible hacia `Finalizada`.

## Operación autorizada

Máximo una escritura: ejecutar exclusivamente la transición `41` sobre
`SST-130`. Después se exige un readback inmediato de identidad, estado,
resolución, comentarios, parent y vínculos.

Cualquier drift, fallo, incertidumbre, pérdida de credenciales o vencimiento
consume el lote y bloquea la escritura o el cierre. La autorización incluye
publicar, fusionar y releer la evidencia final del control-plane si la
transición y su readback son exactos.

No autoriza comentarios, ediciones de campos o vínculos, otras transiciones u
otros issues. Tampoco autoriza cambios en Auth, Bend, Fend, Infra, runtime,
rollback, migraciones, flags, datos reales o QA integrada.
