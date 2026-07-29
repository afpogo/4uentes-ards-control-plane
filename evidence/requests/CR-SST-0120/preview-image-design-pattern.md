# CR-SST-0120 - Preview image design pattern

## Intencion

Definir un patron generico para generar o conservar `preview image` de articulos
SST creados desde:

- una URL conocida;
- una imagen/foto provista por el usuario o productor;
- una captura generada por `sst-extension`;
- un PDF/text article derivado de una web.

El objetivo es evitar que articulos validos queden con preview visual no
disponible cuando SST ya tiene una URL fuente o una imagen candidata.

## Problema

`sst-extension` puede crear articulos de tipo texto desde una web y generar PDF
textual. El contenido se guarda correctamente, pero cuando no existe captura
visual o imagen explicita, SST muestra preview no disponible.

Esto se ve mal para el usuario y no escala si cada flujo implementa su propio
fallback. La preview debe resolverse con un algoritmo comun y gobernado.

## Patron Propuesto

Nombre: `ArticlePreviewResolver`

Rol: resolver una preview visual para un articulo desde un conjunto ordenado de
fuentes candidatas, sin mezclar contenido privado en evidencia ni romper
ownership cross-repo.

### Entrada Canonica

```yaml
article_preview_request:
  article_id: string | null
  source_url: string | null
  provided_image:
    url: string | null
    blob_ref: string | null
    mime_type: string | null
  producer_snapshot:
    visual_thumbnail_ref: string | null
    capture_mode: visual-pdf | textual-pdf | html | text | unknown
    preview_unavailable_reason: string | null
  policy:
    allow_private_thumbnail_storage: boolean
    allow_remote_metadata_fetch: boolean
    allow_page_screenshot: boolean
    max_preview_bytes: number
```

### Salida Canonica

```yaml
article_preview_result:
  status: available | unavailable | pending | rejected
  source: provided-image | producer-thumbnail | url-og-image | url-favicon | generated-screenshot | generated-placeholder | none
  image_ref: string | null
  image_url: string | null
  reason: string | null
  provenance:
    source_url_host: string | null
    generated_at: iso_datetime
    producer: sst-extension | sst-fend | node-auth | sst-bend | unknown
```

## Algoritmo Generico

Orden recomendado:

1. Si existe `provided_image`, validarla y usarla.
2. Si `sst-extension` produjo una miniatura visual segura, usar
   `producer_snapshot.visual_thumbnail_ref`.
3. Si existe `source_url` y la politica lo permite, intentar resolver metadata
   publica:
   - `og:image`
   - `twitter:image`
   - favicon de alta resolucion
4. Si la URL requiere sesion privada y el usuario ya esta en navegador:
   - `sst-extension` puede producir thumbnail local opcional;
   - esa thumbnail solo se persiste si la politica de privacidad lo permite.
5. Si no hay imagen segura:
   - generar placeholder deterministico por dominio/tipo;
   - persistir `preview_unavailable_reason` explicito.

La preview nunca debe depender de guardar screenshots privados en ARDS/SDD o
Jira. La evidencia solo debe registrar metadata sanitizada, estado y razon.

## Aplicacion En sst-extension

`sst-extension` debe actuar como productor opcional de preview cuando ya esta
capturando una web:

- Para captura visual: puede generar un thumbnail liviano junto al artifact
  principal.
- Para PDF textual: debe enviar `source_url`, `capture_mode: textual-pdf` y una
  razon si no genero thumbnail.
- Si el usuario provee foto/imagen, la extension debe preferir esa imagen sobre
  derivaciones automaticas.
- No debe exponer secretos, cookies, JWTs ni contenido privado en evidencia.

## Aplicacion En SST-fend

`sst-fend` debe consumir el resultado de preview como contrato de presentacion:

- Si `status: available`, renderiza `image_ref` o `image_url`.
- Si `status: pending`, muestra estado de procesamiento.
- Si `status: unavailable`, muestra placeholder gobernado con razon
  funcional, no un vacio ambiguo.
- No debe inferir comportamiento distinto por flujo de origen; debe consumir el
  contrato comun.

## Ownership Propuesto

- `sst-extension`: owner del contrato productor cuando captura URL privada o
  genera thumbnail desde sesion del navegador.
- `node-auth`: owner del contrato de ingestion si recibe preview metadata o
  artifacts desde la extension.
- `sst-fend`: owner del render y degradacion visual.
- `sst-bend` o servicio backend seleccionado: owner futuro si se decide derivar
  previews desde URL/PDF server-side.
- `4uentes-orchestor`: owner de la decision cross-repo, evidencia, Jira mirror
  y lifecycle.

## Decision Recomendada

Implementar en dos capas:

1. Contrato comun `ArticlePreviewResolver` con `status/source/reason/provenance`.
2. Primer productor: `sst-extension`, usando URL + imagen provista + thumbnail
   visual opcional.

Despues, `sst-fend` debe adoptar el contrato para que cualquier articulo SST,
no solo los derivados de extension, tenga un comportamiento consistente.

## Guardrails

- No guardar previews privadas en Jira o ARDS/SDD evidence.
- No persistir screenshots privados sin politica explicita.
- No enviar cookies, JWTs, secretos ni raw PDFs a evidencia.
- No crear derivacion server-side de URLs privadas sin resolver autenticacion,
  consentimiento y boundary de secretos.
- Toda implementacion cross-repo debe actualizar owner docs del repo mutado y
  ejecutar enforcement del control-plane.
