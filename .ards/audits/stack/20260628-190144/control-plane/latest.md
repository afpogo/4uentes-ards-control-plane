---
artifact_type: ards_audit_report
audit_template_id: ARDS-CONTROL-PLANE-AUDIT-001
audit_template_version: 0.3.0
target_type: control_plane_repository
target_repository: C:\Users\andre\Desktop\4uentes\apps\4uentes-orchestor
target_commit: not_available
generated_at: 2026-06-28T19:29:21.6949305-03:00
report_path: C:\Users\andre\Desktop\4uentes\apps\4uentes-orchestor\.ards\audits\stack\20260628-190144\control-plane\20260628-192658\control-plane-audit-and-adoption.md
adoption_handoff: ready
---

# 1. Veredicto ejecutivo

- `overall_status`: `control_plane_partial`
- `observed_mode`: `enforced`
- `confidence`: `high`
- Solutions observadas: `sst`

El repositorio auditado sí opera como Control Plane ARDS/SDD parcial: mantiene catálogo canónico de servicios, Solution `sst`, requests, evidencia, State, capabilities, policy links, initiatives y verificadores determinísticos. `npm.cmd run check` pasó con `0 FAIL`, validando catálogo, bindings locales, state e initiatives.

No alcanza conformidad completa porque el propio modelo declara que el lifecycle de requests es `documented_only` y “not strictly enforced”; existen 83 requests en `inbox`, 81 en `planned`, 62 en `done`, pero `queued` y `running` están vacíos. Hay evidencia de ejecución Jira real en CRs y scripts, pero los controles de Runtime no están completamente modelados como autorización, idempotencia, retry, cola, reconciliación y mínimo privilegio verificables. También hay drift visible entre adopción local/Core y referencias host-specific dentro de specs estables.

El estado observado es mejor que un catálogo documental: hay enforcement estructural real. Pero todavía mezcla gobierno documental, validación parcial y ejecución externa puntual. La adopción puede continuar desde `INIT-CP-0001`.

# 2. Mapa del sistema gobernado

| Solution | Service | Rol | Capabilities principales | Estado de sync |
|---|---|---|---|---|
| `sst` | `sst-fend` | frontend web core | consume BFF/auth, document-agent workflows, governed article tags | binding local OK; remote no observado |
| `sst` | `sst-bend` | backend API core | dictionary tags, article tags, tag prefix engine, learning content tags | binding local OK; varias capabilities linked/pending/orphan |
| `sst` | `4uentes-auth` | shared auth/BFF | auth provider, tag prefix preview consumer | alias `node-auth` separado; binding local OK; remote no observado |
| `sst` | `sst-extension` | optional frontend extension | consume BFF/auth | optional-active; binding local OK; remote no observado |
| `sst` | `sst-chatbot` | optional agent runtime participant | agent handoff, derivations | capability inbound draft; binding local OK; remote no observado |
| `sst` | `sst-4uentes-infra` | infra GitOps | deploys frontend/backend/auth | binding local OK; remote no observado |
| `sst` | `4uentes-orchestor` | control plane | request lifecycle, state, evidence, policy handoff | self-governed; lifecycle enforcement planned |

# 3. Lifecycle reconstruido

```text
Intencion -> Clasificacion -> INIT -> CR -> Impacto -> Policies -> Plan ->
Ejecucion -> Validacion -> Evidence -> State -> Decision
```

| Etapa | Estado observado | Tipo | Evidencia |
|---|---|---|---|
| Intención | Existe en `requests/inbox/*.yaml` | documental estructurado | `templates/change-request.template.yaml:1-71`, conteo `inbox=83` |
| Clasificación | Parcial, generada por planner | determinística parcial | `scripts/plan-change.js:271-316` |
| INIT | Existe modelo local y 3 iniciativas | documental validado | `initiatives/00-index.yaml:1-11`, `specs/initiatives/initiative-model.yaml:1-47` |
| CR | Existe en `inbox/planned/done/rejected` | documental estructurado | conteo `planned=81`, `done=62`, `rejected=1` |
| Impacto | Calculado por planner desde catálogo/Solution | determinístico parcial | `scripts/plan-change.js:73-113`, `397-415` |
| Policies | Registry y links locales | documental + validación parcial | `state/policy-links.yaml:1-177` |
| Plan | `planned` separa plan de ejecución | determinístico parcial | `docs/requests/execution-model.md:37-40` |
| Ejecución | Manual/puntual; Jira scripts y CRs registran writes | runtime parcial | `package.json:21-29`, `requests/done/CR-SST-0075...yaml:24-26` |
| Validación | `npm.cmd run check` pasa | determinística | comando `npm.cmd run check`, exit code `0` |
| Evidence | Carpeta por CR con outputs | documental auditado | `docs/requests/execution-model.md:11-16`, `requests/done/CR-SST-0075...yaml:66-86` |
| State | Read-model validado, con warnings | documental validado | `state/state-machine.yaml:39-65`, comando `npm.cmd run check` |
| Decisión | Existe en CRs done | documental | `requests/done/CR-SST-0075...yaml:88-91` |

