---
artifact_type: ards_audit_report
audit_template_id: ARDS-SDD-AUDIT-001
audit_template_version: 0.3.0
target_type: service_repository
target_repository: C:\Users\andre\Desktop\4uentes\apps\4uentes-sst\chatboot-integration\sst_chatbot
target_commit: fa958a08ac23d664e2cf239e554585026bd266f4
generated_at: 2026-06-28T19:21:51.8670818-03:00
report_path: C:\Users\andre\Desktop\4uentes\apps\4uentes-orchestor\.ards\audits\stack\20260628-190144\sst-chatbot\20260628-191955\ards-sdd-audit-and-adoption.md
adoption_handoff: ready
---

# 1. Veredicto ejecutivo

- `overall_status`: `partial`
- `observed_profile`: `standard` incompleto
- `confidence`: `medium`

El repositorio `sst_chatbot` tiene una base ARDS/SDD real: `AGENTS.md`, `docs/`, `specs/`, ADRs, policies, Capabilities, binding cross-repo, scripts de validacion y tests con fakes. No es solo cosmetico: `scripts/ards_check.py` pasa y hay implementacion testeable de memoria, prompts, providers y fake orchestrator. Sin embargo, la conformidad baseline no puede considerarse completa porque la ruta agregada `pytest`/`scripts/check.py` no fue verificable en el sandbox read-only por falta de directorio temporal usable, varias referencias de Evidence apuntan a `evidence/requests/...` pero no existe `evidence/` en el target, y el State/backlog vivo no diferencia de forma gobernada implementado/parcial/pendiente/bloqueado/descartado con Evidence local. La trazabilidad cross-repo existe como contrato y como contexto en `4uentes-orchestor`, pero desde el Service auditado queda parcial.

# 2. Alcance y limitaciones

- Raiz auditada: `C:\Users\andre\Desktop\4uentes\apps\4uentes-sst\chatboot-integration\sst_chatbot`.
- Branch observable por lectura directa: `codex/sst-chatbot-orchestrator-handoff` desde `.git/HEAD`.
- Commit observable por lectura directa: `fa958a08ac23d664e2cf239e554585026bd266f4`.
- Git CLI no verificable: `git rev-parse/status` fallo por `dubious ownership`; no se modifico `safe.directory`.
- Rutas excluidas: `.ards/audits/**` por regla del Audit Pack.
- Repos relacionados usados solo como contexto read-only: `4uentes-core`, `4uentes-orchestor`.
- Comandos ejecutados:
  - `rg --files -g '! .ards/audits/**'`: exit code 0; inventario de archivos del target.
  - `git rev-parse --show-toplevel; git rev-parse --abbrev-ref HEAD; git rev-parse HEAD; git status --short`: exit code 1; fallo por `dubious ownership`.
  - `.\.venv\Scripts\python.exe scripts\ards_check.py`: exit code 0; output `ARDS/SDD check passed.`
  - `.\.venv\Scripts\python.exe -m pytest`: exit code 1; no ejecuta tests, falla con `FileNotFoundError: No usable temporary directory found`.
  - Lecturas `Get-Content`, `Test-Path`, `rg -n`: exit code 0 salvo busquedas sin match.
- Comandos no ejecutados:
  - `scripts/check.py`: no ejecutado porque agrega `pytest` y reproduciria la limitacion de temp dir.
  - `init.py`: no ejecutado porque `AGENTS.md` indica que requiere variables de proveedor.
- Limitacion de entorno: sandbox read-only sin temp dir usable para pytest; no se pidio escalacion porque la auditoria exige operar en solo lectura.

# 3. Resumen por dimension

