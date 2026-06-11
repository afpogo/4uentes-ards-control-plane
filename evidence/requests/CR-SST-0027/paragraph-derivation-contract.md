# CR-SST-0027 - Contrato De Derivacion Secuencial Por Parrafos

Observado el: 2026-06-04

## Correccion 2026-06-05

CR-SST-0030 corrige el destino conceptual de este contrato.

La derivacion secuencial por parrafos puede alimentar memoria interna de usuario
en una fase posterior, especialmente cuando el evento de usuario involucra
fuentes largas como URLs, PDFs o libros. No debe leerse como el primer slice de
memoria interna ni como mutacion de un "ARDS/SDD de usuario".

El primer slice recomendado ahora es memoria interna basada en eventos simples
de plataforma y chatbot: `user_memory_event`, `user_memory_fact`,
`user_memory_intention`, `user_memory_thread` y `user_memory_recall`.

## Decision

El procesamiento secuencial por parrafos es el primer motor agentico que
alimenta el ARDS/SDD de usuario definido en CR-SST-0026.

El objetivo no es producir solo un resumen. El objetivo es convertir una fuente
larga en propuestas ARDS trazables: hechos, conceptos, intenciones, preguntas,
relaciones, tags candidatos, decisiones y resumenes.

## Flujo Conceptual

```text
source_text_snapshot
  -> paragraph_sequence
  -> paragraph_derivation_run
  -> context_chain
  -> paragraph_derivation[]
  -> ards_proposal
  -> backend validation
  -> user ARDS/SDD mutation
```

## Partes Del Contrato

### `paragraph_sequence`

Representa la segmentacion ordenada del texto fuente.

Campos minimos:

- `sequence_id`;
- `snapshot_id`;
- `source_id`;
- `normalization_version`;
- `paragraph_count`;
- `chunking_policy`;
- `text_hash`;
- `created_at`.

Reglas:

- El orden original debe preservarse.
- Un parrafo puede dividirse en chunks si supera limites de contexto.
- Cada chunk debe mantener referencia a su `paragraph_index` original.

### `paragraph_derivation_run`

Representa una corrida completa del agente sobre una secuencia.

Campos minimos:

- `run_id`;
- `workspace_id`;
- `sequence_id`;
- `producer_service`;
- `capability_id`;
- `prompt_id`;
- `prompt_version`;
- `model_profile`;
- `correlation_id`;
- `idempotency_key`;
- `status`;
- `started_at`;
- `completed_at`.

Estados iniciales:

- `created`;
- `processing`;
- `completed`;
- `failed`;
- `superseded`.

### `context_chain`

Representa el estado acumulado que pasa de un parrafo al siguiente.

Campos minimos:

- `context_chain_id`;
- `run_id`;
- `after_paragraph_index`;
- `summary_so_far`;
- `active_concepts`;
- `open_questions`;
- `candidate_intentions`;
- `evidence_refs`;
- `context_hash`.

Reglas:

- El contexto de `paragraph_index = n` alimenta `n + 1`.
- El hash permite detectar drift o reprocesamiento inconsistente.
- El contexto acumulado no reemplaza la evidencia por parrafo.

### `paragraph_derivation`

Representa el resultado estructurado de procesar un parrafo o chunk.

Campos minimos:

- `derivation_id`;
- `run_id`;
- `paragraph_index`;
- `chunk_index`;
- `input_context_hash`;
- `output_context_hash`;
- `main_idea`;
- `facts`;
- `intentions`;
- `concepts`;
- `tag_candidates`;
- `questions`;
- `relationships`;
- `evidence_refs`;
- `confidence`;
- `validation_flags`.

Reglas:

- `facts` deben derivarse de evidencia de la fuente.
- `intentions` pueden ser inferidas solo si se marcan como inferidas.
- `questions` capturan dudas o informacion faltante.
- `validation_flags` debe registrar baja confianza, contradicciones o contenido
  insuficiente.

### `final_derivation_summary`

Representa la salida global de la corrida.

Campos minimos:

- `summary_id`;
- `run_id`;
- `source_id`;
- `short_summary`;
- `key_points`;
- `important_facts`;
- `candidate_intentions`;
- `knowledge_entry_candidates`;
- `evidence_refs`;
- `validation_summary`.

### `ards_proposal`

La salida final del agente debe mapear al modelo de CR-SST-0026.

Campos minimos:

- `proposal_id`;
- `producer_service`;
- `capability_id`;
- `workspace_id`;
- `proposed_entries`;
- `validation_summary`;
- `correlation_id`;
- `idempotency_key`;
- `status`.

`proposed_entries` debe contener candidatos para `knowledge_entry`, no entradas
finales ya mutadas.

## Politica De Ejecucion Inicial

La implementacion inicial debe usar un solo pipeline secuencial. No se debe
crear un subagente por parrafo en la primera version, porque el valor central
del flujo es conservar continuidad contextual.

## Fuera De Alcance De CR-SST-0027

- Implementar codigo en `sst-chatbot`.
- Implementar endpoints o tablas en `sst-bend`.
- Implementar UI.
- Ejecutar providers reales.
- Definir prompts finales productivos.
- Mutar ARDS/SDD de usuario.

## Siguiente Request

CR-SST-0028 debe usar este contrato para definir como la UI, los jobs
persistidos y el backend muestran, validan y consolidan estas propuestas.