# 4. Evaluación de boundaries

- Core vs Control Plane: el boundary está declarado correctamente: `AGENTS.md:12-18` dice que consume `4uentes-ards-core` y no lo redefine. Riesgo: hay modelos locales candidatos, como `specs/initiatives/initiative-model.yaml:6-9`, todavía no promovidos al Core.
- Control Plane vs Service: el boundary está bien declarado: no contiene runtime productivo y no reemplaza ARDS/SDD local de repos funcionales (`AGENTS.md:9-10`, `30-36`). Hay CRs que declaran modificaciones funcionales, por lo que el enforcement debe ser más fuerte.
- Control Plane vs Agent: existe propuesta-before-execution y handoff estructurado para `sst-chatbot`, pero el schema no está enforcementado como check dedicado (`specs/capabilities/inbound/4uentes-orchestor--sst-chatbot-agent-handoff.yaml:36-39`, `54-101`).
- Control Plane vs Runtime: no se observa runtime productivo general. Sí hay scripts de Jira writer/MCP y CRs con `jira_write_executed: true`, por lo que aplican controles runtime a ese adaptador. Están parcialmente documentados, no completamente verificados.
- Desired state vs observed evidence: el repo distingue plan de ejecución (`docs/requests/execution-model.md:37-40`) y State requiere evidencia (`state/state-machine.yaml:62`), pero el check reporta bugfix states no terminales sin request/evidence.

# 5. Resumen por dimensión

| Dimensión | Estado | Evidencia principal | Riesgo |
|---|---|---|---|
| A. Identidad, catálogo y Solutions | `partial` | `solutions/sst.yaml:1-50`, `catalog/services/sst-bend.yaml:1-49` | Medio |
| B. Core y canon | `partial` | `specs/ards/contract-binding.yaml:5-13`, Core `standard/ARDS_KIND_MODEL_v1.md:69-75` | Alto |
| C. Intake, INIT y CR | `partial` | `state/state-machine.yaml:39-65`, `docs/requests/execution-model.md:21-56` | Alto |
| D. Impacto, riesgo, planning | `partial` | `scripts/plan-change.js:73-119`, `229-268` | Medio |
| E. Capabilities cross-repo | `partial` | `state/capability-links.yaml:5-169`, `specs/capabilities/00-index.yaml:11-16` | Medio |
| F. Evidence, State, continuidad | `partial` | `state/00-index.yaml:1-28`, `docs/requests/state-read-model.md:72-73` | Alto |
| G. Sync, reconciliación, drift | `partial` | `npm.cmd run check` warnings; `verify-local-bindings.js:55-67` | Alto |
| H. Agent Governance | `partial` | inbound handoff schema `...sst-chatbot-agent-handoff.yaml:54-101` | Medio |
| I. Runtime gobernado | `partial` | Jira scripts `package.json:21-29`, CR execution flags | Alto |
| J. Límites y autoprotección | `partial` | `AGENTS.md:30-48`, `npm.cmd run check` | Medio |

# 6. Hallazgos priorizados

```yaml
id: FINDING-CP-001
control_ids: [CP-13, CP-14, CP-16, CP-17, CP-22, CP-34]
type: fact
status: partial
severity: high
confidence: high
title: "El lifecycle de requests existe pero no está estrictamente enforcementado"
evidence:
  - kind: file
    reference: "state/state-machine.yaml:39-65"
    detail: "Declara request_lifecycle documented_only y reglas que dicen que V1 no está estrictamente enforced."
  - kind: file
    reference: "docs/requests/state-read-model.md:44-46"
    detail: "Indica que la duplicación histórica entre inbox y planned puede seguir como deuda visible."
  - kind: command
    reference: "Get-ChildItem requests/*"
    detail: "Conteo observado: inbox=83, planned=81, done=62, rejected=1, queued=0, running=0."
impact: "El Control Plane puede registrar y planificar, pero no demuestra enforcement completo de transiciones ni continuidad operacional."
minimum_remediation: "Agregar validador de lifecycle que detecte duplicados, referencias faltantes, transiciones inválidas, approvals ausentes y cierre sin State/Evidence suficiente."
suggested_change_unit: INIT
```