| Dimension | Estado | Evidencia principal | Riesgo |
|---|---|---|---|
| A. Identidad, alcance y guia operativa | partial | `AGENTS.md:3`, `AGENTS.md:10`, `AGENTS.md:37`, `AGENTS.md:79`, `AGENTS.md:85` | Owners humanos/servicio no quedan explicitados de forma completa. |
| B. Specs como fuente de verdad y SDD | partial | `specs/00-index.yaml:2`, `specs/00-index.yaml:5`, `specs/00-index.yaml:16`, `specs/00-index.yaml:50` | Hay specs utiles, pero versionado/deprecacion y drift con Evidence quedan parciales. |
| C. Docs como contexto humano | compliant | `docs/00-overview.md:3`, `docs/00-overview.md:36`, `docs/adr/0001-adopt-ards-sdd.md` | Riesgo bajo; documentacion amplia y enlazada. |
| D. Validacion reproducible | partial | `scripts/check.py:18`, `scripts/ards_check.py:194`, comando `ards_check.py` exit 0, comando `pytest` exit 1 por entorno | Ruta agregada no verificada end-to-end. |
| E. Policies y guardrails | partial | `specs/integration/policies.yaml`, `docs/ai/policy.md`, `AGENTS.md:85` | Adopcion existe, pero parte humana es resumida y con defecto de encoding. |
| F. Continuidad, State y Evidence | partial | `docs/tasks/README.md:13`, `specs/ards/contract-binding.yaml:24`, `Test-Path evidence -> False` | Estado vivo y Evidence local insuficientes para cierre gobernado. |
| G. Capabilities y coordinacion cross-repo | partial | `specs/capabilities/agent-lifecycle-and-orchestrator-boundary.yaml:17`, `specs/integrations/sst-chatbot-core-orchestrator-sync.yaml` | Handoff real/transporte y evidencia cross-repo quedan parciales. |
| H. Portabilidad y automatizacion gobernada | partial | `specs/ards/contract-binding.yaml:11`, `src/app/providers/*`, `scripts/check.py:18` | Buena portabilidad, automatizacion semantica todavia limitada. |
| I. Integridad anti-cosmetica | partial | `scripts/ards_check.py`, `Test-Path evidence -> False`, `docs/policies/README.md` | Referencias criticas a Evidence no resuelven dentro del target. |

# 4. Hallazgos priorizados

```yaml
id: FINDING-ARDS-001
control_ids: [ARDS-14, ARDS-17, ARDS-18]
type: fact
status: not_verifiable
severity: high
confidence: high
title: "La ruta pytest/check.py no fue verificable en sandbox read-only"
evidence:
  - kind: command
    reference: ".\\.venv\\Scripts\\python.exe -m pytest"
    detail: "exit code 1; FileNotFoundError: No usable temporary directory found antes de cargar tests."
  - kind: file
    reference: "scripts/check.py:18"
    detail: "El check agregado ejecuta ards_check.py y pytest."
impact: "No se puede afirmar que la validacion agregada completa pase en esta ejecucion."
minimum_remediation: "Definir una ruta de auditoria read-only compatible con pytest o documentar requisitos de temp dir y Evidence de ejecucion en entorno permitido."
dependencies: []
```

```yaml
id: FINDING-ARDS-002
control_ids: [ARDS-26, ARDS-31, ARDS-38, ARDS-40]
type: fact
status: partial
severity: high
confidence: high
title: "Referencias de Evidence cross-repo no resuelven dentro del Service"
evidence:
  - kind: file
    reference: "specs/ards/contract-binding.yaml:24"
    detail: "last_report_ref apunta a evidence/requests/CR-SST-0077/sst-chatbot-child-sync-diff.yaml."
  - kind: file
    reference: "specs/capabilities/agent-lifecycle-and-orchestrator-boundary.yaml:14"
    detail: "evidence_ref apunta a evidence/requests/CR-SST-0021/implementation-summary.md."
  - kind: absence
    reference: "Test-Path evidence"
    detail: "Resultado False en el target."
impact: "La trazabilidad declarada depende del Control Plane o conversaciones externas, no de Evidence local resoluble."
minimum_remediation: "Agregar o enlazar de forma resoluble la Evidence minima local, o declarar explicitamente que la Evidence vive en Control Plane con binding verificable."
dependencies: ["4uentes-orchestor"]
```

