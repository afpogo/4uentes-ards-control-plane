# CR-SST-0123 - Implementation Analysis Start

## Estado

- Fecha: 2026-07-05
- Request: `CR-SST-0123`
- Estado: analisis iniciado.

## Observacion inicial

La revalidacion posterior a `CR-SST-0122` confirma que el backend ya no falla
por UUID/hash:

- `POST /api/learning-workspaces/sources/preview`: 200.
- `POST /api/learning-workspaces/sources/{previewId}/accept`: 201.
- `GET /api/learning-workspaces/context`: 200.

El gap residual esta en el resultado funcional:

- La UI muestra `Preview aceptado`.
- El template renderizado queda solo como shell de documento.
- El contexto visible muestra `annotations: []` y `contentBlocks: []`.

## Hipotesis a validar

1. `sst-fend` no esta enviando annotations/contentBlocks en el payload de preview.
2. `sst-fend` envia el payload, pero luego renderiza un campo incorrecto del contexto aceptado.
3. `node-auth` descarta campos de annotations/contentBlocks durante passthrough.
4. `sst-bend` acepta el preview pero no persiste/expone contentBlocks para este tipo de source.

## Primer corte recomendado

Inspeccionar `sst-fend` en:

- componente/ruta `/learning`
- builder del payload de preview
- handler de accept
- renderer de contexto aceptado/template
- tests existentes de LearningWorkspace

Luego contrastar con specs owner y solo ampliar a BFF/backend si el payload
frontend ya es correcto.
