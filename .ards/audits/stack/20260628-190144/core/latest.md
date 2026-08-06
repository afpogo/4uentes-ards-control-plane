---
artifact_type: ards_audit_report
audit_template_id: ARDS-CORE-AUDIT-001
audit_template_version: 0.3.0
target_type: canonical_core_repository
target_repository: C:\Users\andre\Desktop\4uentes\apps\4uentes-core
target_commit: 2ad4e0f4aeddbf603d5541c5f6f4acfab8e7006d
generated_at: 2026-06-28T19:01:44-03:00
report_path: C:\Users\andre\Desktop\4uentes\apps\4uentes-orchestor\.ards\audits\stack\20260628-190144\core\20260628-190144\core-audit-and-adoption.md
adoption_handoff: ready
---

# 1. Veredicto ejecutivo

- `overall_status`: `core_partial`
- `confidence`: `high`
- version de Core observada: package `0.1.0`, contrato MCP/sync `ards-core-contract-v0.1`, estandar/perfiles `v1`

El repositorio implementa un Core ARDS/SDD reusable real: declara alcance canonico, separa `standard/`, `governance/`, `templates/`, `docs/`, `admin/`, `prompts/` y expone un contrato MCP read-only para consumo por orquestadores. Los boundary controls principales estan mayormente conformes: no se observo logica de negocio ni escritura normal sobre repos hijos, y el Control Plane queda definido como consumidor/aplicador.

No alcanza conformidad plena porque varios modelos obligatorios siguen incompletos o no deterministas: CR no tiene modelo canonico propio, INIT existe como plan MCP pero no como lifecycle canonico formal, State/Evidence carecen de schema deterministico completo, y varios perfiles/templates figuran como `initial-profile`, `needs-review` o con TODOs. La validacion propia pasa, pero valida estructura, links, YAML y tono; no cubre compatibilidad profunda de perfiles, bindings, drift ni schemas de todos los modelos.

# 2. Mapa de artefactos canonicos

| Dominio | Artefacto normativo | Version | Consumidor | Validacion |
|---|---|---:|---|---|
| Estandar base | `standard/ARDS_CORE_STANDARD_BASE_v1.md` | v1 | Services, Control Plane | `npm.cmd run check` exit 0 |
| Kind model | `standard/ARDS_KIND_MODEL_v1.md`, `schemas/ards-kind.schema.yaml` | v1 / 1.0 | MCP, Services | YAML syntax en `npm.cmd run check` |
| Minimum contract | `governance/repo-minimum-contract.md` | no explicita | Services, Control Plane | presencia y links |
| Definition of Done | `governance/definition-of-done.md` | no explicita | humanos/agentes | presencia y links |
| Source validation | `governance/source-validation.md`, `docs/reference-sources.md` | source maps 1.0 | mantenedores Core | presencia, links, YAML embebido no validado como schema |
| Policies globales | `specs/integration/policies.yaml`, `specs/policies/ards-sdd-policy-component-model.yaml`, `docs/policies/*` | 1.0 | agentes, repos hijos | YAML syntax |
| Capability | `schemas/capability.inbound.schema.yaml`, `schemas/capability.outbound.schema.yaml`, `templates/specs/capabilities/*` | 1.0 | productores/consumidores | YAML syntax; sin validador semantico |
| State | `templates/specs/state-scenario.template.yaml`, `templates/specs/states/00-index.template.yaml`, docs conceptuales | 1.0 | Services, Control Plane | YAML syntax; schema parcial |
| Adoption binding | `templates/specs/ards/contract-binding.template.yaml`, `admin/decisions/0006-child-contract-binding.md` | 0.1 | repos hijos | YAML syntax; contrato MCP |
| Sync contract | `tools/mcp/catalog.ts`, `docs/concepts/core-orchestrator-child-sync.md` | `ards-core-contract-v0.1` | orquestador | `npm.cmd run check`; `mcp:smoke` no ejecutado por escritura de `dist/` |
| MCP interface | `tools/mcp/server.ts`, `admin/mcp-usage.md` | server 0.1.0 | agentes/MCP clients | inspeccion estatica; smoke no read-only |
| Templates | `templates/**` | varios `schema_version` 1.0 | repos hijos | YAML syntax |
| Prompts | `prompts/*.prompt.md` | sin version individual | agentes | presencia y links |

# 3. Evaluacion canon versus instancia

Contenido correctamente canonico:
- `README.md:18-28` define rol del repo como estandar base, templates, gobernanza minima y no runtime.
- `docs/concepts/ards-core.md:21-27` separa Core, Control Plane y repo hijo; el repo hijo no copia el core completo.
- `governance/repo-minimum-contract.md:7-12` define archivos minimos, incluido `specs/ards/contract-binding.yaml`.
- `docs/concepts/core-orchestrator-child-sync.md:16-30` define que el Core contiene estandares, templates, governance, prompts y MCP read-only.
- `admin/decisions/0004-core-orchestrator-child-sync-boundary.md:19-30` establece que el Core provee contratos y no inspecciona ni modifica repos hijos.

