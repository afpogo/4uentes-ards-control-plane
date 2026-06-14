# CR-SST-0069 Gate 1 - pass-through BFF

Fecha: 2026-06-12

## Alcance

Se introdujo en `4uentes-auth` el pass-through autenticado para consumir el
preview del `SST Tag Prefix Engine` desde clientes BFF.

Endpoint publicado por BF:

- `POST /api/tags/prefix-engine/preview`

Endpoint upstream SST:

- `POST /4uentes/v1/tags/prefix-engine/preview`

## Cambios runtime

Archivos principales en `4uentes-auth`:

- `src/presentation/routes.ts`
- `src/presentation/tag-prefix-engine/routes.ts`
- `src/presentation/tag-prefix-engine/controller.ts`
- `src/domain/constants/tag-prefix-engine.constants.ts`
- `src/domain/datasources/tag-prefix-engine.datasource.ts`
- `src/domain/repositories/tag-prefix-engine.repository.ts`
- `src/domain/use-cases/TagPrefixEngine/proxyTagPrefixEnginePreview.usecase.ts`
- `src/infrastructure/datasources/tag-prefix-engine.datasource.impl.ts`
- `src/infrastructure/repositories/tag-prefix-engine.repository.ts`

Decisiones:

- usar `AuthMiddleware.validateJwt`;
- forwardear `Authorization`;
- preservar `x-active-account-id` o `x-account-id` cuando existan;
- eliminar campos internos de middleware (`user`, `authTokenPayload`) antes de
  reenviar el body;
- preservar el shape upstream sin transformar `ImportedReference` en `TagValue`;
- no persistir salida del parser.

## Cambios ARDS/SDD

Archivos principales en `4uentes-auth`:

- `specs/capabilities/inbound/sst-bend--tag-prefix-engine-preview.yaml`
- `specs/capabilities/outbound/tag-prefix-engine-preview.yaml`
- `docs/capabilities/inbound/sst-bend--tag-prefix-engine-preview.md`
- `docs/capabilities/outbound/tag-prefix-engine-preview.md`
- `specs/capabilities/inbound/00-index.yaml`
- `specs/capabilities/outbound/00-index.yaml`
- `specs/routing.yaml`
- `specs/integrations-api.yaml`
- `docs/bf/03-routing.md`
- `docs/bf/06-integrations-api.md`
- `docs/bf/11-endpoints-e2e-map.md`
- `docs/capabilities/00-overview.md`

## Validacion

Comando:

```bash
npm run check
```

Resultado:

```text
[ARDS CHECK] OK
```

Smoke autenticado por BFF:

```json
{
  "contractVersion": "sst-tag-prefix-engine.preview.v1",
  "persistenceMode": "preview-only",
  "persisted": false,
  "scope": "learning-content",
  "blocks": 1,
  "tagValues": 1,
  "tagOccurrences": 4,
  "externalRefs": 1,
  "importedRefs": 1,
  "issues": 0
}
```

## Decision de compuerta

Gate 1 aprobado.

`4uentes-auth` ya publica una facade BFF protegida y read-only para que
`sst-fend` introduzca renderizado preview sin depender directamente de
`sst-bend` y sin adelantar persistencia.
