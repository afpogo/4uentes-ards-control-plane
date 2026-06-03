# CR-SST-0006 - Resumen Cross-Repo Robots

Observado el: 2026-05-20

## Lectura Corta

Robots fue hablado y documentado en SST como parte del dominio
`users-accounts-robots`, pero el desarrollo completo no esta distribuido entre
repos. El unico repo con desarrollo real es `sst-bend`, y ese desarrollo es
parcial: persistencia/modelo y plan ARDS/SDD, sin administracion HTTP de Robots.

## Matriz De Resultado

| Repo | Hay conversacion/docs | Hay desarrollo | Estado |
|---|---:|---:|---|
| `sst-bend` | si | parcial | Modelo + migracion + state rollout; falta HTTP/admin runtime. |
| `4uentes-auth` | no directo | no Robots | Solo forwarding de account context hacia SST. |
| `sst-fend` | no | no | Sin UI ni services. |
| `sst-extension` | no | no | Sin Robots; account context local pendiente. |
| `sst-4uentes-infra` | no | no | Sin manifests o policy de Robots. |

## Semantica Encontrada

- Robot = actor operativo dentro de una cuenta SST.
- Pertenece a una unica cuenta.
- Tiene un unico `role`.
- Owner puede crear/destruir Robots.
- Member no puede destruir Robots.
- La destruccion es soft delete.
- Debe conservarse auditoria, runtime y contexto documental.

## Estado Operativo

`sst-bend` ya tiene base de datos y modelo para Robots:

- tabla `robots`
- modelo `Robot`
- relacion `Account -> robots`
- campos de auditoria y deleted state
- script que reubica Robots al reconciliar account scope

Pero no hay surface runtime:

- no hay `GET /4uentes/v1/accounts/:id/robots` observable en rutas
- no hay `POST /4uentes/v1/accounts/:id/robots`
- no hay `DELETE /4uentes/v1/robots/:id`
- no hay controller/use cases especificos

## Decision Recomendada

Documentar el estado como `runtime-partial` y no moverlo a `done` funcional.

Para avanzar, primero `sst-bend` debe cerrar el contrato y runtime de Robots.
Despues se puede abrir handoff hacia `4uentes-auth` y UI en `sst-fend`.
