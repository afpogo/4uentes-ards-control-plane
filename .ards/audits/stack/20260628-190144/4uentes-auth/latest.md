---
artifact_type: ards_audit_report
audit_template_id: ARDS-SDD-AUDIT-001
audit_template_version: 0.3.0
target_type: service_repository
target_repository: "C:\\Users\\andre\\Desktop\\4uentes\\apps\\node-auth"
target_commit: "22ab4ee02a10c22aef206cef60514cd4fba5e6b5"
generated_at: "2026-06-28T19:13:49.2282315-03:00"
report_path: "C:\\Users\\andre\\Desktop\\4uentes\\apps\\4uentes-orchestor\\.ards\\audits\\stack\\20260628-190144\\4uentes-auth\\20260628-191221\\ards-sdd-audit-and-adoption.md"
adoption_handoff: ready
---

# 1. Veredicto ejecutivo

- `overall_status`: `partial`
- `observed_profile`: `advanced`
- `confidence`: `medium-high`

El repositorio `4uentes-auth` tiene una adopcion ARDS/SDD sustancial: `AGENTS.md`, `specs/`, `docs/`, policies, capabilities inbound/outbound, `contract-binding` y un check agregado existen y son descubribles. No es una adopcion cosmetica. Sin embargo, no alcanza `baseline_conformant` porque hay drift material entre runtime y specs: rutas implementadas (`/:id/agent-jobs` y `/api/diccionario/secrets/*`) no aparecen en el spec canonico de routing, y la capability `article-tags` declara `implemented`/`ready-for-consumer` mientras conserva `status_hint: runtime-partial` y QA pendiente en `TODO`. La validacion ejecutable `npm run check` no se ejecuto porque borra y recompila `dist`, lo cual no es seguro bajo auditoria read-only. El estado observado es avanzado por estructura y coordinacion cross-repo, pero con brechas de trazabilidad, evidencia y alineacion semantica que requieren remediacion gobernada.

# 2. Alcance y limitaciones

- Raiz auditada: `C:\Users\andre\Desktop\4uentes\apps\node-auth`.
- Branch/commit observable: branch `codex/sst-tags-governance-bff...origin/codex/sst-tags-governance-bff`; commit `22ab4ee02a10c22aef206cef60514cd4fba5e6b5`.
- Estado Git: `git status` requirio `-c safe.directory=...` por `dubious ownership`; working tree con cambios en `.github/workflows/build-publish-development.yml`, `tmp-bf-dev.err`, `tmp-bf-dev.log`.
- Rutas excluidas: `.ards/audits/**` por regla del runtime.
- Related repos usados solo como contexto: no se leyeron artefactos externos salvo referencias declaradas en el target.
- Comandos ejecutados:
  - `rg --files -g '!**/.ards/audits/**'`: exit 0; inventario completo.
  - `git -c safe.directory=... rev-parse HEAD`: exit 0; commit indicado arriba.
  - `git -c safe.directory=... status --short --branch`: exit 0; branch y dirty tree.
  - `git -c safe.directory=... ls-files .env .env.example .env.local.example`: exit 0; `.env` no esta versionado, examples si.
  - `rg -n "TODO|PLACEHOLDER|..."`: exit 1 sin resultados globales iniciales; busquedas focalizadas posteriores encontraron TODOs en capabilities.
  - Lecturas `Get-Content`, `Select-String`, `Get-ChildItem`: exit 0 salvo una busqueda `rg` con quoting invalido descartada y repetida correctamente.
- Comandos no ejecutados:
  - `npm run check`: `not_verifiable` en esta auditoria porque `scripts/ards-check.js:78` ejecuta `fs.rmSync(distPath, { recursive: true, force: true })` y luego emite build.
  - `npm run build`: `not_verifiable` por escritura en `dist`.

# 3. Resumen por dimension

