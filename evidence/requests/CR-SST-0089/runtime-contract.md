# CR-SST-0089 - Contrato Runtime De Preview/Import

## Contexto

`CR-SST-0089` sigue a `CR-SST-0088` dentro de `INIT-SST-0001` para el track
activo `SST-6`. El objetivo es dejar definido el limite runtime futuro de
`sst-bend` antes de modificar el repo hijo.

Jira se mantiene como mirror, no como fuente de verdad. Este CR no ejecuta
reads ni writes contra Jira.

## Servicio Objetivo Futuro

Servicio objetivo: `sst-bend`.

Este paso no modifica `sst-bend`. La mutacion del repo hijo queda bloqueada
hasta que el plan de implementacion sea aceptado y nombre archivos, pruebas,
rollback y comportamiento `preview-only`.

## Entradas

El primer corte acepta dos modos de entrada:

- `CourseSource manifest`
- `WebArticleSource payload`

`CourseSource` representa un curso con documentos, assets, labs, scripts y
evaluaciones. `WebArticleSource` representa una fuente documental acotada,
tomada desde una URL, HTML o texto extraido. No es una semilla de crawler.

`TranscriptionSource` queda fuera de implementacion en este CR.

Para `CourseSource`, el runtime futuro no debe depender solo de un `docsPath`
fijo. Debe aceptar selectores controlados para cubrir cursos con documentos
anidados o distribuidos:

```yaml
documentSelectors:
  includeGlobs: []
  excludeGlobs: []
assetSelectors:
  includeGlobs: []
```

`docsPath` queda permitido como atajo simple cuando el curso use una carpeta
documental estable.

## Salidas

La salida esperada del preview/import es:

- `KnowledgeDocument`
- `ContentBlock[]`
- `TagSuggestion[]`
- `warnings[]`

`KnowledgeDocument` es la unidad procesable derivada desde la source.
`ContentBlock[]` conserva bloques semanticos como `clase`, `nota`,
`recordar`, `ejemplo`, `definicion`, `image`, `docs` y `code`. El analisis
de fuente agrega candidatos que el runtime debe soportar como bloques o aliases
normalizados: `titulo`, `subt`, `subtitulo`, `importante` y `resumen`.
`TagSuggestion[]` sugiere tags, pero no crea `TagDefinition`.
`warnings[]` registra problemas sin mutacion silenciosa.

## Persistencia

La persistencia por defecto es `preview-only`.

Reglas:

- El preview puede devolver documentos, bloques, sugerencias y advertencias.
- La importacion persistida requiere aprobacion explicita posterior.
- No se crean `TagDefinition` automaticamente.
- No se publica contenido automaticamente.
- No se cierra Jira automaticamente.

## Advertencias Esperadas

El endpoint futuro debe devolver advertencias para:

- prefijos desconocidos;
- aliases normalizados desde typos;
- assets referenciados que no existen;
- rutas excluidas por politica;
- entradas parciales;
- prefijos tecnicos detectados dentro de codigo o config;
- contenido sin suficiente estructura para producir bloques confiables.

## Acciones Prohibidas En V1

Este contrato no autoriza:

- scraping masivo;
- crawler recursivo;
- persistencia sin aprobacion;
- publicacion automatica;
- creacion automatica de `TagDefinition`;
- cierre automatico de Jira;
- ingestion ciega de carpetas generadas de labs.
