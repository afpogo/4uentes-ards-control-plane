# CR-SST-0123 - Implementation Analysis

## Estado

- Fecha: 2026-07-05
- Request: `CR-SST-0123`
- Jira mirror: `SST-52`
- Estado: analisis inicial completado.

## Evidencia base

`CR-SST-0118` revalido `/learning` despues de `CR-SST-0122`:

- `POST /api/learning-workspaces/sources/preview`: 200.
- `POST /api/learning-workspaces/sources/{previewId}/accept`: 201.
- `GET /api/learning-workspaces/context`: 200.
- UI: `Preview aceptado`.
- Resultado funcional: `annotations: []` y `contentBlocks: []`.

## Hallazgo principal

El gap inicial esta en `sst-fend` standalone `/learning`.

Archivo principal:

- `src/pages/LearningWorkspace/components/LearningWorkspaceSheet.tsx`

La ruta standalone usa estado local para titulo, source text, granularidad,
lineas/parrafos y relevancia, pero `sourceAnnotations` queda vacio cuando no se
recibe `source.annotations` desde un padre:

```ts
const sourceAnnotations = useMemo(() => source?.annotations ?? [], [source?.annotations]);
```

Luego `handlePreview` envia:

```ts
annotations: sourceAnnotations
```

En `/learning`, ese arreglo es `[]`. El backend recibe texto y selectores, pero
no recibe una anotacion concreta derivada de la granularidad elegida. Eso explica
que el preview y el accept puedan ser exitosos, pero el contexto aceptado no
contenga anotaciones ni bloques anotados visibles.

## Comparacion con Article Text tab

`src/pages/Articles/components/ArticleCreateFlow/ArticleCreateFlow.tsx` si
construye `LearningWorkspaceAnnotationRequest[]` desde selecciones locales:

- `clientAnnotationId`
- `selector`
- `selectionRange`
- `contentTags`
- `relevance`
- `acceptanceState: draft`

Luego pasa esas anotaciones al panel:

```tsx
<LearningWorkspaceSheet
  embedded
  hideEditor
  source={{
    title: draftSnapshot.titulo,
    sourceRef: learningWorkspaceSourceRef,
    sourceText: draftSnapshot.desc,
    annotations: learningWorkspaceAnnotations,
  }}
/>
```

Por eso la intencion de `CR-SST-0117` esta cubierta para el panel embebido con
selecciones, pero no para `/learning` como laboratorio/QA standalone.

## Gap de pruebas

`src/pages/LearningWorkspace/__tests__/LearningWorkspace.test.tsx` mockea una
respuesta de preview con `materialized.contentBlocks` y `annotations`, pero no
verifica que el payload enviado por `LearningWorkspaceSheet` contenga una
anotacion local derivada de la granularidad seleccionada.

El test puede pasar aunque el runtime real envie `annotations: []`.

## Dirty worktree observado

`sst-fend` ya contiene cambios locales previos en varias rutas y archivos sin
trackear relacionados con LearningWorkspace. Este CR debe trabajar con esos
cambios y no revertirlos.

## Hipotesis tecnica recomendada

Implementar en `LearningWorkspaceSheet` una anotacion local sintetica cuando
`source.annotations` esta vacio:

- derivar el texto seleccionado segun `granularity`;
- construir `clientAnnotationId` estable desde sourceRef/granularity/rango;
- construir `selector` con granularidad, lineStart/lineEnd, paragraphStart/
  paragraphEnd, blockType y targetLabel;
- incluir `selectionRange` cuando exista texto concreto;
- asignar `contentTags` desde `blockType` o un tag local gobernado;
- asignar `relevance` desde `blockType` o granularidad;
- enviar esa anotacion como `annotations[]` en preview.

## Boundary

La primera implementacion debe quedarse en `sst-fend`:

- no tocar `node-auth`;
- no tocar `sst-bend`;
- no cambiar schemas backend;
- no cerrar `SST-48` hasta que Chrome DevTools MCP pruebe contexto aceptado con
  `annotations` y `contentBlocks` visibles.

## Archivos probables

- `src/pages/LearningWorkspace/components/LearningWorkspaceSheet.tsx`
- `src/pages/LearningWorkspace/__tests__/LearningWorkspace.test.tsx`
- `docs/38-learning-workspace-frontend.md`
- `specs/38-learning-workspace-frontend.yml`
- `docs/capabilities/inbound/node-auth--learning-workspace-context.md`
- `specs/capabilities/inbound/node-auth--learning-workspace-context.yaml`
