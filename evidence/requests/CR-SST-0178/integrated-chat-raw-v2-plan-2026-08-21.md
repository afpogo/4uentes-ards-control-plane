# Plan integral de chat visible y `raw-v2` en development

Este mapa responde qué CR debe completar qué gate antes del cierre integrado de
`CR-SST-0178`. Los request YAML vinculados conservan autoridad; Jira es sólo un
mirror y no existe autorización de escritura en este lifecycle.

<!-- visual-map:start -->

```yaml
visual_map:
  schema_version: "1.0"
  id: "cr-sst-0178-integrated-chat-raw-v2-lifecycle"
  type: "lifecycle"
  question: "¿Qué CR debe completar qué gate antes del QA y cierre integrado de CR-SST-0178?"
  abstraction_level: "request lifecycle"
  source_refs:
    - "requests/running/CR-SST-0178-deploy-sst-chatbot-development-cluster.yaml"
    - "requests/done/CR-SST-0199-route-realtime-socketio-through-development-ingress.yaml"
    - "requests/planned/CR-SST-0200-visible-chat-and-spa-session-repair.yaml"
    - "requests/planned/CR-SST-0201-development-raw-v2-gradual-adoption.yaml"
  observed_at: "2026-08-21"
  authority_boundary: "Vista derivada; los request YAML y la evidencia de validación conservan autoridad."
  textual_fallback_required: true
  request_ids: ["CR-SST-0178", "CR-SST-0199", "CR-SST-0200", "CR-SST-0201"]
```

```mermaid
flowchart TD
    C["CR-SST-0178 coordinación [running]"]
    E["CR-SST-0199 edge realtime [validated]"]
    U["CR-SST-0200 chat y sesión SPA [running]"]
    R["CR-SST-0201 raw-v2 [validated]"]
    Q["QA logout ngrok follow-up [planned]"]
    X["CR-SST-0178 decisión de cierre [gate]"]

    C -->|"coordina"| E
    C -->|"coordina"| U
    E -->|"integración requerida"| R
    U -->|"integración requerida"| R
    R -->|"rollout y observación aprobados"| Q
    Q -->|"ambos entornos pasan"| X
    Q -.->|"cualquier fallo: rollback + evidencia"| C

    classDef running fill:#fef3c7,stroke:#d97706,color:#451a03
    classDef planned fill:#e0f2fe,stroke:#0284c7,color:#082f49
    classDef done fill:#dcfce7,stroke:#16a34a,color:#052e16
    class C,U running
    class Q,X planned
    class E,R done
```

## Fallback textual del mapa de lifecycle

```text
CR-SST-0199 y CR-SST-0201 están done tras QA público.
CR-SST-0200 permanece running por el follow-up del teardown de logout.
CR-SST-0178 permanece running hasta que el retest público confirme cero requests autenticadas posteriores al logout.
```

<!-- visual-map:end -->

## Límites fijados

- Alcance exclusivo de development; producción, extensión y mobile quedan fuera.
- `sst-bend` conserva conversación y persistencia; `sst-chatbot` no recibe Ingress.
- `CR-SST-0159` permanece `running` por password recovery.
- `CR-SST-0182` conserva coordinación cross-tab.
- No se escribirá en Jira sin un lote enumerado independiente.
