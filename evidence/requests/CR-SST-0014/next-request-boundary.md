# CR-SST-0014 - Next Request Boundary

## Decision

No se debe modificar runtime en este request. Este request cierra solo el
analisis profundo y actualiza el estado del orquestador.

## Request recomendado 1

Titulo: `Close dictionary tags as controlled validated-local release`

Objetivo:

- Definir criterios de cierre de Diccionario tags.
- Ejecutar smoke endpoint o validacion live minima.
- Confirmar si `TagDefinition` CRUD queda fuera del cierre o entra como gap
  aceptado.
- Mover `dictionary-tags` a `ready-for-release` o `done` solo con evidencia
  explicita.

Repos involucrados:

- `sst-bend`
- `4uentes-auth`
- `sst-fend`
- `sst-extension` solo si Quick Save queda dentro del cierre.

## Request recomendado 2

Titulo: `Promote article-tags from draft to governed SST capability`

Objetivo:

- Promover `article-tags` desde draft a contrato activo.
- Adoptar tags estructurados en BFF y frontend.
- Agregar cobertura para create/update Articulos con tags.
- Validar `includeTags=true` en lista y detalle.

Repos involucrados:

- `sst-bend`
- `4uentes-auth`
- `sst-fend`

## Request recomendado 3

Titulo: `Define learning-content tag grammar for SST courses and classes`

Objetivo:

- Crear capability `learning-content-tags`.
- Definir gramatica de bloques: definicion, ejemplo, recordar, importante,
  docs, referencias y tecnologias.
- Normalizar aliases de marcadores actuales como `subt`/`sub`.
- Decidir nombre de UI: Clase, Articulo, Curso o Recurso de aprendizaje.
- Preparar parser futuro para notas como el curso de AWS.

Repos involucrados:

- Orquestador para contrato y estado.
- `sst-bend` cuando se implemente parser/API.
- `sst-fend` cuando se implemente UI.

## Request separado

Titulo: `Real-time transcription intake for SST`

Motivo:

La transcripcion en tiempo real es captura de informacion, no cierre de tags.
Debe tener request separada porque incorpora permisos, streaming, storage,
procesamiento y trazabilidad.

