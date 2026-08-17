# Template De Mapa De Lifecycle

<!-- visual-map:start -->

```yaml
visual_map:
  schema_version: "1.0"
  id: "TODO-lifecycle-map-id"
  type: "lifecycle"
  question: "TODO: ¿qué gate o estado debe completarse antes del siguiente?"
  abstraction_level: "TODO: request lifecycle o adoption gate"
  source_refs:
    - "TODO/repo-relative-lifecycle.yaml"
  observed_at: "TODO-YYYY-MM-DD"
  authority_boundary: "Vista derivada; TODO/lifecycle conserva autoridad."
  textual_fallback_required: true
```

```mermaid
flowchart LR
    P["planned [gate]"]
    R["running [gate]"]
    V["validated [gate]"]
    B["blocked [gate]"]
    P -->|"approved start"| R
    R -->|"validation passed"| V
    R -->|"blocking evidence"| B

    classDef planned fill:#e0f2fe,stroke:#0284c7,color:#082f49
    classDef running fill:#fef3c7,stroke:#d97706,color:#451a03
    classDef validated fill:#dcfce7,stroke:#16a34a,color:#052e16
    classDef blocked fill:#fee2e2,stroke:#dc2626,color:#450a0a
    class P planned
    class R running
    class V validated
    class B blocked
```

## Fallback Textual Del Mapa De Lifecycle

```text
planned --approved start--> running
running --validation passed--> validated
running --blocking evidence--> blocked
```

<!-- visual-map:end -->
