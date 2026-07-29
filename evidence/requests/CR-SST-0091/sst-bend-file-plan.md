# CR-SST-0091 - File Plan Propuesto Para `sst-bend`

## Boundary

Este file plan es resultado de discovery read-only. No se aplicaron cambios en
`sst-bend`.

## Archivos Nuevos Esperados

### Modelos Sequelize

- `db/models/learning-workspace.js`
- `db/models/learning-source-ref.js`
- `db/models/learning-document-ref.js`
- `db/models/learning-content-block-ref.js`
- `db/models/learning-asset-ref.js`
- `db/models/learning-lab-ref.js`
- `db/models/learning-spec-ref.js`
- `db/models/learning-import-warning.js`
- `db/models/learning-import-provenance.js`

### Migration

- `db/migrations/TODO-create-learning-workspace-tables.js`

El timestamp debe generarse en la ejecucion real para evitar colision.

### Dominio

- `src/apps/sst/domain/learning-workspaces/learning-workspace.repository.js`
- `src/apps/sst/domain/learning-workspaces/learning-workspace.entity.js`
- `src/apps/sst/domain/learning-workspaces/learning-source.entity.js`
- `src/apps/sst/domain/learning-workspaces/learning-document.entity.js`
- `src/apps/sst/domain/learning-workspaces/learning-workspace.errors.js`

### Aplicacion

- `src/apps/sst/application/learning-workspaces/get-or-create-learning-workspace.usecase.js`
- `src/apps/sst/application/learning-workspaces/preview-learning-source.usecase.js`
- `src/apps/sst/application/learning-workspaces/accept-learning-source.usecase.js`
- `src/apps/sst/application/learning-workspaces/reject-learning-source.usecase.js`
- `src/apps/sst/application/learning-workspaces/get-learning-workspace-context.usecase.js`
- `src/apps/sst/application/learning-workspaces/index.js`

### Infraestructura

- `src/apps/sst/infrastructure/db/postgres/learning-workspaces/sequelize-learning-workspace.repository.js`

### Presentacion

- `src/apps/sst/presentation/schemas/learning-workspace.dto.js`
- `src/apps/sst/presentation/controllers/learning-workspaces.controller.js`
- `src/apps/sst/presentation/routes/learning-workspaces.routes.js`

### Tests / QA

- `scripts/test-learning-workspace.js`
- posible extension de `scripts/test-tag-engine.js` si `preview-learning-source`
  envuelve el motor de prefijos.

## Archivos Existentes A Modificar

- `db/models/index.js`: registrar modelos y asociaciones.
- `src/apps/sst/presentation/routes/index.js`: montar ruta
  `/learning-workspaces`.
- `package.json`: agregar script `test:learning-workspace` si se crea
  `scripts/test-learning-workspace.js`.
- `specs/api/00-index.yaml`: agregar spec si se publica contrato API runtime.
- `specs/api/TODO-learning-workspaces.yaml`: crear spec API si el endpoint se
  expone como contrato observable.
- `docs/api/00-overview.md`: enlazar doc API si se publica contrato observable.
- `docs/api/TODO-learning-workspaces.md`: documentar endpoints si se exponen.
- `specs/capabilities/outbound/00-index.yaml`: evaluar capability outbound si
  `sst-chatbot`, BFF o frontend consumen el endpoint.
- `docs/capabilities/outbound/TODO-learning-workspace-context.md`: crear o
  marcar draft si el cambio habilita consumo aguas abajo.

## Rutas Propuestas

Base path heredado: `/4uentes/v1`.

Rutas propuestas bajo:

```text
/learning-workspaces
```

Endpoints minimos:

- `GET /learning-workspaces/me`
- `POST /learning-workspaces/sources/preview`
- `POST /learning-workspaces/sources/:previewId/accept`
- `POST /learning-workspaces/sources/:previewId/reject`
- `GET /learning-workspaces/context`

Si el repo decide no persistir `previewId`, usar fingerprint deterministico y
documentar el ajuste antes de implementar.

## Middleware

Todas las rutas deben usar:

- `verifyJWT`;
- `resolveAccountContext`.

Mutaciones gobernadas deben usar:

- `requireAccountRole(["owner"])` o rol equivalente definido por el repo.

## Pruebas Minimas

`scripts/test-learning-workspace.js` debe cubrir:

- lazy creation con `accountId` y `userId`;
- preview devuelve `persisted=false`;
- preview no crea documentos aceptados;
- accept consolida documentos/bloques/warnings/provenance;
- accept repetido no duplica;
- reject no crea recall durable;
- context excluye previews no aprobados;
- context filtra por `accountId` y `userId`;
- no se crea `TagDefinition`;
- source preview reutiliza comportamiento `preview-only` del motor de prefijos.

## Rollback

Rollback esperado:

- `npm run migration:rollback` debe revertir la migration de tablas nuevas;
- revertir montaje de route en `src/apps/sst/presentation/routes/index.js`;
- remover registros nuevos de `db/models/index.js`;
- no tocar tablas de tags existentes salvo lectura/reuso.

## Riesgos Pendientes

- Falta confirmar si existen tablas reales de `user_memory_event`,
  `user_memory_fact` y `user_memory_intention`; no aparecieron en el discovery
  focalizado.
- Si no existen, la primera implementacion debe registrar eventos de learning
  en una tabla propia o dejar link `TODO` sin bloquear workspace/context.
- Falta decidir si `previewId` se persiste como entidad temporal o se deriva
  de fingerprint de source/preview.
