# Propuesta De DerivaciÃ³n Secuencial Por PÃ¡rrafos

Fecha observada: 2026-08-22.

> Estado posterior (2026-08-25): este documento queda como antecedente
> historico. El contrato vigente aprobado por `CR-SST-0219` se explica en
> [`contrato-derivacion-secuencial-por-parrafos-v1.md`](contrato-derivacion-secuencial-por-parrafos-v1.md)
> y su autoridad machine-readable es
> [`paragraph-sequential-derivation-contract-v1.yaml`](../../../evidence/requests/CR-SST-0219/paragraph-sequential-derivation-contract-v1.yaml).

Este documento explica cÃ³mo recuperar la intenciÃ³n de `CR-SST-0027` dentro de
`INIT-SST-0010`, respetando la correcciÃ³n conceptual de `CR-SST-0030`.

El plan de adopciÃ³n por owner y sus gates se encuentra en
`evidence/initiatives/INIT-SST-0010/paragraph-sequential-derivation-adoption-plan.md`.

La propuesta todavÃ­a no es una autorizaciÃ³n de implementaciÃ³n. No asigna un
nuevo Change Request, no habilita cambios en repos hijos y no convierte la
memoria interna de usuario en un ARDS/SDD por usuario. Los mapas son vistas
derivadas; ante una contradicciÃ³n prevalecen las fuentes ARDS/SDD indicadas en
cada bloque.

## Mapa De Lifecycle: PosiciÃ³n Gobernada De La Propuesta

<!-- visual-map:start -->

```yaml
visual_map:
  schema_version: "1.0"
  id: "sst-paragraph-derivation-governed-lifecycle"
  type: "lifecycle"
  question: "Â¿QuÃ© gates deben completarse antes de implementar la derivaciÃ³n secuencial por pÃ¡rrafos?"
  abstraction_level: "request lifecycle"
  source_refs:
    - "initiatives/INIT-SST-0010-personal-knowledge-and-memory-workspace.yaml"
    - "requests/done/CR-SST-0027-paragraph-sequential-ards-derivation.yaml"
    - "requests/done/CR-SST-0030-sst-user-internal-memory-boundary.yaml"
    - "requests/done/CR-SST-0193-implement-canonical-user-memory-runtime.yaml"
    - "requests/done/CR-SST-0194-integrate-chatbot-memory-proposals-and-recall.yaml"
    - "evidence/requests/CR-SST-0194/owner-publication-readback-2026-08-23.md"
    - "evidence/initiatives/INIT-SST-0010/request-id-collision-2026-08-22.md"
  observed_at: "2026-08-22"
  authority_boundary: "Vista derivada; la Initiative, los lifecycle de las CRs y su evidencia conservan autoridad."
  textual_fallback_required: true
  request_ids: ["CR-SST-0027", "CR-SST-0030", "CR-SST-0193", "CR-SST-0194"]
  initiative_ids: ["INIT-SST-0010"]
  status_vocabulary: ["validated", "authoritative", "running", "blocked", "proposed"]
```

```mermaid
flowchart LR
    I["INIT-SST-0010 memoria personal [authoritative]"]
    D["CR-SST-0027 contrato por pÃ¡rrafos [validated]"]
    C["CR-SST-0030 boundary de memoria [authoritative]"]
    M["CR-SST-0193 memoria canÃ³nica [running]"]
    B["Identidad, scope y namespace [blocked]"]
    H["CR-SST-0194 handoff de propuestas [running] owners merged"]
    P["Nueva CR propuesta de derivaciÃ³n por pÃ¡rrafos [planned]"]

    I -->|"gobierna la secuencia"| D
    D -->|"reutiliza contrato validado"| P
    C -->|"corrige destino a memoria SST"| P
    M -->|"provee persistencia canÃ³nica"| B
    B -->|"bloquea cierre e integraciÃ³n"| H
    H -->|"habilita proposal y recall ports"| P

    classDef authoritative fill:#dbeafe,stroke:#2563eb,color:#172554
    classDef validated fill:#dcfce7,stroke:#16a34a,color:#052e16
    classDef running fill:#fef3c7,stroke:#d97706,color:#451a03
    classDef blocked fill:#fee2e2,stroke:#dc2626,color:#450a0a
    classDef planned fill:#e0f2fe,stroke:#0284c7,color:#082f49
    class I,C authoritative
    class D validated
    class M running
    class B blocked
    class H,P planned
```

## Fallback Textual Del Mapa De Lifecycle

```text
INIT-SST-0010 [authoritative] --gobierna la secuencia--> CR-SST-0027 [validated].
CR-SST-0027 --reutiliza contrato validado--> nueva CR de derivaciÃ³n por pÃ¡rrafos [proposed].
CR-SST-0030 [authoritative] --corrige el destino a memoria interna SST--> nueva CR propuesta.
CR-SST-0193 [running] --provee persistencia canÃ³nica--> gate de identidad, scope y namespace [blocked].
El QA integrado pendiente --impide cerrar la integraciÃ³n--> CR-SST-0194 [running].
CR-SST-0194 --debe habilitar proposal y recall ports--> nueva CR de derivaciÃ³n por pÃ¡rrafos [proposed].
La nueva CR no puede numerarse ni ejecutarse hasta reconciliar el namespace global.
```

