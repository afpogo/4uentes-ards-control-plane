# Preflight Jira Read-only Del Tren Minimo

## Ejecucion

- Fecha: 2026-08-06.
- Provider/proyecto: Jira / `SST`.
- Modo: JQL y metadata read-only.
- Jira permanece como mirror; el control plane es source of truth.

El preflight se repitio despues del merge del PR #3. Se buscaron coincidencias
por `INIT-SST-0004`, `CR-SST-0152`, `CR-SST-0153`, `CR-SST-0154` y los titulos
propuestos. No existe una Epic primaria compatible para `INIT-SST-0004` ni un
issue compatible para ninguno de los tres CRs.

Una busqueda semantica amplia de accepted context devolvio `SST-46`, pero se
descarto como duplicado: corresponde a `CR-SST-0116`, esta finalizada y su
identidad no coincide con `CR-SST-0153`.

## Jerarquia Y Metadata

- `SST-6` existe, es una `Tarea`, permanece `En curso` y pertenece a la Epic
  `SST-27` de `INIT-SST-0001`.
- El proyecto expone `Epic`, `Tarea` y `Subtask`.
- `Subtask` exige parent; `SST-6` es un parent valido para los dos CRs
  ejecutables acotados.
- Una `Tarea` puede usar como parent la nueva Epic de `INIT-SST-0004`.

## Decision

El lote propuesto no esta duplicado segun el estado observado. Los candidatos
son:

1. Epic de `INIT-SST-0004`.
2. Tarea de `CR-SST-0152` bajo esa Epic.
3. Subtask de `CR-SST-0153` bajo `SST-6`.
4. Subtask de `CR-SST-0154` bajo `SST-6`.

No se realizo ninguna escritura. Creaciones y transiciones a `En curso`
permanecen bloqueadas hasta el merge humano de la enmienda y una autorizacion
de lote explicita posterior. La evidencia omite cloud IDs, account IDs,
correos, URLs privadas y contenido de usuario.