```yaml
id: FINDING-ARDS-003
control_ids: [ARDS-24, ARDS-25, ARDS-27, ARDS-28]
type: inference
status: partial
severity: medium
confidence: high
title: "El State vivo existe como backlog narrativo, pero no como estado gobernado completo"
evidence:
  - kind: file
    reference: "docs/tasks/README.md:13"
    detail: "Current Task Backlog lista pendientes."
  - kind: file
    reference: "docs/tasks/README.md:14-26"
    detail: "Las entradas no separan sistematicamente implementado, parcial, pendiente, bloqueado, descartado y no incorporado."
impact: "Un agente puede retomar contexto, pero no cerrar o priorizar trabajo con Evidence y estados verificables."
minimum_remediation: "Crear o adoptar State machine-readable para requests/capabilities locales y enlazar Evidence por item."
dependencies: []
```

```yaml
id: FINDING-ARDS-004
control_ids: [ARDS-03]
type: fact
status: partial
severity: medium
confidence: medium
title: "Proposito y limites estan claros, pero owners/responsables del Service no estan completos"
evidence:
  - kind: file
    reference: "docs/00-overview.md:3"
    detail: "Declara proposito del repo."
  - kind: file
    reference: "specs/capabilities/agent-lifecycle-and-orchestrator-boundary.yaml:17"
    detail: "Declara ownership funcional por repositorio."
  - kind: absence
    reference: "AGENTS.md / README.md"
    detail: "No se observo owner humano/equipo responsable descubrible del Service."
impact: "Escalacion, aprobaciones y responsabilidad operacional quedan ambiguas."
minimum_remediation: "Agregar owners/responsables y autoridad de aprobacion en AGENTS, README, docs o spec apropiada."
dependencies: []
```

```yaml
id: FINDING-ARDS-005
control_ids: [ARDS-09]
type: inference
status: partial
severity: medium
confidence: medium
title: "Las specs tienen estados, pero el mecanismo de versionado/deprecacion es incompleto"
evidence:
  - kind: file
    reference: "specs/00-index.yaml:6-84"
    detail: "El indice registra statuses accepted/draft/candidate/review/active."
  - kind: absence
    reference: "specs/"
    detail: "No se observo politica local explicita para reemplazar/deprecar specs con reglas de migracion."
impact: "Puede aparecer drift entre specs antiguas, candidates y runtime sin proceso de retiro claro."
minimum_remediation: "Documentar lifecycle de specs: draft, candidate, accepted, deprecated, superseded, evidence requerida y validacion."
dependencies: []
```

```yaml
id: FINDING-ARDS-006
control_ids: [ARDS-20, ARDS-38]
type: fact
status: partial
severity: low
confidence: high
title: "La documentacion humana de policies tiene defecto de encoding y es resumida"
evidence:
  - kind: file
    reference: "docs/policies/README.md"
    detail: "Los bullets de policies adoptadas se renderizan como caracteres de control antes de 'gent-*'."
  - kind: file
    reference: "specs/integration/policies.yaml"
    detail: "El registry machine-readable si declara los ids adoptados."
impact: "El contrato machine-readable es util, pero el entrypoint humano reduce legibilidad y puede inducir errores."
minimum_remediation: "Corregir encoding/listado humano y enlazar documentos core o copias locales de lectura."
dependencies: ["4uentes-core"]
```

```yaml
id: FINDING-ARDS-007
control_ids: [ARDS-41]
type: inference
status: partial
severity: medium
confidence: high
title: "El check ARDS valida estructura, pero cubre poco del contrato semantico"
evidence:
  - kind: file
    reference: "scripts/ards_check.py:75"
    detail: "Valida YAML y claves version/kind."
  - kind: file
    reference: "scripts/ards_check.py:92"
    detail: "Valida que paths indexados existan."
  - kind: file
    reference: "scripts/ards_check.py:139"
    detail: "Valida catalogo de prompts."
impact: "Puede pasar con Evidence rota, State narrativo y capabilities sin contrato completo."
minimum_remediation: "Extender ards_check para validar Evidence refs, required fields por kind, lifecycle de specs y State minimo."
dependencies: []
```

