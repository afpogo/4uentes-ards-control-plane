---
artifact_type: ards_audit_report
audit_template_id: ARDS-CONTROL-PLANE-AUDIT-001
audit_template_version: 0.3.0
target_type: control_plane_repository
target_repository: C:\Users\andre\Desktop\4uentes\apps\4uentes-orchestor
target_commit: fb7208e874f4f89c07a38fe4368739e10ff7c20f
generated_at: 2026-06-25T23:36:05-03:00
report_path: C:\Users\andre\Desktop\4uentes\apps\4uentes-orchestor\.ards\audits\control-plane\20260625-233605\control-plane-audit-and-adoption.md
adoption_handoff: ready
---

# 1. Veredicto ejecutivo

- `overall_status`: `control_plane_partial`
- `observed_mode`: `enforced`
- `confidence`: `high`
- Solutions observadas: `sst`

El repositorio auditado opera como Control Plane ARDS/SDD real para la Solution `sst`: mantiene catálogo canónico de 6 servicios, modelo de Solution, lifecycle documental de CRs, State consolidado, Capability links, policy links, Evidence por request y validadores determinísticos (`npm run check`, exit code 0). No es solo un catálogo.

No alcanza conformidad plena porque el request lifecycle principal está declarado como `documented_only`, no hay enforcement completo de transiciones `inbox -> planned -> queued -> running -> done`, existen State entries en `validated-local` sin `request_ids` ni `evidence_refs`, las observaciones de remotos no fueron verificables por Git en el entorno auditado, y el runtime real de handoff `sst-chatbot -> 4uentes-orchestor` sigue en `draft`. Hay ejecución externa gobernada para Jira en scripts/playbooks, pero no runtime productivo general; las acciones críticas se tratan con gates y evidencia, aunque el control de retry/idempotencia/reconciliación no está completo para todos los caminos.

El handoff de adopción queda `ready`: la siguiente mejora óptima es formalizar enforcement del lifecycle y cerrar los State gaps antes de promover runtime.

# 2. Mapa del sistema gobernado

| Solution | Service | Rol | Capabilities principales | Estado de sync |
|---|---|---|---|---|
| `sst` | `sst-fend` | `core`, frontend SPA | Consumo BFF/auth, UI SST | Catalogado, `orchestrator_link_contract.status: adopted`; remote no observable en `npm run check` |
| `sst` | `sst-bend` | `core`, API | `dictionary-*`, `sst-tags-governance`, `article-tags`, `sst-tag-prefix-engine` | Catalogado y relacionado con State; related repo confirma adopción de `orchestrator_link`; remote no observable |
| `sst` | `4uentes-auth` | `shared`, auth/BFF | Auth/BFF compartido, `tag-prefix-engine-preview` | Catalogado como shared; legacy alias `node-auth` separado; remote no observable |
| `sst` | `sst-extension` | `optional`, browser extension | Cliente opcional SST | Catalogado como `optional-active`; remote no observable |
| `sst` | `sst-chatbot` | `optional`, agent runtime | `capability.inbound.sst-chatbot-agent-handoff`, agent derivations | Catalogado, reconciliado por CR-SST-0082; inbound capability sigue `draft`; transporte runtime no implementado |
| `sst` | `sst-4uentes-infra` | `infrastructure`, GitOps | Deploys frontend/backend/auth | Catalogado como infra; remote no observable |
| `sst` | `4uentes-orchestor` | Control Plane | Catálogo, planning, State, Evidence, Jira sync, handoffs | Target auditado; `npm run check` pasa con warnings |

# 3. Lifecycle reconstruido

```text
Intención -> Clasificación -> INIT -> CR -> Impacto -> Policies -> Plan ->
Ejecución -> Validación -> Evidence -> State -> Decisión
```

| Etapa | Estado observado | Tipo | Evidencia |
|---|---|---|---|
| Intención | Existe en `requests/inbox/*.yaml` | Documental estructurado | 79 archivos inbox observados |
| Clasificación | Existe en requests planificados con `risk`, `task_weight`, `model_selection` | Determinística + manual | `requests/planned/CR-SST-0083...yaml:68-103` |
| INIT | No hay unidad INIT explícita consistente; se agrupa por CRs y feature State | Parcial | Ausencia de directorio/modelo INIT; CRs multi-CR en State |
| CR | Existe con carpetas `inbox`, `planned`, `done`, `rejected` | Documental estructurado | `docs/requests/execution-model.md:21-40`; conteo: 79 inbox, 77 planned, 62 done, 1 rejected |
| Impacto | Existe en planned CRs | Determinístico parcial | `requests/planned/CR-SST-0083...yaml:28-50`; `scripts/plan-change.js:96-113` |
| Policies | Existen policy registry, policy links y gates | Parcialmente determinístico | `state/policy-links.yaml:1-16`; `state/jira-backlog-sync-machine.yaml:59-69` |
| Plan | Existe en `requests/planned` y `scripts/plan-change.js` | Determinístico parcial, escribe planned output | `docs/requests/execution-model.md:95-111`; `scripts/plan-change.js:115` |
| Ejecución | No hay `queued` ni `running`; hay `done` y scripts de Jira/operación | Manual/gobernada, no runtime general | `requests` count: queued 0, running 0; `package.json` scripts Jira |
| Validación | Existe `npm run check`; checks de hijos no se ejecutan desde planner | Determinística parcial | `npm run check`, exit 0; `docs/requests/execution-model.md:113-123` |
| Evidence | Existe por request | Documental + outputs | 80 directorios `evidence/requests`; `docs/requests/execution-model.md:125-132` |
| State | Existe read model consolidado | Determinístico parcial | `state/00-index.yaml:1-28`; `state/state-machine.yaml:39-65` |
| Decisión | Existe en CRs `done`, `rejected`, `pending` | Manual trazable | `requests/rejected/CR-SST-0028...yaml:46-49`; `requests/planned/CR-SST-0083...yaml:118-120` |