```yaml
id: FINDING-CP-002
control_ids: [CP-46, CP-47, CP-48, CP-49, CP-50, CP-51, CP-52]
type: inference
status: partial
severity: high
confidence: high
title: "Hay ejecución Jira real/parcial, pero los controles Runtime no están completos"
evidence:
  - kind: file
    reference: "package.json:21-29"
    detail: "Define scripts de backlog create, update-existing, sync-machine y jira:writer:apply."
  - kind: file
    reference: "requests/done/CR-SST-0075-fend-governed-article-tag-selector.yaml:24-26"
    detail: "Declara jira_read_executed y jira_write_executed true."
  - kind: file
    reference: "specs/capabilities/inbound/4uentes-orchestor--sst-chatbot-agent-handoff.yaml:36-39"
    detail: "Asigna al orchestrator queueing, retry, idempotency, audit y reconciliation como comportamiento esperado, no como implementación verificada."
impact: "Las acciones externas pueden quedar auditadas por CR, pero no se prueba autorización, idempotencia, retry, mínimos privilegios ni reconciliación post-fallo de forma uniforme."
minimum_remediation: "Modelar el Runtime Jira como adapter explícito con transporte, permisos, idempotency key, retry policy, audit trail, reconciliación y aprobación humana por tipo de acción."
suggested_change_unit: CR-CONTROL-PLANE
```

```yaml
id: FINDING-CP-003
control_ids: [CP-05, CP-07, CP-09, CP-10, CP-36, CP-37, CP-39]
type: fact
status: partial
severity: high
confidence: high
title: "Drift entre Core, adopción local y referencias host-specific"
evidence:
  - kind: file
    reference: "specs/ards/contract-binding.yaml:5-13"
    detail: "Consume core_ref 4uentes-ards-core@2ad4e0f y last_validated_at 2026-06-13."
  - kind: file
    reference: "state/policy-links.yaml:13-36"
    detail: "Varias policies core-required figuran pending-core-handoff."
  - kind: file
    reference: "C:\\Users\\andre\\Desktop\\4uentes\\apps\\4uentes-core\\specs\\integration\\policies.yaml:11-17"
    detail: "Core declara registry canonical y available/adoptable."
  - kind: file
    reference: "specs/capabilities/outbound/4uentes-orchestor--core-agent-policy-governance-handoff.yaml:72-76"
    detail: "Incluye paths absolutos locales en evidence de core adoption."
impact: "La adopción puede estar materialmente avanzada, pero el Control Plane conserva señales contradictorias y paths locales en specs estables."
minimum_remediation: "Reconciliar contract binding, policy links y handoff de Core; reemplazar paths absolutos por refs estables o evidence records host-specific fuera de specs."
suggested_change_unit: CR-CONTROL-PLANE
```

```yaml
id: FINDING-CP-004
control_ids: [CP-24, CP-25, CP-26, CP-27, CP-28]
type: fact
status: partial
severity: medium
confidence: high
title: "Capabilities existen, pero el validador no cubre contrato, consumidor y validación suficiente"
evidence:
  - kind: file
    reference: "state/capability-links.yaml:5-169"
    detail: "Registra producer, state, link_status, work_origin y source_ref."
  - kind: file
    reference: "specs/capabilities/00-index.yaml:15-16"
    detail: "Declara TODO sobre si se necesita check dedicado de capabilities del control-plane."
  - kind: file
    reference: "scripts/verify-state-model.js:45-54"
    detail: "Campos requeridos para capability links no incluyen consumidor, contrato ni validación."
impact: "Un cambio de capability no siempre permite reconstruir consumidores afectados, contrato vigente y checks requeridos."
minimum_remediation: "Extender capability links con producer/consumer/contract/status/validation y validador cross-repo no mutante."
suggested_change_unit: CR-CONTROL-PLANE
```

```yaml
id: FINDING-CP-005
control_ids: [CP-29, CP-30, CP-31, CP-32, CP-33, CP-35, CP-38]
type: fact
status: partial
severity: high
confidence: high
title: "State/Evidence es reutilizable pero tiene gaps de continuidad y frescura"
evidence:
  - kind: command
    reference: "npm.cmd run check"
    detail: "Exit code 0, pero WARN: login-504-proxy-timeout y sst-bend-emfile-watchers sin request_ids y sin evidence_refs para validated-local."
  - kind: file
    reference: "state/00-index.yaml:4"
    detail: "updated_at 2026-05-28, anterior a numerosos CRs de junio."
  - kind: file
    reference: "docs/requests/state-read-model.md:72-73"
    detail: "Estados no terminales sin evidence_refs emiten WARN, no bloquean."
impact: "Un agente puede retomar gran parte del trabajo, pero no todo State activo tiene origen/evidencia suficiente ni prueba de frescura frente a Services."
minimum_remediation: "Elevar warnings críticos a fails según estado, agregar freshness check y reconciliar bugfix states sin request/evidence."
suggested_change_unit: CR-CONTROL-PLANE
```