Contenido especifico de Solution encontrado:
- Hay referencias a patrones observados en repos concretos: `standard/ARDS_CORE_STANDARD_BASE_v1.md:174` deriva una regla de `sst-bend`; `standard/ARDS_BACKEND_BFF_CORE_PROFILE_v1.md:9` indica base inicial en `4uentes-auth`/`node-auth`; `docs/reference-sources.md:208-233` registra `4uentes-orchestor` como fuente observada validada.
- Esas referencias estan mayormente tratadas como evidencia/fuente, no como estado operativo vivo. No se encontro catalogo operativo, requests vivos ni evidence concreta de una Solution dentro del Core.

Definiciones que deberian promoverse desde Control Plane:
- El modelo reusable de service catalog, request registry y state machine aun esta pendiente: `standard/ARDS_CONTROL_PLANE_CORE_PROFILE_v1.md:93-94` y `admin/decisions/0007-control-plane-project-type.md:52-53`.
- Policy governance ya fue promovido desde el orquestador por decision: `admin/decisions/0008-agent-policy-governance-adoption.md:23-33`.

Contenido que deberia permanecer local y no entrar al Core:
- Catalogos vivos de services/solutions, request lifecycle instanciado, evidence manifests historicos, bindings locales y state machine de una instancia concreta. El propio Core lo separa en `docs/concepts/core-orchestrator-child-sync.md:32-67`.

# 4. Resumen por dimension

| Dimension | Estado | Evidencia principal | Riesgo |
|---|---|---|---|
| A. Identidad canonica y versionado | `partial` | `README.md:18-28`, `package.json:2-3`, `admin/decisions/0005-contract-versioning.md:18-44` | Politica de deprecacion futura aun TODO |
| B. Estandar ARDS/SDD reusable | `partial` | `governance/repo-minimum-contract.md:7-12`, perfiles en `standard/*` | Perfiles `initial-profile` y templates con TODO |
| C. Governance y modelos canonicos | `partial` | DoD, source validation, policies y schemas de capability existen | CR/INIT/State/Evidence incompletos |
| D. Canon versus instancia | `compliant` | `admin/decisions/0004...:28-41`, `docs/concepts/ards-core.md:119-126` | Bajo; vigilar promocion de patrones observados |
| E. Consumo y sincronizacion | `partial` | `tools/mcp/catalog.ts:427-477`, binding template | Buen contrato inicial, falta schema/validador de diff |
| F. Recursos reusables y portabilidad | `partial` | tool-agnostic en `README.md:28`, MCP read-only | Prompts sin version individual |
| G. Integridad y validacion | `partial` | `npm.cmd run check` exit 0 | Check no cubre contratos semanticos ni compatibilidad |
| H. Limites de ejecucion y seguridad | `compliant` | `admin/mcp-usage.md:3-11`, `server.ts` usa lectura/plan | Mutaciones futuras requieren policy separada |

# 5. Hallazgos priorizados

```yaml
id: FINDING-CORE-001
control_ids: [CORE-17, CORE-18, CORE-19]
type: fact
status: non_compliant
severity: high
confidence: high
title: "CR e INIT no tienen lifecycle canonico completo"
evidence:
  - kind: absence
    reference: "rg -n '\\bCR\\b|change request|INIT|lifecycle' target"
    detail: "No aparece un modelo canonico de CR con estados, autoridad, evidencia y cierre; INIT existe como plan_project_init, no como lifecycle normativo completo."
  - kind: file
    reference: "admin/mcp-contract-draft.md:244-275"
    detail: "`ards.plan_project_init` devuelve un plan read-only, pero no formaliza INIT como modelo de cambio gobernado."
  - kind: file
    reference: "prompts/review-child-contract-binding.prompt.md:173"
    detail: "El cierre con decision humana aparece en un prompt, no como contrato canonico general de CR/INIT."
impact: "Los agentes constructores no tienen una unidad de cambio canonica suficiente para proponer, aprobar, validar y cerrar cambios de Core o adopcion."
minimum_remediation: "Definir modelos canonicos CR e INIT con estados, autoridad, permisos, evidencia requerida, compatibilidad y cierre; agregar templates/schemas o declarar exclusion temporal explicita."
suggested_change_unit: CR-CORE
```