# 4. Evaluación de boundaries

- Core vs Control Plane: boundary mayormente correcto. `AGENTS.md` declara que consume `4uentes-ards-core` y no lo redefine (`AGENTS.md:8-15`). `specs/ards/contract-binding.yaml:5-13` identifica `ards-core-contract-v0.1` y `core_ref`. Riesgo: `state/policy-links.yaml:6-37` mantiene policies `core-required` con `pending-core-handoff`, por lo que hay gaps explícitos entre canon y adopción.

- Control Plane vs Service: boundary mayormente correcto. El target modela servicios, no contiene runtime de negocio final. `docs/requests/execution-model.md:109-111` indica que el planner no modifica repos funcionales ni ejecuta checks de ellos. `AGENTS.md` prohíbe tocar repos funcionales sin request. Related `sst-bend/AGENTS.md:508-516` confirma adopción de gobierno por `4uentes-orchestor`.

- Control Plane vs Agent: boundary correcto y explícito. `docs/cross-repo/orchestrator-boundary.md:10-27` establece que `sst_chatbot` propone y `4uentes-orchestor` acepta/rechaza/planifica. `specs/capabilities/inbound/4uentes-orchestor--sst-chatbot-agent-handoff.yaml:35-39` exige payload estructurado y autoridad del orchestrator.

- Control Plane vs Runtime: parcial. El handoff runtime real sigue en `draft` y sin transporte implementado (`docs/cross-repo/sst-chatbot-orchestrator-handoff.md:54-58`). Hay scripts y state machine para Jira con gates (`state/jira-backlog-sync-machine.yaml:70-84`, `125-151`), pero no constituyen runtime general ni enforcement completo del lifecycle.

- Desired state vs observed evidence: parcial. Hay buena distinción documental (`docs/requests/execution-model.md:37-40`; `evidence/requests/CR-SST-0083/validation-results.md:28-32`), pero dos bugfix states declaran `validated-local` sin evidence ni request (`state/bugfixes/login-504-proxy-timeout.current.yaml:15-19`; `state/bugfixes/sst-bend-emfile-watchers.current.yaml:14-18`).

# 5. Resumen por dimensión

| Dimensión | Estado | Evidencia principal | Riesgo |
|---|---|---|---|
| A. Identidad, catálogo y Solutions | `compliant` | `solutions/sst.yaml:1-50`; 6 service files; `npm run check` OK | Bajo |
| B. Core y canon | `partial` | `specs/ards/contract-binding.yaml:5-13`; `state/policy-links.yaml:6-37` | Medio |
| C. Intake, INIT y CR | `partial` | `docs/requests/execution-model.md:21-56`; ausencia de INIT formal | Medio |
| D. Impacto, riesgo, policies y planificación | `partial` | `requests/planned/CR-SST-0083...yaml:28-120`; `scripts/plan-change.js` | Medio |
| E. Capabilities y dependencias | `partial` | `state/capability-links.yaml:46-64`, `106-169` | Medio |
| F. Evidence, State y continuidad | `partial` | `state/00-index.yaml`; warnings de State en `npm run check` | Alto |
| G. Sync, reconciliación y drift | `partial` | `state/jira-backlog-sync-machine.yaml`; remote no observable | Medio |
| H. Agent Governance | `partial` | `docs/cross-repo/orchestrator-boundary.md:99-128`; inbound capability draft | Medio |
| I. Runtime gobernado | `partial` | Jira state machine y scripts; chatbot runtime no implementado | Alto |
| J. Límites y autoprotección | `partial` | `AGENTS.md`; `npm run check`; validators string-based | Medio |

# 6. Hallazgos priorizados

