---
artifact_type: ards_audit_report
audit_template_id: ARDS-SDD-AUDIT-001
audit_template_version: 0.3.0
target_type: service_repository
target_repository: C:\Users\andre\Desktop\4uentes\apps\sst-fend
target_commit: not_available
generated_at: 2026-06-28T19:10:47.3275501-03:00
report_path: C:\Users\andre\Desktop\4uentes\apps\4uentes-orchestor\.ards\audits\stack\20260628-190144\sst-fend\20260628-190857\ards-sdd-audit-and-adoption.md
adoption_handoff: ready
---

# 1. Veredicto ejecutivo

- `overall_status`: `partial`
- `observed_profile`: `standard`
- `confidence`: `high`

El repositorio `sst-fend` tiene una adopcion ARDS/SDD real y util: `AGENTS.md`, indices de `specs/` y `docs/`, policies adoptadas, capabilities inbound, contract binding, templates y un gate agregado documentado. No es cumplimiento cosmetico. Sin embargo, no alcanza `baseline_conformant`: hay trazabilidad cross-repo incompleta con `TODO` en `orchestrator_link`, capabilities marcadas como `implemented` aunque su `upstream_ref`/publicacion upstream sigue pendiente, State central solo indexa fuentes y no modela claramente implementado/parcial/bloqueado/no incorporado, y la validacion completa `npm run check` no fue verificable en modo read-only porque build/Jest pueden escribir artefactos o cache. Ademas existe un `.env` fisico con claves sensibles por nombre dentro del arbol auditado, aunque `.gitignore` lo excluye.

# 2. Alcance y limitaciones

- Raiz auditada: `C:\Users\andre\Desktop\4uentes\apps\sst-fend`.
- Related repos usados solo como contexto declarado: `4uentes-core`, `4uentes-orchestor`.
- Rutas excluidas: `.ards/audits/**`; tambien se evitaron `node_modules`, `dist`, `build` para inventario operativo.
- Commit/branch: `not_available`. `git rev-parse HEAD`, `git branch --show-current` y `git status --short` fallaron por `dubious ownership` y corregirlo requeriria modificar configuracion Git global.
- Comandos ejecutados:
  - `rg --files ...`: exit code 0; inventario de `AGENTS.md`, `specs/`, `docs/`, `scripts/ards-check.js`, capabilities y tests.
  - `npm run css:types:check`: exit code 1 por `npm.ps1` bloqueado por PowerShell ExecutionPolicy.
  - `npm run lint:check`: exit code 1 por `npm.ps1` bloqueado por PowerShell ExecutionPolicy.
  - `npm.cmd run css:types:check`: exit code 0; output: `[CSS MODULES] declarations and style usage are in sync`.
  - `npm.cmd run lint:check`: exit code 0; output: `22 problems (0 errors, 22 warnings)`.
  - `npm.cmd test -- --no-cache`: exit code 1; fallo de entorno/sandbox: `EPERM: operation not permitted, open ...\Temp\jest\haste-map...`.
- Comandos no ejecutados:
  - `npm.cmd run check`: no ejecutado porque `scripts/ards-check.js` invoca Webpack build y Jest; no es garantizadamente read-only.
  - `npm.cmd run build`: no ejecutado porque Webpack puede escribir en `dist/`.
- Limitaciones: no se verifico CI remoto, no se inspecciono historial Git, no se confirmo si `.env` esta versionado.

# 3. Resumen por dimension

| Dimension | Estado | Evidencia principal | Riesgo |
|---|---|---|---|
| A. Identidad, alcance y guia operativa | compliant | `AGENTS.md:1-30`, `AGENTS.md:42-72`, `AGENTS.md:218-225` | Bajo |
| B. Specs como fuente de verdad y SDD | partial | `specs/00-index.yaml:1-18`, `specs/33-articles-frontend.yml:45-139` | Medio |
| C. Docs como contexto humano | compliant | `docs/00-overview.md:11-47`, `docs/00-overview.md:69-86` | Bajo |
| D. Validacion reproducible | partial | `scripts/ards-check.js:117-142`; subchecks `css:types:check` y `lint:check` ejecutados | Alto |
| E. Policies y guardrails | partial | `specs/integration/policies.yaml:24-33`, `.env:1-9`, `.gitignore:59-61` | Alto |
| F. Continuidad, State y Evidence | partial | `specs/states/00-index.yaml:6-26`, `docs/tasks/README.md:5-15` | Alto |
| G. Capabilities y coordinacion cross-repo | partial | `specs/capabilities/inbound/00-index.yaml:6-66`, TODOs en capabilities | Alto |
| H. Portabilidad y automatizacion gobernada | partial | `specs/10-ai-generation.yml:55-89`, `.agents/skills` permitido en `specs/01-project-structure.yml:16-20` | Medio |
| I. Integridad y anti-cumplimiento cosmetico | partial | indices resuelven, pero hay TODOs normativos y upstream pendientes | Alto |