```yaml
id: FINDING-CORE-002
control_ids: [CORE-16, CORE-21, CORE-40, CORE-43]
type: fact
status: partial
severity: high
confidence: high
title: "State y Evidence existen como concepto/template, pero no como schema deterministico completo"
evidence:
  - kind: file
    reference: "standard/ARDS_CORE_STANDARD_BASE_v1.md:90-101"
    detail: "Define state scenarios y campos minimos en texto."
  - kind: file
    reference: "templates/specs/state-scenario.template.yaml:1-3"
    detail: "Existe template YAML con `schema_version`, `kind` y `state_id`."
  - kind: file
    reference: "docs/concepts/core-orchestrator-child-sync.md:221-222"
    detail: "La evidencia de sync se describe como manifest con paths, hashes, YAML, TODOs/excepciones e items de diff."
  - kind: absence
    reference: "schemas/"
    detail: "Solo hay schemas para kind y capabilities; no hay schema machine-readable para state_scenario, evidence_manifest, sync_diff ni contract_binding."
impact: "La deteccion de drift y la validacion de Evidence dependen parcialmente de interpretacion humana/agente."
minimum_remediation: "Agregar schemas/validadores para state scenario, evidence manifest, sync diff y contract binding; conectar esos schemas al validador."
suggested_change_unit: CR-CORE
```

```yaml
id: FINDING-CORE-003
control_ids: [CORE-08, CORE-09, CORE-13, CORE-41]
type: fact
status: partial
severity: medium
confidence: high
title: "Varios perfiles son iniciales o necesitan revision antes de ser canon cerrado"
evidence:
  - kind: file
    reference: "standard/ARDS_BACKEND_BFF_CORE_PROFILE_v1.md:3"
    detail: "Estado `initial-profile, needs-review`."
  - kind: file
    reference: "standard/ARDS_FRONTEND_WEB_CORE_PROFILE_v1.md:3"
    detail: "Estado `initial-profile`."
  - kind: file
    reference: "standard/ARDS_CONTROL_PLANE_CORE_PROFILE_v1.md:3"
    detail: "Estado `initial-profile`."
  - kind: file
    reference: "docs/reference-sources.md:60-80"
    detail: "Fuente backend-bff observada en 4uentes-auth figura `needs-review` y no debe promoverse a canon final todavia."
  - kind: file
    reference: "tools/mcp/catalog.ts:156-159"
    detail: "El catalogo MCP arrastra `source_validation_missing` y TODOs para backend-bff."
impact: "Un consumidor puede adoptar perfiles aun no estabilizados como si fueran canon definitivo."
minimum_remediation: "Clasificar perfiles por estabilidad normativa, bloquear o marcar explicitamente consumo de `needs-review`, y definir criterios de promocion a `active`."
suggested_change_unit: CR-CORE
```

```yaml
id: FINDING-CORE-004
control_ids: [CORE-39, CORE-40, CORE-43, CORE-44]
type: fact
status: partial
severity: medium
confidence: high
title: "La validacion propia pasa, pero no cubre semantica contractual ni drift real"
evidence:
  - kind: command
    reference: "npm run check"
    detail: "Exit code 1 por PowerShell ExecutionPolicy al cargar npm.ps1; no ejecuto el check."
  - kind: command
    reference: "npm.cmd run check"
    detail: "Exit code 0; Required Files, Internal Links, YAML Syntax, Tone & Scope pasaron con 0 errores y 0 warnings."
  - kind: file
    reference: "VALIDATION.md:45-75"
    detail: "El validador cubre archivos requeridos, links, YAML y tono/scope."
  - kind: file
    reference: "VALIDATION.md:90-96"
    detail: "Profile-specific validation, CI, reportes y pre-commit siguen como future enhancements."
impact: "El Core puede parecer valido aunque existan incompatibilidades entre perfiles, schemas, sync contracts o bindings."
minimum_remediation: "Extender `validate.ts` con validacion semantica de project types, schemas de bindings/diff/state/evidence y fixtures de compatibilidad."
suggested_change_unit: CR-CORE
```

```yaml
id: FINDING-CORE-005
control_ids: [CORE-04, CORE-32]
type: fact
status: partial
severity: medium
confidence: high
title: "Versionado de sync existe, pero soporte/deprecacion futura no esta cerrado"
evidence:
  - kind: file
    reference: "admin/decisions/0005-contract-versioning.md:18-44"
    detail: "Define `ards-core-contract-v0.1`, resolucion de `latest`, error para versiones desconocidas y regla de version nueva para breaking changes."
  - kind: file
    reference: "admin/decisions/0005-contract-versioning.md:78-79"
    detail: "Queda TODO definir politica de soporte y deprecacion para `ards-core-contract-v0.2`."
  - kind: file
    reference: "admin/ADR-FORMAT.md:69-73"
    detail: "El formato ADR contempla estados `deprecated` y `superseded`."
impact: "La compatibilidad actual es clara para v0.1, pero no hay regla completa para mantener bindings existentes cuando evolucione el contrato."
minimum_remediation: "Crear politica de soporte/deprecacion con ventanas, compatibilidad de bindings, migracion y matriz de versiones soportadas."
suggested_change_unit: CR-CORE
```