| Dimension | Estado | Evidencia principal | Riesgo |
|---|---|---|---|
| A. Identidad, alcance y guia operativa | `partial` | `AGENTS.md:5`, `AGENTS.md:31`, `AGENTS.md:255`, `AGENTS.md:312` | Owners humanos no identificados explicitamente. |
| B. Specs como fuente de verdad y SDD | `partial` | `specs/00-index.yaml:12`, `specs/features/00-index.yaml`, `src/presentation/articulo/routes.ts:50` | Drift runtime/spec en rutas nuevas. |
| C. Docs como contexto humano | `partial` | `docs/00-overview.md:46`, `docs/adr/README.md` | ADRs son plantilla/guia, no decisiones reales completas. |
| D. Validacion reproducible | `partial` | `package.json:7`, `scripts/ards-check.js:76`, `scripts/ards-check.js:78` | Check real pero no ejecutable en read-only; resultados actuales no verificados. |
| E. Policies y guardrails | `partial` | `specs/integration/policies.yaml`, `docs/policies/README.md:18` | Adopcion declarada, pero doc humana tiene corrupcion textual menor. |
| F. Continuidad, State y Evidence | `partial` | `docs/tasks/README.md`, `specs/ards/contract-binding.yaml:14` | Evidence existe, pero algunas capabilities listas apuntan a TODO o evidence externo no verificado. |
| G. Capabilities y coordinacion cross-repo | `partial` | `specs/capabilities/00-index.yaml:19`, `specs/capabilities/outbound/article-tags.yaml:7` | Estados contradictorios en `article-tags`. |
| H. Portabilidad y automatizacion gobernada | `partial` | `specs/ards/contract-binding.yaml:3`, `specs/integration/policies.yaml` | Buena portabilidad; validacion automatizada no comprobada en read-only. |
| I. Integridad y anti-cumplimiento cosmetico | `partial` | `specs/capabilities/outbound/article-tags.yaml:69`, `docs/capabilities/outbound/article-tags.md:47` | TODOs en artefactos publicados como ready. |

# 4. Hallazgos priorizados

```yaml
id: FINDING-ARDS-001
control_ids: [ARDS-07, ARDS-08, ARDS-38, ARDS-40]
type: fact
status: partial
severity: high
confidence: high
title: "El runtime expone rutas de document agent jobs no registradas en el spec canonico de routing"
evidence:
  - kind: file
    reference: "src/presentation/articulo/routes.ts:50"
    detail: "Se registra POST /:id/agent-jobs."
  - kind: file
    reference: "src/presentation/articulo/routes.ts:54"
    detail: "Se registra GET /:id/agent-jobs."
  - kind: file
    reference: "src/presentation/articulo/routes.ts:58"
    detail: "Se registra GET /:id/agent-jobs/:jobId."
  - kind: command
    reference: "Select-String specs\\routing.yaml -Pattern 'agent-jobs'"
    detail: "Exit 0 sin coincidencias para agent-jobs; el spec enumera documents/source-pdf pero no estas rutas."
impact: "La trazabilidad SDD desde intencion/spec hasta implementacion queda incompleta para una superficie HTTP observable."
minimum_remediation: "Crear CR local para actualizar `specs/routing.yaml`, docs BF y capabilities si aplica, o retirar/ocultar la superficie si no corresponde al contrato vigente."
dependencies: []
```

