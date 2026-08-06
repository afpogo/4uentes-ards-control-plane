# Autorización De Lote Jira — CR-CP-0017

Fecha: 2026-07-19
Ventana: turno manual actual
Estado inicial: consumido

## Fuente De Autorización

El owner solicitó avanzar con el siguiente ticket después de acordar que la
baseline normativa v1 debe preceder al trabajo de runtime de `ARDS-13`.

## Límite Del Lote

- Request: `CR-CP-0017`
- Provider: Jira
- Proyecto: `ARDS`
- Candidato de creación: una única Tarea para `CR-CP-0017`
- Parent esperado: `ARDS-1`
- Tipo esperado: `Tarea`
- Estado inicial esperado: `Por hacer`
- Búsqueda exacta: `project = ARDS AND labels = "cr-cp-0017"`

## Operaciones Permitidas

- Leer metadata del proyecto, tipo y parent.
- Buscar duplicados mediante JQL.
- Crear exactamente una Tarea si no existe coincidencia compatible.
- Incluir summary, descripción y labels sanitizados durante la creación.
- Releer identity, parent, type, status, resolution, assignee y labels.
- Actualizar los artefactos locales con la key observada.

## Operaciones Prohibidas

- Comentarios.
- Transiciones.
- Asignaciones manuales.
- Ediciones posteriores a la creación.
- Links Jira.
- Borrados.
- Creación de cualquier otro issue.

La autorización se consume al completar el lote o al terminar el turno.

## Resultado

- Estado: consumido.
- Issue creado: `ARDS-16`.
- Tipo observado: `Tarea`.
- Parent observado: `ARDS-1`.
- Estado observado: `Por hacer`.
- Resolution: ausente.
- Assignee: ausente.
- Operaciones adicionales: ninguna.