```yaml
id: FINDING-CORE-006
control_ids: [CORE-27, CORE-28, CORE-29, CORE-44]
type: fact
status: partial
severity: medium
confidence: medium
title: "El contrato de adopcion/sync esta definido, pero la muestra cross-repo no encontro bindings locales materializados"
evidence:
  - kind: file
    reference: "templates/specs/ards/contract-binding.template.yaml:1-13"
    detail: "Existe template `ards_child_contract_binding` con `resolved_contract_version` y referencias al orquestador."
  - kind: file
    reference: "docs/concepts/core-orchestrator-child-sync.md:192-222"
    detail: "Documenta binding local y evidencia principal de sync."
  - kind: command
    reference: "rg -n 'ards_child_contract_binding|resolved_contract_version|ards-core-contract' related repos"
    detail: "En la muestra acotada solo aparecieron menciones conceptuales en AGENTS.md; no se detectaron bindings `specs/ards/contract-binding.yaml`."
impact: "El Core ya ofrece el mecanismo, pero la adopcion observada parece todavia conceptual o incompleta."
minimum_remediation: "Usar el Control Plane para emitir diffs read-only y guiar adopcion de `specs/ards/contract-binding.yaml` en repos hijos, sin que el Core escriba."
suggested_change_unit: CR-CONTROL-PLANE
```

```yaml
id: FINDING-CORE-007
control_ids: [CORE-33, CORE-35]
type: fact
status: partial
severity: low
confidence: high
title: "Prompts y perfiles son reusables, pero los prompts no tienen version individual ni contrato de inputs uniforme"
evidence:
  - kind: file
    reference: "README.md:5"
    detail: "El Core provee prompts reutilizables."
  - kind: file
    reference: "prompts/review-child-contract-binding.prompt.md:21-30"
    detail: "Un prompt declara fuentes canonicas y flujo detallado."
  - kind: absence
    reference: "prompts/*.prompt.md"
    detail: "No se observo front matter uniforme con version, inputs, limites y criterios de validacion por prompt."
impact: "Los prompts pueden evolucionar sin trazabilidad fina, aunque no son la unica fuente normativa."
minimum_remediation: "Agregar metadata minima a prompts o un indice versionado de prompts con proposito, inputs, limites y validacion."
suggested_change_unit: CR-CORE
```

```yaml
id: FINDING-CORE-008
control_ids: [CORE-01, CORE-23, CORE-25, CORE-31, CORE-45]
type: fact
status: partial
severity: observation
confidence: high
title: "Los limites canon/instancia estan bien definidos; hay una contradiccion documental menor sobre existencia de tooling"
evidence:
  - kind: file
    reference: "README.md:28"
    detail: "Dice que no contiene codigo funcional, scripts ni automatizacion todavia."
  - kind: file
    reference: "package.json:7-16"
    detail: "Existen scripts `check`, `mcp:stdio`, `mcp:build`, `mcp:smoke` y `build`."
  - kind: file
    reference: "docs/00-overview.md:56-61"
    detail: "Documenta `npm run check` y luego conserva TODO de definir comando cuando exista tooling."
impact: "No rompe el boundary porque el tooling es de validacion/acceso read-only, pero genera ambiguedad para auditores y agentes."
minimum_remediation: "Actualizar README/overview para distinguir tooling de validacion/MCP read-only de runtime o automatizacion mutante."
suggested_change_unit: CR-CORE
```

# 6. Matriz completa de controles

