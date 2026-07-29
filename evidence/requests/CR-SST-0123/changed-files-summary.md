# CR-SST-0123 - Changed Files Summary

## Estado

- Fecha: 2026-07-05
- Request: `CR-SST-0123`
- Repositorio mutado: `sst-fend`
- Jira mirror: `SST-52`

## Update 2026-07-06

QA manual detecto que el articulo `text` necesitaba una URL falsa para poder
crearse y que el response de `POST /articulos` no incluia learning-content
tags. El alcance se amplio de forma justificada a `sst-bend` porque el backend
seguia exigiendo `url/sourceUrl` para `payload.kind=text`.

### sst-fend

- `src/pages/Articles/components/ArticleCreateFlow/ArticleCreateFlow.tsx`
- `src/pages/Articles/components/ArticleCreateFlow/__tests__/ArticleCreateFlow.test.tsx`
- `src/pages/Articles/components/ArticleForm/index.tsx`
- `src/pages/Articles/components/ArticleForm/interface.ts`
- `src/pages/Articles/components/ArticleFormView/ArticleFormView.i18n.ts`
- `src/pages/Articles/components/ArticleModal/ArticleModal.tsx`
- `src/pages/LearningWorkspace/components/LearningWorkspaceSheet.tsx`
- `src/pages/LearningWorkspace/__tests__/LearningWorkspace.test.tsx`
- `src/services/articuloService.ts`
- `src/services/types/learningWorkspace.ts`
- `docs/38-learning-workspace-frontend.md`
- `specs/38-learning-workspace-frontend.yml`

### sst-bend

- `src/apps/sst/presentation/schemas/articulo.dto.js`
- `src/apps/sst/domain/articulos/article-payload.factory.js`
- `docs/capabilities/outbound/article-text-ingestion.md`
- `specs/capabilities/outbound/article-text-ingestion.yaml`
- `specs/api/routing.yaml`

## Runtime

- `src/pages/LearningWorkspace/components/LearningWorkspaceSheet.tsx`
  - Agrega derivacion de anotacion local cuando `source.annotations` esta vacio.
  - Deriva el texto seleccionado desde la granularidad activa: linea, rango,
    parrafo, rango de parrafos, linea mas parrafo, documento, header, footer,
    bloque o seleccion.
  - Construye `clientAnnotationId`, `selector`, `selectionRange`,
    `contentTags`, `relevance` y `acceptanceState: draft`.
  - Mantiene prioridad para anotaciones provistas por la tab `Texto`: si
    `source.annotations` existe, se usa sin reemplazarla.

## Tests

- `src/pages/LearningWorkspace/__tests__/LearningWorkspace.test.tsx`
  - Verifica que `Generar preview` envia `annotations[]` no vacio.
  - Verifica que la anotacion standalone default representa `Parrafo 1`.
  - Verifica que cambiar granularidad a `document` envia selector/documento.

## Owner Docs

- `docs/38-learning-workspace-frontend.md`
- `specs/38-learning-workspace-frontend.yml`
- `docs/capabilities/inbound/node-auth--learning-workspace-context.md`
- `specs/capabilities/inbound/node-auth--learning-workspace-context.yaml`

## Limites

- No se modifico `node-auth`.
- No se modifico `sst-bend`.
- No se cambiaron contratos de auth/RBAC.
- No se cierra `CR-SST-0118 / SST-48` en esta evidencia.
