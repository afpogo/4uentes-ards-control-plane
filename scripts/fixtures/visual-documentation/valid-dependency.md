## Valid Dependency Fixture

<!-- visual-map:start -->

```yaml
visual_map:
  schema_version: "1.0"
  id: "valid-dependency-fixture"
  type: "dependency"
  question: "¿Qué request es prerequisite del siguiente?"
  abstraction_level: "Change request lifecycle."
  source_refs:
    - "requests/planned/CR-CP-0018-define-visual-documentation-as-code-profile.yaml"
    - "requests/planned/CR-CP-0019-implement-visual-documentation-quality-gate.yaml"
  observed_at: "2026-08-15"
  authority_boundary: "Vista derivada; el lifecycle conserva autoridad."
  textual_fallback_required: true
```

```mermaid
flowchart LR
    A["CR-CP-0018 [validated]"]
    B["CR-CP-0019 [validated]"]
    A -->|"baseline reutilizable"| B
    classDef partial fill:#fef3c7,stroke:#d97706,color:#451a03
    classDef planned fill:#e0f2fe,stroke:#0284c7,color:#082f49
    class A partial
    class B planned
```

## Fallback Textual

```text
CR-CP-0018 provides the profile prerequisite required by CR-CP-0019.
```

<!-- visual-map:end -->