```yaml
id: FINDING-CP-006
control_ids: [CP-41, CP-42, CP-43, CP-44, CP-45]
type: fact
status: partial
severity: medium
confidence: high
title: "Agent handoff está diseñado como proposal-before-execution, pero no enforcementado"
evidence:
  - kind: file
    reference: "specs/capabilities/inbound/4uentes-orchestor--sst-chatbot-agent-handoff.yaml:36-39"
    detail: "Agent output se trata como proposal data y el orchestrator conserva queueing, retry, audit y reconciliation."
  - kind: file
    reference: "specs/capabilities/inbound/4uentes-orchestor--sst-chatbot-agent-handoff.yaml:54-101"
    detail: "Define schema de operation_intent, handoff_payload y agent_result."
  - kind: file
    reference: "initiatives/INIT-CP-0001-control-plane-lifecycle-enforcement.yaml:31-36"
    detail: "Incluye candidate CR para agregar agent handoff schema check."
impact: "El contrato es claro, pero un payload inválido podría entrar si no se valida por tooling."
minimum_remediation: "Implementar schema check no mutante para handoffs de agentes y enlazar resultados con CR/Evidence/State."
suggested_change_unit: CR-CONTROL-PLANE
```

```yaml
id: FINDING-CP-007
control_ids: [CP-56, CP-57, CP-58]
type: fact
status: partial
severity: medium
confidence: high
title: "La validación propia es determinística, pero no cubre toda la superficie gobernada"
evidence:
  - kind: command
    reference: "npm.cmd run check"
    detail: "Exit code 0; catalog, bindings, state e initiatives pasan."
  - kind: file
    reference: "package.json:7-32"
    detail: "Scripts de check documentados junto a scripts Jira/MCP no incluidos en check principal."
  - kind: file
    reference: "AGENTS.md:101-105"
    detail: "La sección de validación lista solo catalog y local bindings, desactualizada respecto de package.json."
impact: "El repo tiene buena autoprotección básica, pero la validación principal no cubre runtime adapters, request lifecycle completo, capabilities contractuales ni drift de Core/Service."
minimum_remediation: "Actualizar documentación de validación y ampliar `npm run check` o checks separados para lifecycle, runtime adapter dry-run, freshness y capabilities."
suggested_change_unit: CR-CONTROL-PLANE
```

# 7. Matriz completa de controles

