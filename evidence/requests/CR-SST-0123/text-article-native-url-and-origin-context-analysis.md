# CR-SST-0123 - Text Article Native URL And Origin Context Analysis

## Estado

- Fecha: 2026-07-06
- Request: `CR-SST-0123`
- Jira mirror: `SST-52`
- Resultado: se detecto y corrigio un drift frontend/backend.

## Hallazgo

QA manual creo un articulo `payload.kind=text` usando una URL falsa como
workaround. El response mostro:

- `url`: valor inventado por el usuario.
- `payload.data.sourceUrl`: mismo valor inventado.
- `tags[]`: tags generales del articulo.
- sin learning-content tags en el response de `POST /articulos`.

La documentacion owner ya separaba dos acciones:

- crear articulo persiste el articulo y sus `ArticleTag`.
- preview/accept de `LearningWorkspace` persiste contexto aceptado y
  `LearningContentTag`.

El problema real era doble:

1. `sst-fend` trataba la URL como campo visible principal aun cuando el schema
   local permitia omitirla para `payloadKind=text`.
2. `sst-bend` todavia exigia `url/sourceUrl` y `payload.data.sourceUrl` para
   `payload.kind=text`, contradiciendo la intencion de articulo de texto nativo.

## Decision

- Mantener separados `ArticleTag` y `LearningContentTag`.
- Permitir articulos de texto nativos sin URL.
- Asociar contexto de aprendizaje despues de crear el articulo usando
  `originArticleId`.
- No esperar que `POST /articulos` devuelva learning-content tags; esos viven
  en `LearningWorkspace` luego de `preview -> accept`.

## Cambios

### sst-fend

- `ArticleForm` muestra la fuente como referencia opcional para `text`.
- `ArticleModal` omite `url` del request si esta vacia.
- `ArticleCreateFlow` conserva `learningAnnotations` en el draft.
- El result de articulo `text` muestra un panel `LearningWorkspace` ligado al
  `articleId` creado.
- `LearningWorkspaceSheet` envia `originArticleId` y propaga ese valor a cada
  anotacion cuando existe.

### sst-bend

- `createArticuloSchema` ya no exige `url/sourceUrl` para `payload.kind=text`.
- `ArticlePayloadFactory` permite `payload.kind=text` con `data: {}`.
- Si `payload.data.sourceUrl` se envia, debe ser string.

## Validacion

- `sst-fend`: `npm.cmd test -- LearningWorkspace.test.tsx ArticleCreateFlow.test.tsx --runInBand` PASS, 14/14.
- `sst-fend`: `npm.cmd run check` PASS, 27 suites / 162 tests.
- `sst-bend`: `node --check` en archivos modificados PASS.
- `sst-bend`: validacion runtime minima de schema/factory PASS para text article sin URL/sourceUrl.
- `sst-bend`: `npm.cmd run check` exit 0; harness reporta cobertura protegida parcial por falta de `SMOKE_JWT`, preexistente para smokes autenticados.

## Pendiente

- Revalidar con Chrome DevTools MCP en sesion autenticada:
  1. crear articulo text sin URL;
  2. verificar que `POST /articulos` no requiere URL falsa;
  3. generar preview post-creacion;
  4. aceptar contexto;
  5. verificar `GET /learning-workspaces/context` con `originArticleId` y
     `annotations[].contentTags`.