```yaml
id: FINDING-ARDS-008
control_ids: [ARDS-29, ARDS-30, ARDS-31, ARDS-32, ARDS-33]
type: inference
status: partial
severity: medium
confidence: high
title: "La coordinacion cross-repo esta declarada, pero aun no es plenamente operacional"
evidence:
  - kind: file
    reference: "specs/ards/contract-binding.yaml:26-29"
    detail: "Binding local apunta a sync contract en status draft."
  - kind: file
    reference: "docs/ai/policy.md"
    detail: "Declara que el transporte real permanece undecided."
  - kind: file
    reference: "specs/capabilities/agent-lifecycle-and-orchestrator-boundary.yaml:113"
    detail: "Fake orchestrator adapter status implemented-local."
impact: "El Service puede producir propuestas locales, pero no demuestra handoff real gobernado al Control Plane."
minimum_remediation: "Cerrar CR de transporte/handoff real o registrar explicitamente el alcance POC con Evidence y drift signals."
dependencies: ["4uentes-orchestor"]
```

# 5. Matriz completa de controles

| ID | Nivel | Estado | Evidencia | Nota |
|---|---|---|---|---|
| ARDS-01 | MUST | compliant | `AGENTS.md:1`, raiz auditada | Existe guia operativa en raiz. |
| ARDS-02 | MUST | compliant | `AGENTS.md:10`, `AGENTS.md:37`, `AGENTS.md:79`, `AGENTS.md:85` | Estructura, comandos, restricciones, seguridad y policies estan declarados. |
| ARDS-03 | MUST | partial | `docs/00-overview.md:3`, `specs/capabilities/...:17` | Proposito y limites si; owner humano/equipo no completo. |
| ARDS-04 | SHOULD | partial | `docs/ai/policy.md`, `docs/playbooks/*` | Hay especializacion por dominio, no se observaron AGENTS por subdirectorio. |
| ARDS-05 | MUST | compliant | `specs/00-index.yaml:2`, `specs/00-index.yaml:5` | Indice discoverable. |
| ARDS-06 | MUST | compliant | `specs/capabilities/user-activity-ards-memory.yaml`, `specs/architecture/provider-model-memory-configuration.yaml` | Requisitos, reglas y validaciones presentes. |
| ARDS-07 | MUST | partial | `specs/*`, `tests/test_ards_memory_runtime.py`, `tests/test_fake_orchestrator_handoff.py` | Trazabilidad existe, pero Evidence refs locales faltan. |
| ARDS-08 | MUST | partial | `specs/ards/contract-binding.yaml:24`, `Test-Path evidence -> False` | Drift potencial por referencias no resolubles. |
| ARDS-09 | SHOULD | partial | `specs/00-index.yaml:6-84` | Statuses existen; lifecycle de deprecacion no explicito. |
| ARDS-10 | MUST | compliant | `docs/00-overview.md:3`, `docs/00-overview.md:36` | Overview suficiente. |
| ARDS-11 | MUST | compliant | `docs/00-overview.md:54`, `docs/00-overview.md:61`, `docs/playbooks/02-run-initial-validation.md` | Operacion, limites y troubleshooting enlazados. |
| ARDS-12 | SHOULD | compliant | `docs/adr/0001-adopt-ards-sdd.md`, `docs/adr/0002-provider-model-memory-configuration.md` | ADRs con contexto, decision y consecuencias. |
| ARDS-13 | MUST | compliant | `docs/00-overview.md:38-39`, `specs/00-index.yaml` | Docs complementan specs; no se observo segunda fuente contradictoria material. |
| ARDS-14 | MUST | partial | `docs/playbooks/02-run-initial-validation.md:14`, comando `ards_check.py` exit 0, pytest not_verifiable | Ruta existe, pero no verificada completa. |
| ARDS-15 | MUST | compliant | `scripts/check.py:18`, `scripts/ards_check.py`, comando `ards_check.py` exit 0 | Comandos existen; pytest bloqueado por entorno, no placeholder. |
| ARDS-16 | MUST | partial | `docs/playbooks/02-run-initial-validation.md:18`, `docs/playbooks/02-run-initial-validation.md:26` | DoD de checks existe; Evidence de cierre no integrada al State. |
| ARDS-17 | MUST | partial | outputs de comandos | Se distingue exito/fallo/limitacion, pero pytest no corrio. |
| ARDS-18 | SHOULD | compliant | `scripts/check.py:18-20` | Existe comando agregado repo-level. |
| ARDS-19 | MUST | compliant | `AGENTS.md:79`, `docs/ai/policy.md` | Seguridad, alcance y acciones prohibidas declaradas. |
| ARDS-20 | MUST | partial | `specs/integration/policies.yaml`, `docs/policies/README.md` | Adopcion local declarada; doc humana resumida/encoding defectuoso. |
| ARDS-21 | MUST | compliant | `docs/ai/policy.md`, `specs/capabilities/...:63` | Agente no aprueba/ejecuta sin handoff. |
| ARDS-22 | MUST | compliant | `AGENTS.md:79`, `docs/ai/policy.md` | Secretos y credenciales tratados explicitamente. |
| ARDS-23 | SHOULD | compliant | `specs/capabilities/...:74`, `tests/test_fake_orchestrator_handoff.py` | Human review para `workspace.apply_patch`. |
| ARDS-24 | MUST | partial | `docs/tasks/README.md:1`, `docs/tasks/README.md:13` | Permite retomar, pero no como State gobernado completo. |
| ARDS-25 | MUST | partial | `docs/tasks/README.md:14-26` | Backlog no diferencia todos los estados requeridos. |
| ARDS-26 | MUST | partial | `specs/ards/contract-binding.yaml:24`, `Test-Path evidence -> False` | Cambios relevantes referencian Evidence ausente localmente. |
| ARDS-27 | MUST | compliant | `docs/tasks/*`, `specs/*`, `tests/*` | No depende exclusivamente de chat IA. |
| ARDS-28 | SHOULD | partial | `docs/tasks/README.md`, `specs/capabilities/*` | Enlaces parciales; no hay State unificado con Evidence. |
| ARDS-29 | MUST | compliant | `specs/00-index.yaml:16`, `specs/capabilities/*` | Capabilities discoverables. |
| ARDS-30 | MUST | partial | `specs/capabilities/agent-lifecycle-and-orchestrator-boundary.yaml`, `provider-abstraction.yaml` | Contratos utiles; varios status draft/candidate. |
| ARDS-31 | MUST | partial | `specs/integrations/sst-chatbot-core-orchestrator-sync.yaml`, `contract-binding.yaml` | Handoff/trazabilidad declarada; Evidence local faltante. |
| ARDS-32 | SHOULD | compliant | `specs/ards/contract-binding.yaml:3`, `specs/ards/contract-binding.yaml:11` | Binding local con core ref y contract version. |
| ARDS-33 | SHOULD | partial | `scripts/ards_check.py`, `contract-binding.yaml` | Señales existen; drift detection no valida Evidence rota. |
| ARDS-34 | MUST | compliant | `specs/*`, `docs/*`, `src/app/providers/*` | Conocimiento critico vive en ARDS/SDD local, no solo prompts proveedor. |
| ARDS-35 | MUST | compliant | `docs/adr/0002-provider-model-memory-configuration.md`, `src/app/providers/*` | Adaptadores complementan contratos provider-agnostic. |
| ARDS-36 | SHOULD | partial | `scripts/check.py`, `scripts/ards_check.py` | Automatizacion existe, pero semantica ARDS incompleta y pytest no verificable. |
| ARDS-37 | MAY | compliant | `docs/ai/policy.md`, `src/app/orchestrator/fake_client.py` | Fake adapter y reglas no rompen portabilidad. |
| ARDS-38 | MUST | partial | `scripts/ards_check.py:92`, `Test-Path evidence -> False` | Indices specs resuelven; refs Evidence criticas no. |
| ARDS-39 | MUST | partial | `rg TODO/TBD`, `docs/ai/policy.md:47` | No hay adopcion vacia evidente; templates/examples existen pero no como estado real. Defecto menor en policy docs. |
| ARDS-40 | MUST | partial | `contract-binding.yaml:23-24`, ausencia `evidence/` | Afirmaciones de validacion/sync no coinciden plenamente con Evidence local. |
| ARDS-41 | SHOULD | partial | `scripts/ards_check.py` | Check automatico existe, cobertura de contrato limitada. |