| ID | Nivel | Estado | Evidencia | Nota |
|---|---|---|---|---|
| CORE-01 | MUST | `compliant` | `README.md:18-28`, `docs/concepts/ards-core.md:3-13` | Declara Core canonico, alcance y limites. |
| CORE-02 | MUST | `compliant` | `package.json:2-3`, `standard/*_v1.md`, `admin/decisions/0005...:18-44` | Versiones identificables: package 0.1.0, perfiles v1, sync v0.1. |
| CORE-03 | MUST | `compliant` | `admin/decisions/0001...:16-30`, `README.md:106-110` | Separa admin de standard y material a copiar. |
| CORE-04 | MUST | `partial` | `admin/ADR-FORMAT.md:69-73`, `admin/decisions/0005...:78-79` | Proceso ADR existe; politica de soporte/deprecacion futura queda TODO. |
| CORE-05 | SHOULD | `compliant` | `admin/decisions/*.md`, `docs/reference-sources.md:7-18` | Cambios canonicos se ligan a decisiones/fuentes. |
| CORE-06 | MUST | `compliant` | `standard/ARDS_CORE_STANDARD_BASE_v1.md`, `governance/repo-minimum-contract.md:3-12` | Estandar base y contrato minimo existen. |
| CORE-07 | MUST | `compliant` | `standard/ARDS_CORE_STANDARD_BASE_v1.md:61-75`, `governance/repo-minimum-contract.md:82-99` | Define AGENTS, specs/docs y validacion reproducible. |
| CORE-08 | MUST | `partial` | `standard/*PROFILE_v1.md`, `tools/mcp/catalog.ts:67-377` | Hay perfiles; varios estan `initial-profile` o `needs-review`. |
| CORE-09 | MUST | `partial` | `templates/**`, `standard/ARDS_BACKEND_BFF_CORE_PROFILE_v1.md:106-108` | Templates alineados en general, pero hay TODOs de obligatoriedad/validacion. |
| CORE-10 | MUST | `compliant` | `templates/specs/ards/contract-binding.template.yaml:1-13`, `docs/concepts/orchestrator-sync-diff-examples.md:11-44` | Declara adopcion, excepciones y drift via binding/diff. |
| CORE-11 | MUST | `compliant` | `governance/repo-minimum-contract.md:7-12` | Minimum contract existe. |
| CORE-12 | MUST | `partial` | `governance/definition-of-done.md:5-15`, `:64-114` | DoD y evidencia existen; falta schema de evidencia proporcional. |
| CORE-13 | MUST | `compliant` | `governance/source-validation.md:7-12`, `docs/concepts/source-intake-model.md:30-36` | Regla de promocion y source validation claras. |
| CORE-14 | MUST | `compliant` | `governance/ai-guardrails.md`, `specs/integration/policies.yaml:56-213` | Policies y guardrails globales presentes. |
| CORE-15 | MUST | `partial` | `schemas/capability.*.schema.yaml`, `docs/concepts/capabilities-cross-repo.md:3-45` | Modelo Capability existe; validacion semantica limitada. |
| CORE-16 | MUST | `partial` | `standard/ARDS_CORE_STANDARD_BASE_v1.md:90-101`, `templates/specs/state-scenario.template.yaml:1-3` | State existe como concepto/template; vinculo Evidence no tiene schema completo. |
| CORE-17 | MUST | `non_compliant` | busqueda CR/change request | No hay modelo canonico CR/lifecycle. |
| CORE-18 | MUST | `partial` | `tools/mcp/server.ts:427-437`, `admin/mcp-contract-draft.md:244-275` | INIT existe como plan read-only, no como modelo canonico completo. |
| CORE-19 | MUST | `partial` | `specs/integration/policies.yaml:80-213`, `admin/ADR-FORMAT.md:120-127` | Agent governance cubre policies/validacion; autoridad/cierre de cambios no integral. |
| CORE-20 | MUST | `compliant` | `admin/mcp-usage.md:3-11`, `admin/mcp-contract-draft.md:391-406` | Runtime gobernado y mutaciones futuras fuera del contrato base. |
| CORE-21 | SHOULD | `partial` | `schemas/*.yaml`, ausencia de schemas state/evidence/binding/diff | Algunos modelos tienen schemas; varios no. |
| CORE-22 | MUST | `partial` | `specs/integration/policies.yaml`, `standard/ARDS_CONTROL_PLANE_CORE_PROFILE_v1.md:74-94` | Policy registry canonico existe; Capability/State linking del control-plane aun pendiente de templates completos. |
| CORE-23 | MUST | `compliant` | `admin/decisions/0004...:28-30` y busqueda de catalogs/requests vivos | No se observo estado operativo vivo de una Solution en el Core. |
| CORE-24 | MUST | `compliant` | `docs/reference-sources.md:36-51`, `:208-233` | Identidades concretas aparecen como fuentes observadas. |
| CORE-25 | MUST | `compliant` | `docs/concepts/ards-core.md:119-126` | No redefine comportamiento de producto ni logica de negocio. |
| CORE-26 | MUST | `compliant` | `docs/concepts/core-orchestrator-child-sync.md:8-67` | Explica Core, orquestador y repo hijo. |
| CORE-27 | MUST | `compliant` | `templates/specs/ards/contract-binding.template.yaml:1-13`, `admin/decisions/0006...:20-45` | Binding identifica version, perfil y contrato. |
| CORE-28 | MUST | `compliant` | `tools/mcp/catalog.ts:427-477`, `docs/concepts/core-orchestrator-child-sync.md:119-190` | Sync read-only definido. |
| CORE-29 | MUST | `partial` | `tools/mcp/catalog.ts:448-477`, `docs/concepts/orchestrator-sync-diff-examples.md:132-145` | Campos deterministas existen; falta validador/schema de diff. |
| CORE-30 | MUST | `compliant` | `docs/concepts/core-orchestrator-child-sync.md:72-81` | Regla anti-duplicacion explicita. |
| CORE-31 | MUST | `compliant` | `admin/decisions/0004...:28-30`, `admin/mcp-usage.md:11` | Core no escribe repos hijos. |
| CORE-32 | SHOULD | `partial` | `admin/decisions/0005...:40-44`, `:78-79` | Compatibilidad v0.1 clara; deprecacion futura pendiente. |
| CORE-33 | MUST | `partial` | `README.md:28`, `docs/reference-sources.md:60-80` | Tool-agnostic; algunos perfiles derivados de repos concretos aun needs-review. |
| CORE-34 | MUST | `compliant` | `standard/`, `governance/`, `specs/`, `templates/` | Prompts no son unica fuente normativa. |
| CORE-35 | SHOULD | `partial` | `prompts/*.prompt.md`, ausencia de metadata uniforme | Proposito visible, pero sin version/inputs/limites uniformes. |
| CORE-36 | MAY | `compliant` | `admin/mcp-usage.md:53-81`, `tools/mcp/server.ts` | Expone MCP local read-only. |
| CORE-37 | MUST | `compliant` | `admin/mcp-contract-draft.md:137-138`, `tools/mcp/catalog.ts:452-460` | MCP referencia artefactos versionados, no autoridad paralela. |
| CORE-38 | SHOULD | `compliant` | `admin/mcp-usage.md:60-68`, `tools/mcp/server.ts:427-437` | Tools devuelven planes/contratos sin mutar. |
| CORE-39 | MUST | `compliant` | `VALIDATION.md:18-35`, `npm.cmd run check` exit 0 | Ruta de validacion existe y paso. |
| CORE-40 | MUST | `partial` | `VALIDATION.md:45-75`, `validate.ts` | Reproduce checks basicos; no valida todos los contratos semanticos. |
| CORE-41 | MUST | `partial` | `standard/ARDS_CORE_STANDARD_BASE_v1.md:208-210`, `docs/reference-sources.md:91-163` | TODOs visibles; algunos perfiles/templates no cerrados. |
| CORE-42 | MUST | `compliant` | `governance/source-validation.md:7-12`, `docs/reference-sources.md:170-200` | Promocion requiere fuente validada o decision. |
| CORE-43 | SHOULD | `partial` | `tools/mcp/smoke.ts`, `VALIDATION.md:90-96` | Hay smoke MCP, pero requiere build con escritura; faltan fixtures amplios. |
| CORE-44 | SHOULD | `partial` | `docs/concepts/orchestrator-sync-diff-examples.md:11-145` | Facilita diff; no hay validador ejecutado read-only. |
| CORE-45 | MUST | `compliant` | `README.md:28`, `docs/concepts/ards-core.md:119-126` | No es runtime de producto. |
| CORE-46 | MUST | `compliant` | `admin/mcp-usage.md:3-11`, `server.ts` usa `readFile` y tools plan/read | Distingue lectura/planificacion; no muta. |
| CORE-47 | MUST | `compliant` | `admin/mcp-contract-draft.md:391-406` | Mutaciones futuras fuera de primera version y requieren gates. |

