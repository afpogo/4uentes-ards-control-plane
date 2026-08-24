# Autorización exacta pendiente para CR-HPT-0019

Fecha: 2026-08-23.

La instrucción del usuario de mergear el trabajo y mantener Jira actualizado
autoriza este frente de preparación, pero no se interpreta como un permiso
Jira abierto. El lote que requiere confirmación es exactamente el contenido de
`correction-plan-preview.json`:

1. actualizar sólo la descripción de `HPT-5`;
2. crear una única `Tarea` para `CR-HPT-0018`, parent `HPT-5`, directamente en
   `Listo` mediante transición `41`;
3. releer ambas superficies;
4. no comentar, borrar, enlazar, reparentar ni editar otros issues.

Hasta recibir esa confirmación, `jira_write_allowed=false` y `blocked=1`.