# 6. Backlog de remediacion propuesto

| Orden | Unidad | Tipo | Riesgo | Descripcion |
|---|---|---|---|---|
| 1 | CR local del Service | CR | high | Hacer resolubles las referencias de Evidence usadas por `contract-binding.yaml` y Capabilities, o declarar binding externo verificable al Control Plane. |
| 2 | CR local del Service | CR | high | Definir ruta de validacion read-only/auditable para `pytest` y `scripts/check.py`, incluyendo requisito de temp dir o modo compatible. |
| 3 | CR local del Service | CR | medium | Crear State local machine-readable que diferencie implementado, parcial, pendiente, bloqueado, descartado y no incorporado, con enlaces a Evidence. |
| 4 | INIT cross-repo | INIT | medium | Reconciliar `sst-chatbot` con `4uentes-orchestor` para decidir si Evidence canonica queda en Control Plane o se replica como Evidence local minima. |
| 5 | CR local del Service | CR | medium | Documentar lifecycle de specs: versionado, deprecacion, reemplazo, drift y Evidence requerida. |
| 6 | CR local del Service | CR | medium | Extender `scripts/ards_check.py` para validar referencias de Evidence, schemas por `kind`, lifecycle de specs y State minimo. |
| 7 | CR local del Service | CR | low | Corregir `docs/policies/README.md` para eliminar caracteres de control y enlazar lectura humana de policies core. |
| 8 | CR del Control Plane | CR | medium | Exponer señal estable para drift detection de child contract bindings sin depender de conversaciones. |
| 9 | INIT cross-repo | INIT | medium | Cerrar seleccion de transporte real para handoff `sst-chatbot -> 4uentes-orchestor` o registrar explicitamente que sigue en POC. |