# 7. Backlog de promocion y remediacion

Faltantes del Core:
- Modelo canonico de CR: lifecycle, estados, autoridad, aprobaciones, evidencia, compatibilidad, cierre.
- Modelo canonico de INIT separado de `ards.plan_project_init`, con criterios de aceptacion y Evidence.
- Schemas/validadores para `state_scenario`, `states_index`, `ards_child_contract_binding`, `ards_child_sync_diff`, `evidence_manifest`, policy adoption/exception.
- Politica de soporte/deprecacion para contratos posteriores a `ards-core-contract-v0.1`.
- Validacion semantica de perfiles, project types, source validation status, TODOs bloqueantes y compatibilidad de templates.
- Metadata versionada de prompts.

Contenido local candidato a promocion:
- Desde Control Plane: templates reusables para service catalog, request registry, state machine y capability-state links, si se estabilizan como modelos genericos.
- Desde adopciones relacionadas: manifests de policy adoption/exception y contract bindings reales, solo como fixtures anonimizados o ejemplos no normativos.
- Desde MCP smoke: convertir expectativas de `tools/mcp/smoke.ts` en fixtures de compatibilidad que no requieran escritura.

Contenido que no debe promoverse:
- Catalogos vivos de services/solutions de `4uentes-orchestor`.
- Requests, Evidence, states y snapshots historicos de una instancia.
- Contratos runtime de producto de `sst-bend`, `node-auth`, `sst-fend`, `sst-extension` o infra.
- Decisiones locales de excepcion que no tengan valor reusable.