| ID | Nivel | Estado | Evidencia | Nota |
|---|---|---|---|---|
| CP-01 | MUST | compliant | `catalog/services/*.yaml`, `npm.cmd run check` | 6 servicios descubiertos |
| CP-02 | MUST | compliant | `solutions/sst.yaml:1-14` | Solution lógica modelada |
| CP-03 | MUST | compliant | `solutions/sst.yaml:15-41` | Relaciones explícitas |
| CP-04 | MUST | compliant | `solutions/sst.yaml:19-23`, `catalog/services/sst-bend.yaml:8-9` | Aliases separados |
| CP-05 | MUST | partial | `README.md:14-15`, spec outbound `:72-76` | Catálogo OK; specs con paths absolutos |
| CP-06 | MUST | compliant | `specs/ards/contract-binding.yaml:5-13` | Core identificado |
| CP-07 | MUST | partial | `AGENTS.md:12-18`, `specs/initiatives/...:6-9` | Modelo INIT local candidato |
| CP-08 | MUST | partial | `state/policy-links.yaml`, `state/capability-links.yaml` | Instancias existen; enforcement parcial |
| CP-09 | MUST | partial | `specs/ards/contract-binding.yaml:5-13` | Binding existe, frescura limitada |
| CP-10 | MUST | partial | `state/policy-links.yaml:13-36` | Gaps visibles pero contradictorios con Core |
| CP-11 | SHOULD | compliant | outbound handoff `:50-61` | Handoff formal al Core |
| CP-12 | MUST | compliant | `templates/change-request.template.yaml:1-71` | Request estructurado |
| CP-13 | MUST | partial | `state/state-machine.yaml:39-61` | Estados existen, no strict enforcement |
| CP-14 | MUST | partial | CR-SST-0075 `:18-91` | CR conecta mucho, no universalmente enforced |
| CP-15 | MUST | compliant | `initiatives/00-index.yaml:1-11` | INIT existe |
| CP-16 | MUST | partial | CR-SST-0075 `:88-91` | Trazable en muestras; no enforcement global |
| CP-17 | SHOULD | partial | `docs/requests/execution-model.md:52-56` | Reconciliación retroactiva documentada |
| CP-18 | MUST | partial | `scripts/plan-change.js:397-415` | Impacto calculado para planner |
| CP-19 | MUST | partial | `scripts/plan-change.js:229-268` | Riesgo heurístico |
| CP-20 | MUST | partial | `state/policy-links.yaml`, CR templates | Policies registradas; no siempre bloqueantes |
| CP-21 | MUST | partial | `scripts/plan-change.js:96-113` | Plan genera contexto/checks |
| CP-22 | MUST | compliant | `docs/requests/execution-model.md:37-40` | Planned no es ejecución |
| CP-23 | SHOULD | partial | `npm.cmd run check` | Automatización estructural, no impacto total |
| CP-24 | MUST | compliant | `specs/capabilities/00-index.yaml` | Registro existe |
| CP-25 | MUST | partial | `state/capability-links.yaml:5-169` | Falta consumer/contract/validation en links |
| CP-26 | MUST | partial | `state/capability-links.yaml` | Identifica productores, no todos consumidores |
| CP-27 | MUST | compliant | statuses `linked`, `pending-child-adoption`, `orphan-observed`; inbound draft | Estados distinguibles |
| CP-28 | SHOULD | partial | `scripts/verify-state-model.js:309-384` | Verifica links básicos |
| CP-29 | MUST | partial | `evidence/requests/**`, CR-SST-0075 `:66-86` | Evidence enlazada; gaps warning |
| CP-30 | MUST | partial | `state/00-index.yaml`, state files | Consolidado, frescura incompleta |
| CP-31 | MUST | partial | `state/state-machine.yaml:62`, check warnings | Done exige evidencia; no terminal warning |
| CP-32 | MUST | partial | `docs/requests/state-read-model.md:5-15` | Distinción declarada |
| CP-33 | MUST | compliant | state statuses y capability link statuses | Activo/parcial/orphan/pending distinguibles |
| CP-34 | MUST | partial | state/read model y evidence | Retomable, pero lifecycle gaps |
| CP-35 | SHOULD | compliant | `state/00-index.yaml:1-28` | Read model index |
| CP-36 | MUST | partial | `npm.cmd run check`, contract binding | Compara estructura, no canon/Service completo |
| CP-37 | MUST | partial | policy links pending, orphan-observed | Drift visible parcial |
| CP-38 | MUST | partial | `state/00-index.yaml:4`, local binding warnings | No freshness check completo |
| CP-39 | MUST | partial | `state/state-machine.yaml:60-65` | Regla existe, enforcement parcial |
| CP-40 | SHOULD | partial | `package.json:7-32` | Checks invocables, cobertura incompleta |
| CP-41 | MUST | partial | agent handoff schema `:54-101` | Estructura diseñada |
| CP-42 | MUST | compliant | handoff `:36-39` | Orchestrator conserva autoridad |
| CP-43 | MUST | compliant | `AGENTS.md:26-35`, handoff `:37` | Agente como propuesta |
| CP-44 | MUST | partial | handoff schema y validation refs | Alcance definido, no check dedicado |
| CP-45 | SHOULD | partial | CR evidence/subagent plan | Actor/modelo registrado en muestras |
| CP-46 | CONDITIONAL-MUST | partial | Jira scripts `package.json:21-29` | Transporte no unificado |
| CP-47 | CONDITIONAL-MUST | partial | handoff expected behaviors | Idempotency/retry esperados, no verificados |
| CP-48 | CONDITIONAL-MUST | partial | evidence Jira summaries | Audit trail por CR, no universal |
| CP-49 | CONDITIONAL-MUST | partial | sync-machine scripts | Reconciliación parcial |
| CP-50 | CONDITIONAL-MUST | not_verifiable | scripts y docs | Mínimo privilegio no comprobable en read-only |
| CP-51 | CONDITIONAL-MUST | partial | templates execution approval `:57-60` | Approval requerido documental |
| CP-52 | CONDITIONAL-MUST | partial | CR-SST-0022 fake adapter, inbound draft | Fake/draft distinguido, Runtime Jira menos claro |
| CP-53 | MUST | compliant | `AGENTS.md:9-10`, `30-36` | No contiene lógica final de Services |
| CP-54 | MUST | partial | `AGENTS.md:35-48`, CRs con functional mods | Regla existe; enforcement no total |
| CP-55 | MUST | partial | `AGENTS.md:12-18`, local INIT model | No reemplaza Core, pero modelos locales candidatos |
| CP-56 | MUST | compliant | `npm.cmd run check` exit 0 | Validación no mutante existe |
| CP-57 | MUST | partial | scripts JS determinísticos | Componentes runtime/inferenciales no cubiertos |
| CP-58 | SHOULD | not_verifiable | read-only audit | Secretos/permisos no inspeccionados |