```yaml
id: FINDING-ARDS-002
control_ids: [ARDS-08, ARDS-11, ARDS-31, ARDS-38, ARDS-40]
type: fact
status: partial
severity: high
confidence: high
title: "La capability dictionary-secret-management-v1 existe e implementa rutas, pero el spec canonico de routing no las enumera"
evidence:
  - kind: file
    reference: "src/presentation/dictionary/routes.ts:45"
    detail: "Se registra GET /secrets."
  - kind: file
    reference: "src/presentation/dictionary/routes.ts:46-64"
    detail: "Se registran create/get/patch/reveal/copy/rotate/delete para /secrets."
  - kind: file
    reference: "specs/capabilities/outbound/dictionary-secret-management-v1.yaml:15"
    detail: "Declara base_path /api/diccionario/secrets."
  - kind: command
    reference: "rg -n 'diccionario/secrets|secrets' specs\\routing.yaml docs\\bf"
    detail: "No hubo coincidencias en `specs/routing.yaml`; solo capabilities/docs de capability."
impact: "El contrato de routing declarado como source of truth queda atrasado frente a una capability publicada para consumidores."
minimum_remediation: "Actualizar `specs/routing.yaml` y los docs BF de endpoints para incluir la superficie `/api/diccionario/secrets/*`, con validacion y security notes."
dependencies: ["CR-SST-0084"]
```

```yaml
id: FINDING-ARDS-003
control_ids: [ARDS-26, ARDS-30, ARDS-31, ARDS-39, ARDS-40]
type: conflict
status: partial
severity: high
confidence: high
title: "article-tags esta marcado como implemented/ready-for-consumer pero conserva estado runtime-partial y QA pendiente"
evidence:
  - kind: file
    reference: "specs/capabilities/inbound/sst-bend--article-tags.yaml:10"
    detail: "adoption_status: implemented."
  - kind: file
    reference: "specs/capabilities/inbound/sst-bend--article-tags.yaml:20"
    detail: "orchestrator_link.status_hint: runtime-partial."
  - kind: file
    reference: "specs/capabilities/inbound/sst-bend--article-tags.yaml:53"
    detail: "qa_refs contiene TODO para pruebas HTTP BF."
  - kind: file
    reference: "specs/capabilities/outbound/article-tags.yaml:7"
    detail: "publication_status: ready-for-consumer."
  - kind: file
    reference: "specs/capabilities/outbound/article-tags.yaml:69"
    detail: "qa_refs contiene TODO para httpPruebas."
impact: "Consumidores downstream podrian interpretar readiness completa sin evidence local suficiente; contradice anti-cumplimiento cosmetico."
minimum_remediation: "Reconciliar el estado: o completar QA/evidence y mantener ready, o degradar publication/adoption status hasta que la validacion exista."
dependencies: ["CR-SST-0060"]
```

```yaml
id: FINDING-ARDS-004
control_ids: [ARDS-14, ARDS-17, ARDS-18, ARDS-41]
type: fact
status: not_verifiable
severity: medium
confidence: high
title: "La ruta unica de validacion existe pero no pudo ejecutarse bajo read-only"
evidence:
  - kind: file
    reference: "package.json:7"
    detail: "`check` ejecuta `node scripts/ards-check.js`."
  - kind: file
    reference: "scripts/ards-check.js:78"
    detail: "El check borra `dist` antes de crear el programa TypeScript."
  - kind: file
    reference: "scripts/ards-check.js:138"
    detail: "El check ejecuta build TypeScript."
impact: "La auditoria no pudo observar resultado actual de build/check sin violar la restriccion de no escritura."
minimum_remediation: "Agregar un modo `npm run check:readonly` o separar `ards:lint-docs` de `build`, manteniendo `npm run check` como gate completo."
dependencies: []
```

```yaml
id: FINDING-ARDS-005
control_ids: [ARDS-20, ARDS-38, ARDS-39]
type: fact
status: partial
severity: low
confidence: high
title: "La documentacion humana de policies contiene corrupcion textual en los IDs"
evidence:
  - kind: file
    reference: "docs/policies/README.md:18"
    detail: "Se observa `gent-model-selection-policy` en vez de `agent-model-selection-policy`."
  - kind: file
    reference: "specs/integration/policies.yaml"
    detail: "El registry machine-readable conserva IDs correctos y adoption_status adopted."
impact: "No rompe el contrato machine-readable, pero degrada descubribilidad humana y control de integridad documental."
minimum_remediation: "Corregir encoding/texto de `docs/policies/README.md` y validar que los IDs coincidan con el registry."
dependencies: []
```

```yaml
id: FINDING-ARDS-006
control_ids: [ARDS-03, ARDS-23, ARDS-24, ARDS-25]
type: inference
status: partial
severity: medium
confidence: medium
title: "El repo identifica rol y coordinacion, pero no owners humanos/responsables operativos de forma explicita"
evidence:
  - kind: file
    reference: "AGENTS.md:5"
    detail: "Identifica repo, legacy id, rol, surface y stack."
  - kind: file
    reference: "docs/00-overview.md:9"
    detail: "Identidad del repo y rol documentados."
  - kind: absence
    reference: "AGENTS.md / docs/00-overview.md"
    detail: "No se observo seccion de owners humanos, responsables de aprobacion o escalation path."
impact: "Para cambios de alto riesgo, la autoridad humana de aprobacion queda implicita en el orchestrator o en conocimiento externo."
minimum_remediation: "Agregar owners/responsables y reglas de aprobacion humana para auth, secrets, capabilities y releases."
dependencies: []
```

# 5. Matriz completa de controles

| ID | Nivel | Estado | Evidencia | Nota |
|---|---|---|---|---|
| ARDS-01 | MUST | `compliant` | `AGENTS.md:1` | Existe guia raiz sustantiva. |
| ARDS-02 | MUST | `compliant` | `AGENTS.md:64`, `AGENTS.md:255`, `AGENTS.md:312` | Estructura, comandos, SoT y DoD definidos. |
| ARDS-03 | MUST | `partial` | `AGENTS.md:5`, `docs/00-overview.md:9` | Proposito y limites si; owners humanos no explicitos. |
| ARDS-04 | SHOULD | `compliant` | `AGENTS.md:105`, `docs/bf/*`, `docs/capabilities/*` | Especializacion por dominio mediante docs/specs. |
| ARDS-05 | MUST | `compliant` | `specs/00-index.yaml:1` | Indice canonico presente. |
| ARDS-06 | MUST | `compliant` | `specs/auth.yaml`, `specs/routing.yaml` | Requisitos, endpoints, invariantes y contratos utiles. |
| ARDS-07 | MUST | `partial` | `src/presentation/articulo/routes.ts:50`, ausencia en `specs/routing.yaml` | Algunas rutas no trazan a spec canonico. |
| ARDS-08 | MUST | `partial` | Findings 001-003 | Hay drift material registrado por auditoria. |
| ARDS-09 | SHOULD | `compliant` | `specs/features/00-index.yaml` | Versiones/status y estados active/sealed/future. |
| ARDS-10 | MUST | `compliant` | `docs/00-overview.md:1`, `docs/README.md` | Overview suficiente y descubrible. |
| ARDS-11 | MUST | `partial` | `docs/bf/*`, Finding 002 | Criticos documentados en general; secrets no integrados al routing BF canonico. |
| ARDS-12 | SHOULD | `partial` | `docs/adr/README.md` | Existe formato ADR, no ADRs reales observados. |
| ARDS-13 | MUST | `partial` | `docs/00-overview.md:46`, Findings 001-003 | Docs complementan, pero hay drift con specs/runtime. |
| ARDS-14 | MUST | `partial` | `AGENTS.md:328`, `package.json:7` | Ruta existe; no verificable read-only. |
| ARDS-15 | MUST | `compliant` | `package.json:7`, `AGENTS.md:77` | `check` real; `test` placeholder declarado, no baseline. |
| ARDS-16 | MUST | `compliant` | `AGENTS.md:312` | DoD local explicita checks/evidence/capabilities. |
| ARDS-17 | MUST | `not_verifiable` | `scripts/ards-check.js:140` | No se observo resultado actual por restriccion read-only. |
| ARDS-18 | SHOULD | `compliant` | `package.json:7` | Existe `npm run check`. |
| ARDS-19 | MUST | `compliant` | `AGENTS.md:247`, `AGENTS.md:342` | Seguridad, alcance, acciones y guardrails declarados. |
| ARDS-20 | MUST | `partial` | `specs/integration/policies.yaml`, `docs/policies/README.md:18` | Registry correcto; doc humana con corrupcion textual. |
| ARDS-21 | MUST | `compliant` | `AGENTS.md:342`, `docs/cross-repo/orchestrator-link-rule.md` | Limites de agente y orchestrator declarados. |
| ARDS-22 | MUST | `compliant` | `.gitignore`, `git ls-files .env...`, `docs/bf/10-containers.md:68` | `.env` ignorado; examples versionados; guardrail de secrets. |
| ARDS-23 | SHOULD | `partial` | `docs/cross-repo/orchestrator-link-rule.md` | Reglas existen; approvals humanos no suficientemente nombrados. |
| ARDS-24 | MUST | `compliant` | `docs/tasks/README.md`, `specs/ards/contract-binding.yaml` | State/handoff historico y binding versionado. |
| ARDS-25 | MUST | `partial` | `specs/features/00-index.yaml`, Finding 003 | Estados existen; contradiccion `ready` vs `runtime-partial`. |
| ARDS-26 | MUST | `partial` | `specs/capabilities/outbound/article-tags.yaml:69` | Evidence parcial; TODO en capability ready. |
| ARDS-27 | MUST | `compliant` | `docs/tasks/*`, `specs/capabilities/*` | No depende solo de chat. |
| ARDS-28 | SHOULD | `partial` | `specs/ards/contract-binding.yaml:14`, capabilities | Enlaces existen; algunos evidence externos no verificados. |
| ARDS-29 | MUST | `compliant` | `specs/capabilities/00-index.yaml:24` | Capabilities inbound/outbound descubribles. |
| ARDS-30 | MUST | `partial` | Finding 003 | Contratos/productor/consumidor presentes; estado/evidence inconsistente en article-tags. |
| ARDS-31 | MUST | `partial` | `orchestrator_link` en capabilities, Finding 003 | Handoff existe, pero readiness contradictoria. |
| ARDS-32 | SHOULD | `compliant` | `specs/ards/contract-binding.yaml:3` | Contract binding con core ref. |
| ARDS-33 | SHOULD | `compliant` | `specs/00-index.yaml:69`, `specs/capabilities/*` | Señales para control plane presentes. |
| ARDS-34 | MUST | `compliant` | `AGENTS.md`, `specs/*`, `docs/*` | Conocimiento critico no encerrado en prompts. |
| ARDS-35 | MUST | `compliant` | `specs/integration/policies.yaml` | Provider agnostic declarado. |
| ARDS-36 | SHOULD | `partial` | `scripts/ards-check.js` | Automatizacion existe; no separa modo read-only. |
| ARDS-37 | MAY | `not_applicable` | No requerido | No penaliza. |
| ARDS-38 | MUST | `partial` | Findings 001, 002, 005 | Referencias principales resuelven, pero routing incompleto y doc policies corrupta. |
| ARDS-39 | MUST | `partial` | `specs/capabilities/outbound/article-tags.yaml:69` | TODO en artefacto que declara readiness. |
| ARDS-40 | MUST | `partial` | Findings 001-003 | Algunas afirmaciones no coinciden con evidence actual. |
| ARDS-41 | SHOULD | `partial` | `scripts/ards-check.js` | Check ARDS existe, pero cobertura no incluye drift detectado y no es read-only. |

# 6. Backlog de remediacion propuesto

| Orden | Unidad | Tipo | Riesgo | Alcance | Resultado esperado |
|---|---|---|---|---|---|
| 1 | CR local del Service | `CR` | high | `specs/routing.yaml`, `docs/bf/03-routing.md`, `docs/bf/11-endpoints-e2e-map.md`, rutas `articulo` | Registrar o retirar `/:id/agent-jobs` con contrato, auth, evidence y capability impact. |
| 2 | CR local del Service + INIT cross-repo si afecta consumers | `CR` | high | `specs/routing.yaml`, `docs/bf/*`, `specs/capabilities/*dictionary-secret*` | Integrar `/api/diccionario/secrets/*` al routing canonico y docs BF. |
| 3 | CR local del Service / CR Control Plane | `CR` | high | `specs/capabilities/*article-tags*`, `docs/capabilities/*article-tags*`, `httpPruebas` | Reconciliar `article-tags`: completar QA/evidence o degradar status. |
| 4 | CR local del Service | `CR` | medium | `scripts/ards-check.js`, `package.json`, `AGENTS.md`, `specs/00-index.yaml` | Separar validacion read-only de build mutante. |
| 5 | CR local del Service | `CR` | medium | `AGENTS.md`, `docs/00-overview.md`, policies | Agregar owners/responsables y aprobaciones humanas por dominio. |
| 6 | CR local del Service | `CR` | low | `docs/policies/README.md` | Corregir IDs corruptos y validar integridad textual. |
| 7 | CR local del Service | `CR` | low | `docs/adr/` | Promover decisiones reales relevantes a ADRs completas. |

# 7. Evidencia positiva

- `AGENTS.md` es operativo y especifico: define rol, stack, rutas, golden paths, source of truth, AI guardrails, DoD y validacion.
- `specs/00-index.yaml` y `docs/00-overview.md` establecen precedencia y separan specs normativas de docs derivadas/historicas.
- `package.json` provee `npm run check`; `scripts/ards-check.js` valida presencia de artefactos ARDS y build TypeScript.
- `specs/capabilities/00-index.yaml` estructura inbound/outbound y reglas de estados.
- `specs/ards/contract-binding.yaml` declara binding con `ards-core-contract-v0.1` y referencia al orchestrator.
- `.env` esta ignorado y no versionado; `.env.example` y `.env.local.example` si estan versionados.
- El runtime observado en `src/presentation/routes.ts` confirma mounts principales `/api/auth`, `/api/articulos`, `/api/articles`, `/api/diccionario`, `/api/tags`, `/api/article-nodes`, `/api/extension`, `/api/scrapper` y JWKS publico.

# 8. Preguntas abiertas

- Quien es el owner humano responsable de aprobar cambios de auth, secrets y publication_status de capabilities?
- Las rutas `/:id/agent-jobs` son contrato publico vigente, experimento interno o deuda a retirar?
- `article-tags` debe considerarse listo para consumidor o debe volver a estado parcial hasta cerrar QA BF?
- El Control Plane espera que `dictionary-secret-management-v1` este en `specs/routing.yaml` o acepta capability-only para esta superficie?

# Handoff para adopcion por humano + agente IA constructor

## Objetivo de adopcion

Alcanzar `baseline_conformant_with_observations` o `baseline_conformant` para `4uentes-auth`, manteniendo el perfil observado avanzado, mediante reconciliacion de specs/docs/runtime, evidence verificable y validacion no mutante.

## Brecha resumida

El repositorio ya tiene estructura ARDS/SDD avanzada, pero falla en consistencia semantica: endpoints implementados no estan reflejados en la fuente canonica de routing, una capability publicada conserva señales de parcialidad y TODOs, y el check unico no puede ejecutarse bajo auditoria read-only.

## Secuencia recomendada

1. `CR local del Service`: reconciliar `article-tags` porque afecta readiness cross-repo y contiene contradiccion directa.
2. `CR local del Service`: actualizar routing/docs para `agent-jobs`.
3. `CR local del Service`: actualizar routing/docs para `dictionary-secret-management-v1`.
4. `CR local del Service`: separar validacion read-only.
5. `CR local del Service`: owners/aprobaciones y limpieza documental.

## Unidad de cambio sugerida por paso

- Paso 1: `CR` local, con posible `CR` del Control Plane si cambia estado central.
- Paso 2: `CR` local del Service.
- Paso 3: `CR` local del Service, referenciado a `CR-SST-0084`.
- Paso 4: `CR` local del Service.
- Paso 5: `CR` local del Service.

## Alcance por paso

- Paso 1: `specs/capabilities/inbound/sst-bend--article-tags.yaml`, `specs/capabilities/outbound/article-tags.yaml`, docs capability y `httpPruebas` relacionado si se completa QA.
- Paso 2: `specs/routing.yaml`, `docs/bf/03-routing.md`, `docs/bf/11-endpoints-e2e-map.md`, `docs/capabilities` si esos jobs son capability.
- Paso 3: `specs/routing.yaml`, `docs/bf/03-routing.md`, `docs/bf/06-integrations-api.md`, `docs/bf/11-endpoints-e2e-map.md`, capability secret docs/specs.
- Paso 4: `scripts/ards-check.js`, `package.json`, `AGENTS.md`, `specs/00-index.yaml`.
- Paso 5: `AGENTS.md`, `docs/00-overview.md`, `docs/policies/README.md`, `docs/adr/README.md`.

## Criterios de aceptacion

- No queda capability `ready-for-consumer` con `status_hint: runtime-partial` o QA `TODO` sin excepcion explicita.
- Todo endpoint Express observable tiene entrada en el contrato canonico que corresponda o queda marcado como interno/no publico.
- `npm run check` sigue existiendo y pasa en entorno normal.
- Existe un comando read-only que valida indices/referencias sin borrar ni emitir `dist`.
- Owners y aprobaciones humanas quedan documentados para auth, secrets, capabilities y release.

## Evidence requerida

- Output de `npm run check`.
- Output del nuevo check read-only.
- QA HTTP o contract tests para `article-tags` si se mantiene readiness.
- Diff o reporte de referencias routing/runtime.
- Decision humana si se degrada o mantiene status de capabilities.

## Policies y guardrails aplicables

- No commitear secretos ni leer valores sensibles de `.env`.
- No mover dominio SST al BF.
- Todo cambio observable debe revisar capabilities inbound/outbound.
- Cambios cross-repo deben conservar `orchestrator_link`.
- Aprobacion humana requerida para cambiar readiness de capabilities publicadas y superficies de auth/secrets.

## Riesgos y no-objetivos

- No refactorizar Clean Architecture como parte de la adopcion ARDS.
- No cambiar comportamiento runtime sin CR explicito.
- No inventar capabilities nuevas para rutas existentes sin confirmar ownership.
- No resolver evidence externo del orchestrator mediante suposiciones conversacionales.

## Primer siguiente paso recomendado

Abrir un `CR local del Service` para reconciliar `article-tags`: decidir si se completa QA y se mantiene `ready-for-consumer`, o si se degrada el estado hasta que exista evidence verificable.

```yaml
adoption_handoff:
  readiness: ready
  recommended_first_unit:
    type: CR
    id_suggestion: "CR-4AUTH-ARDS-001"
    title: "Reconciliar readiness y evidence de article-tags"
    reason: "Es la contradiccion de mayor riesgo cross-repo: readiness publicada con status runtime-partial y QA TODO."
  ordered_units:
    - order: 1
      type: CR
      scope: "specs/capabilities/*article-tags*, docs/capabilities/*article-tags*, httpPruebas relacionados"
      acceptance_criteria:
        - "No hay TODO en qa_refs de article-tags si publication_status sigue ready-for-consumer."
        - "adoption_status, publication_status y orchestrator_link.status_hint son coherentes."
        - "Existe evidence local o referencia externa verificable para QA BF."
      required_evidence:
        - "Output de npm run check"
        - "QA HTTP o contract test de create/update/list/detail con tags e includeTags"
        - "Decision registrada si se degrada readiness"
      human_approval: required
    - order: 2
      type: CR
      scope: "specs/routing.yaml y docs BF para /:id/agent-jobs"
      acceptance_criteria:
        - "Las rutas agent-jobs implementadas estan especificadas o retiradas del contrato publico."
        - "Auth, headers, request, response y errores quedan documentados."
      required_evidence:
        - "Referencia de runtime en src/presentation/articulo/routes.ts"
        - "Output de check documental"
      human_approval: conditional
    - order: 3
      type: CR
      scope: "specs/routing.yaml y docs BF para /api/diccionario/secrets/*"
      acceptance_criteria:
        - "La capability dictionary-secret-management-v1 esta alineada con routing canonico."
        - "Docs BF explican security controls y endpoints."
      required_evidence:
        - "Referencia a CR-SST-0084"
        - "Output de npm run check"
      human_approval: required
    - order: 4
      type: CR
      scope: "scripts/ards-check.js, package.json, AGENTS.md, specs/00-index.yaml"
      acceptance_criteria:
        - "Existe check read-only sin rmSync ni emit a dist."
        - "npm run check conserva build completo para CI/local."
      required_evidence:
        - "Output de check read-only"
        - "Output de npm run check en entorno con escritura"
      human_approval: conditional
    - order: 5
      type: CR
      scope: "AGENTS.md, docs/00-overview.md, docs/policies/README.md"
      acceptance_criteria:
        - "Owners/responsables y aprobaciones humanas documentados."
        - "IDs de policies en docs coinciden con registry."
      required_evidence:
        - "Revision humana de ownership"
        - "Check de referencias"
      human_approval: required
  blockers: []
  non_goals:
    - "No modificar runtime funcional durante la adopcion documental salvo CR separado."
    - "No leer ni versionar secretos locales."
    - "No reemplazar el orchestrator como fuente de gobierno cross-repo."
```