Riesgos de compatibilidad o migracion:
- `latest` puede resolver a otra version; los consumidores deben persistir `resolved_contract_version`.
- Repos relacionados parecen heredar policies en `AGENTS.md` pero no se detectaron bindings locales; la adopcion formal puede requerir migracion.
- Perfiles `initial-profile` o `needs-review` pueden estar siendo consumidos antes de estabilizarse.
- El cambio de `ARDS_INFRA_CORE_PROFILE_v1` a posible alias `ARDS_INFRA_DEVOPS_CORE_PROFILE_v1` esta pendiente y puede romper referencias.

# 8. Evidencia positiva y preguntas abiertas

Evidencia positiva:
- `npm.cmd run check` ejecuto la validacion documentada con exit code 0: archivos requeridos, links internos, YAML y tono/scope pasaron sin errores ni warnings.
- `admin/decisions/0004-core-orchestrator-child-sync-boundary.md:19-30` protege claramente el boundary Core/Orchestrator/Child.
- `tools/mcp/catalog.ts:389-424` resuelve `latest` a `ards-core-contract-v0.1` y rechaza versiones desconocidas.
- `tools/mcp/catalog.ts:448-477` devuelve contrato de sync con required files, referencias core, anti-duplication rules y estados de sync.
- `docs/concepts/orchestrator-sync-diff-examples.md:44-145` define tipos de diff y reglas de reporte utiles para drift.
- `docs/reference-sources.md:7-18` y `governance/source-validation.md:7-12` evitan promocionar fuentes sin evidencia.

Preguntas abiertas:
- Cual es la politica de soporte/deprecacion cuando exista `ards-core-contract-v0.2`.
- Que perfiles `initial-profile` pasan a `active` y con que evidencia.
- Si `catalog/services`, `solutions`, request registry y state machine deben tener templates canonicos del Core o permanecer locales del Control Plane.
- Que nivel de TODO en templates es aceptable para material canonico consumible.
- Si el smoke MCP debe tener una variante read-only que no requiera compilar a `dist/`.

# Handoff para adopcion por humano + agente IA constructor

## Objetivo de adopcion

Llevar el Core de `core_partial` a `core_conformant_with_observations`: boundary canon/instancia preservado, modelos CR/INIT/State/Evidence formalizados, contratos de adopcion/sync validados de forma deterministica y perfiles claramente clasificados por estabilidad.

## Brecha resumida

El Core ya es reusable y tiene buena separacion arquitectonica, pero sus unidades de cambio gobernadas y sus modelos machine-readable no cubren todo lo que el Audit Pack exige. La adopcion observada en repos relacionados parece conceptual en `AGENTS.md` y no plenamente materializada mediante `specs/ards/contract-binding.yaml`.

## Secuencia recomendada

1. `CR-CORE`: formalizar modelos CR e INIT.
2. `CR-CORE`: agregar schemas de State/Evidence/Binding/Sync Diff.
3. `CR-CORE`: extender validacion semantica y fixtures read-only.
4. `CR-CORE`: estabilizar perfiles y versionado/deprecacion.
5. `CR-CONTROL-PLANE`: usar el contrato Core para generar diffs read-only de adopcion en repos hijos.
6. `INIT`: planificar adopcion de bindings en repos relacionados sin mutacion automatica inicial.

## Unidad de cambio sugerida por paso

| Paso | Unidad | Alcance | Criterios de aceptacion | Evidence requerida |
|---:|---|---|---|---|
| 1 | `CR-CORE` | `governance/`, `standard/`, `templates/specs/` existentes | CR e INIT tienen lifecycle, estados, autoridad, aprobaciones, evidencia y cierre | ADR aceptada, docs normativos, templates/schemas, `npm.cmd run check` |
| 2 | `CR-CORE` | `schemas/`, `templates/specs/ards/`, `templates/specs/states/`, `docs/concepts/*sync*` | Schemas para state, evidence, binding y sync diff referenciados desde indice | schemas versionados, fixtures validos/invalidos, check actualizado |
| 3 | `CR-CORE` | `validate.ts`, `VALIDATION.md`, `tools/mcp/smoke.ts` o variante read-only | Check valida semantica minima de project types, bindings, schemas y source status | salida exit 0, salida negativa fixture invalidos, sin escritura requerida |
| 4 | `CR-CORE` | `standard/*PROFILE_v1.md`, `docs/reference-sources.md`, `admin/decisions/0005*` | Cada perfil declara estabilidad; politica de deprecacion/versionado cerrada | ADR, matriz de perfiles, source maps actualizados |
| 5 | `CR-CONTROL-PLANE` | Repo control-plane relacionado, no Core | Control Plane puede comparar contrato Core vs repo hijo y emitir diff sin escribir | reporte read-only con `resolved_contract_version` y `evidence_manifest_hash` |
| 6 | `INIT` | Repos hijos relacionados | Plan de adopcion de `specs/ards/contract-binding.yaml` por repo | diff por repo, aprobacion humana por batch, no mutacion automatica inicial |