# 8. Drift detectado

## Core -> Control Plane

- `specs/ards/contract-binding.yaml:8-9` fija `ards-core-contract-v0.1` y `4uentes-ards-core@2ad4e0f`, pero el repo Core relacionado contiene políticas activas actualizadas al `2026-06-20` (`specs/integration/policies.yaml:1-17`).
- `state/policy-links.yaml:13-36` mantiene policies `core-required` en `pending-core-handoff`, mientras Core declara registry canonical y adoption paths.
- `specs/initiatives/initiative-model.yaml:6-9` declara modelo local con `core_promotion_status: candidate`.

## Control Plane -> Service

- `npm.cmd run check` observó paths y artefactos mínimos en repos relacionados, pero todos los remotes de services reportaron `WARN: remote could not be observed`.
- `state/capability-links.yaml:112-114` conserva `sst-tags-governance` como `pending-child-adoption`.
- `state/capability-links.yaml:126-134` marca `learning-content-tags` como `orphan-observed`.

## Declarado -> observado

- El lifecycle declara `queued` y `running`, pero el conteo actual observado es `queued=0`, `running=0`.
- `state/state-machine.yaml:60-61` declara lifecycle document-only y no strictly enforced.
- `AGENTS.md:101-105` documenta solo dos checks, pero `package.json:7` ejecuta cuatro verificadores.

## Catálogo/State obsoleto

- `state/00-index.yaml:4` tiene `updated_at: 2026-05-28`, anterior a numerosos CRs de junio.
- `specs/ards/contract-binding.yaml:12` tiene `last_validated_at: 2026-06-13`.

## Adapter draft/fake presentado como productivo

- No se observó que el `sst-chatbot` handoff draft se presente como productivo: `specs/capabilities/inbound/...sst-chatbot-agent-handoff.yaml:5` dice `status: "draft"`.
- Riesgo restante: Jira writer/MCP sí aparece operativo en scripts y CRs, pero sin adapter manifest completo de Runtime.

# 9. Backlog de remediación propuesto

1. `INIT-CP-0001`: cerrar enforcement de lifecycle antes de ampliar runtime.
2. `CR-CONTROL-PLANE`: reconciliar Core contract binding, policy links y references host-specific.
3. `CR-CONTROL-PLANE`: agregar validator de lifecycle request/INIT/CR/Evidence/State.
4. `CR-CONTROL-PLANE`: convertir warnings críticos de State en errores según estado y agregar freshness check.
5. `CR-CONTROL-PLANE`: extender capability links con consumer, contract, validation y affected checks.
6. `CR-CONTROL-PLANE`: modelar Jira writer/MCP como Runtime adapter gobernado.
7. `CR-CONTROL-PLANE`: agregar schema validation para agent handoff.
8. `CR-CONTROL-PLANE`: actualizar documentación de validación para reflejar `package.json`.
9. `CR-CORE`: promover o rechazar formalmente el initiative model local.
10. `CR-SERVICE`: solo después de enforcement, reconciliar manifests de adopción en child repos.

# 10. Evidencia positiva y preguntas abiertas

## Evidencia positiva

- `npm.cmd run check` terminó con exit code `0`.
- Catálogo y Solution pasan validación: 6 services y 1 solution.
- `solutions/sst.yaml:15-41` modela relaciones reales, no solo lista de repos.
- `README.md:14-15` separa paths locales de identidad canónica.
- `docs/requests/execution-model.md:37-40` separa planning de ejecución.
- `state/capability-links.yaml:166-169` explicita reglas para child repos y pending adoption.
- `AGENTS.md:30-48` declara límites claros contra mutaciones funcionales no gobernadas.
- `initiatives/INIT-CP-0001-control-plane-lifecycle-enforcement.yaml:8-16` ya formula la adopción necesaria.

## Preguntas abiertas

- ¿Cuál es el adapter Runtime oficial para Jira: MCP directo, scripts locales, queue o writer service?
- ¿Qué fuente debe decidir frescura entre State del Control Plane y repos hijos cuando Git remotes no pueden observarse?
- ¿El `initiative_model` local debe promoverse al Core o permanecer como extensión control-plane-only?
- ¿Qué acciones Jira requieren aprobación humana obligatoria y cuáles pueden ejecutarse por policy automática?

