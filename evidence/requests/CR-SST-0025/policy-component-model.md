# CR-SST-0025 - Policies Como Parte Principal ARDS/SDD

Observado el: 2026-06-02

## Decision

`policies` pasan a ser una parte principal e identificable del ARDS/SDD, junto
con `capabilities`, `states`, `requests`, `evidence`, `catalog` y `solutions`.

Una `capability` dice que puede producir o consumir un repo. Una `policy` dice
bajo que reglas se puede planificar, ejecutar, validar, aceptar, excepcionar o
escalar ese trabajo.

## Partes Identificables

### `policy_definition`

Define la identidad estable de la regla.

Campos minimos:

- `policy_id`;
- `policy_class`;
- `title`;
- `status`;
- `scope`;
- `rule`.

### `policy_source`

Declara autoridad y proveniencia.

Campos minimos:

- `source_repo`;
- `source_path`;
- `source_version`;
- `source_status`;
- `owner`.

### `policy_adoption`

Declara como un repo adopta la policy.

Campos minimos:

- `adopting_repo`;
- `adoption_status`;
- `local_implementation_path`;
- `validation_ref`.

### `policy_enforcement`

Declara como se aplica o valida la policy.

Campos minimos:

- `enforcement_mode`;
- `check_ref`;
- `failure_behavior`.

### `policy_exception`

Declara gaps, waivers o desviaciones temporales.

Campos minimos:

- `exception_status`;
- `owner`;
- `reason`;
- `expires_at`;
- `closure_plan`.

### `policy_evidence`

Prueba adopcion, validacion, excepcion o handoff.

Campos minimos:

- `evidence_ref`;
- `observed_at`;
- `result`.

### `policy_state_link`

Relaciona policies con state, requests, capabilities o adopciones por repo.

Campos minimos:

- `policy_id`;
- `state_kind`;
- `state_id`;
- `state_file`;
- `link_status`.

## Relacion Con Capabilities

```text
capability
  publishes or consumes behavior

policy
  constrains, authorizes, classifies, validates, or exceptions behavior
```

Un ejemplo:

- `capability.inbound.sst-chatbot-agent-handoff` modela el handoff.
- `orchestrator-link` exige metadata de reconciliacion.
- `capability-state-linkage` exige enlace con `feature_state`.
- `model-selection` exige `task_weight`, `model_selection` y
  `subagent_deployment_plan` cuando el trabajo se planifica.
- `human-doc-language` exige evidencia humana en espanol y capa tecnica estable
  en ingles.

## Artifacts Creados

- `specs/policies/00-index.yaml`
- `specs/policies/ards-sdd-policy-component-model.yaml`
- `state/policy-links.yaml`

## Handoff A Core

El core debe recibir este modelo como parte principal ARDS/SDD:

- tipo `policy_definition`;
- tipo `policy_adoption`;
- tipo `policy_exception`;
- tipo `policy_state_link`;
- enum de `policy_class`;
- enum de `adoption_status`;
- source validation para policies universales;
- adopcion de `human-doc-language` como policy reusable originada en el
  orquestador.

## Boundary

No se modificaron repos hijos ni `4uentes-core`.

El orquestador define el modelo operativo local y prepara el handoff. El core
debe canonizar lo reusable para que otros ARDS/SDD escalen sobre el mismo
contrato.
