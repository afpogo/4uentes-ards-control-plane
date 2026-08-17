## Unknown Request Fixture

<!-- visual-map:start -->
```yaml
visual_map:
  schema_version: "1.0"
  id: "unknown-request-fixture"
  type: "dependency"
  question: "¿Qué request desconocido aparece en el mapa?"
  abstraction_level: "Change request lifecycle."
  source_refs:
    - "requests/planned/CR-SST-0180-integrate-login-sessions-and-timeout-corrections.yaml"
  observed_at: "2026-08-15"
  authority_boundary: "Vista derivada; el lifecycle conserva autoridad."
  textual_fallback_required: true
```
```mermaid
flowchart LR
    A["CR-SST-9999 [planned]"] -->|"depends on"| B["CR-SST-0180 [partial]"]
```
## Fallback Textual
```text
CR-SST-9999 depends on CR-SST-0180.
```
<!-- visual-map:end -->
