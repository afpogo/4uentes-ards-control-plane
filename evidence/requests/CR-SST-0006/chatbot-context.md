# CR-SST-0006 - Contexto Para `sst_chatbot`

Observado el: 2026-05-20

## Proposito Del Handoff

Este documento es una salida compacta del control-plane para que `sst_chatbot`
pueda razonar sobre el estado de Robots en SST sin volver a recorrer todos los
repos.

El contenido proviene de la investigacion cross-repo `CR-SST-0006` y debe
tratarse como evidencia de discovery, no como autorizacion para modificar repos.

## Pregunta Respondida

Que se hablo sobre Robots en SST, si existe desarrollo en algun repo, y que gaps
quedan para convertirlo en feature runtime.

## Respuesta Corta

Robots fue hablado y documentado en SST como parte del dominio
`users-accounts-robots`.

El unico repo con desarrollo real es `sst-bend`, y el estado es parcial:

- existe diseno ARDS/SDD;
- existe tabla `robots`;
- existe modelo Sequelize `Robot`;
- existen asociaciones con `Account` y `ConsolidatedUser`;
- existe migracion base de account core;
- existe script de reconciliacion que contempla `robots`;
- no existen endpoints runtime publicados de Robots;
- no existen controller/use cases de Robots;
- no existe UI en `sst-fend`;
- no existe soporte en `sst-extension`;
- no existe implementation directa en `4uentes-auth`;
- no hay manifests o politica especifica en `sst-4uentes-infra`.

## Estado Por Servicio

| Servicio | Estado | Interpretacion |
|---|---|---|
| `sst-bend` | `runtime-partial` | Tiene persistencia/modelo y docs/specs; falta HTTP/admin runtime. |
| `4uentes-auth` | `not-implemented` | No implementa Robots; solo forwardea account context. |
| `sst-fend` | `not-implemented` | No hay UI, service, store, route ni tests de Robots. |
| `sst-extension` | `not-implemented` | No hay Robots; account context local sigue pendiente. |
| `sst-4uentes-infra` | `not-implemented` | No hay manifests/docs/specs especificos de Robots. |

## Semantica De Robots Encontrada

- Robot = actor operativo dentro de una cuenta SST.
- Pertenece a una unica cuenta.
- Tiene un unico `role`.
- `owner` puede crear y destruir Robots.
- `member` no puede destruir Robots.
- La destruccion es soft delete.
- Debe conservarse auditoria, runtime y contexto documental.

## Evidencia Principal

En `sst-bend`:

- `specs/api/users-accounts-robots.yaml`
- `docs/api/18-users-accounts-robots.md`
- `specs/states/feature.users-accounts-robots-rollout.yaml`
- `docs/tasks/2026-04-18-users-accounts-robots-rollout.md`
- `db/models/robot.js`
- `db/models/account.js`
- `db/models/index.js`
- `db/migrations/20260419000000-create-account-core-tables.js`
- `scripts/reconcile-users-account-scope.js`
- `src/apps/sst/presentation/routes/accounts.routes.js`
- `src/apps/sst/presentation/controllers/accounts.controller.js`

En `4uentes-auth`:

- `specs/capabilities/inbound/sst-bend--account-context-forwarding.yaml`
- `src/presentation/helpers/auth.ts`

En `sst-extension`:

- `docs/integration/node-auth-extension-dictionary.md`
- `specs/integration/inbound/node-auth--dictionary-domain-management-v1.yaml`

## Runtime Actual

Endpoints actuales observados en `sst-bend`:

- `GET /4uentes/v1/me`
- `GET /4uentes/v1/accounts`

Endpoints planificados pero no publicados:

- `GET /4uentes/v1/accounts/:id/robots`
- `POST /4uentes/v1/accounts/:id/robots`
- `DELETE /4uentes/v1/robots/:id`

## Gaps

- No existe `robots.routes.js`.
- No existe `robots.controller.js`.
- No se observaron use cases `createRobot`, `listRobots` o `deleteRobot`.
- No existe capability outbound `users-accounts-robots` runtime observable.
- No hay QA/smoke dedicado a Robots.
- Falta definir el snapshot canonico de memoria/contexto para Robots destruidos.

## Decision Recomendada

No tratar Robots como feature completa.

Clasificacion recomendada:

```text
sst-bend: runtime-partial, persistence/model-ready, HTTP/admin not implemented
cross-repo: not implemented, account-context prerequisite present
```

## Siguiente Request Sugerido

Abrir un request nuevo para disenar y publicar la runtime surface de Robots en
`sst-bend`, antes de pedir UI en `sst-fend` o handoff completo via
`4uentes-auth`.

Intent type sugerido para `sst_chatbot`:

```text
user_history.propose_update
```

o, si se quiere producir un plan tecnico:

```text
workspace.generate_bundle
```

No usar todavia:

```text
server.restart_service
server.refresh_cache
workspace.apply_patch
```

## Boundaries

- Este handoff no autoriza cambios en repos funcionales.
- Este handoff no mueve `CR-SST-0006` a `done`.
- `sst_chatbot` puede proponer un plan, pero `4uentes-orchestor` debe aceptar o
  rechazar cualquier request posterior.