```yaml
id: FINDING-CP-001
control_ids: [CP-13, CP-16, CP-22, CP-56]
type: fact
status: partial
severity: high
confidence: high
title: "El request lifecycle principal existe pero está declarado como document-only y no se observan queued/running"
evidence:
  - kind: file
    reference: "state/state-machine.yaml:39-61"
    detail: "request_lifecycle.documented_only: true; las referencias del lifecycle V1 no están estrictamente enforced."
  - kind: file
    reference: "docs/requests/execution-model.md:37-40"
    detail: "`planned` no significa aprobado ni ejecución."
  - kind: command
    reference: "Get-ChildItem requests -Directory ...; exit 0"
    detail: "queued: 0, running: 0, planned: 77, done: 62."
impact: "El Control Plane puede planificar y cerrar documentalmente, pero no demuestra enforcement completo de transiciones ni separación ejecutable entre aprobado, en ejecución y cerrado."
minimum_remediation: "Introducir enforcement no mutante del lifecycle: validación de transiciones, presencia de approval para queued/running/done y consistencia entre carpeta, status y Evidence."
suggested_change_unit: INIT
```

```yaml
id: FINDING-CP-002
control_ids: [CP-29, CP-31, CP-32, CP-34, CP-39]
type: fact
status: non_compliant
severity: high
confidence: high
title: "Dos State entries declaran validated-local sin request_ids ni evidence_refs"
evidence:
  - kind: command
    reference: "npm run check; exit 0"
    detail: "verify-state-model emitió 4 WARN: dos bugfix states sin request_ids y sin evidence_refs."
  - kind: file
    reference: "state/bugfixes/login-504-proxy-timeout.current.yaml:15-19"
    detail: "request_ids: [], validation_refs: [], evidence_refs: [] con status validated-local."
  - kind: file
    reference: "state/bugfixes/sst-bend-emfile-watchers.current.yaml:14-18"
    detail: "request_ids: [], validation_refs: [], evidence_refs: [] con status validated-local."
impact: "El State consolidado contiene cumplimiento declarado no respaldado por Evidence suficiente, lo que rompe continuidad auditable para esos bugfixes."
minimum_remediation: "Normalizar esos bugfixes como reconciliación retroactiva: crear CRs históricos o degradar status hasta que exista Evidence suficiente."
suggested_change_unit: CR-CONTROL-PLANE
```

```yaml
id: FINDING-CP-003
control_ids: [CP-18, CP-23, CP-24, CP-25, CP-26, CP-28, CP-36]
type: fact
status: partial
severity: medium
confidence: high
title: "Capabilities y State están enlazados, pero el verificador no prueba contratos ni consumidores afectados de forma completa"
evidence:
  - kind: file
    reference: "state/capability-links.yaml:56-64"
    detail: "Existe link para capability.inbound.sst-chatbot-agent-handoff."
  - kind: file
    reference: "state/capability-links.yaml:106-124"
    detail: "Se distinguen `pending-child-adoption` y `linked` para SST tags."
  - kind: command
    reference: "npm run check; exit 0"
    detail: "verify-state-model valida 16 capability links, pero no ejecuta checks cross-repo completos."
impact: "Un cambio de capability puede orientarse, pero la detección de consumidores, checks requeridos y drift contractual sigue parcialmente documental."
minimum_remediation: "Extender el verificador para comprobar existencia de spec refs, producer/consumer, contrato, state_file, evidence_ref y checks requeridos por capability."
suggested_change_unit: CR-CONTROL-PLANE
```

```yaml
id: FINDING-CP-004
control_ids: [CP-36, CP-37, CP-38, CP-40]
type: fact
status: partial
severity: medium
confidence: high
title: "La sincronización detecta drift local, pero los remotos de servicios no fueron observables"
evidence:
  - kind: command
    reference: "npm run check; exit 0"
    detail: "verify-local-bindings reportó 6 WARN: remote could not be observed."
  - kind: file
    reference: "catalog/services/sst-bend.yaml:15-18"
    detail: "head_observed y working_tree_observed datan de 2026-05-26."
  - kind: file
    reference: "state/00-index.yaml:4"
    detail: "updated_at: 2026-05-28, aunque existen State files actualizados posteriormente."
impact: "El Control Plane puede estar gobernando contra snapshots locales viejos o remotos no observados; el drift se registra, pero no se cierra automáticamente."
minimum_remediation: "Separar último snapshot observado, última verificación local y último remote observation; fallar o elevar severidad cuando el dato sea más viejo que el State gobernado."
suggested_change_unit: CR-CONTROL-PLANE
```