# 4. Hallazgos priorizados

```yaml
id: FINDING-ARDS-001
control_ids: [ARDS-24, ARDS-25, ARDS-26, ARDS-28, ARDS-31, ARDS-33, ARDS-40]
type: fact
status: partial
severity: high
confidence: high
title: "La trazabilidad con el orquestador esta adoptada pero queda incompleta con TODOs en metadatos gobernados"
evidence:
  - kind: file
    reference: "AGENTS.md:327-335"
    detail: "Declara gobierno por 4uentes-orchestor y exige orchestrator_link antes de cerrar trabajo gobernado."
  - kind: file
    reference: "docs/cross-repo/orchestrator-link-rule.md:24-31"
    detail: "state_id debe corresponder a estado vivo cuando exista; request_id puede ser TODO solo si luego se reconcilia."
  - kind: file
    reference: "specs/33-articles-frontend.yml:57-66"
    detail: "Capability local implementada conserva state_id, request_id y correlation_id en TODO."
  - kind: file
    reference: "specs/capabilities/inbound/node-auth--auth-frontend-access-ui.yaml:12-21"
    detail: "Capability aceptada/implementada conserva state_id, request_id y correlation_id en TODO."
impact: "El Control Plane no puede cerrar drift ni evaluar impacto cross-repo sin reconciliar metadata viva; la evidencia local existe pero no queda enlazada a State gobernado."
minimum_remediation: "Crear un INIT cross-repo de reconciliacion de orchestrator_link para mapear cada TODO vigente contra state/request/correlation reales o marcar excepcion gobernada."
dependencies: ["4uentes-orchestor state/capability-links.yaml"]
```

```yaml
id: FINDING-ARDS-002
control_ids: [ARDS-29, ARDS-30, ARDS-31, ARDS-32, ARDS-40]
type: fact
status: partial
severity: high
confidence: high
title: "Capabilities inbound figuran como implemented aunque algunos contratos upstream formales siguen sin publicar"
evidence:
  - kind: file
    reference: "specs/capabilities/inbound/00-index.yaml:6-66"
    detail: "El indice marca multiples adoptions con adoption_status implemented."
  - kind: file
    reference: "specs/capabilities/inbound/node-auth--article-detail-include-documents.yaml:8-10"
    detail: "upstream_ref y upstream_publication_status estan en TODO, pero adoption_status es implemented."
  - kind: file
    reference: "specs/capabilities/inbound/node-auth--article-detail-include-documents.yaml:23-27"
    detail: "La propia capability declara gap: node-auth todavia debe publicar outbound capability formal."
impact: "La implementacion local puede ser real, pero el contrato productor/consumidor no esta completamente verificable desde artefactos versionados."
minimum_remediation: "Separar estado local de implementacion y estado de contrato upstream; publicar o referenciar outbound capability de node-auth antes de considerar completo el binding cross-repo."
dependencies: ["node-auth outbound capability", "4uentes-orchestor reconciliation"]
```

```yaml
id: FINDING-ARDS-003
control_ids: [ARDS-14, ARDS-15, ARDS-17, ARDS-18, ARDS-41]
type: fact
status: partial
severity: high
confidence: high
title: "El gate agregado existe, pero no fue verificable completo bajo auditoria read-only"
evidence:
  - kind: file
    reference: "AGENTS.md:147-163"
    detail: "Define `npm run check` como gate operativo e incluye lint, build y test."
  - kind: file
    reference: "scripts/ards-check.js:137-140"
    detail: "Ejecuta css modules check, ESLint, Webpack build y Jest."
  - kind: command
    reference: "npm.cmd run css:types:check"
    detail: "exit code 0; declarations and style usage in sync."
  - kind: command
    reference: "npm.cmd run lint:check"
    detail: "exit code 0; 0 errors, 22 warnings."
  - kind: command
    reference: "npm.cmd test -- --no-cache"
    detail: "exit code 1; EPERM al escribir haste-map de Jest en Temp."
impact: "La ruta de validacion esta bien definida, pero el resultado completo no puede reproducirse sin un entorno con permisos de escritura controlados."
minimum_remediation: "Documentar una variante audit-safe o CI-safe para `npm run check` con directorios de cache/output controlados, y registrar evidencia de una corrida completa en entorno autorizado."
dependencies: []
```

