# CR-SST-0092 - Resumen De Implementacion

## Alcance Ejecutado

Se implemento el primer slice runtime de `LearningWorkspace` en `sst-bend`.

Incluye:

- creacion lazy de workspace por `tenantId/accountId/userId`;
- preview de source con persistencia `preview-only`;
- aceptacion explicita de preview con consolidacion durable;
- rechazo de preview sin entrar al contexto durable;
- contexto de lectura `LearningWorkspaceContext` con contenido aceptado;
- idempotencia para aceptaciones repetidas;
- migracion reversible para tablas nuevas;
- tests focalizados sin requerir DB.

## Boundary Preservado

- No se modifico `sst-chatbot`.
- No se modifico `sst-fend`.
- No se modifico `4uentes-auth`.
- No se creo `TagDefinition` automaticamente.
- No se implemento crawler.
- No se clono ARDS/SDD por usuario.
- `source_preview` reutiliza el motor existente de prefijos y devuelve
  `persisted=false`.

## Mapeo De Scope

`sst-bend` ya expone `accountId` y `userId` via
`resolveAccountContext.middleware.js`.

Como no hay tenant explicito observado en `sst-bend`, el primer slice usa:

- `tenantId: "legacy"`
- `accountId: req.accountId`
- `userId: req.accountContext.userId`

Ese mapeo queda como compatibilidad inicial hasta que exista tenant real.

## Endpoints Agregados

Base path heredado: `/4uentes/v1`.

Rutas:

- `GET /learning-workspaces/me`
- `GET /learning-workspaces/context`
- `POST /learning-workspaces/sources/preview`
- `POST /learning-workspaces/sources/:previewId/accept`
- `POST /learning-workspaces/sources/:previewId/reject`

Todas usan `verifyJWT` y `resolveAccountContext`. `accept` y `reject` requieren
rol `owner`.

## Persistencia

Tablas nuevas:

- `learning_workspaces`
- `learning_source_refs`
- `learning_document_refs`
- `learning_content_block_refs`
- `learning_asset_refs`
- `learning_lab_refs`
- `learning_spec_refs`
- `learning_import_warnings`
- `learning_import_provenance`

Las tablas de `TagDefinition` no se modifican ni se escriben desde este slice.