# 7. Evidencia positiva

- `AGENTS.md` existe y contiene proposito, estructura, comandos, POC rules, testing, seguridad y policies locales.
- `docs/00-overview.md` da contexto humano amplio y enlaza cross-repo, capabilities, playbooks y validacion.
- `specs/00-index.yaml` indexa arquitectura, capabilities, integrations, POCs, policies y templates.
- `scripts/ards_check.py` valida presencia de rutas ARDS, YAML, notebooks, specs indexadas y prompt catalog.
- `.\.venv\Scripts\python.exe scripts\ards_check.py` paso con exit code 0.
- Hay ADRs aceptadas para ARDS/SDD, estructura Python y provider/model/memory.
- Hay implementacion real bajo `src/app/memory`, `src/app/orchestrator`, `src/app/providers`, `src/app/prompts`.
- Los tests inspeccionados cubren idempotency, fake orchestrator, bloqueos de server operations, human review y validacion de memoria.
- `specs/ards/contract-binding.yaml` declara core contract version, core ref, policies adoptadas y sync contract local.
- `docs/ai/policy.md` establece limites claros: no ejecutar server work, no mutar SST/workspaces/infra, no tratar output de proveedor como estado de negocio aceptado.

# 8. Preguntas abiertas

- Quien es el owner humano/equipo responsable de aprobar cambios de gobierno ARDS/SDD en `sst-chatbot`?
- La Evidence canonica de CRs cross-repo debe vivir solamente en `4uentes-orchestor` o debe replicarse una Evidence minima dentro de cada Service?
- Cual sera el primer transporte aprobado para handoff real entre `sst-chatbot` y `4uentes-orchestor`?

