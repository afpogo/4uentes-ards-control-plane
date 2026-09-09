# Batch de escritura Jira para CR-HPT-0022

Fecha: 2026-08-28

Estado: consumido

Fuente de autorización: el usuario instruyó implementar los cinco gates
enumerados, incluida la creación de una Tarea Jira hija de `HPT-8` para este
CR.

Se autoriza una única creación durante este turno:

- tipo: `Tarea`;
- proyecto: `HPT`;
- parent: `HPT-8`;
- summary: `[CR-HPT-0022] Adopt the Automation receipt-object service grant in 4uentes-auth`;
- labels: `ards-sdd`, `cr-hpt-0022`, `init-hpt-0003`,
  `receipt-object-grant`, `auth`.

El batch debe leer `HPT-8`, buscar duplicados por ID, crear sólo si no existe
ninguno y hacer readback de tipo, parent, estado y labels.

No se autoriza transición, comentario, asignación, borrado ni otra escritura.
El batch se consume al crear y verificar la Tarea o al registrar un intento de
escritura con resultado incierto.


Resultado: se creó y verificó `HPT-14` bajo `HPT-8`.
