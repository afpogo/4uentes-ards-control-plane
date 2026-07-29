# CR-SST-0116 - Analisis Pre Implementacion

Fecha: 2026-07-04

## Objetivo

Preparar el corte runtime para persistir contexto de texto anotado aceptado
usando el contrato definido en `CR-SST-0115`.

## Politicas Aplicadas

- `agent-architecture-boundary-policy`: el cambio cruza BFF/API/backend y debe
  respetar ownership.
- `owner-documentation-authority-policy`: al mutar repos hijos, `node-auth` y
  `sst-bend` deben actualizar owner docs o registrar excepcion.
- `agent-delegation-policy`: se desplegaron subagentes read-only para revisar
  readiness de `sst-bend` y `node-auth`.
- `human-doc-language`: evidencia humana en espanol, identificadores tecnicos
  estables sin traducir.

## Estado Actual Observado

### `node-auth`

`node-auth` ya expone:

- `GET /api/learning-workspaces/me`
- `GET /api/learning-workspaces/context`
- `POST /api/learning-workspaces/sources/preview`
- `POST /api/learning-workspaces/sources/:previewId/accept`
- `POST /api/learning-workspaces/sources/:previewId/reject`

La implementacion actual es un passthrough delgado:

- usa `AuthMiddleware.validateJwt`;
- preserva `Authorization`;
- preserva account context headers;
- reenvia el body despues de remover campos inyectados por middleware;
- no interpreta parser, tags, relevancia ni persistencia local.

Conclusion: `node-auth` parece preparado para transportar el nuevo shape siempre
que `sst-bend` lo acepte. El cambio esperado en `node-auth` es principalmente
documental/spec, salvo que se decida agregar tests o tipos mas explicitos.

### `sst-bend`

`sst-bend` ya tiene runtime `LearningWorkspace`:

- rutas bajo `/4uentes/v1/learning-workspaces`;
- `PreviewLearningSourceUseCase`;
- `AcceptLearningSourceUseCase`;
- `RejectLearningSourceUseCase`;
- `GetLearningWorkspaceContextUseCase`;
- tablas `learning_workspaces`, `learning_source_refs`,
  `learning_document_refs`, `learning_content_block_refs`,
  `learning_import_warnings`, `learning_import_provenance`;
- `acceptPreview` persiste documentos y bloques aceptados;
- `getContext` devuelve solo documentos aceptados.

Gap principal:

- `learningSourcePreviewSchema` no acepta `annotations[]`;
- `PreviewLearningSourceUseCase` no devuelve anotaciones normalizadas;
- `AcceptLearningSourceUseCase` requiere `preview`, pero no entiende
  `annotationIds`;
- `normalizeAcceptedBlocks` solo normaliza `materialized.contentBlocks` o
  `contentBlocks`, no `annotations[]`;
- `LearningContentBlockRef` puede guardar metadata JSONB, pero no hay campos
  dedicados para `contentTags`, `relevance`, `selector` o `selectionRange`.

## Decision Tecnica Recomendada Inicial

Antes de recibir el cierre de subagentes, se considero evitar migracion nueva y
persistir la seleccion anotada como `LearningContentBlockRef`:

- `blockType`: `relevance`;
- `text`: `normalizedText` o `selectionRange.selectedText`;
- `sourceSpan`: selector legible, por ejemplo `manual_selection:10-42`;
- `metadata.selector`: selector completo;
- `metadata.selectionRange`: rango completo;
- `metadata.contentTags`: tags del fragmento;
- `metadata.relevance`: relevancia;
- `metadata.clientAnnotationId`: correlacion frontend;
- `metadata.acceptanceState`: `accepted`;
- `metadata.originArticleId`: si existe.

Esto conserva query/context sin forzar schema migration en el primer corte.

## Decision Ajustada Tras Subagentes

Para `CR-SST-0116`, la recomendacion final es agregar persistencia dedicada de
anotaciones si el alcance mantiene `annotationIds`, estados `previewed |
accepted | rejected`, query por tags/relevancia y preview server-side.

Motivo:

- aceptar por `annotationIds` requiere identidad durable por anotacion;
- preview server-side requiere estado antes de `accept`;
- contexto aceptado debe poder exponer `contentTags`, `relevance`, `selector` y
  `selectionRange` sin depender de un bloque generico;
- JSONB dentro de `LearningContentBlockRef` puede servir como render/cache, pero
  no como read model principal de anotaciones.

La implementacion puede seguir creando `LearningContentBlockRef` aceptados como
materializacion de lectura, pero la fuente de verdad de anotacion debe ser una
tabla/modelo `LearningAnnotationRef`.

## Plan Minimo De Implementacion

1. Extender `src/apps/sst/presentation/schemas/learning-workspace.dto.js` para
   aceptar `sourceRef` objeto/string, `originArticleId`, `articleTags` y
   `annotations[]`.
2. Ajustar `PreviewLearningSourceUseCase` para preservar anotaciones candidatas
   y responderlas como `preview.annotations` con `acceptanceState=previewed`.
3. Ajustar `normalizeAcceptedBlocks` para convertir `preview.annotations` en
   `LearningContentBlockRef` aceptados.
4. Ajustar `AcceptLearningSourceUseCase` y repositorio solo si se requiere
   soportar `annotationIds` parcial.
5. Actualizar specs/docs owner en `sst-bend`:
   - `specs/api/learning-workspaces.yaml`
   - `docs/api/26-learning-workspaces.md`
   - `specs/capabilities/outbound/learning-workspace-context.yaml`
   - `docs/capabilities/outbound/learning-workspace-context.md`
6. Actualizar specs/docs owner en `node-auth` si el contrato observable queda
   documentado como soportado:
   - `specs/routing.yaml`
   - `specs/integrations-api.yaml`
   - `docs/bf/03-routing.md`
   - `docs/bf/06-integrations-api.md`
   - inbound/outbound capability docs de `learning-workspace-context`.
7. Ejecutar validaciones:
   - `sst-bend npm.cmd run test:learning-workspace`
   - `sst-bend npm.cmd run check`
   - `node-auth npm.cmd run check`
   - `4uentes-orchestor npm.cmd run check`

## Riesgos

- Si se intenta filtrar por `contentTags` a nivel SQL ahora, JSONB puede ser
  suficiente para contexto pero no optimo para busqueda avanzada.
- Si `annotationIds` parcial se implementa sin cuidado, `accept` puede aceptar
  mas fragmentos de los que el usuario eligio.
- Si `sourceText` cambia entre preview y accept, se necesita mantener el
  `preview` completo en el body o persistir preview temporal. El contrato actual
  permite enviar `preview` completo a `accept`, que es la ruta mas simple.

## Boundary

Este analisis no modifica repos hijos. La implementacion empieza despues de
integrar el resultado de subagentes read-only.
