# CR-SST-0115 - Contrato BFF/API De Selecciones Anotadas

## Proposito

Definir el contrato minimo para transportar selecciones anotadas desde
`sst-fend` hacia el BFF `node-auth` y, luego, hacia `sst-bend` sin romper la
regla de arquitectura vigente: el frontend no llama directo al backend SST.

Este documento no implementa runtime. Sirve como contrato para `CR-SST-0116`.

## Flujo Canonico

1. `sst-fend` mantiene texto editable y anotaciones locales.
2. El usuario genera preview explicito.
3. `sst-fend` envia el texto fuente y las anotaciones candidatas al BFF.
4. `node-auth` valida auth, preserva contexto de cuenta y reenvia a `sst-bend`.
5. `sst-bend` normaliza selectores y devuelve un `previewId`.
6. El usuario acepta o rechaza explicitamente.
7. Solo `accept` promueve el contexto anotado a estado consultable.

## Endpoints Publicos BFF

El BFF mantiene la superficie existente:

| Metodo | Ruta | Intencion |
| --- | --- | --- |
| `GET` | `/api/learning-workspaces/me` | Cargar workspace del usuario autenticado. |
| `GET` | `/api/learning-workspaces/context` | Leer contexto aceptado/estable. |
| `POST` | `/api/learning-workspaces/sources/preview` | Crear preview de fuente y anotaciones candidatas. |
| `POST` | `/api/learning-workspaces/sources/:previewId/accept` | Promover preview aceptado. |
| `POST` | `/api/learning-workspaces/sources/:previewId/reject` | Rechazar preview. |

## Payload De Preview

`POST /api/learning-workspaces/sources/preview`

```json
{
  "sourceRef": {
    "kind": "article_draft",
    "id": "local-draft-id",
    "title": "Titulo visible",
    "originUrl": "https://example.com/opcional"
  },
  "originArticleId": "article-id-opcional",
  "sourceText": "Texto completo materializado usado para calcular selectores.",
  "articleTags": ["java", "spring"],
  "annotations": [
    {
      "clientAnnotationId": "local-annotation-id",
      "selector": {
        "type": "manual_selection",
        "start": 10,
        "end": 42
      },
      "selectionRange": {
        "start": 10,
        "end": 42,
        "selectedText": "fragmento seleccionado"
      },
      "contentTags": ["security", "jwt"],
      "relevance": "recordar",
      "acceptanceState": "draft"
    }
  ]
}
```

## Campos

| Campo | Obligatorio | Owner | Regla |
| --- | --- | --- | --- |
| `sourceRef.kind` | si | `sst-fend`/BFF | Tipo de fuente: `article_draft`, `article`, `url`, `imported_document` o `manual_text`. |
| `sourceRef.id` | no | origen | Identificador estable si existe. Drafts locales pueden usar id temporal. |
| `originArticleId` | no | `sst-fend`/SST | Solo existe si la anotacion ya esta ligada a un articulo persistido. |
| `sourceText` | si | `sst-fend` | Texto completo usado para validar rangos. |
| `articleTags` | no | `sst-fend` | Clasificacion general del articulo; no reemplaza `contentTags`. |
| `annotations[]` | si | `sst-fend` | Lista de selecciones candidatas. Puede ser una lista vacia solo para preview de documento completo si el backend lo soporta luego. |
| `clientAnnotationId` | si | `sst-fend` | Correlacion local para reconciliar preview/respuesta. |
| `selector.type` | si | `sst-fend`/SST | Alcance semantico de la seleccion. |
| `selectionRange.start/end` | si para seleccion manual | `sst-fend` | Offsets sobre `sourceText`; `end` es exclusivo. |
| `selectionRange.selectedText` | si | `sst-fend` | Snapshot visible para QA y validacion de mismatch. |
| `contentTags` | si | usuario/SST | Tags del fragmento. Deben permanecer separados de `articleTags`. |
| `relevance` | si | usuario/SST | Rol pedagogico del fragmento. |
| `acceptanceState` | si | SST | En preview entra como `draft`; SST responde `previewed`. |

## Selectores Permitidos

El contrato acepta estos valores, aunque `CR-SST-0116` puede implementar un
subconjunto incremental:

- `manual_selection`
- `paragraph`
- `paragraph_range`
- `line`
- `line_range`
- `line_plus_paragraph`
- `document`
- `document_header`
- `document_footer`
- `semantic_block`

Para el primer runtime persistente, el minimo aceptable es:

- `manual_selection`
- `paragraph` cuando el frontend pueda calcularlo de forma estable

## Relevancias Permitidas

- `clase`
- `nota`
- `recordar`
- `ejemplo`
- `definicion`
- `image`
- `docs`
- `code`

## Respuesta De Preview

```json
{
  "previewId": "preview-id",
  "status": "previewed",
  "sourceRef": {
    "kind": "article_draft",
    "id": "local-draft-id"
  },
  "annotations": [
    {
      "clientAnnotationId": "local-annotation-id",
      "serverAnnotationId": "server-preview-annotation-id",
      "selector": {
        "type": "manual_selection",
        "start": 10,
        "end": 42
      },
      "normalizedText": "fragmento seleccionado",
      "contentTags": ["security", "jwt"],
      "relevance": "recordar",
      "acceptanceState": "previewed"
    }
  ],
  "warnings": []
}
```

## Accept / Reject

`POST /api/learning-workspaces/sources/:previewId/accept`

Body opcional:

```json
{
  "annotationIds": ["server-preview-annotation-id"],
  "acceptedByUser": true
}
```

Si `annotationIds` no se envia, el backend puede aceptar todo el preview. Si se
envia, solo esos fragmentos pasan a `accepted`.

`POST /api/learning-workspaces/sources/:previewId/reject`

Body opcional:

```json
{
  "reason": "user_rejected"
}
```

El contenido rechazado no debe aparecer en `GET /api/learning-workspaces/context`.

## Estados

| Estado | Significado |
| --- | --- |
| `draft` | Solo existe localmente o como intencion enviada a preview. |
| `previewed` | Backend calculo preview, pero no es contexto consultable. |
| `accepted` | Usuario promovio el fragmento; queda disponible como contexto. |
| `rejected` | Usuario rechazo el preview o fragmento. |

## Errores Minimos

| Codigo | Caso |
| --- | --- |
| `400` | Payload invalido, rango fuera de `sourceText`, selector no soportado. |
| `401` | Usuario no autenticado. |
| `403` | Usuario sin acceso al workspace/fuente. |
| `404` | `previewId` inexistente o expirado. |
| `409` | `sourceText` o version de fuente no coincide con la preview. |
| `422` | Anotacion semanticamente invalida aunque el JSON sea correcto. |

## Reglas De Arquitectura

- `sst-fend` consume solo `/api/learning-workspaces/*` en `node-auth`.
- `node-auth` no decide semantica de tags; valida auth y transporta contexto.
- `sst-bend` es owner de normalizacion, persistencia y query de contexto.
- `ArticleTag` y `LearningContentTag` no se mezclan en un unico campo.
- `preview` no contamina contexto aceptado.
- `accept` debe ser accion explicita del usuario.

## Criterio Para CR-SST-0116

`CR-SST-0116` puede implementar runtime si:

- preserva la ruta BFF;
- persiste selectores y texto normalizado;
- mantiene estados `previewed`, `accepted` y `rejected`;
- permite leer contexto aceptado sin depender del draft local;
- actualiza owner docs en `node-auth` y `sst-bend`;
- valida checks de ambos repos y control-plane.
