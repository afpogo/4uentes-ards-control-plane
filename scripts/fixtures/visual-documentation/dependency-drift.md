## Dependency Drift Fixture

<!-- visual-map:start -->
```yaml
visual_map:
  schema_version: "1.0"
  id: "dependency-drift-fixture"
  type: "dependency"
  question: "¿Qué dependency contradice el lifecycle planificado?"
  abstraction_level: "Change request lifecycle."
  source_refs:
    - "requests/planned/CR-CP-0019-implement-visual-documentation-quality-gate.yaml"
    - "requests/planned/CR-CP-0006-roll-out-visual-documentation-policy-to-child-repos.yaml"
  observed_at: "2026-08-15"
  authority_boundary: "Vista derivada; el lifecycle conserva autoridad."
  textual_fallback_required: true
```
```mermaid
flowchart LR
    A["CR-CP-0006 [planned]"]
    B["CR-CP-0019 [validated]"]
    A -->|"backend prerequisite"| B
```
## Fallback Textual
```text
CR-CP-0006 is incorrectly shown as prerequisite of CR-CP-0019.
```
<!-- visual-map:end -->
