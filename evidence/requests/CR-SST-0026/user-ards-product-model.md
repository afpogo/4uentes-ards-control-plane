# CR-SST-0026 - Modelo De Producto ARDS/SDD De Usuario

Observado el: 2026-06-04

## Correccion 2026-06-05

CR-SST-0030 corrige la terminologia de este artifact.

La lectura final no debe ser "ARDS/SDD de usuario". El ARDS/SDD es la memoria
documental y operativa del proyecto. Para SST, el concepto de producto correcto
es `sst_user_internal_memory`: memoria interna de usuario basada en eventos,
hechos, intenciones, conversaciones con chatbot y recall agentico.

Este documento queda como evidencia historica de la primera aproximacion. Para
implementacion, reemplazar mentalmente:

- `user ARDS/SDD` por `SST user internal memory`;
- `user_ards_workspace` por `user_memory_space`;
- `knowledge_entry` por `user_memory_fact` o memoria derivada;
- `ards_proposal` por `user_memory_proposal`.

## Decision

SST debe tratar el ARDS/SDD por usuario como su modelo principal de producto.
El sistema no guarda solamente articulos, PDFs, tags o resumenes: convierte
fuentes y actividad del usuario en conocimiento gobernado, trazable y revisable.

`ARDS/SDD` no es una base de datos. La base de datos, filesystem, storage o
cola son mecanismos de persistencia subordinados. El ARDS/SDD es el modelo
operativo que define identidad, estructura, evidencia, estados, reglas y
autoridad sobre el conocimiento del usuario.

## Partes Del ARDS/SDD De Usuario

### `user_ards_workspace`

Representa el espacio ARDS/SDD propio de un usuario o account.

Campos minimos:

- `tenant_id`;
- `account_id`;
- `user_id`;
- `workspace_id`;
- `status`;
- `created_at`;
- `updated_at`.

### `source_record`

Representa una fuente incorporada al ARDS/SDD del usuario.

Campos minimos:

- `source_id`;
- `source_type`;
- `source_uri`;
- `title`;
- `original_metadata`;
- `ingested_at`;
- `owner_scope`;
- `idempotency_key`.

`source_type` puede comenzar con `url`, `pdf`, `text`, `file` y `manual_note`.
Otros tipos deben agregarse por request posterior.

### `source_text_snapshot`

Representa el texto normalizado obtenido desde una fuente.

Campos minimos:

- `snapshot_id`;
- `source_id`;
- `normalization_version`;
- `text_hash`;
- `language`;
- `paragraph_count`;
- `created_at`.

El snapshot permite reprocesar, auditar o comparar derivaciones sin depender de
que la fuente externa siga igual.

### `knowledge_entry`

Representa una unidad de conocimiento dentro del ARDS/SDD del usuario.

Tipos iniciales:

- `summary`;
- `fact`;
- `concept`;
- `tag_candidate`;
- `question`;
- `decision`;
- `relationship`;
- `note`.

Campos minimos:

- `entry_id`;
- `entry_type`;
- `workspace_id`;
- `source_refs`;
- `content`;
- `confidence`;
- `status`;
- `visibility`;
- `created_by`;
- `created_at`.

### `evidence_ref`

Conecta una entrada de conocimiento con su origen.

Campos minimos:

- `evidence_ref_id`;
- `source_id`;
- `snapshot_id`;
- `paragraph_index`;
- `text_span`;
- `quote_hash`;
- `derivation_id`.

La evidencia debe permitir explicar por que una entrada existe sin copiar texto
fuente completo de forma innecesaria.

### `ards_proposal`

Representa una propuesta producida por agente antes de mutar el ARDS/SDD del
usuario.

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

Estados iniciales:

- `drafted`;
- `validated`;
- `needs_user_review`;
- `accepted`;
- `rejected`;
- `superseded`.

### `provenance_record`

Registra como se produjo una derivacion.

Campos minimos:

- `provenance_id`;
- `proposal_id`;
- `prompt_id`;
- `prompt_version`;
- `model_profile`;
- `provider_adapter`;
- `agent_run_id`;
- `created_at`.

## Estados De Gobierno

El ARDS/SDD del usuario debe separar tres dimensiones:

- `proposal_status`: estado de la propuesta agentica.
- `validation_status`: resultado de reglas backend o humanas.
- `visibility`: si el usuario puede ver, editar o archivar la entrada.

Estados iniciales recomendados:

- `draft`;
- `validated`;
- `user_review`;
- `user_approved`;
- `visible`;
- `archived`;
- `rejected`.

## Regla Principal

Un agente puede producir `ards_proposal`. Solo el backend autorizado puede
convertir una propuesta validada en mutacion del ARDS/SDD del usuario.

Esa regla mantiene trazabilidad, permisos, idempotencia y posibilidad de
revision humana.

## Fuera De Alcance De CR-SST-0026

- Implementar tablas, migraciones o storage real.
- Implementar procesamiento por parrafos.
- Implementar UI.
- Modificar `sst-fend`, `sst-bend`, `sst-chatbot`, `4uentes-auth` o infra.
- Canonizar este modelo en `4uentes-ards-core`.

## Siguiente Request

`CR-SST-0027` debe usar este modelo como base para definir como el procesamiento
secuencial por parrafos genera `ards_proposal` y `knowledge_entry` candidatos.