```yaml
id: FINDING-CP-005
control_ids: [CP-46, CP-47, CP-48, CP-49, CP-50, CP-52]
type: fact
status: partial
severity: high
confidence: high
title: "El runtime de handoff sst-chatbot sigue en draft; el adapter fake está correctamente diferenciado"
evidence:
  - kind: file
    reference: "specs/capabilities/inbound/4uentes-orchestor--sst-chatbot-agent-handoff.yaml:5"
    detail: "status: draft."
  - kind: file
    reference: "docs/cross-repo/sst-chatbot-orchestrator-handoff.md:54-58"
    detail: "El transporte real sigue sin selección implementada; HTTP, queue y worker siguen como opciones abiertas."
  - kind: file
    reference: "requests/done/CR-SST-0022-local-fake-orchestrator-handoff-adapter.yaml:10-13"
    detail: "El adapter fake local se declara como proposal-only con idempotency behavior."
  - kind: file
    reference: "evidence/requests/CR-SST-0083/validation-results.md:28-32"
    detail: "HTTP ingress sigue como decisión arquitectónica hasta definir endpoint, auth, idempotency, audit metadata y mapping."
impact: "No hay falsa promoción del runtime, pero no se puede evaluar conformidad runtime completa hasta implementar transporte, autorización, retry, audit trail y reconciliación."
minimum_remediation: "Mantener capability en draft y abrir CR específico para contrato HTTP ingress con auth, idempotency, audit, retry, failure modes y reconciliación post-ejecución."
suggested_change_unit: CR-CONTROL-PLANE
```

```yaml
id: FINDING-CP-006
control_ids: [CP-07, CP-09, CP-10, CP-11, CP-55]
type: fact
status: partial
severity: medium
confidence: medium
title: "La adopción del Core está trazada, pero persisten handoffs pendientes y ambigüedad nominal Core"
evidence:
  - kind: file
    reference: "specs/ards/contract-binding.yaml:5-13"
    detail: "El Control Plane consume ards-core-contract-v0.1 con core_ref 4uentes-ards-core@2ad4e0f."
  - kind: file
    reference: "state/policy-links.yaml:6-37"
    detail: "Policies core-required están en pending-core-handoff."
  - kind: file
    reference: "requests/done/CR-SST-0077-sst-policy-adoption-sync-rollout.yaml:90-94"
    detail: "Se acepta gap de naming entre 4uentes-core y 4uentes-ards-core y handoff pendiente de human-doc-language."
impact: "El canon no parece redefinido silenciosamente, pero la adopción no está completamente cerrada ni reconciliada con todos los gaps."
minimum_remediation: "Formalizar decisión de naming Core y cerrar/promover handoffs pendientes como CR-CORE o registrar excepciones explícitas."
suggested_change_unit: CR-CORE
```

```yaml
id: FINDING-CP-007
control_ids: [CP-12, CP-14, CP-41, CP-44, CP-45]
type: inference
status: partial
severity: medium
confidence: medium
title: "Los handoffs de agente tienen contrato documental, pero no se observó schema ejecutable validado para payloads"
evidence:
  - kind: file
    reference: "docs/cross-repo/orchestrator-boundary.md:99-116"
    detail: "Payload mínimo documentado con idempotency_key y correlation_id."
  - kind: file
    reference: "specs/capabilities/inbound/4uentes-orchestor--sst-chatbot-agent-handoff.yaml:75-101"
    detail: "Campos requeridos de handoff_payload y agent_result."
  - kind: absence
    reference: "scripts/ y specs/ inspeccionados"
    detail: "No se observó validator ejecutable específico de operation_intent/handoff_payload dentro del check principal."
impact: "La forma contractual existe, pero agentes futuros podrían producir payloads aceptados documentalmente sin validación determinística integrada."
minimum_remediation: "Agregar schema machine-readable y check no mutante para handoff_payload/agent_result; enlazarlo a `npm run check`."
suggested_change_unit: CR-CONTROL-PLANE
```

# 7. Matriz completa de controles

