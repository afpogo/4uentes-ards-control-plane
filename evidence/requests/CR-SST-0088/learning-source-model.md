# CR-SST-0088 - Modelo LearningSource

## Contexto

Este documento define el primer corte local del modelo `learning-content` para
`SST-6`, bajo `INIT-SST-0001`. Jira se mantiene como mirror; el control-plane
local es la fuente canonica de este CR mientras el acceso MCP/Jira siga
bloqueado o no se soliciten writes.

## Regla Central

`CourseSource != ArticleDocument`.

Un curso contiene documentos y recursos. Un articulo web es una fuente
documental. Ambos pueden producir `KnowledgeDocument` y derivaciones IA, pero
no son la misma entidad logica.

## LearningSource

`LearningSource` es el tipo raiz abstracto para entradas de aprendizaje. No es
persistencia de contenido procesado por si misma; describe de donde sale el
material que luego puede normalizarse.

Subtipos del primer corte:

- `CourseSource`
- `WebArticleSource`

Subtipo reservado:

- `TranscriptionSource`

## CourseSource

`CourseSource` modela una estructura de curso local o referenciada, compuesta
por documentos, assets, labs, scripts y evaluaciones.

Forma minima:

```yaml
sourceType: "course"
rootRef: "TODO"
docsPath: "docs"
assetPaths: []
exclusionPolicy:
  generatedLabsExcludedByDefault: true
  ignoredPaths: []
prefixAliasPolicy:
  allowed: true
  aliases: []
```

Reglas:

- `docsPath` apunta al subconjunto documental del curso.
- `assetPaths` enumera recursos auxiliares que pueden referenciarse desde
  documentos o bloques.
- `exclusionPolicy` excluye artefactos generados de labs por defecto.
- `prefixAliasPolicy` permite registrar aliases de prefijo sin convertirlos en
  identidades canonicas.

## WebArticleSource

`WebArticleSource` modela contenido tomado desde una URL, HTML o texto extraido.
Es una fuente documental, no un curso.

Forma minima:

```yaml
sourceType: "web-article"
url: "TODO"
rawText: "TODO"
extractionMode: "full"
aiProcessingMode: "summary"
```

Reglas:

- Debe existir `url` o `rawText`.
- `extractionMode` admite `full` o `partial`.
- `aiProcessingMode` admite `summary`, `concepts`, `tags` o `blocks`.
- El scraping masivo queda fuera de scope.

## TranscriptionSource Reservado

`TranscriptionSource` queda documentado solo como extension futura. No se
implementa ni se valida en `CR-SST-0088`.

Forma conceptual:

```yaml
sourceType: "transcription"
mediaType: "web"
transcriptText: "TODO"
sourceRef: "TODO"
```

`mediaType` futuro admite `web`, `video`, `audio` u `other`.

## KnowledgeDocument

`KnowledgeDocument` es la unidad procesable producida desde una source. Puede
derivarse de `CourseSource`, `WebArticleSource` o, en el futuro, de
`TranscriptionSource`.

Forma conceptual:

```yaml
documentId: "TODO"
sourceRef: "TODO"
title: "TODO"
language: "TODO"
contentBlocks: []
tagSuggestions: []
warnings: []
```

## ContentBlock

`ContentBlock` es un bloque semantico normalizado para render, revision y
posterior tagging.

Tipos iniciales:

- `clase`
- `nota`
- `recordar`
- `ejemplo`
- `definicion`
- `image`
- `docs`
- `code`

Forma conceptual:

```yaml
blockType: "nota"
order: 0
text: "TODO"
metadata: {}
sourceSpan: "TODO"
```

## Limite IA

Permitido en v1 de diseno:

- extraccion limpia;
- resumen;
- conceptos;
- tags sugeridos;
- bloques semanticos;
- warnings.

No permitido todavia:

- scraping masivo;
- publicacion automatica;
- persistencia sin aprobacion;
- creacion automatica de `TagDefinition`;
- cierre Jira automatico.