```yaml
id: FINDING-ARDS-004
control_ids: [ARDS-22, ARDS-39]
type: fact
status: partial
severity: high
confidence: medium
title: "Existe un `.env` fisico con nombres de valores sensibles dentro del arbol auditado"
evidence:
  - kind: file
    reference: ".env:1-9"
    detail: "Contiene claves por nombre SIG_BYTES, KDF_SA1..KDF_SA4, API y VITE_BF_BASE_URL; valores no se reproducen en este informe."
  - kind: file
    reference: ".gitignore:59-61"
    detail: "`.env` y `.env.local` estan ignorados."
  - kind: file
    reference: "AGENTS.md:85-90"
    detail: "Prohibe commitear secretos y exige mantener `.env.example` alineado."
impact: "Aunque `.gitignore` reduce riesgo de versionado, la presencia de secretos o seeds reales en el workspace compartido debilita higiene operativa y auditoria reproducible."
minimum_remediation: "Mover valores reales fuera del arbol del repo o documentar explicitamente que `.env` local no es artefacto versionado; verificar con Git en un entorno seguro si fue trackeado historicamente."
dependencies: ["Git access without dubious ownership"]
```

```yaml
id: FINDING-ARDS-005
control_ids: [ARDS-24, ARDS-25, ARDS-26, ARDS-27]
type: inference
status: partial
severity: medium
confidence: high
title: "State existe como indice, pero no como estado vivo suficientemente expresivo"
evidence:
  - kind: file
    reference: "specs/states/00-index.yaml:6-26"
    detail: "Indexa fuentes de state y remite a specs/task evidence, pero no lista estados vivos con implementado/parcial/pendiente/bloqueado/descartado/no incorporado."
  - kind: file
    reference: "docs/tasks/README.md:5-15"
    detail: "Docs/tasks registra cambios, QA y validaciones, pero es historico."
impact: "Un agente posterior puede retomar contexto, pero no puede computar estado operativo completo sin leer historico narrativo y resolver TODOs."
minimum_remediation: "Agregar o completar un state registry local machine-readable que enlace features/capabilities, estado, blockers, evidencia y validaciones."
dependencies: ["FINDING-ARDS-001"]
```

