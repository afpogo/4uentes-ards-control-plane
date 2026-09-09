# Batch de escritura Jira para CR-HPT-0020

Estado: consumido

Se autoriza una única creación:

- tipo: `Tarea`;
- proyecto: `HPT`;
- parent: `HPT-8`;
- summary: `[CR-HPT-0020] Define receipt object custody and binding provisioning boundary`;
- labels: `ards-sdd`, `cr-hpt-0020`, `init-hpt-0003`,
  `receipt-object-custody`, `sst`.

El batch debe leer `HPT-8`, buscar duplicados por ID, crear sólo si no existe
ninguno y hacer readback de tipo, parent, estado y labels.

No se autoriza transición, comentario, asignación ni otra escritura.

Resultado: se creó `HPT-13` y se verificó su parent `HPT-8`, tipo `Tarea`,
estado `Por hacer` y labels exactas.