| ID | Nivel | Estado | Evidencia | Nota |
|---|---|---|---|---|
| CP-01 | MUST | `compliant` | `catalog/services/*.yaml`; `npm run check` OK | 6 servicios descubiertos |
| CP-02 | MUST | `compliant` | `solutions/sst.yaml:1-14` | Solution lógica `sst`, no solo lista plana |
| CP-03 | MUST | `compliant` | `solutions/sst.yaml:15-41` | Relaciones explícitas |
| CP-04 | MUST | `compliant` | `catalog/services/4uentes-auth.yaml:9-23` | `node-auth` como alias/evidencia local |
| CP-05 | MUST | `compliant` | `environments/local/bindings.local.yaml:3-5`; `README.md` | Paths separados del catálogo estable |
| CP-06 | MUST | `compliant` | `specs/ards/contract-binding.yaml:5-13` | Core contract identificado |
| CP-07 | MUST | `partial` | `AGENTS.md:8-15`; `state/policy-links.yaml:6-37` | Consume Core, pero handoffs pendientes |
| CP-08 | MUST | `partial` | `state/policy-links.yaml`; `state/capability-links.yaml`; `docs/cross-repo/orchestrator-boundary.md` | Instancias operativas parciales |
| CP-09 | MUST | `compliant` | `specs/ards/contract-binding.yaml`; service `orchestrator_link_contract` | Binding/adopción existe |
| CP-10 | MUST | `compliant` | `requests/done/CR-SST-0077...yaml:90-94` | Gaps visibles |
| CP-11 | SHOULD | `partial` | `state/policy-links.yaml:13-37` | Handoffs pendientes, no todos cerrados |
| CP-12 | MUST | `partial` | `requests/inbox`, templates, `docs/requests/execution-model.md` | Estructura existe; schema enforcement incompleto |
| CP-13 | MUST | `partial` | `state/state-machine.yaml:39-61` | Estados/transiciones documentales |
| CP-14 | MUST | `partial` | `requests/planned/CR-SST-0083...yaml:28-120` | CR conecta impacto/riesgo/plan; no uniforme verificable en todos |
| CP-15 | MUST | `partial` | Ausencia de INIT formal | Hay agrupación por State/CR, no INIT explícito |
| CP-16 | MUST | `partial` | `requests/rejected/CR-SST-0028...yaml:46-49`; `requests/planned/CR-SST-0083...yaml:118-120` | Decisiones trazables, enforcement incompleto |
| CP-17 | SHOULD | `compliant` | `docs/requests/execution-model.md:52-56`; `requests/done/CR-SST-0082...yaml:18-22` | Reconciliación retroactiva explícita |
| CP-18 | MUST | `compliant` | `requests/planned/CR-SST-0083...yaml:28-50` | Impacto registrado |
| CP-19 | MUST | `compliant` | `requests/planned/CR-SST-0083...yaml:68-80` | Riesgo proporcional |
| CP-20 | MUST | `partial` | `state/policy-links.yaml`; `state/jira-backlog-sync-machine.yaml:59-69` | Policies antes de escritura Jira; generalización incompleta |
| CP-21 | MUST | `compliant` | `requests/planned/CR-SST-0083...yaml:52-66` | Contexto/checks requeridos |
| CP-22 | MUST | `compliant` | `docs/requests/execution-model.md:37-40` | Boundary plan/ejecución explícito |
| CP-23 | SHOULD | `partial` | `scripts/plan-change.js`; `npm run check` | Determinismo parcial |
| CP-24 | MUST | `compliant` | `state/capability-links.yaml:1-169` | Registro operativo |
| CP-25 | MUST | `partial` | `state/capability-links.yaml` | Productor/estado/link sí; contrato/validación no siempre completo |
| CP-26 | MUST | `partial` | `state/capability-links.yaml`; `requests/planned` | Afectados identificables parcialmente |
| CP-27 | MUST | `compliant` | `specs/capabilities/inbound/...yaml:5`; `state/capability-links.yaml:112-132` | Draft/pending/orphan diferenciados |
| CP-28 | SHOULD | `partial` | `verify-state-model` output | Verifica links, no contratos cross-repo completos |
| CP-29 | MUST | `partial` | 80 evidence dirs; bugfixes sin evidence | Evidencia amplia, gaps puntuales altos |
| CP-30 | MUST | `compliant` | `state/00-index.yaml`; feature states | State consolidado existe |
| CP-31 | MUST | `non_compliant` | `state/bugfixes/*.current.yaml` sin evidence | State relevante sin Evidence suficiente |
| CP-32 | MUST | `partial` | `docs/requests/execution-model.md:127-132`; CR-SST-0083 evidence | Buena regla, incumplimientos puntuales |
| CP-33 | MUST | `compliant` | State statuses `implemented-local`, `validated-local`, `draft`, `rejected` | Distinción presente |
| CP-34 | MUST | `partial` | `state/00-index.yaml`; warnings | Retomable salvo states sin evidence |
| CP-35 | SHOULD | `compliant` | `state/00-index.yaml`; `state/capability-links.yaml`; `state/policy-links.yaml` | Read models existen |
| CP-36 | MUST | `partial` | `npm run check`; `contract-binding`; child sync diffs | Comparación parcial |
| CP-37 | MUST | `compliant` | `accepted_gaps`, `open_gaps`, `pending-child-adoption` | Drift visible |
| CP-38 | MUST | `partial` | `catalog/services/* observed_at`; warnings remote | Edad visible, no enforcement suficiente |
| CP-39 | MUST | `partial` | `docs/requests/jira-status-signal-approval-intake-flow.md:30-46` | Regla existe; State gaps contradicen |
| CP-40 | SHOULD | `partial` | `npm run check`; Jira doctors | Checks invocables, no periódicos observados |
| CP-41 | MUST | `partial` | `docs/cross-repo/orchestrator-boundary.md:99-116` | Contrato documentado, schema executable no observado |
| CP-42 | MUST | `compliant` | `docs/cross-repo/orchestrator-boundary.md:10-27` | Autoridad del Control Plane |
| CP-43 | MUST | `compliant` | `docs/cross-repo/orchestrator-boundary.md:39-45`, `118-128` | Agente sin autoridad implícita |
| CP-44 | MUST | `partial` | Inbound capability required fields | Alcance definido, validación incompleta |
| CP-45 | SHOULD | `partial` | CRs con requester, model_selection, subagent plan | Actor/modelo no uniforme en todos |
| CP-46 | CONDITIONAL-MUST | `partial` | `state/jira-backlog-sync-machine.yaml`; chatbot transport draft | Jira transport documentado; chatbot no |
| CP-47 | CONDITIONAL-MUST | `partial` | `state/jira-backlog-sync-machine.yaml:59-84`; CR-SST-0083 residual risks | Auth/idempotency/retry incompletos para runtime futuro |
| CP-48 | CONDITIONAL-MUST | `partial` | Evidence Jira/CR dirs | Audit trail existe para scripts observados |
| CP-49 | CONDITIONAL-MUST | `partial` | `state/jira-backlog-sync-machine.yaml:132-151` | Reconciliación modelada para Jira, no general |
| CP-50 | CONDITIONAL-MUST | `partial` | `docs/cross-repo/orchestrator-boundary.md:76-82` | Mínimo privilegio conceptual; enforcement parcial |
| CP-51 | CONDITIONAL-MUST | `compliant` | `state/jira-backlog-sync-machine.yaml:64-65`, `125-131` | Write gate humano |
| CP-52 | CONDITIONAL-MUST | `compliant` | `requests/done/CR-SST-0022...yaml:10-13`; `CR-SST-0082...yaml:63-66` | Fake/local claramente distinguido |
| CP-53 | MUST | `compliant` | Estructura repo: docs/catalog/state/scripts; no product runtime code observado | No contiene lógica final de servicios |
| CP-54 | MUST | `partial` | `AGENTS.md`; CRs con functional_repositories_modified | Regla existe; ejecución real depende de operadores |
| CP-55 | MUST | `compliant` | `AGENTS.md:8-15`; Core binding | No reemplaza Core silenciosamente |
| CP-56 | MUST | `compliant` | `npm run check`, exit 0 | Validación no mutante principal |
| CP-57 | MUST | `partial` | `scripts/verify-catalog.js` usa parsing regex/string | Determinístico, pero parser YAML parcial |
| CP-58 | SHOULD | `partial` | Jira guards `no_secret_material`; local bindings ignored | Mínimo privilegio documentado, no auditado extremo a extremo |

