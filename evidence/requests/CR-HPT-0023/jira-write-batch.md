# Batch de escritura Jira para CR-HPT-0023

Fecha: 2026-08-28

Estado: consumido

Fuente de autorización: el usuario instruyó implementar los cinco gates
enumerados, incluida una Tarea Jira hija de `HPT-8` para este CR.

Se autoriza una única creación durante este turno:

- tipo: `Tarea`;
- proyecto: `HPT`;
- parent: `HPT-8`;
- summary: `[CR-HPT-0023] Implement SST receipt-intake binding provisioning`;
- labels: `ards-sdd`, `cr-hpt-0023`, `init-hpt-0003`,
  `receipt-binding`, `sst`.

El batch debe leer `HPT-8`, buscar duplicados por ID, crear sólo si no existe
ninguno y hacer readback de tipo, parent, estado y labels. No se autoriza
transición, comentario, asignación, borrado ni otra escritura.


Resultado: se creó y verificó `HPT-15` bajo `HPT-8`.
