# Preflight Jira read-only

Fecha: 2026-08-04

No se ejecutaron escrituras, comentarios ni transiciones.

## Resultado

- `SST-72` es una Epic en `Por hacer` y cubre estabilización integral de login, signup y recovery. Se reutiliza como mirror de `INIT-SST-0006`.
- `SST-73..81` están en `Por hacer`, bajo `SST-72`, con tipo actual `Error` y sin referencias INIT/CR.
- La búsqueda por auth, login, signin, signup, register, rebrand, overflow y responsive no encontró otro programa ni un ticket de rebranding completo.
- `SST-73` cubre la exposición de credenciales; `SST-74` el layout mobile de signup; `SST-76` el popover signin; `SST-77/78/81` son dependencias de accesibilidad, validación y densidad; `SST-80` requiere autoridad legal/producto.

## Decisión de reconciliación

- No crear otra Epic.
- Reutilizar `SST-73`, `SST-74` y `SST-76`, preservando sus keys.
- Evaluar conversión `Error -> Task` antes de usarlos como issue primario de CR; no crear duplicados para evitar la incompatibilidad.
- Crear una Task nueva bajo `SST-72` para `CR-SST-0150` y otra para `CR-SST-0151` sólo después de autorización humana enumerada.
- Toda escritura debe indicar proyecto, keys/candidatos, operación, tipo/parent/status esperados y ventana de ejecución.
