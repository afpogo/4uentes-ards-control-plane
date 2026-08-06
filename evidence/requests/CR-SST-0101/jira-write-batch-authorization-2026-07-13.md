# CR-SST-0101 - Autorizacion De Lote Jira

## Alcance Autorizado

- Request: `CR-SST-0101`.
- Provider: Jira Work mediante MCP Atlassian.
- Proyecto: `SST`.
- Issue enumerado: `SST-33`.
- Initiative/Epic: `INIT-SST-0003 / SST-29`.
- Issue type y parent esperados: `Tarea` bajo `SST-29`.
- Estado inicial esperado: `Tareas por hacer`.
- Operaciones permitidas:
  - transicionar a `En curso` y agregar el comentario de inicio/reconciliacion;
  - transicionar a `En revision` mediante `In Review` y agregar el comentario de revision;
  - transicionar a `Finalizada` mediante `Listo` y agregar el comentario de cierre.
- Ventana: turno activo del 2026-07-13.
- Borrados, edicion de campos, reparenting, links y cualquier otro issue: no autorizados.

## Fuente De Autorizacion

El usuario solicito explicitamente conectarse a SST-33 mediante Jira Work MCP,
transicionarlo con comentarios y recorrer todos los estados para preservar
trazabilidad.

## Preflight

- Estado observado: `Tareas por hacer`.
- Tipo observado: `Tarea`.
- Parent observado: `SST-29`, tipo `Epic`.
- Summary e identidad: compatibles con `CR-SST-0101` e `INIT-SST-0003`.
- Transiciones disponibles: `Por hacer`, `En curso`, `In Review`, `Listo`.
- Duplicado o issue alternativo: no detectado.
- Evidencia:
  - `evidence/requests/CR-SST-0101/jira-issue-SST-33-observation.md`;
  - `evidence/requests/CR-SST-0101/jira-active-dependency-review-summary.md`.

## Proteccion De Datos

Los comentarios solo publican identidad del CR, disposicion, rutas relativas de
owner docs y resultados de validacion. No incluyen URLs privadas, contenido
capturado, tokens, cookies, JWT, credenciales ni valores de secretos.

