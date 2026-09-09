# Batch de escritura Jira para CR-HPT-0025

Fecha: 2026-08-28

Estado: consumido

Fuente de autorización: el usuario instruyó implementar los cinco gates
enumerados, incluida una Tarea Jira hija de `HPT-8` para este CR.

Se autoriza una única creación durante este turno:

- tipo: `Tarea`;
- proyecto: `HPT`;
- parent: `HPT-8`;
- summary: `[CR-HPT-0025] Implement SST receipt-object upload custody and retention`;
- labels: `ards-sdd`, `cr-hpt-0025`, `init-hpt-0003`,
  `receipt-upload`, `sst`.

El batch debe buscar duplicados, crear sólo si no existe ninguno y releer tipo,
parent, estado y labels. No autoriza transición, comentario ni asignación.

Resultado: se creó y verificó `HPT-17` bajo `HPT-8`.
