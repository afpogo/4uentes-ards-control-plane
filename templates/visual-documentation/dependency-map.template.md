# Template De Mapa De Dependencias

<!-- visual-map:start -->

```yaml
visual_map:
  schema_version: "1.0"
  id: "TODO-dependency-map-id"
  type: "dependency"
  question: "TODO: ¿qué depende de qué y en qué dirección?"
  abstraction_level: "TODO: service, repository o request"
  source_refs:
    - "TODO/repo-relative-source.yaml"
  observed_at: "TODO-YYYY-MM-DD"
  authority_boundary: "Vista derivada; TODO/source conserva autoridad."
  textual_fallback_required: true
```

```mermaid
flowchart LR
    A["A [confirmed]"]
    B["B [confirmed]"]
    C["C [planned]"]
    A -->|"depends on"| B
    B -.->|"planned dependency"| C

    classDef confirmed fill:#dbeafe,stroke:#2563eb,color:#172554
    classDef planned fill:#e0f2fe,stroke:#0284c7,color:#082f49
    class A,B confirmed
    class C planned
```

## Fallback Textual Del Mapa De Dependencias

```text
A [confirmed] depends on B [confirmed].
B has a planned dependency on C [planned].
```

<!-- visual-map:end -->
