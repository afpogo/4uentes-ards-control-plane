# CR-SST-0089 - Plan De Implementacion Futuro

## Alcance

Este documento define como deberia ejecutarse la implementacion futura en
`sst-bend` cuando se habilite la mutacion del repo hijo. No ejecuta esa
implementacion en este paso.

## Secuencia Recomendada

1. Revisar el POC existente del motor de prefijos en `sst-bend`.
2. Definir tipos internos para `CourseSource`, `WebArticleSource`,
   `KnowledgeDocument`, `ContentBlock`, `TagSuggestion` y `warnings`.
3. Agregar `documentSelectors` y `assetSelectors` para cursos con `docs`
   anidados o documentos distribuidos.
4. Crear un servicio de aplicacion puro para preview/import sin dependencia de
   DB.
5. Agregar validacion de entrada con modo warning-first.
6. Exponer endpoint solo cuando el servicio puro tenga pruebas.
7. Mantener persistencia `preview-only` por defecto.
8. Registrar evidencia de pruebas, archivos tocados y rollback.

## Pruebas Futuras Esperadas

Cuando el repo hijo se modifique, la implementacion deberia validar:

- `CourseSource manifest` produce `KnowledgeDocument` y `ContentBlock[]`;
- `WebArticleSource payload` produce salida normalizada sin crawler;
- prefijos `clase`, `nota`, `recordar`, `ejemplo`, `definicion`, `image`,
  `docs` y `code` se mapean a bloques;
- prefijos `titulo`, `subt`, `subtitulo`, `importante` y `resumen` se mapean
  como bloques o aliases normalizados;
- aliases y typos generan normalizacion con evidencia;
- falsos positivos de codigo/config no crean `TagDefinition`;
- assets faltantes generan `warnings[]`;
- carpetas generadas como `.gradle`, `build`, `.idea` y `postgres_data`
  quedan excluidas por defecto;
- no hay escritura en DB sin aprobacion posterior.

## Criterio Para Mutar `sst-bend`

Antes de editar `sst-bend`, la siguiente ejecucion debe registrar:

- archivos objetivo;
- endpoint propuesto;
- pruebas automatizadas;
- comando de build/check;
- estrategia de rollback;
- evidencia de que la persistencia sigue `preview-only`;
- decision explicita sobre Jira read/write si MCP sigue bloqueado.

## Fuera De Alcance

Queda fuera de este CR:

- UI en `sst-fend`;
- BFF en `4uentes-auth`;
- extension browser;
- `TranscriptionSource`;
- persistencia definitiva;
- `TagDefinition` automatico;
- publicacion automatica;
- cierre Jira.