<!-- visual-map:end -->

Lectura humana: el diseÃ±o histÃ³rico sigue siendo reutilizable, pero no debe
saltarse la fundaciÃ³n de memoria, identidad ni el handoff gobernado. La nueva
feature es una unidad posterior y separada, no una ampliaciÃ³n silenciosa de
`CR-SST-0193` o `CR-SST-0194`.

## Mapa De Secuencia: Procesamiento De Un ArtÃ­culo

<!-- visual-map:start -->

```yaml
visual_map:
  schema_version: "1.0"
  id: "sst-paragraph-derivation-runtime-sequence"
  type: "sequence"
  question: "Â¿En quÃ© orden se procesa cada pÃ¡rrafo y se entrega una propuesta de memoria gobernada?"
  abstraction_level: "cross-repo handoff"
  source_refs:
    - "evidence/requests/CR-SST-0027/paragraph-derivation-contract.md"
    - "evidence/requests/CR-SST-0027/prompt-versioning-summary.md"
    - "evidence/requests/CR-SST-0027/agent-authority-boundary.md"
    - "evidence/requests/CR-SST-0030/correction-impact-summary.md"
    - "requests/done/CR-SST-0194-integrate-chatbot-memory-proposals-and-recall.yaml"
  observed_at: "2026-08-22"
  authority_boundary: "Vista derivada de una propuesta; CR-SST-0027, CR-SST-0030 y los contratos owner conservan autoridad."
  textual_fallback_required: true
  request_ids: []
  initiative_ids: []
  notes: "La serializaciÃ³n textual del contexto es acotada; la cadena durable conserva estructura y provenance."
```

```mermaid
sequenceDiagram
    participant U as Usuario [bounded]
    participant B as sst-bend [authoritative]
    participant A as sst-chatbot [proposal producer]
    participant C as Context chain [bounded]

    U->>B: solicita analizar artÃ­culo [proposed]
    B->>A: entrega snapshot, scope y run identity [validated input]
    loop por cada pÃ¡rrafo o chunk en orden
        A->>C: recupera resumen y referencias anteriores [bounded context]
        C-->>A: devuelve contexto serializado y context hash [confirmed]
        A->>A: deriva idea, hechos, conceptos, preguntas y flags
        A->>C: agrega derivaciÃ³n estructurada y output hash [append-only]
    end
    A-->>B: entrega resumen final y user_memory_proposal [proposed]
    B->>B: valida identidad, scope, idempotencia y consentimiento
    B-->>U: expone propuesta para revisiÃ³n [needs review]
```

## Fallback Textual Del Mapa De Secuencia

```text
1. El usuario solicita a sst-bend analizar un artÃ­culo.
2. sst-bend entrega a sst-chatbot un snapshot inmutable, scope validado e identidad de corrida.
3. Para cada pÃ¡rrafo o chunk, respetando el orden original:
   a. sst-chatbot recupera de Context chain el resumen, conceptos, preguntas y referencias anteriores.
   b. Context chain entrega una serializaciÃ³n textual acotada mÃ¡s su context hash.
   c. sst-chatbot deriva resultados estructurados del pÃ¡rrafo actual.
   d. sst-chatbot agrega la derivaciÃ³n y su output hash a la cadena durable.
4. sst-chatbot entrega a sst-bend un resumen final y una user_memory_proposal; no escribe memoria canÃ³nica.
5. sst-bend valida identidad, scope, idempotencia y consentimiento.
6. El usuario recibe una propuesta revisable; ninguna inferencia queda aceptada automÃ¡ticamente.
```

<!-- visual-map:end -->

Lectura humana: los anÃ¡lisis anteriores no deberÃ­an conservarse solamente como
un string creciente. La fuente durable es una cadena estructurada. Antes de
procesar el siguiente pÃ¡rrafo se genera desde ella una representaciÃ³n textual
acotada, reproducible y asociada a un hash.

## Mapa De Datos: Cadena Contextual Y Provenance

<!-- visual-map:start -->

```yaml
visual_map:
  schema_version: "1.0"
  id: "sst-paragraph-derivation-logical-data"
  type: "data"
  question: "Â¿QuÃ© entidades lÃ³gicas preservan la cadena contextual y la evidencia de cada pÃ¡rrafo?"
  abstraction_level: "logical entity"
  source_refs:
    - "evidence/requests/CR-SST-0027/paragraph-derivation-contract.md"
    - "evidence/requests/CR-SST-0027/prompt-versioning-summary.md"
    - "evidence/requests/CR-SST-0030/user-internal-memory-model.md"
    - "evidence/requests/CR-SST-0192/personal-memory-governance-v1.yaml"
  observed_at: "2026-08-22"
  authority_boundary: "Vista derivada sin valores productivos; los contratos referenciados y la futura documentaciÃ³n owner conservan autoridad."
  textual_fallback_required: true
  request_ids: []
  initiative_ids: []
```