# 8. Drift detectado

## Core - Control Plane

- `specs/ards/contract-binding.yaml:8-9` fija `ards-core-contract-v0.1` y `4uentes-ards-core@2ad4e0f`.
- `state/policy-links.yaml:6-37` mantiene policies `core-required` con `pending-core-handoff`.
- `requests/done/CR-SST-0077...yaml:90-94` reconoce gap de naming entre `4uentes-core` y `4uentes-ards-core` y handoff pendiente de `human-doc-language`.

## Control Plane - Service

- `sst-bend` related repo confirma adopción: `sst-bend/AGENTS.md:508-516` y `sst-bend/specs/00-index.yaml:69-75`.
- Catálogo del target aún conserva observaciones de working tree de 2026-05-26 en varios servicios, con dirty trees.
- `npm run check` no pudo observar remotos para seis bindings locales.

## Declarado - Observado

- `state/bugfixes/login-504-proxy-timeout.current.yaml` y `state/bugfixes/sst-bend-emfile-watchers.current.yaml` declaran `validated-local` sin request/evidence.
- `state/features/sst-chatbot.current.yaml:44-51` referencia Evidence de CR-SST-0083 que existe, pero el CR sigue `planned` con decisión `pending` (`requests/planned/CR-SST-0083...yaml:118-120`). Esto es aceptable si se interpreta como evidencia de planificación, no de ejecución runtime.

## Catálogo/State obsoleto

- `state/00-index.yaml:4` indica `updated_at: 2026-05-28`, aunque hay feature states actualizados al 2026-06-24.
- `state/capability-links.yaml:4` indica `updated_at: 2026-06-13`, aunque hay evidencia posterior de CR-SST-0083 y CR-SST-0084.

## Adapter draft/fake presentado como productivo

- No se detectó falsa promoción. El inbound handoff está `draft` (`specs/capabilities/inbound/...yaml:5`) y la documentación mantiene el adapter fake como test/local (`requests/done/CR-SST-0022...yaml:10-13`; `requests/done/CR-SST-0082...yaml:63-66`).

# 9. Backlog de remediación propuesto

1. `INIT-CONTROL-PLANE-LIFECYCLE-ENFORCEMENT`: definir enforcement incremental para lifecycle, sin runtime productivo.
2. `CR-CONTROL-PLANE-STATE-EVIDENCE-GAPS`: reconciliar o degradar los dos bugfix states sin Evidence.
3. `CR-CONTROL-PLANE-READ-MODEL-FRESHNESS`: actualizar `state/00-index.yaml`, `state/capability-links.yaml` y reglas de freshness.
4. `CR-CONTROL-PLANE-CAPABILITY-LINK-VALIDATOR`: extender `verify-state-model` para validar producer/consumer/contract/evidence/check refs.
5. `CR-CONTROL-PLANE-HANDOFF-SCHEMA-CHECK`: agregar schema ejecutable para `operation_intent`, `handoff_payload` y `agent_result`.
6. `CR-CORE-CONTRACT-NAMING-DECISION`: cerrar la ambigüedad `4uentes-core` vs `4uentes-ards-core` y handoffs core pendientes.
7. `CR-CONTROL-PLANE-RUNTIME-HTTP-INGRESS-CONTRACT`: solo después de cerrar gaps de lifecycle/State, diseñar endpoint/auth/idempotency/audit/retry/reconcile para `sst-chatbot`.

