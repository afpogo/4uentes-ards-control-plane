# CR-SST-0030 - Boundary Conceptual

Observado el: 2026-06-05

## Decision

Se separan dos conceptos que habian quedado mezclados:

1. `project_ards_sdd`
2. `sst_user_internal_memory`

## `project_ards_sdd`

El ARDS/SDD del proyecto es la memoria de vida de un repositorio, producto o
control-plane.

En este repo se expresa como archivos:

- `catalog/`;
- `solutions/`;
- `requests/`;
- `evidence/`;
- `specs/`;
- `state/`;
- `docs/`.

Sirve para que agentes y humanos recuerden historicos, decisiones, requests,
validaciones, reglas, handoffs, contratos y estado del trabajo.

Este concepto no debe clonarse automaticamente por cada usuario final de SST.

## `sst_user_internal_memory`

La memoria interna de usuario en SST es un modelo de producto/runtime.

Registra actividad del usuario dentro de SST y conversaciones con chatbot para
permitir:

- recordar hechos utiles;
- recuperar intenciones encaminadas;
- continuar tareas inconclusas;
- asistir decisiones futuras;
- explicar por que el sistema recuerda algo;
- construir contexto agentico privado por usuario.

No es el ARDS/SDD del proyecto. Puede usar ideas de gobierno, evidencia,
provenance y estados, pero no debe presentarse como un ARDS/SDD de usuario.

## Regla De Terminologia

Usar:

- `project ARDS/SDD` para memoria documental y operativa del proyecto.
- `SST user internal memory` para memoria de usuario dentro de la plataforma.
- `user_memory_event`, `user_memory_fact`, `user_memory_intention` y
  `user_memory_thread` para objetos de producto.

Evitar:

- `user ARDS/SDD`;
- `user_ards_workspace`;
- `ARDS/SDD final del usuario`;
- `mutacion del ARDS/SDD del usuario`.

## Relacion Entre Ambos

El proyecto puede documentar la memoria interna de usuario mediante ARDS/SDD.
Eso no convierte cada memoria interna en un ARDS/SDD.

```text
project ARDS/SDD
  documents and governs
    SST user internal memory
```

No:

```text
SST user internal memory
  is a project ARDS/SDD
```