```mermaid
erDiagram
    SOURCE_SNAPSHOT ||--|| PARAGRAPH_SEQUENCE : "origina una secuencia ordenada [confirmed]"
    PARAGRAPH_SEQUENCE ||--|| DERIVATION_RUN : "es procesada por una corrida [confirmed]"
    DERIVATION_RUN ||--|| CONTEXT_CHAIN : "mantiene una cadena contextual [confirmed]"
    DERIVATION_RUN ||--o{ PARAGRAPH_DERIVATION : "produce derivaciones ordenadas [confirmed]"
    CONTEXT_CHAIN ||--o{ PARAGRAPH_DERIVATION : "vincula hashes de entrada y salida [confirmed]"
    PARAGRAPH_DERIVATION }o--o{ EVIDENCE_REF : "cita evidencia de pÃ¡rrafo o chunk [confirmed]"
    DERIVATION_RUN ||--|| FINAL_SUMMARY : "consolida un resumen final [confirmed]"
    FINAL_SUMMARY ||--o{ USER_MEMORY_PROPOSAL : "propone memoria revisable [proposed]"

    SOURCE_SNAPSHOT {
        string snapshot_id "logical identifier"
        string text_hash "immutable source hash"
    }
    PARAGRAPH_SEQUENCE {
        string sequence_id "logical identifier"
        string normalization_version "versioned rule"
    }
    DERIVATION_RUN {
        string run_id "logical identifier"
        string prompt_version "versioned contract"
        string idempotency_key "deduplication key"
    }
    CONTEXT_CHAIN {
        string context_chain_id "logical identifier"
        string context_hash "bounded state hash"
        string serialized_context "bounded prompt representation"
    }
    PARAGRAPH_DERIVATION {
        int paragraph_index "original order"
        int chunk_index "bounded subdivision"
        string input_context_hash "previous state reference"
        string output_context_hash "next state reference"
    }
    EVIDENCE_REF {
        string evidence_ref_id "source location reference"
    }
    FINAL_SUMMARY {
        string summary_id "logical identifier"
        string validation_summary "flags and confidence"
    }
    USER_MEMORY_PROPOSAL {
        string proposal_id "logical identifier"
        string status "review lifecycle"
    }
```

## Fallback Textual Del Mapa De Datos

```text
Un SOURCE_SNAPSHOT origina exactamente una PARAGRAPH_SEQUENCE ordenada.
Una PARAGRAPH_SEQUENCE es procesada por una DERIVATION_RUN.
Cada DERIVATION_RUN mantiene una CONTEXT_CHAIN y produce cero o mÃ¡s PARAGRAPH_DERIVATION ordenadas.
La CONTEXT_CHAIN relaciona cada PARAGRAPH_DERIVATION mediante input_context_hash y output_context_hash.
Cada PARAGRAPH_DERIVATION cita cero o mÃ¡s EVIDENCE_REF de su pÃ¡rrafo o chunk original.
La DERIVATION_RUN consolida un FINAL_SUMMARY.
El FINAL_SUMMARY puede producir una o mÃ¡s USER_MEMORY_PROPOSAL revisables.
serialized_context es una representaciÃ³n textual acotada para el prompt; no reemplaza las derivaciones estructuradas ni sus referencias.
```

<!-- visual-map:end -->

## Decisiones Que Debe Cerrar La Futura CR

- PolÃ­tica exacta de segmentaciÃ³n y normalizaciÃ³n de artÃ­culos.
- LÃ­mite de tokens de `serialized_context` y estrategia de compactaciÃ³n.
- Persistencia de runs parciales, reanudaciÃ³n y supersession.
- Schema versionado de `paragraph_derivation` y `user_memory_proposal`.
- Tratamiento de contradicciones entre pÃ¡rrafos y baja confianza.
- PolÃ­tica de consentimiento y revisiÃ³n antes de aceptar memoria inferida.
- RetenciÃ³n de snapshots y evidencia sin conservar contenido sensible mÃ¡s allÃ¡
  de lo necesario.

## Boundary De ImplementaciÃ³n

La futura CR deberÃ¡ identificar como mÃ­nimo a `sst-chatbot` como productor de
derivaciones y a `sst-bend` como autoridad de validaciÃ³n y persistencia. Si se
modifican esos repos, sus specs, docs, capabilities y pruebas owner deberÃ¡n
actualizarse dentro del mismo lifecycle. Este documento del control plane no
reemplaza esa documentaciÃ³n owner.