# Handoff para adopcion por humano + agente IA constructor

## Objetivo de adopcion

Llevar `sst-chatbot` desde un perfil `standard` incompleto hacia `baseline_conformant_with_observations`, con Evidence resoluble, State gobernado y validacion reproducible en entorno auditable sin depender de historial conversacional.

## Brecha resumida

El repo ya tiene ARDS/SDD estructural, docs, specs, policies, capabilities, binding y checks. La brecha principal esta en operatividad: Evidence referenciada no resuelve dentro del Service, State/backlog no modela estados completos con Evidence, `pytest` no fue verificable en sandbox read-only, y el drift check ARDS aun no cubre semantica suficiente.

## Secuencia recomendada

1. CR local del Service: resolver Evidence refs o declarar binding externo verificable.
2. CR local del Service: hacer validacion reproducible en modo auditable.
3. CR local del Service: crear State machine-readable con estados y Evidence.
4. CR local del Service: extender `ards_check.py` para validar Evidence/State/spec lifecycle.
5. INIT cross-repo: reconciliar con `4uentes-orchestor` transporte/handoff real y ownership de Evidence.
6. CR local del Service: documentar lifecycle de specs y corregir policy README.

## Unidad de cambio sugerida por paso

- Paso 1: CR local del Service.
- Paso 2: CR local del Service.
- Paso 3: CR local del Service.
- Paso 4: CR local del Service.
- Paso 5: INIT cross-repo.
- Paso 6: CR local del Service.

## Alcance por paso

- Paso 1: `specs/ards/contract-binding.yaml`, `specs/capabilities/*`, posible `evidence/` local o referencias al Control Plane.
- Paso 2: `docs/playbooks/02-run-initial-validation.md`, `scripts/check.py`, docs de entorno de test.
- Paso 3: `docs/tasks/README.md`, posible spec/state local bajo `specs/` usando templates existentes.
- Paso 4: `scripts/ards_check.py`, `tests/` si se agregan pruebas del check.
- Paso 5: `specs/integrations/sst-chatbot-core-orchestrator-sync.yaml`, `docs/architecture/agent-core-and-orchestrator-boundary.md`, artefactos relacionados en `4uentes-orchestor`.
- Paso 6: `specs/00-index.yaml`, docs/policies y policy docs.

## Criterios de aceptacion

- Todas las referencias `evidence_ref` y `last_report_ref` resuelven localmente o mediante binding externo documentado y verificable.
- `scripts/check.py` puede ejecutarse en un entorno documentado y produce exito/fallo distinguible.
- Existe State versionado que diferencia implementado, parcial, pendiente, bloqueado, descartado y no incorporado.
- Cada State relevante enlaza Evidence o declara ausencia/gap.
- `ards_check.py` falla si una Evidence critica no resuelve o si un spec indexado no cumple schema minimo.
- El handoff real o su estado POC queda explicitamente gobernado con CR/INIT y aprobacion humana.
- Policy README se renderiza sin caracteres corruptos.

## Evidence requerida

- Output de `.\.venv\Scripts\python.exe scripts\ards_check.py`.
- Output de `.\.venv\Scripts\python.exe -m pytest` o declaracion `not_verifiable` con causa y entorno requerido.
- Output de `.\.venv\Scripts\python.exe scripts\check.py`.
- Diff o reporte de resolucion de Evidence refs.
- State file actualizado con enlaces a Evidence.
- Decision humana para ownership de Evidence cross-repo.
- Decision humana para transporte/handoff real si se avanza fuera del fake adapter.

## Policies y guardrails aplicables

- Respetar `AGENTS.md` y `docs/ai/policy.md`.
- No mover credenciales ni Plaud secrets a este repo.
- No habilitar server operations directas desde `sst-chatbot`.
- Mantener fake orchestrator como test infrastructure hasta aprobacion humana.
- Provider SDKs deben permanecer detras de adapters.
- Unit tests no deben llamar proveedores externos reales.
- Cambios cross-repo requieren INIT/CR y aprobacion humana.

