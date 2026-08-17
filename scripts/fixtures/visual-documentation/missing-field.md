## Missing Field Fixture

<!-- visual-map:start -->
```yaml
visual_map:
  schema_version: "1.0"
  id: "missing-field-fixture"
  type: "dependency"
  abstraction_level: "Change request lifecycle."
  source_refs:
    - "requests/planned/CR-SST-0180-integrate-login-sessions-and-timeout-corrections.yaml"
  observed_at: "2026-08-15"
  authority_boundary: "Vista derivada; el lifecycle conserva autoridad."
  textual_fallback_required: true
```
```mermaid
flowchart LR
    A["A [confirmed]"] -->|"depends on"| B["B [confirmed]"]
```
## Fallback Textual
```text
A depends on B.
```
<!-- visual-map:end -->
