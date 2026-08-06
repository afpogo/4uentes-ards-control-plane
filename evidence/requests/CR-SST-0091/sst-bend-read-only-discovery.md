# CR-SST-0091 - Discovery Read-Only De `sst-bend`

## Fecha

2026-06-29.

## Alcance

Se hizo discovery read-only del repo hijo `sst-bend`. No se modifico ningun
archivo del repo hijo.

## Binding Local Observado

Path local:

```text
C:\Users\andre\Desktop\4uentes\apps\4uentes-sstbend\sst-bend
```

Stack confirmado:

- Node.js / Express;
- Sequelize + Postgres;
- Clean architecture en `src/apps/sst/**`;
- migrations en `db/migrations/**`;
- modelos en `db/models/**`;
- base path `/4uentes/v1`.

## Estado Git Observado

El worktree de `sst-bend` ya estaba dirty antes de este CR. Estado observado
durante discovery:

- `.env.example` modificado;
- `.github/workflows/build-publish-development.yml` modificado;
- `docker-compose.yml` modificado;
- docs/specs/scripts de dictionary secrets modificados;
- `src/apps/sst/application/diccionario/dictionary-secret-crypto.service.js`
  modificado.

La implementacion futura no debe revertir ni pisar esos cambios sin decision
explicita.

## Hooks De Scope Existentes

Se observo `src/apps/sst/presentation/middlewares/resolve-account-context.middleware.js`.

Este middleware:

- resuelve `req.accountContext`;
- setea `req.accountId`;
- setea `req.accountRole`;
- setea `req.consolidatedUser`;
- crea usuario/cuenta/membership cuando no existe contexto default;
- asegura root node por cuenta.

Decision de plan:

- `LearningWorkspace` debe crearse lazy en primer uso usando este contexto,
  salvo que una implementacion futura agregue un hook confiable de provisioning.
- Las rutas deben usar `verifyJWT` + `resolveAccountContext`.

## Patron De Rutas Y Controllers

Rutas SST registradas en:

- `src/apps/sst/presentation/routes/index.js`

Patron observado en tags:

- route file instancia repository/usecases/controller;
- usa `verifyJWT`;
- usa `resolveAccountContext`;
- usa `validatorHandler`;
- usa `requireAccountRole(["owner"])` para mutaciones gobernadas;
- controller pasa `accountId` y `userId` a usecases.

## Preview Existente Reutilizable

Se observo:

- `src/apps/sst/application/tags/preview-tag-prefixes.usecase.js`
- `src/apps/sst/application/tags/tag-prefix-engine.js`
- `scripts/test-tag-engine.js`

El use case existente devuelve:

- `contractVersion: "sst-tag-prefix-engine.preview.v1"`;
- `persistenceMode: "preview-only"`;
- `persisted: false`;
- `materialized.contentBlocks`;
- `materialized.tagValues`;
- `materialized.tagOccurrences`;
- issues/warnings.

Decision de plan:

- `source_preview` de LearningWorkspace debe reutilizar o envolver este motor,
  no duplicarlo.
- `source_accept` debe ser el primer punto que consolide contenido durable.

## Persistencia Observada

Patron de modelos:

- `db/models/<entity>.js`
- registro en `db/models/index.js`
- asociaciones en `static associate(models)`
- `timestamps: false`
- columnas `created_at`/`updated_at` en schema.

Patron de migrations:

- `db/migrations/<timestamp>-<name>.js`
- `up` crea tablas e indices;
- `down` remueve indices y droppea tablas;
- FK a `accounts` y `conso_users` cuando aplica.

## Comandos Disponibles

Comandos relevantes:

- `npm run check`
- `npm run build`
- `npm run migration:run`
- `npm run migration:rollback`
- `npm run test:tag-engine`

`npm run check` es el baseline operativo documentado por `AGENTS.md`.
