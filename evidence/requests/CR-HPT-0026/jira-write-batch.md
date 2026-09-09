# Batch de escritura Jira para CR-HPT-0026

Fecha: 2026-08-28

Estado: consumido

Fuente de autorización: el usuario instruyó implementar los cinco gates
enumerados, incluida una Tarea Jira hija de `HPT-8` para este CR.

Se autoriza una única creación durante este turno:

- tipo: `Tarea`;
- proyecto: `HPT`;
- parent: `HPT-8`;
- summary: `[CR-HPT-0026] Adopt Automation receipt custody and run integrated QA`;
- labels: `ards-sdd`, `cr-hpt-0026`, `init-hpt-0003`,
  `receipt-automation`, `qa`.

El batch debe buscar duplicados, crear sólo si no existe ninguno y releer tipo,
parent, estado y labels. No autoriza transición, comentario ni asignación.

Resultado: se creó y verificó `HPT-18` bajo `HPT-8`.
