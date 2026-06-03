# CR-SST-0014 - Implementation State Analysis

## Resumen

Diccionario tags esta implementado localmente y validado como feature de
Diccionario. La expansion a Articulos existe parcialmente en `sst-bend`, pero
todavia no esta cerrada como capacidad gobernada por SST porque faltan adopcion
en BFF/frontend, cobertura explicita y una decision de modelo para Cursos,
Clases y Bitacora.

El estado correcto para la funcionalidad amplia no es `done`. El estado
correcto para `sst-tags-governance` pasa a ser `runtime-partial`: hay runtime
real en backend, pero todavia no existe ciclo completo gobernado por SST.

## Conceptos tecnicos de tags

La tercera pieza que faltaba recordar es `TagValue`.

Modelo observado:

- `TagDefinition`: define el tipo de tag, por ejemplo tema, tecnologia,
  importancia, fuente o modulo.
- `TagValue`: valor reutilizable dentro de una definicion, por ejemplo `AWS`,
  `IAM`, `S3`, `seguridad` o `importante`.
- `TagOccurrence`: vinculacion concreta de un `TagValue` con un recurso, por
  ejemplo una entrada de Diccionario, un Articulo o una clase del curso.

## Estado por dominio

### Diccionario

Estado: `validated-local`.

Implementado:

- Modelo DB-first de dominio de Diccionario.
- Endpoints y repositorio para `DictionaryTagValue` y
  `DictionaryTagOccurrence`.
- Asociacion de tags a entradas de Diccionario.
- BFF con rutas pass-through para tag-values y tag-occurrences.
- Frontend con consumo y visualizacion de tag-values en la experiencia de
  Diccionario.
- Evidencia previa en CR-SST-0002.

Pendiente antes de declarar `done` sin reservas:

- Evidencia live o smoke endpoint explicitamente ejecutada.
- Gobierno formal de `TagDefinition`.
- Criterio de cierre que separe Diccionario de la expansion SST-level.
- Decision de si offline/encryption final queda fuera del cierre o como gap
  aceptado.

### Articulos

Estado: `runtime-partial`.

Implementado en backend:

- `POST /articulos` y `PATCH /articulos/:id` aceptan `tags` opcionales.
- `GET /articulos` y `GET /articulos/:id` pueden usar `includeTags=true`.
- El repositorio sincroniza tags de articulos creando o reutilizando
  `DictionaryTagValue`.
- Las ocurrencias usan `DictionaryTagOccurrence` con `articleId` y
  `sourceType: "article-tag"`.
- La capability `article-tags` existe como contrato outbound en `sst-bend`,
  pero esta en estado `draft`.

Gaps:

- La capability `article-tags` no esta promovida a contrato activo.
- BFF y frontend no aparecen como adoptados para crear/editar tags
  estructurados en Articulos.
- La UI de Articulos todavia trata tags como representacion simple de lectura
  en lugar de operar el modelo `TagValue` + `TagOccurrence`.
- Falta cobertura explicita para `POST/PATCH /articulos` con tags y para
  `includeTags=true`.

### Cursos, Clases y Bitacora

Estado: `ards-documented` / conceptual.

Hay evidencia fuerte de necesidad en los archivos del curso de AWS. Los textos
ya contienen una gramatica humana que puede convertirse en una gramatica SST,
pero no se observo runtime gobernado para parsear esos archivos como recursos
SST.

Gaps:

- No existe capability activa para `course-tags` o `learning-content-tags`.
- No existe parser gobernado para las notas del curso.
- No existe decision canonica sobre si el recurso se llama Articulo, Clase,
  Curso, Learning Resource o una combinacion por nivel.
- Bitacora sigue como extension conceptual.

### Transcripcion en tiempo real

Estado: fuera de cierre para tags.

La transcripcion es una futura fuente de captura. Debe ser request separada
porque afecta captura, streaming, permisos, persistencia y procesamiento. No
debe bloquear el cierre de Diccionario tags.

## Decision de estado

- `dictionary-tags`: se mantiene en `validated-local`.
- `sst-tags-governance`: debe avanzar de `planned` a `runtime-partial` porque
  la evidencia muestra runtime parcial en backend para Articulos y Diccionario,
  pero no un ciclo completo gobernado por SST.