# 10. Evidencia positiva y preguntas abiertas

## Evidencia positiva

- `npm run check` ejecutó `verify-catalog`, `verify-local-bindings --optional` y `verify-state-model`; exit code 0.
- El catálogo separa identities estables de aliases y paths locales (`solutions/sst.yaml:47-50`; `catalog/services/4uentes-auth.yaml:48`).
- El Core consumido está declarado con contrato y ref (`specs/ards/contract-binding.yaml:5-13`).
- El lifecycle distingue explícitamente planning de ejecución (`docs/requests/execution-model.md:37-40`).
- El Control Plane conserva Evidence por request y decisiones de rechazo/cierre.
- El handoff de agente no concede autoridad implícita a `sst-chatbot` (`docs/cross-repo/orchestrator-boundary.md:39-45`).
- El adapter fake no se presenta como productivo.
- Jira se trata como mirror operativo, no source of truth (`state/jira-backlog-sync-machine.yaml:6-9`, `152-158`).

## Preguntas abiertas

- ¿Debe existir una unidad formal `INIT` separada de CRs y State para transformaciones multi-CR?
- ¿Cuál es la decisión canónica final sobre naming `4uentes-core` vs `4uentes-ards-core`?
- ¿Qué nivel de enforcement se espera antes de permitir `queued`/`running` en requests?
- ¿El target debe gobernar solo `sst` o incorporar oficialmente otras Solutions como `fulbito`?
- ¿Qué transporte runtime se aprobará para `sst-chatbot`: HTTP ingress, queue u otro mecanismo?

# Handoff para adopción por humano + agente IA constructor

## Objetivo de adopción

Llevar el Control Plane desde `control_plane_partial` a `control_plane_conformant_with_observations` sin implementar runtime productivo todavía: lifecycle verificable, State sin declaraciones no respaldadas, Capability links validados, drift/freshness visible y handoffs de agente con schema ejecutable.

## Brecha resumida

El repo ya gobierna `sst` con catálogo, CRs, Evidence, State y checks. La brecha principal es enforcement: el lifecycle está documentado pero no estrictamente validado, hay State sin Evidence, los read models tienen timestamps obsoletos, y el handoff runtime sigue en `draft`.

## Secuencia recomendada

| Orden | Unidad | Alcance | Criterios de aceptación | Evidence requerida | Aprobación |
|---|---|---|---|---|---|
| 1 | `INIT` | Lifecycle + State evidence enforcement | INIT creado; CRs hijos definidos; no muta servicios | Documento INIT, matriz de gaps, plan de CRs | Requerida |
| 2 | `CR-CONTROL-PLANE` | `state/bugfixes/login-504-proxy-timeout.current.yaml`, `state/bugfixes/sst-bend-emfile-watchers.current.yaml` | Cada State tiene `request_ids` y `evidence_refs`, o status degradado | `npm run check`, evidence de reconciliación | Requerida |
| 3 | `CR-CONTROL-PLANE` | `state/00-index.yaml`, `state/capability-links.yaml`, `state/policy-links.yaml` | Freshness consistente; warnings explicados o elevados | Check de freshness, changed-files summary | Requerida |
| 4 | `CR-CONTROL-PLANE` | `scripts/verify-state-model.js`, `state/capability-links.yaml`, specs capability | Validator comprueba producer/consumer/contract/state/evidence/check refs | `npm run check`, fixture o reporte de links | Requerida |
| 5 | `CR-CONTROL-PLANE` | `specs/capabilities/inbound/...`, nuevo schema/check handoff | Payloads de handoff validables por comando no mutante | Check de schema, ejemplos válidos/invalidos | Requerida |
| 6 | `CR-CORE` | Core naming y pending handoffs | Decisión explícita o excepción registrada | Core decision record, updated binding | Requerida |
| 7 | `CR-CONTROL-PLANE` | Runtime HTTP ingress contract, sin implementación productiva | Contrato define auth, idempotency, retry, audit, reconcile, failure modes | Design doc, risk review, acceptance criteria | Requerida |

## Policies y guardrails aplicables

- No modificar repos funcionales desde adopción del Control Plane sin CR aprobado.
- No promover `capability.inbound.sst-chatbot-agent-handoff` fuera de `draft` hasta tener implementación verificable.
- Mantener `planned` separado de `queued`, `running` y `done`.
- Toda escritura externa Jira o futura runtime requiere aprobación humana explícita.
- No convertir Evidence en configuración estable sin decisión.
- No redefinir Core en el Control Plane; usar handoff a Core para modelos reutilizables.
- Mantener secrets fuera de Evidence y payloads.

