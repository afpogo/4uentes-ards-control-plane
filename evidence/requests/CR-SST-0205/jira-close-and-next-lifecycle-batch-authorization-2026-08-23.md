# Lote Jira autorizado al cerrar CR-SST-0205

Fecha: 2026-08-23.

## Autoridad

El usuario indico: `Ok actualicemos jira y avancemos al siguiente lifecycle`.
La autorizacion se consume una sola vez en esta sesion y se limita al espejo
Jira del cierre ya publicado de `CR-SST-0205` y al inicio gobernado de
`CR-SST-0206`.

## Preflight read-only

- `SST-115`: Subtask de `SST-113`, refleja `CR-SST-0205`, estado
  `Tareas por hacer`; el control plane ya esta `done`.
- `SST-116`: Subtask de `SST-113`, refleja `CR-SST-0206`, estado
  `Tareas por hacer`; sus dependencias locales `CR-SST-0202`, `CR-SST-0204` y
  `CR-SST-0211` estan `done`.
- Transiciones disponibles en ambos issues: `En curso` (`21`) y `Listo`
  (`41`, destino `Finalizada`).

## Operaciones exactas

1. Transicionar solamente `SST-115` mediante `41` a `Finalizada`.
2. Transicionar solamente `SST-116` mediante `21` a `En curso`, pero unicamente
   despues de fusionar el lifecycle `running` de `CR-SST-0206`.
3. Releer ambos issues y registrar status, categoria, tipo y parent.

No se autorizan comentarios, edicion de campos, creacion, borrado, links,
reparenting ni escritura sobre `SST-113` u otro issue. Jira sigue siendo mirror;
el control plane conserva autoridad.