```yaml
id: FINDING-ARDS-006
control_ids: [ARDS-12]
type: fact
status: partial
severity: medium
confidence: high
title: "ADRs existen como puente, pero las decisiones no estan normalizadas como ADRs formales"
evidence:
  - kind: file
    reference: "docs/adr/README.md:1-16"
    detail: "El indice declara que `docs/architecture/*` sigue siendo material vigente mientras no se migre a ADRs formales."
impact: "Hay contexto arquitectonico, pero el formato de decisiones, consecuencias y estado queda distribuido."
minimum_remediation: "Promover decisiones criticas de `docs/architecture/*` a ADRs formales cuando cambien o cuando sean usadas para aprobar CRs relevantes."
dependencies: []
```

# 5. Matriz completa de controles

| ID | Nivel | Estado | Evidencia | Nota |
|---|---|---|---|---|
| ARDS-01 | MUST | compliant | `AGENTS.md:1-7` | Existe en raiz y define repo, rol, stack y surface. |
| ARDS-02 | MUST | compliant | `AGENTS.md:42-72`, `AGENTS.md:92-163`, `AGENTS.md:218-225` | Incluye comandos, estructura, SoT, validacion y DoD. |
| ARDS-03 | MUST | compliant | `AGENTS.md:25-30`, `specs/01-project-structure.yml:1-14` | Identifica servicio SPA frontend y limites de runtime. |
| ARDS-04 | SHOULD | partial | `AGENTS.md:179-196` | Hay reglas por dominio, no se observaron overrides por subdirectorio. |
| ARDS-05 | MUST | compliant | `specs/00-index.yaml:1-18`, `specs/00-index.yaml:57-180` | Indice canonico de specs vigente. |
| ARDS-06 | MUST | compliant | `specs/33-articles-frontend.yml:140-160`, `specs/17-testing.yml:8-18` | Specs incluyen scope, reglas, testing y contratos verificables. |
| ARDS-07 | MUST | partial | `docs/tasks/README.md:5-15`, `specs/33-articles-frontend.yml:57-66` | Hay trazabilidad, pero con TODOs en state/request/correlation. |
| ARDS-08 | MUST | partial | `specs/capabilities/inbound/node-auth--article-detail-include-documents.yaml:8-27` | Implementado local con contrato upstream formal pendiente. |
| ARDS-09 | SHOULD | compliant | `specs/00-index.yaml:176-180`, `AGENTS.md:197-205` | Declara deprecated/transitional y reemplazos. |
| ARDS-10 | MUST | compliant | `docs/00-overview.md:1-10`, `docs/00-overview.md:48-68` | Overview documental suficiente. |
| ARDS-11 | MUST | compliant | `docs/00-overview.md:69-86`, `docs/00-overview.md:123-131` | Enlaza dominios, validacion y fuentes. |
| ARDS-12 | SHOULD | partial | `docs/adr/README.md:1-16` | ADR formal pendiente; arquitectura vive en docs de referencia. |
| ARDS-13 | MUST | compliant | `docs/00-overview.md:88-115` | Docs clasificados como normative/derived/reference/historical y no reemplazan specs. |
| ARDS-14 | MUST | partial | `AGENTS.md:147-163`, `scripts/ards-check.js:117-142` | Ruta existe; corrida completa no verificada en read-only. |
| ARDS-15 | MUST | compliant | `package.json` scripts; `npm.cmd run css:types:check`, `npm.cmd run lint:check` | Scripts existen; subchecks ejecutaron. |
| ARDS-16 | MUST | compliant | `AGENTS.md:218-225` | DoD define `npm run check`, alineacion specs/docs y QA. |
| ARDS-17 | MUST | partial | comandos ejecutados en seccion 2 | Se distinguen exitos y limitaciones; build/test completos no verificados. |
| ARDS-18 | SHOULD | compliant | `package.json` script `check`, `scripts/ards-check.js:117-142` | Existe gate agregado. |
| ARDS-19 | MUST | compliant | `AGENTS.md:165-170`, `AGENTS.md:207-217` | Guardrails locales de seguridad, IA y dependencias. |
| ARDS-20 | MUST | compliant | `specs/integration/policies.yaml:1-14`, `specs/integration/policies.yaml:34-72` | Policies core adoptadas localmente. |
| ARDS-21 | MUST | compliant | `AGENTS.md:207-212`, `docs/ai/policy.md:10-15` | IA como ejecutor, no decisor. |
| ARDS-22 | MUST | partial | `AGENTS.md:85-90`, `.env:1-9`, `.gitignore:59-61` | Tratamiento declarado; existe `.env` fisico sensible. |
| ARDS-23 | SHOULD | partial | `specs/integration/policies.yaml:34-72` | Policies adoptadas; aprobaciones humanas por riesgo no estan detalladas localmente. |
| ARDS-24 | MUST | partial | `specs/states/00-index.yaml:6-26`, `docs/tasks/README.md:5-15` | Retomable, pero State vivo incompleto. |
| ARDS-25 | MUST | partial | `specs/states/00-index.yaml:16-26` | No diferencia todos los estados requeridos en un registro vivo. |
| ARDS-26 | MUST | partial | `docs/tasks/README.md:5-15`, capability `qa_refs` | Evidence existe, pero enlaces a State/orquestador quedan incompletos. |
| ARDS-27 | MUST | compliant | `docs/tasks/README.md`, `specs/capabilities/inbound/*` | No depende solo de conversaciones IA. |
| ARDS-28 | SHOULD | partial | `specs/states/00-index.yaml:16-26` | Enlaces parciales a specs/task_ref; faltan blockers/CRs completos. |
| ARDS-29 | MUST | compliant | `specs/capabilities/inbound/00-index.yaml:6-66` | Capabilities inbound declaradas. |
| ARDS-30 | MUST | partial | `specs/capabilities/inbound/node-auth--auth-frontend-access-ui.yaml:6-21` | Contrato/productor/estado existen, pero upstream_ref queda TODO. |
| ARDS-31 | MUST | partial | `docs/cross-repo/orchestrator-link-rule.md:1-39` | Mecanismo existe; varios links no reconciliados. |
| ARDS-32 | SHOULD | compliant | `specs/ards/contract-binding.yaml:1-13` | Binding local a ARDS Core con core_ref. |
| ARDS-33 | SHOULD | partial | `specs/00-index.yaml:218-225` | Señales declaradas; TODOs reducen deteccion automatica de drift. |
| ARDS-34 | MUST | compliant | `specs/10-ai-generation.yml:55-89`, `docs/ai/policy.md:10-15` | Conocimiento critico vive en specs/docs. |
| ARDS-35 | MUST | compliant | `specs/10-ai-generation.yml:77-83`, `docs/ai/policy.md:14-15` | Skills/proveedores complementan, no reemplazan. |
| ARDS-36 | SHOULD | partial | `scripts/ards-check.js:117-142` | Automatizacion existe; falta variante audit-safe completa. |
| ARDS-37 | MAY | compliant | `.agents/skills` presente; `specs/01-project-structure.yml:16-20` | Skills locales permitidas y portables como complemento. |
| ARDS-38 | MUST | compliant | validacion de paths indexados: sin `MISSING` | Referencias `path:` principales resuelven. |
| ARDS-39 | MUST | partial | `rg TODO...`; `.env:1-9` | TODOs explicitos permitidos, pero algunos estan en metadatos de cierre. |
| ARDS-40 | MUST | partial | capability implemented con upstream TODO | Afirmaciones locales no siempre coinciden con evidencia cross-repo completa. |
| ARDS-41 | SHOULD | compliant | `scripts/ards-check.js:10-33`, `scripts/ards-check.js:117-142` | Hay check automatico parcial del contrato ARDS/SDD. |

# 6. Backlog de remediacion propuesto

| Orden | Unidad | Tipo | Riesgo | Descripcion | Dependencias |
|---|---|---|---|---|---|
| 1 | INIT cross-repo | INIT cross-repo | Alto | Reconciliar `orchestrator_link` de specs, capabilities y task reports contra `4uentes-orchestor/state/capability-links.yaml`; reemplazar TODOs por IDs reales o excepciones gobernadas. | Control Plane |
| 2 | Capability contract reconciliation | INIT cross-repo | Alto | Publicar/referenciar outbound capabilities faltantes de `node-auth` y actualizar `upstream_ref`/`upstream_publication_status` en `sst-fend`. | node-auth, Control Plane |
| 3 | State registry local | CR local del Service | Alto | Completar `specs/states/00-index.yaml` o agregar state registry local machine-readable con estados: implemented, partial, pending, blocked, discarded, not_in_solution. | Unidad 1 |
| 4 | Audit-safe validation | CR local del Service | Alto | Documentar o implementar modo de validacion no mutante: cache/output controlados para Jest/Webpack o evidencia CI adjunta. | Ninguna |
| 5 | Secret hygiene | CR local del Service | Alto | Verificar si `.env` fue versionado; mover valores reales fuera del arbol o dejar solo placeholders; documentar manejo local. | Git disponible |
| 6 | ADR normalization | CR local del Service | Medio | Migrar decisiones criticas de `docs/architecture/*` a ADRs formales cuando sean tocadas por CRs. | Ninguna |
| 7 | Policy approval matrix | CR del Core o Control Plane | Medio | Estandarizar reglas de aprobacion humana por riesgo y propagar adopcion local. | Core/Control Plane |

# 7. Evidencia positiva

- `AGENTS.md` es sustantivo: identifica rol, stack, integracion con BF, golden paths, seguridad, Source of Truth y Definition of Done.
- `specs/00-index.yaml` funciona como indice canonico y declara status, dominios, templates, policies, validation y binding con orquestador.
- `docs/00-overview.md` separa material normativo, derivado, reference e historico, reduciendo ambiguedad entre docs y specs.
- `scripts/ards-check.js` no es placeholder: valida archivos requeridos, referencias clave, CSS module types, ESLint, Webpack y Jest.
- `npm.cmd run css:types:check` paso correctamente.
- `npm.cmd run lint:check` paso sin errores, aunque con 22 warnings de hooks.
- Hay adopcion local de policies heredadas desde Core en `specs/integration/policies.yaml`.
- Hay `specs/ards/contract-binding.yaml` con `core_ref` y `last_validated_at`.
- Las capabilities inbound estan indexadas y enlazan docs, specs, implementation summaries y QA refs.
- Los paths principales declarados en indices auditados resolvieron sin faltantes.

# 8. Preguntas abiertas

- Cuales son los `state_id`, `request_id` y `correlation_id` definitivos en `4uentes-orchestor` para las capabilities/features que hoy estan en `TODO`?
- El archivo `.env` fisico contiene valores reales o placeholders compartidos, y alguna vez estuvo trackeado en Git?
- Existe evidencia CI o una corrida autorizada reciente de `npm run check` completa fuera del sandbox read-only?

# Handoff para adopcion por humano + agente IA constructor

## Objetivo de adopcion

Llevar `sst-fend` desde perfil observado `standard` parcial hacia `baseline_conformant_with_observations`, con trazabilidad cross-repo reconciliada, State vivo machine-readable, capabilities con contratos upstream verificables y validacion reproducible en entorno audit-safe.

## Brecha resumida

El repo ya tiene estructura ARDS/SDD real, pero la adopcion avanzada esta a medio cerrar: los artefactos existen, pero varios estados y capabilities no estan reconciliados con Control Plane; la evidencia ejecutable completa no fue reproducible en read-only; y la higiene de secretos necesita verificacion.

## Secuencia recomendada

1. INIT cross-repo de reconciliacion de `orchestrator_link`.
2. INIT cross-repo de contratos outbound faltantes de `node-auth`.
3. CR local para State registry vivo de `sst-fend`.
4. CR local para validacion audit-safe.
5. CR local para higiene de `.env` y documentacion de secretos.
6. CR local incremental para ADRs formales en decisiones criticas.

## Unidad de cambio sugerida por paso

- Paso 1: `INIT cross-repo`.
- Paso 2: `INIT cross-repo`.
- Paso 3: `CR local del Service`.
- Paso 4: `CR local del Service`.
- Paso 5: `CR local del Service`.
- Paso 6: `CR local del Service`.

## Alcance por paso

- Paso 1: `specs/33-articles-frontend.yml`, `specs/34-dictionary-frontend.yml`, `specs/35-home-frontend.yml`, `specs/36-public-landing-frontend.yml`, `specs/37-branding-frontend.yml`, `specs/capabilities/inbound/*.yaml`, `docs/tasks/*.md`, `docs/cross-repo/orchestrator-link-rule.md`.
- Paso 2: `specs/capabilities/inbound/*.yaml`, `docs/capabilities/inbound/*.md`, evidence del productor `node-auth`.
- Paso 3: `specs/states/00-index.yaml` o nuevo artefacto bajo `specs/states/`.
- Paso 4: `scripts/ards-check.js`, `package.json`, `docs/00-overview.md`, `AGENTS.md`.
- Paso 5: `.env.example`, `AGENTS.md`, `docs/policies/README.md`, verificacion Git de `.env`.
- Paso 6: `docs/adr/README.md`, `docs/architecture/*`.

## Criterios de aceptacion

- Paso 1: ningun `orchestrator_link` de trabajo cerrado conserva `state_id`, `request_id` o `correlation_id` en `TODO` salvo excepcion explicita y fechada.
- Paso 2: cada capability `implemented` tiene `upstream_ref` resoluble o estado separado que indique `implemented_local_contract_pending`.
- Paso 3: State local permite filtrar implementado, parcial, pendiente, bloqueado, descartado y no incorporado a Solution.
- Paso 4: un auditor puede ejecutar una ruta documentada que no escriba fuera de directorios controlados o puede consumir evidencia CI verificable.
- Paso 5: no hay secretos reales requeridos dentro del arbol versionable; `.env` queda tratado como local no persistente.
- Paso 6: decisiones criticas nuevas o modificadas registran contexto, decision, consecuencias y estado.

## Evidence requerida

- Outputs de `npm.cmd run check` o variante audit-safe completa.
- Diff o reporte del Control Plane mostrando links reconciliados.
- Referencias outbound de `node-auth` para capabilities consumidas.
- Verificacion Git de tracking/historia de `.env`.
- Task report o CR evidence por cada unidad cerrada.

## Policies y guardrails aplicables

- `AGENTS.md` Source of Truth y DoD.
- `specs/integration/policies.yaml` policies heredadas de Core.
- `docs/cross-repo/orchestrator-link-rule.md` para todo trabajo gobernado por `4uentes-orchestor`.
- Aprobacion humana requerida para reconciliacion cross-repo, cambios de contrato capability, decision de secretos y cierre de State.
- No modificar contratos funcionales ni runtime mientras se reconcilia metadata, salvo CR separado.

## Riesgos y no-objetivos

- No convertir task reports historicos en fuente primaria nueva.
- No marcar capabilities como completas solo por implementacion local si falta outbound upstream.
- No ejecutar build/test con escritura no controlada dentro de auditorias read-only.
- No publicar valores de `.env` en docs, reports o evidencia.
- No usar prompts o conversaciones como reemplazo de State/Evidence versionados.

## Primer siguiente paso recomendado

Iniciar un `INIT cross-repo` de reconciliacion de `orchestrator_link` entre `sst-fend` y `4uentes-orchestor`, porque desbloquea State, Evidence, drift detection y cierre correcto de capabilities.

```yaml
adoption_handoff:
  readiness: ready
  recommended_first_unit:
    type: INIT
    id_suggestion: "INIT-SST-FEND-ARDS-ORCHESTRATOR-LINK-RECONCILIATION"
    title: "Reconciliar orchestrator_link de sst-fend con Control Plane"
    reason: "Es la dependencia principal para cerrar trazabilidad, State y capabilities sin cambiar runtime."
  ordered_units:
    - order: 1
      type: INIT
      scope: "Reconciliar state_id, request_id, correlation_id y evidence_ref en specs/capabilities/docs gobernados por 4uentes-orchestor."
      acceptance_criteria:
        - "No quedan TODOs en orchestrator_link de trabajo cerrado salvo excepcion documentada."
        - "Cada capability local enlaza State o request gobernado."
      required_evidence:
        - "Reporte o diff del Control Plane."
        - "Listado de artefactos actualizados y links resolubles."
      human_approval: required
    - order: 2
      type: INIT
      scope: "Alinear capabilities inbound de sst-fend con outbound formal de node-auth."
      acceptance_criteria:
        - "Cada adoption_status implemented tiene upstream_ref resoluble o estado contractual diferenciado."
      required_evidence:
        - "Outbound capability de node-auth."
        - "Actualizacion de specs/capabilities/inbound/*.yaml."
      human_approval: required
    - order: 3
      type: CR
      scope: "Completar State registry local machine-readable en specs/states."
      acceptance_criteria:
        - "El registry diferencia implemented, partial, pending, blocked, discarded y not_in_solution."
        - "Cada estado relevante enlaza evidence y validation."
      required_evidence:
        - "npm.cmd run css:types:check"
        - "npm.cmd run lint:check"
        - "Revision de paths y enlaces."
      human_approval: conditional
    - order: 4
      type: CR
      scope: "Agregar/documentar validacion audit-safe para ARDS/SDD y calidad frontend."
      acceptance_criteria:
        - "Existe ruta documentada que no requiere escritura no controlada o evidencia CI equivalente."
        - "El resultado distingue exito, fallo y limitacion de entorno."
      required_evidence:
        - "Output completo de check audit-safe o CI."
      human_approval: conditional
    - order: 5
      type: CR
      scope: "Higiene de secretos y `.env` local."
      acceptance_criteria:
        - "Se verifica si `.env` esta trackeado o historicamente expuesto."
        - "Valores reales quedan fuera del arbol versionable o documentados como placeholders."
      required_evidence:
        - "Comandos Git de verificacion."
        - "Documento de manejo de env/secrets actualizado."
      human_approval: required
  blockers:
    - "Git local bloqueado por dubious ownership para obtener commit, branch y tracking de .env."
    - "Jest escribe haste-map en Temp bajo sandbox read-only."
    - "Webpack build puede escribir artefactos y no fue ejecutado en auditoria read-only."
  non_goals:
    - "No cambiar runtime funcional de auth, articles, dictionary, home o landing durante reconciliacion."
    - "No inventar outbound capabilities de node-auth desde sst-fend."
    - "No persistir secretos ni valores de .env en evidencia."
```