# Handoff para adopción por humano + agente IA constructor

## 1. Objetivo de adopción

Evolucionar `4uentes-orchestor` desde Control Plane parcial con enforcement estructural hacia Control Plane conformant: lifecycle de CR enforceable, State/Evidence con frescura verificable, capabilities contractuales completas, drift Core/Service visible y Runtime Jira explícitamente gobernado.

## 2. Brecha resumida

El repositorio ya tiene catálogo, Solution, requests, evidence, State, capabilities, policy links, initiatives y checks. Falta convertir el lifecycle y el Runtime desde documental/parcial a enforcement determinístico: transiciones, approvals, evidence closure, freshness, capability consumers/contracts, schema checks de agent handoff y adapter manifest de Jira.

## 3. Secuencia recomendada

| Orden | Unidad | Título | Dependencia |
|---|---|---|---|
| 1 | INIT | Adoptar `INIT-CP-0001` como paraguas activo | Ninguna |
| 2 | CR-CONTROL-PLANE | Reconciliar Core binding y policy drift | INIT |
| 3 | CR-CONTROL-PLANE | Enforce lifecycle request/CR/Evidence/State | Core drift claro |
| 4 | CR-CONTROL-PLANE | Enforce State freshness y warnings críticos | Lifecycle |
| 5 | CR-CONTROL-PLANE | Fortalecer capability links | State estable |
| 6 | CR-CONTROL-PLANE | Schema check de agent handoff | Capabilities |
| 7 | CR-CONTROL-PLANE | Runtime adapter manifest para Jira writer/MCP | Lifecycle + approvals |
| 8 | CR-CORE | Decidir promoción de initiative model | Evidencia local |
| 9 | CR-SERVICE | Reconciliar manifests child repo | Control Plane enforcement listo |

## 4. Unidad de cambio sugerida por paso

- Paso 1: `INIT`
- Pasos 2-7: `CR-CONTROL-PLANE`
- Paso 8: `CR-CORE`
- Paso 9: `CR-SERVICE`

## 5. Alcance por paso

- `initiatives/INIT-CP-0001-control-plane-lifecycle-enforcement.yaml`
- `specs/ards/contract-binding.yaml`
- `state/policy-links.yaml`
- `specs/capabilities/**`
- `state/capability-links.yaml`
- `state/state-machine.yaml`
- `state/00-index.yaml`
- `scripts/verify-state-model.js`
- `scripts/verify-initiatives.js`
- nuevo o existente validador de lifecycle bajo `scripts/`
- `docs/requests/**`
- `package.json`
- `requests/**`
- `evidence/requests/**`
- `docs/ai/policy.md` y `docs/policies/**` solo si la adopción lo requiere

## 6. Criterios de aceptación

- `npm.cmd run check` pasa sin warnings críticos.
- Existe check determinístico de lifecycle que falla ante CR done sin Evidence/State/decision suficiente.
- No hay paths absolutos host-specific en specs estables.
- Contract binding y policy links no contradicen Core relacionado.
- `state/00-index.yaml` y State files tienen freshness verificable o drift declarado.
- Capability links incluyen producer, consumer, contract, status y validation.
- Agent handoff payloads tienen schema check invocable.
- Jira Runtime adapter queda distinguido como `draft`, `local`, `dry-run` o `productive`, con controles aplicables.
- Cualquier acción runtime crítica requiere aprobación humana documentada.

## 7. Evidence requerida

- Output de `npm.cmd run check`.
- Output de nuevos checks de lifecycle, freshness, capabilities y handoff schema.
- Resumen de archivos cambiados por CR.
- Matriz de drift Core/Control Plane antes/después.
- Muestra de CR válido y muestra negativa bloqueada por validator.
- Decision record humano para Runtime Jira y promoción del initiative model.
- Evidencia de que no se mutaron repos hijos durante CRs de Control Plane.

## 8. Policies y guardrails aplicables

- `AGENTS.md:12-18`: Core es fuente del estándar.
- `AGENTS.md:30-48`: no tocar repos funcionales sin request.
- `docs/requests/execution-model.md:37-40`: planned no es ejecución.
- `state/state-machine.yaml:62`: done requiere evidencia.
- `docs/policies/agent-architecture-boundary-policy.md`
- `docs/policies/agent-task-atomization-policy.md`
- `docs/policies/agent-context-management-policy.md`
- Aprobación humana requerida para promover Runtime productivo, escribir en Jira, modificar repos hijos o cambiar Core.

## 9. Riesgos y no-objetivos

