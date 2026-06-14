# CR-SST-0069 Gate 0 - smoke autenticado de backend

Fecha: 2026-06-12

## Alcance

Se valido el limite runtime de `sst-bend` creado bajo `CR-SST-0067` antes de
introducir cambios consumidores en BFF/frontend.

## Metodo

- Se obtuvo un JWT local de QA a traves del endpoint de autenticacion del BFF
  en ejecucion.
- El token se mantuvo solo en memoria; no se escribio ningun token ni secreto en
  evidencia.
- Se envio un request `POST` autenticado directamente al endpoint preview de
  backend SST con headers de contexto de cuenta.

Endpoint:

- `POST http://localhost:3000/4uentes/v1/tags/prefix-engine/preview`

Intencion del payload:

- `scope: articulo`
- candidato de tag local combinado con candidato de referencia externa
- sin request de persistencia

## Resultado

Resumen de respuesta del backend:

```json
{
  "issues": 0,
  "persisted": false,
  "persistenceMode": "preview-only",
  "importedRefs": 1,
  "status": "PREVIEW_OK",
  "tagValues": 1,
  "blocks": 1,
  "contractVersion": "sst-tag-prefix-engine.preview.v1"
}
```

## Decision de compuerta

Gate 0 aprobado.

El endpoint preview de backend es alcanzable con JWT/contexto de cuenta real y
preserva la semantica requerida de preview:

- sin persistencia
- `persisted=false`
- `persistenceMode=preview-only`
- `ImportedReference` permanece separado de `TagValue` local

Esto autoriza avanzar a Gate 1: introduccion del pass-through BFF en
`4uentes-auth`.
