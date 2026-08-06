# CR-SST-0090 - Ajuste Sobre CR-SST-0089

## Relacion

`CR-SST-0089` define preview/import. `CR-SST-0090` no reemplaza ese contrato:
lo envuelve con el destino runtime donde se consolidan las fuentes aceptadas.

## Ajuste Conceptual

Antes:

- `CourseSource` o `WebArticleSource` entran al preview.
- El preview devuelve `KnowledgeDocument`, `ContentBlock[]`,
  `TagSuggestion[]` y `warnings[]`.
- La persistencia por defecto es `preview-only`.

Con `LearningWorkspace`:

- el preview sigue siendo no durable para recall;
- la aceptacion explicita consolida documentos, bloques, warnings,
  provenance y referencias dentro del workspace scoped;
- `TagSuggestion` puede quedar asociada al workspace como sugerencia, pero no
  crea `TagDefinition`;
- el chatbot solo recibe material aceptado por `LearningWorkspaceContext`.

## Regla De Import

Flujo futuro esperado:

1. Usuario o backend registra `CourseSource` o `WebArticleSource` para preview.
2. `sst-bend` produce salida preview con warnings.
3. Usuario/backend aprueba o rechaza consolidacion.
4. Solo la aprobacion crea entradas durables en `LearningWorkspace`.
5. El contexto durable del chatbot ignora previews no aprobados.

## Warnings

Los warnings se conservan como evidencia runtime de import. No bloquean por
defecto salvo errores criticos definidos por el backend futuro.

## Fuera De Alcance

Este ajuste no implementa:

- tabla o modelo runtime;
- endpoint;
- UI;
- crawler;
- persistencia definitiva;
- cierre de Jira;
- mutacion de repos hijos.