- No convertir el Control Plane en runtime de producto.
- No modificar `4uentes-core` desde CRs locales del Control Plane.
- No mutar Services hasta que el lifecycle esté enforcementado.
- No tratar paths locales como identidad estable.
- No cerrar drift por declaración sin Evidence.
- No presentar adapter draft/fake/local como productivo.

## 10. Primer siguiente paso recomendado

Activar `INIT-CP-0001` y ejecutar el primer CR de reconciliación Core/Control Plane. Es la base menos riesgosa porque elimina contradicciones de canon y deja claro qué modelos son locales, adoptados, candidatos o pendientes antes de endurecer validators y Runtime.

```yaml
adoption_handoff:
  readiness: ready
  recommended_first_unit:
    type: INIT
    id_suggestion: "INIT-CP-0001"
    title: "Control Plane Lifecycle Enforcement"
    reason: "Ya existe, agrupa los gaps principales y evita iniciar CRs aislados sin una gobernanza de adopcion."
  ordered_units:
    - order: 1
      type: INIT
      scope: "initiatives/INIT-CP-0001-control-plane-lifecycle-enforcement.yaml"
      acceptance_criteria:
        - "INIT pasa de planned a active con decision humana."
        - "Mantiene boundaries: no child repo mutation, no runtime promotion, no core canon change."
      required_evidence:
        - "Decision record de activacion."
        - "npm.cmd run check output."
      human_approval: required
    - order: 2
      type: CR
      scope: "specs/ards/contract-binding.yaml, state/policy-links.yaml, specs/capabilities/outbound/4uentes-orchestor--core-agent-policy-governance-handoff.yaml"
      acceptance_criteria:
        - "No quedan contradicciones entre policy links y Core relacionado."
        - "No quedan paths absolutos host-specific en specs estables."
      required_evidence:
        - "Core/Control Plane drift matrix."
        - "npm.cmd run check output."
      human_approval: required
    - order: 3
      type: CR
      scope: "state/state-machine.yaml, docs/requests/execution-model.md, scripts lifecycle validator, package.json"
      acceptance_criteria:
        - "CR done sin Evidence/Decision/State suficiente falla."
        - "Duplicados inbox/planned/done quedan reportados como drift gobernable."
      required_evidence:
        - "Positive and negative validator samples."
        - "Updated command output."
      human_approval: conditional
    - order: 4
      type: CR
      scope: "state/00-index.yaml, state/features/*.current.yaml, state/bugfixes/*.current.yaml, scripts/verify-state-model.js"
      acceptance_criteria:
        - "Warnings criticos de request/evidence se convierten en fail cuando corresponda."
        - "Freshness contra CRs recientes queda verificada o declarada como drift."
      required_evidence:
        - "State freshness report."
        - "npm.cmd run check output without critical warnings."
      human_approval: conditional
    - order: 5
      type: CR
      scope: "state/capability-links.yaml, specs/capabilities/**, scripts/verify-state-model.js or dedicated capability validator"
      acceptance_criteria:
        - "Cada capability link declara producer, consumer, contract, status y validation."
        - "Capabilities draft, pending, orphan, deprecated y linked siguen distinguibles."
      required_evidence:
        - "Capability link validation output."
      human_approval: conditional
    - order: 6
      type: CR
      scope: "specs/capabilities/inbound/4uentes-orchestor--sst-chatbot-agent-handoff.yaml and handoff schema validator"
      acceptance_criteria:
        - "operation_intent, handoff_payload y agent_result tienen validacion no mutante."
        - "Payload invalido queda bloqueado antes de CR/queue."
      required_evidence:
        - "Schema validation positive/negative samples."
      human_approval: conditional
    - order: 7
      type: CR
      scope: "scripts/jira-mcp/**, scripts/jira-writer/**, docs/requests/*jira*, package.json"
      acceptance_criteria:
        - "Jira adapter declara transport, auth, idempotency, retry, audit, reconciliation, privilege and approval policy."
        - "Dry-run/local/productive quedan diferenciados."
      required_evidence:
        - "Runtime adapter manifest review."
        - "Dry-run output only unless human approval authorizes writes."
      human_approval: required
  blockers:
    - "Git target_commit no verificable por dubious ownership sin modificar safe.directory."
    - "Remote URLs de repos relacionados no observables durante npm.cmd run check."
    - "Jira permissions/secrets no verificables en auditoria read-only."
  non_goals:
    - "No modificar repos funcionales durante adopcion del Control Plane."
    - "No promover Runtime productivo antes de lifecycle enforcement."
    - "No cambiar Core canon desde el workflow local."
    - "No usar paths locales como identidad estable."
```