## Riesgos y no-objetivos

- No convertir `sst-chatbot` en owner de colas, scheduling, retries o audit productivo.
- No cerrar Evidence copiando texto conversacional sin artefacto verificable.
- No ampliar `ards_check.py` con reglas fragiles que bloqueen POCs validos sin lifecycle documentado.
- No aprobar `workspace.apply_patch` ni server operations sin gate humano/orchestrator.
- No resolver el transporte real como efecto colateral de un CR local.

## Primer siguiente paso recomendado

Crear un CR local del Service para resolver la Evidence ARDS/SDD minima: inventariar todas las referencias `evidence_ref`/`last_report_ref`, decidir si se materializan localmente o se enlazan mediante binding verificable al Control Plane, y agregar validacion automatica para que no vuelvan a quedar rotas.

```yaml
adoption_handoff:
  readiness: ready
  recommended_first_unit:
    type: CR
    id_suggestion: "CR-SST-ARDS-LOCAL-EVIDENCE-001"
    title: "Resolver Evidence refs ARDS/SDD del service sst-chatbot"
    reason: "Bloquea trazabilidad, controles de Evidence y anti-drift; es prerequisito para State y checks mas fuertes."
  ordered_units:
    - order: 1
      type: CR
      scope: "sst-chatbot: specs/ards/contract-binding.yaml, specs/capabilities/*, evidencia local o binding externo verificable"
      acceptance_criteria:
        - "Todas las referencias evidence_ref y last_report_ref resuelven o declaran fuente externa verificable."
        - "El informe de validacion lista refs resueltas y refs externas justificadas."
      required_evidence:
        - "Output de busqueda de evidence_ref/last_report_ref."
        - "Output de ards_check actualizado o check manual equivalente."
      human_approval: required
    - order: 2
      type: CR
      scope: "sst-chatbot: docs/playbooks/02-run-initial-validation.md, scripts/check.py, entorno de pytest"
      acceptance_criteria:
        - "La ruta de validacion documentada distingue exito, fallo y limitacion de entorno."
        - "scripts/check.py tiene Evidence de ejecucion en entorno permitido."
      required_evidence:
        - "Output de pytest."
        - "Output de scripts/check.py."
      human_approval: conditional
    - order: 3
      type: CR
      scope: "sst-chatbot: docs/tasks/README.md y/o specs/state local"
      acceptance_criteria:
        - "State diferencia implementado, parcial, pendiente, bloqueado, descartado y no incorporado."
        - "Cada item relevante enlaza Evidence o gap explicito."
      required_evidence:
        - "State actualizado."
        - "Links a Evidence por item."
      human_approval: required
    - order: 4
      type: CR
      scope: "sst-chatbot: scripts/ards_check.py"
      acceptance_criteria:
        - "El check falla ante Evidence critica rota."
        - "El check valida schema minimo por kind y lifecycle basico de specs."
      required_evidence:
        - "Tests del check o salida negativa/positiva controlada."
        - "Output de scripts/ards_check.py."
      human_approval: conditional
    - order: 5
      type: INIT
      scope: "sst-chatbot + 4uentes-orchestor: handoff real, ownership de Evidence y drift signals"
      acceptance_criteria:
        - "Queda decidido si Evidence canonica se replica localmente o vive en Control Plane."
        - "El estado del transporte real queda aprobado o explicitamente diferido."
      required_evidence:
        - "CR/INIT cross-repo."
        - "Decision humana registrada."
      human_approval: required
  blockers:
    - "Pytest no verificable en sandbox read-only por falta de temp dir usable."
    - "Evidence local ausente para refs declaradas."
  non_goals:
    - "No implementar transporte real al orchestrator en el primer CR local."
    - "No habilitar server operations directas desde sst-chatbot."
    - "No modificar credenciales, Plaud ingestion ni servicios SST productivos."
```