## Riesgos y no-objetivos

- No implementar todavía endpoint HTTP, queue ni worker runtime.
- No cerrar CRs históricos por edición cosmética sin Evidence.
- No normalizar dirty working trees de servicios desde esta adopción.
- No modificar `4uentes-core`, `sst-bend` ni otros repos relacionados salvo CR separado y aprobado.
- No usar Jira como source of truth para cerrar State local.

## Primer siguiente paso recomendado

Abrir `INIT-CONTROL-PLANE-LIFECYCLE-ENFORCEMENT` para agrupar los CRs de enforcement, State evidence gaps, freshness y validators antes de cualquier runtime.

```yaml
adoption_handoff:
  readiness: ready
  recommended_first_unit:
    type: INIT
    id_suggestion: "INIT-CONTROL-PLANE-LIFECYCLE-ENFORCEMENT"
    title: "Enforce Control Plane lifecycle, State evidence, and drift readiness"
    reason: "La brecha principal es sistémica: lifecycle document-only, State sin Evidence y validators parciales deben cerrarse antes de promover runtime."
  ordered_units:
    - order: 1
      type: INIT
      scope: "Define adoption program for lifecycle enforcement, State evidence reconciliation, read-model freshness, and validators."
      acceptance_criteria:
        - "INIT lists child CRs, dependencies, risks, non-goals, and required Evidence."
        - "INIT explicitly excludes service mutations and runtime implementation."
      required_evidence:
        - "INIT document"
        - "Gap matrix derived from this audit"
      human_approval: required
    - order: 2
      type: CR
      scope: "Reconcile state/bugfixes/login-504-proxy-timeout.current.yaml and state/bugfixes/sst-bend-emfile-watchers.current.yaml."
      acceptance_criteria:
        - "No non-terminal State remains without request_ids and evidence_refs unless status is degraded."
        - "npm run check exits 0 with those warnings removed or intentionally reclassified."
      required_evidence:
        - "validation-results.md"
        - "reconciliation-summary.md"
        - "changed-files-summary.md"
      human_approval: required
    - order: 3
      type: CR
      scope: "Add freshness checks for state/00-index.yaml, state/capability-links.yaml, policy links, catalog observations, and local bindings."
      acceptance_criteria:
        - "Freshness rules distinguish stale snapshot, not_verifiable remote, and current observation."
        - "Remote observation warnings are represented as governed drift, not silent OK."
      required_evidence:
        - "npm run check output"
        - "freshness-check-summary.md"
      human_approval: required
    - order: 4
      type: CR
      scope: "Extend capability/state validator for producer, consumer, contract, evidence, validation_refs, and link_status semantics."
      acceptance_criteria:
        - "All capability links resolve to existing state_file and source_ref or explicit allowed exception."
        - "Draft, pending-child-adoption, orphan-observed, and linked have deterministic rules."
      required_evidence:
        - "validator-output.md"
        - "capability-link-diff-summary.md"
      human_approval: required
    - order: 5
      type: CR
      scope: "Add executable schema validation for sst-chatbot operation_intent, handoff_payload, and agent_result."
      acceptance_criteria:
        - "Valid and invalid sample payloads are checked by a non-mutating command."
        - "The command is referenced by npm run check or a documented sub-check."
      required_evidence:
        - "schema-validation-results.md"
        - "sample-payloads.md"
      human_approval: required
    - order: 6
      type: CR
      scope: "Resolve Core naming and pending Core handoff decisions."
      acceptance_criteria:
        - "contract-binding and policy-links agree on canonical Core identity."
        - "Pending core-required policy handoffs are closed or explicitly deferred."
      required_evidence:
        - "core-decision-record.md"
        - "updated-contract-binding-validation.md"
      human_approval: required
    - order: 7
      type: CR
      scope: "Design, not implement, the first runtime HTTP ingress contract for sst-chatbot handoff."
      acceptance_criteria:
        - "Contract covers auth, authorization, idempotency, retry, audit metadata, failure modes, and post-execution reconciliation."
        - "capability remains draft unless implementation and validation are added in a later CR."
      required_evidence:
        - "runtime-contract-design.md"
        - "risk-review.md"
        - "acceptance-test-plan.md"
      human_approval: required
  blockers:
    - "Current lifecycle is documented_only and lacks complete transition enforcement."
    - "Two validated-local bugfix State files lack request_ids and evidence_refs."
    - "Remote service observations were not verifiable in npm run check."
  non_goals:
    - "Do not implement runtime transport in the first INIT."
    - "Do not mutate child service repositories."
    - "Do not promote fake/local adapter as productive runtime."
    - "Do not use Jira state as source of truth for local ARDS/SDD closure."
```