## Policies y guardrails aplicables

- No modificar repos hijos desde el Core.
- No promover contenido `needs-review` a canon sin `governance/source-validation.md` o decision interna explicita.
- Mantener MCP read-only/plan-only hasta que exista policy separada para mutaciones.
- Cualquier cambio en baseline ARDS/SDD, contracts o profiles requiere aprobacion humana y ADR.
- No copiar el Core completo dentro de Services; usar bindings y referencias.

## Riesgos y no-objetivos

Riesgos:
- Endurecer validacion puede romper adopciones parciales existentes.
- Promover modelos desde el Control Plane puede arrastrar estado local si no se limpia como canon reusable.
- Cambiar nombres de perfiles infra puede romper referencias.

No-objetivos:
- No implementar runtime de producto.
- No escribir bindings en repos hijos desde el Core.
- No convertir prompts en fuente normativa primaria.
- No automatizar mutaciones Stage 5 hasta cerrar permisos, preview, overwrite y auditoria.

## Primer siguiente paso recomendado

Crear `CR-CORE-CR-INIT-LIFECYCLE-v1`: definir las unidades canonicas CR e INIT antes de ampliar validadores o adopciones, porque las siguientes remediaciones necesitan una unidad de cambio gobernada para aprobarse y cerrarse.

```yaml
adoption_handoff:
  readiness: ready
  recommended_first_unit:
    type: CR
    id_suggestion: "CR-CORE-CR-INIT-LIFECYCLE-v1"
    title: "Formalizar lifecycle canonico de CR e INIT"
    reason: "CR e INIT son prerequisito para gobernar las remediaciones restantes con autoridad, evidencia y cierre verificable."
  ordered_units:
    - order: 1
      type: CR
      scope: "governance, standard, templates/specs existentes para modelos CR e INIT"
      acceptance_criteria:
        - "Existe modelo CR con estados, autoridad, permisos, evidencia, validacion y cierre."
        - "Existe modelo INIT o decision explicita de alcance temporal."
        - "Los modelos estan referenciados desde el indice canonico."
        - "npm.cmd run check termina con exit code 0."
      required_evidence:
        - "ADR aceptada"
        - "Documentos normativos actualizados"
        - "Templates o schemas versionados"
        - "Salida de validacion"
      human_approval: required
    - order: 2
      type: CR
      scope: "schemas y templates para State, Evidence, contract binding y sync diff"
      acceptance_criteria:
        - "Schemas versionados existen para state_scenario, evidence_manifest, ards_child_contract_binding y ards_child_sync_diff."
        - "Fixtures validos e invalidos cubren campos obligatorios."
      required_evidence:
        - "Schemas YAML"
        - "Fixtures"
        - "Salida de validador"
      human_approval: required
    - order: 3
      type: CR
      scope: "validate.ts, VALIDATION.md y smoke MCP read-only"
      acceptance_criteria:
        - "La validacion cubre project types, source_validation_missing, bindings y schemas nuevos."
        - "Existe una ruta smoke MCP que no requiere escritura o se documenta como no verificable en read-only."
      required_evidence:
        - "npm.cmd run check exit 0"
        - "Salida de fixtures negativos"
      human_approval: required
    - order: 4
      type: CR
      scope: "perfiles standard, source maps y versionado/deprecacion"
      acceptance_criteria:
        - "Cada perfil declara estado normativo y criterios de promocion."
        - "Existe politica de soporte/deprecacion para contratos posteriores a v0.1."
      required_evidence:
        - "ADR de versionado/deprecacion"
        - "Matriz de perfiles"
        - "Source maps actualizados"
      human_approval: required
    - order: 5
      type: CR
      scope: "Control Plane: diff read-only de adopcion contra ards.get_sync_contract"
      acceptance_criteria:
        - "El Control Plane emite reporte read-only con resolved_contract_version, sync_status y evidence_manifest_hash."
        - "No escribe repos hijos."
      required_evidence:
        - "Reporte de muestra"
        - "Comando/check read-only"
      human_approval: conditional
    - order: 6
      type: INIT
      scope: "Plan de adopcion de bindings en repos relacionados"
      acceptance_criteria:
        - "Cada repo relacionado tiene plan de adopcion o excepcion documentada."
        - "No hay mutacion automatica sin aprobacion humana por repo."
      required_evidence:
        - "Diff por repo"
        - "Aprobacion humana por batch"
      human_approval: required
  blockers: []
  non_goals:
    - "Implementar runtime de producto en el Core"
    - "Escribir directamente en repos hijos desde el Core"
    - "Promover estado operativo vivo de una Solution a canon"
    - "Habilitar mutaciones MCP Stage 5 sin policy separada"
```