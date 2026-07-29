---
artifact_type: ards_audit_report
audit_template_id: ARDS-SDD-AUDIT-001
audit_template_version: 0.3.0
target_type: service_repository
target_repository: "C:\\Users\\andre\\Desktop\\4uentes\\apps\\4uentes-sstbend\\sst-bend"
target_commit: "371b90d583e5ead25a879b57d7ba7c1254ebee76"
generated_at: "2026-06-28T19:07:32.1293884-03:00"
report_path: "C:\\Users\\andre\\Desktop\\4uentes\\apps\\4uentes-orchestor\\.ards\\audits\\stack\\20260628-190144\\sst-bend\\20260628-190526\\ards-sdd-audit-and-adoption.md"
adoption_handoff: ready
---

# 1. Veredicto ejecutivo

- `overall_status`: `partial`
- `observed_profile`: `standard`, con varias piezas `advanced` estructurales
- `confidence`: `high`

El repositorio `sst-bend` tiene una adopción ARDS/SDD real y no meramente cosmética: existe `AGENTS.md` operativo, índices canónicos en `specs/`, documentación navegable en `docs/`, policies adoptadas, State, Evidence histórico, capabilities outbound y contract binding local. La estructura supera el perfil minimal y se acerca a advanced por coordinación cross-repo y capacidades publicadas.

La brecha principal es ejecutable: el comando canónico `npm run check` existe, pero no fue ejecutable bajo auditoría read-only porque su smoke actual realiza POST/PATCH/DELETE contra servicios locales y puede mutar datos persistentes. Además, la propia evidencia del repo registra que la cobertura protegida completa depende de JWT owner y estuvo bloqueada por emisión de token en `node-auth`. Por eso no corresponde declarar baseline conformant completo aunque `npm.cmd run build` y tests locales focalizados sí pasan.

# 2. Alcance y limitaciones

- Raíz auditada: `C:\Users\andre\Desktop\4uentes\apps\4uentes-sstbend\sst-bend`.
- Branch observable: `codex/sst-tags-governance-api`.
- Commit observable: `371b90d583e5ead25a879b57d7ba7c1254ebee76`.
- Rutas excluidas: `.ards/audits/**`.
- Related repos usados solo como contexto declarado: `4uentes-core`, `4uentes-orchestor`.
- Limitación Git inicial: `git rev-parse` sin `safe.directory` falló por dubious ownership; se obtuvo branch/commit con `git -c safe.directory=...`.
- Comandos ejecutados:
  - `rg --files -g '!**/.ards/audits/**'`: exit code 0; inventario ARDS, docs, specs, scripts y código presentes.
  - `git -c safe.directory=... rev-parse --abbrev-ref HEAD`: exit code 0; `codex/sst-tags-governance-api`.
  - `git -c safe.directory=... rev-parse HEAD`: exit code 0; SHA indicado.
  - `npm run build`: exit code 1; no ejecutó por política PowerShell sobre `npm.ps1`.
  - `npm.cmd run build`: exit code 0; `tsc --noEmit`.
  - `npm.cmd run test:tag-engine`: exit code 0; `Tag engine tests passed: 7/7`.
  - `npm.cmd run test:diccionario`: exit code 0; `Diccionario tests passed: 10/10`.
  - `npm.cmd run test:diccionario:secrets`: exit code 0; `dictionary secrets tests passed`.
- Comandos no ejecutados:
  - `npm run check`: `not_verifiable` en modo read-only. El entorno rechazó la ejecución porque `scripts/smoke-test.js` contiene flujos POST/PATCH/DELETE sobre servicios locales potencialmente persistentes.
- Limitaciones de entorno:
  - No se levantaron servicios, DB ni Docker.
  - No se ejecutaron migraciones.
  - No se ejecutaron smokes HTTP mutantes.
  - No se validó cobertura protegida con `SMOKE_JWT_OWNER`.

# 3. Resumen por dimensión

| Dimensión | Estado | Evidencia principal | Riesgo |
|---|---|---|---|
| A. Identidad, alcance y guía operativa | compliant | `AGENTS.md:28-69`, `AGENTS.md:173-179`, `AGENTS.md:390-419` | Bajo |
| B. Specs como fuente de verdad y SDD | partial | `specs/00-index.yaml:15-45`, `specs/api/00-index.yaml:14-169`; muchas specs runtime siguen `draft` | Medio |
| C. Docs como contexto humano | compliant | `docs/00-overview.md:57-78`, `docs/README.md:1-14` | Bajo |
| D. Validación reproducible | partial | `package.json:6-27`, `scripts/ards-check.js:129-204`, `scripts/smoke-test.js:186-372`, `scripts/smoke-test.js:399-474` | Alto |
| E. Policies y guardrails | compliant | `AGENTS.md:317-388`, `specs/integration/policies.yaml:24-74`, `docs/policies/README.md:1-33` | Bajo |
| F. Continuidad, State y Evidence | partial | `specs/states/00-index.yaml:17-53`, `docs/api/VALIDATION_REPORT.md:110-181` | Medio |
| G. Capabilities cross-repo | partial | `specs/capabilities/outbound/00-index.yaml:20-156`, `specs/capabilities/outbound/article-tags.yaml:24-33` | Medio |
| H. Portabilidad y automatización gobernada | compliant | `specs/ards/contract-binding.yaml:1-13`, `AGENTS.md:375-388`, `docs/capabilities/00-overview.md:20-23` | Bajo |
| I. Integridad anti-cosmética | partial | Índices críticos resuelven; drift ejecutable en `npm run check` read-only; `docs/policies/README.md:18-23` muestra texto corrupto menor | Medio |

# 4. Hallazgos priorizados

```yaml
id: FINDING-ARDS-001
control_ids: [ARDS-14, ARDS-17, ARDS-18, ARDS-40]
type: fact
status: not_verifiable
severity: high
confidence: high
title: "El gate canónico npm run check no es seguro para una auditoría read-only"
evidence:
  - kind: file
    reference: "scripts/ards-check.js:150-155"
    detail: "El check ejecuta preflight HTTP y luego `scripts/smoke-test.js`."
  - kind: file
    reference: "scripts/smoke-test.js:186-372"
    detail: "El smoke crea, mueve, asigna y borra nodos/artículos con POST/PATCH/DELETE."
  - kind: command
    reference: "npm run check"
    detail: "No ejecutado; el entorno lo rechazó por riesgo de mutar servicios locales persistentes."
impact: "La validación agregada existe, pero no puede reproducirse dentro del contrato read-only del Audit Pack."
minimum_remediation: "Separar un `check:readonly` o modo dry-run que valide ARDS, build y pruebas no mutantes sin POST/PATCH/DELETE; mantener `check` completo para entornos controlados."
dependencies: []
```

```yaml
id: FINDING-ARDS-002
control_ids: [ARDS-16, ARDS-17, ARDS-26, ARDS-40]
type: fact
status: partial
severity: high
confidence: high
title: "La cobertura protegida completa depende de credenciales y estuvo bloqueada por auth externo"
evidence:
  - kind: file
    reference: "docs/api/VALIDATION_REPORT.md:151-170"
    detail: "El reporte registra `npm run check` OK parcial sin JWT y gate estricto fallando por falta de `SMOKE_JWT`."
  - kind: file
    reference: "specs/states/gap.protected-smoke-coverage.yaml:45-56"
    detail: "El state declara que la cobertura protegida se mide y se fuerza solo cuando se solicita modo estricto."
  - kind: file
    reference: "scripts/protected-coverage.config.js:1-58"
    detail: "Hay manifiesto explícito de endpoints protegidos y thresholds 80/100."
impact: "El repo distingue parcial vs completo, pero no hay evidencia actual ejecutada de cobertura protegida completa."
minimum_remediation: "Definir Evidence reciente para `SMOKE_REQUIRE_AUTH=true` en entorno controlado con JWT owner, o registrar bloqueo vivo cross-repo si node-auth sigue impidiendo tokens."
dependencies: ["node-auth operativo para emisión de JWT owner/member"]
```

```yaml
id: FINDING-ARDS-003
control_ids: [ARDS-06, ARDS-08, ARDS-09, ARDS-39]
type: inference
status: partial
severity: medium
confidence: high
title: "Varias specs normativas de runtime permanecen en estado draft"
evidence:
  - kind: file
    reference: "specs/api/00-index.yaml:14-169"
    detail: "Specs normativas como system, project-structure, routing, integrations, document-processing, error-handling y observability figuran `draft`; auth está `accepted` y algunas de dominio están `active`."
impact: "La fuente de verdad existe y es útil, pero el lifecycle de aceptación no separa claramente contrato vigente de borrador en varias áreas runtime."
minimum_remediation: "Promover specs runtime verificadas a `accepted`/`active` o documentar por spec qué parte sigue draft y qué parte manda en producción."
dependencies: []
```

```yaml
id: FINDING-ARDS-004
control_ids: [ARDS-29, ARDS-30, ARDS-31, ARDS-32, ARDS-40]
type: fact
status: partial
severity: medium
confidence: high
title: "Hay capabilities listas junto con capabilities draft/runtime-partial que requieren lectura cuidadosa"
evidence:
  - kind: file
    reference: "specs/capabilities/outbound/00-index.yaml:20-156"
    detail: "El índice mezcla `ready-for-consumer` con `draft` para `sst-tags-governance` y `dictionary-domain-v1`."
  - kind: file
    reference: "specs/capabilities/outbound/article-tags.yaml:12-33"
    detail: "`publication_status=ready-for-consumer`, pero `orchestrator_link.status_hint=runtime-partial`."
  - kind: file
    reference: "specs/capabilities/outbound/sst-tags-governance.yaml:57-65"
    detail: "Declara explícitamente que la capability está draft para consumidores."
impact: "La coordinación cross-repo está modelada, pero un consumidor o agente puede sobreinterpretar readiness si no evalúa `publication_status`, `status_hint` y QA refs juntos."
minimum_remediation: "Agregar un check ARDS que alerte sobre combinaciones `ready-for-consumer` + `runtime-partial` o QA gaps explícitos sin evidencia de cierre."
dependencies: []
```

```yaml
id: FINDING-ARDS-005
control_ids: [ARDS-19, ARDS-20, ARDS-38, ARDS-39]
type: fact
status: partial
severity: low
confidence: high
title: "La documentación humana de policies tiene corrupción menor en nombres"
evidence:
  - kind: file
    reference: "docs/policies/README.md:16-23"
    detail: "Los bullets muestran `gent-*` en lugar de `agent-*`; el registry machine-readable correcto está en `specs/integration/policies.yaml:34-70`."
impact: "No rompe el registry canónico, pero reduce legibilidad humana y puede confundir búsquedas textuales."
minimum_remediation: "Corregir los nombres en `docs/policies/README.md` y agregarlo a un check de integridad documental liviano."
dependencies: []
```

# 5. Matriz completa de controles

| ID | Nivel | Estado | Evidencia | Nota |
|---|---|---|---|---|
| ARDS-01 | MUST | compliant | `AGENTS.md:1-24` | Existe guía raíz. |
| ARDS-02 | MUST | compliant | `AGENTS.md:73-112`, `AGENTS.md:329-419` | Define estructura, comandos, SoT y DoD. |
| ARDS-03 | MUST | compliant | `AGENTS.md:28-69` | Identifica Service, límites y relación con node-auth. |
| ARDS-04 | SHOULD | partial | `AGENTS.md:137-179` | Hay dominios claros, sin overrides por subdirectorio observados. |
| ARDS-05 | MUST | compliant | `specs/00-index.yaml:15-45` | `specs/` indexado. |
| ARDS-06 | MUST | partial | `specs/api/00-index.yaml:14-169` | Specs útiles, varias runtime en `draft`. |
| ARDS-07 | MUST | compliant | `docs/00-overview.md:57-78`, `specs/capabilities/outbound/*` | Trazabilidad por specs/docs/capabilities. |
| ARDS-08 | MUST | partial | `AGENTS.md:58-69`, `docs/api/01-architecture.md:19` | Target-state separado, pero draft/runtime requiere disciplina. |
| ARDS-09 | SHOULD | partial | `specs/api/00-index.yaml:14-169` | Estados existen, mecanismo de promoción no está automatizado. |
| ARDS-10 | MUST | compliant | `docs/README.md:1-14`, `docs/00-overview.md:1-8` | Overview suficiente. |
| ARDS-11 | MUST | compliant | `docs/00-overview.md:101-117`, `docs/api/09-runbook.md` | Operación y lectura descubiertas. |
| ARDS-12 | SHOULD | compliant | `docs/adr/README.md`, `docs/adr/2026-03-21-sst-document-processing-transport.md` | ADRs presentes. |
| ARDS-13 | MUST | compliant | `docs/00-overview.md:57-78`, `specs/00-index.yaml:10-13` | Docs derivan de specs y no las reemplazan. |
| ARDS-14 | MUST | partial | `package.json:6-17`, `AGENTS.md:402-419` | Ruta existe, pero check agregado no es read-only safe. |
| ARDS-15 | MUST | compliant | `package.json:7`, `scripts/ards-check.js:1-209` | Comando y script existen; no placeholder. |
| ARDS-16 | MUST | compliant | `AGENTS.md:390-399` | DoD local explícita. |
| ARDS-17 | MUST | partial | `scripts/ards-check.js:181-204`, `docs/api/VALIDATION_REPORT.md:151-181` | Distingue parcial/estricto, pero no verificable aquí. |
| ARDS-18 | SHOULD | compliant | `package.json:7` | Hay comando agregado `check`. |
| ARDS-19 | MUST | compliant | `AGENTS.md:317-388` | Guardrails locales cubren seguridad y agente. |
| ARDS-20 | MUST | compliant | `specs/integration/policies.yaml:24-74` | Policies core adoptadas. |
| ARDS-21 | MUST | compliant | `AGENTS.md:375-388`, `AGENTS.md:390-399` | Límites de autoridad y Evidence implícitos en DoD. |
| ARDS-22 | MUST | compliant | `AGENTS.md:317-326`, `specs/api/dictionary-secret-management.yaml:37-39` | Secretos tratados explícitamente. |
| ARDS-23 | SHOULD | compliant | `specs/integration/policies.yaml:24-74`, `docs/cross-repo/orchestrator-link-rule.md:24-31` | Aprobaciones y orquestador modelados. |
| ARDS-24 | MUST | compliant | `specs/states/00-index.yaml:17-53` | State versionado permite retomar. |
| ARDS-25 | MUST | compliant | `specs/states/00-index.yaml:17-53` | Estados `done`, `identified`, `ready`. |
| ARDS-26 | MUST | partial | `specs/states/gap.protected-smoke-coverage.yaml:66-70` | Evidence requerida modelada; ejecución actual no verificada. |
| ARDS-27 | MUST | compliant | `docs/api/VALIDATION_REPORT.md:1-181`, `specs/states/*.yaml` | No depende solo del chat. |
| ARDS-28 | SHOULD | compliant | `specs/states/gap.protected-smoke-coverage.yaml:17-46` | State enlaza gaps, docs y runtime anchors. |
| ARDS-29 | MUST | compliant | `specs/capabilities/outbound/00-index.yaml:20-156` | Capabilities declaradas. |
| ARDS-30 | MUST | partial | `specs/capabilities/outbound/article-tags.yaml:48-110` | Contrato/QA declarados; algunos gaps explícitos. |
| ARDS-31 | MUST | compliant | `docs/capabilities/00-overview.md:8-23` | Handoff cross-repo documentado. |
| ARDS-32 | SHOULD | compliant | `specs/ards/contract-binding.yaml:1-13` | Binding ARDS local existe. |
| ARDS-33 | SHOULD | compliant | `specs/ards/contract-binding.yaml:10-13`, `specs/capabilities/outbound/*` | Señales para Control Plane presentes. |
| ARDS-34 | MUST | compliant | `AGENTS.md:329-388`, `specs/00-index.yaml:10-13` | Conocimiento crítico en ARDS/SDD. |
| ARDS-35 | MUST | compliant | `AGENTS.md:421-483` | Bloque n8n declarado bootstrap, no SoT. |
| ARDS-36 | SHOULD | partial | `scripts/ards-check.js:1-209` | Automatización existe, pero parte mutante no read-only. |
| ARDS-37 | MAY | not_applicable | `skills-lock.json` presente | No se penaliza; no fue foco del Service. |
| ARDS-38 | MUST | compliant | Comando `Test-Path` crítico: todos `True` | Referencias principales resuelven. |
| ARDS-39 | MUST | partial | `docs/policies/README.md:18-23`, `docs/cross-repo/orchestrator-link-rule.md:11-22` | Templates/TODO justificados; corrupción menor en policies. |
| ARDS-40 | MUST | partial | `docs/api/VALIDATION_REPORT.md:151-181`, `scripts/smoke-test.js:1421-1519` | Claims de validación completa no verificados hoy. |
| ARDS-41 | SHOULD | compliant | `scripts/ards-check.js:129-149` | Check automático valida parte del contrato ARDS. |

# 6. Backlog de remediación propuesto

1. CR local del Service: separar validación read-only.
   - Crear una ruta documentada equivalente a `check:readonly` o modo `ARDS_CHECK_READONLY=true`.
   - Debe incluir ARDS structural check, `tsc --noEmit` y tests locales no mutantes.
   - Riesgo: alto; dependencia: ninguna.

2. CR local del Service: registrar Evidence actual de gate estricto protegido.
   - Ejecutar en entorno controlado con SST/Scrapper/Postgres y JWT owner/member.
   - Persistir output en Evidence ARDS local o state asociado.
   - Riesgo: alto; dependencia: node-auth/JWKS operativo.

3. INIT cross-repo: reconciliar bloqueo de JWT si sigue vigente.
   - Si node-auth todavía no emite token owner, abrir INIT/CR coordinado desde orchestrator.
   - Riesgo: alto; dependencia: owner humano de auth.

4. CR local del Service: normalizar lifecycle de specs runtime.
   - Promover specs vigentes de `draft` a `accepted`/`active` o documentar alcance draft.
   - Riesgo: medio; dependencia: revisión humana de contratos.

5. CR local del Service: check de consistency para capabilities.
   - Detectar `ready-for-consumer` con `runtime-partial`, QA gaps o Evidence faltante.
   - Riesgo: medio; dependencia: reglas acordadas.

6. CR local del Service: corregir documentación humana de policies.
   - Reparar `docs/policies/README.md` bullets `agent-*`.
   - Riesgo: bajo; dependencia: ninguna.

# 7. Evidencia positiva

- `AGENTS.md` es específico del repo y describe dos servicios, stack, estructura Clean, SoT, guardrails, DoD y validación.
- `specs/00-index.yaml` define colecciones `api`, `capabilities`, `states`, `features` y `ards`.
- `docs/00-overview.md` declara orden de lectura, clasificación documental y precedencia cross-stack.
- `specs/integration/policies.yaml` adopta policies core con `adoption_status: adopted`.
- `specs/ards/contract-binding.yaml` declara binding local contra `ards-core-contract-v0.1`.
- `specs/capabilities/outbound/00-index.yaml` publica 17 capabilities outbound con consumidores esperados y docs.
- `specs/states/00-index.yaml` modela gaps y rollouts con estados vivos.
- `npm.cmd run build` pasó con `tsc --noEmit`.
- Tests locales no mutantes pasaron:
  - `test:tag-engine`: 7/7.
  - `test:diccionario`: 10/10.
  - `test:diccionario:secrets`: pass.
- El repo ya distingue explícitamente cobertura protegida parcial vs estricta en `scripts/ards-check.js` y `docs/api/VALIDATION_REPORT.md`.

# 8. Preguntas abiertas

1. ¿Debe CI exigir `SMOKE_REQUIRE_AUTH=true` como gate canónico, o mantener `npm run check` parcial por defecto y agregar un gate estricto separado?
2. ¿El bloqueo histórico de emisión JWT en `node-auth` sigue vigente al 2026-06-28?
3. ¿Qué autoridad humana aprueba promoción masiva de specs runtime desde `draft` hacia `accepted`/`active`?

# Handoff para adopción por humano + agente IA constructor

## Objetivo de adopción

Llevar `sst-bend` desde una adopción ARDS/SDD estructuralmente fuerte pero parcialmente verificable hacia un baseline reproducible: comandos read-only seguros para auditoría, Evidence actual de cobertura protegida estricta, specs runtime con lifecycle claro y capabilities cross-repo sin ambigüedad de readiness.

## Brecha resumida

Estado observado: ARDS/SDD standard con piezas advanced, pero `npm run check` combina validación estructural con smoke HTTP mutante y no puede ejecutarse bajo auditoría read-only. La cobertura protegida completa requiere JWT owner y tiene Evidence histórica de bloqueo. Algunas specs normativas siguen draft y algunas capabilities mezclan readiness con hints parciales.

Estado deseado: validación separada por riesgo, Evidence vigente y reproducible, specs con estado normativo inequívoco, y señales cross-repo aptas para que el Control Plane detecte drift sin interpretar conversaciones.

## Secuencia recomendada

1. CR local del Service: agregar o documentar validación read-only.
2. CR local del Service: capturar Evidence de `check` estricto en entorno controlado.
3. INIT cross-repo: resolver dependencia de JWT si sigue bloqueada.
4. CR local del Service: normalizar lifecycle de specs runtime.
5. CR local del Service: reforzar consistency checks de capabilities.
6. CR local del Service: corregir documentación humana menor de policies.

## Unidad de cambio sugerida por paso

- Paso 1: CR local del Service.
- Paso 2: CR local del Service.
- Paso 3: INIT cross-repo.
- Paso 4: CR local del Service.
- Paso 5: CR local del Service.
- Paso 6: CR local del Service.

## Alcance por paso

- Paso 1: `package.json`, `scripts/ards-check.js`, `scripts/smoke-test.js`, `AGENTS.md`, `docs/00-overview.md`.
- Paso 2: `docs/api/VALIDATION_REPORT.md`, `specs/states/gap.protected-smoke-coverage.yaml` o Evidence local equivalente.
- Paso 3: artefactos del orchestrator y vínculo local en `docs/cross-repo/orchestrator-link-rule.md`/state aplicable.
- Paso 4: `specs/api/00-index.yaml` y specs runtime referenciadas.
- Paso 5: `scripts/ards-check.js`, `specs/capabilities/outbound/*.yaml`, `docs/capabilities/00-overview.md`.
- Paso 6: `docs/policies/README.md`.

## Criterios de aceptación

- Paso 1: existe comando read-only documentado que corre sin servicios, DB ni mutaciones y termina con exit code 0 en entorno de auditoría.
- Paso 2: existe Evidence reciente de gate estricto o bloqueo explícito con causa, fecha, comando y output.
- Paso 3: si auth bloquea, existe INIT/CR cross-repo con owner y criterio de cierre.
- Paso 4: cada spec runtime normativa tiene estado coherente o nota de alcance draft.
- Paso 5: el check alerta sobre readiness ambiguo de capabilities o QA gaps críticos.
- Paso 6: `docs/policies/README.md` contiene nombres `agent-*` legibles y alineados con registry.

## Evidence requerida

- Outputs de `npm.cmd run build`.
- Outputs de tests locales no mutantes.
- Output del nuevo check read-only.
- Output de `SMOKE_REQUIRE_AUTH=true` en entorno controlado, o registro de bloqueo.
- Diff o reporte de specs promovidas/justificadas.
- Resultado del check de capabilities.

## Policies y guardrails aplicables

- No ejecutar smokes mutantes en auditorías read-only.
- No instalar dependencias ni migrar DB sin aprobación humana.
- No marcar capability `ready-for-consumer` si runtime, QA y referencias no están alineadas.
- Mantener `specs/api/**` como contrato runtime; `docs/**` derivado.
- Usar `orchestrator_link` si el trabajo no nace desde el lifecycle del orchestrator.
- Aprobación humana requerida para cambios de CI/gates estrictos y promoción normativa masiva.

## Riesgos y no-objetivos

- No convertir el smoke mutante en gate universal sin entorno aislado y datos descartables.
- No resolver auth/JWT dentro de `sst-bend` si corresponde a `node-auth`.
- No modificar contratos runtime mientras se ordena ARDS/SDD.
- No declarar `advanced` completo hasta tener drift detection y Evidence automatizada suficiente.

## Primer siguiente paso recomendado

CR local del Service: separar validación read-only de smoke mutante. Es la unidad de menor dependencia y mayor impacto porque desbloquea auditorías reproducibles sin esperar JWT, DB ni servicios locales.

```yaml
adoption_handoff:
  readiness: ready
  recommended_first_unit:
    type: CR
    id_suggestion: "CR-SST-ARDS-READONLY-CHECK"
    title: "Separar validación ARDS read-only de smoke HTTP mutante"
    reason: "Permite auditar baseline ARDS/SDD sin riesgo de mutar servicios locales ni depender de JWT."
  ordered_units:
    - order: 1
      type: CR
      scope: "package.json, scripts/ards-check.js, scripts/smoke-test.js, AGENTS.md, docs/00-overview.md"
      acceptance_criteria:
        - "Existe comando read-only documentado."
        - "El comando no realiza POST/PATCH/DELETE ni requiere servicios locales."
        - "El comando ejecuta estructura ARDS, build noEmit y tests locales seguros."
      required_evidence:
        - "Output del nuevo comando read-only con exit code 0."
        - "Output de npm.cmd run build."
        - "Output de tests locales no mutantes."
      human_approval: conditional
    - order: 2
      type: CR
      scope: "docs/api/VALIDATION_REPORT.md, specs/states/gap.protected-smoke-coverage.yaml"
      acceptance_criteria:
        - "Evidence vigente del gate estricto o bloqueo actual registrado."
        - "Diferencia entre baseline parcial y completo documentada con fecha."
      required_evidence:
        - "Output de SMOKE_REQUIRE_AUTH=true en entorno controlado o bloqueo reproducible."
      human_approval: required
    - order: 3
      type: INIT
      scope: "Cross-repo auth/JWT si node-auth sigue bloqueando smokes protegidos"
      acceptance_criteria:
        - "Owner de auth identificado."
        - "CR o state cross-repo vinculado desde orchestrator."
      required_evidence:
        - "Estado de emisión JWT owner/member."
        - "orchestrator_link reconciliado."
      human_approval: required
    - order: 4
      type: CR
      scope: "specs/api/00-index.yaml y specs runtime draft"
      acceptance_criteria:
        - "Cada spec normativa tiene estado aceptado/activo o justificación draft."
      required_evidence:
        - "Reporte de revisión de lifecycle de specs."
      human_approval: required
    - order: 5
      type: CR
      scope: "scripts/ards-check.js y specs/capabilities/outbound/*.yaml"
      acceptance_criteria:
        - "El check detecta readiness ambiguo en capabilities."
      required_evidence:
        - "Output del check con fixtures o repo actual."
      human_approval: conditional
  blockers:
    - "Gate protegido completo depende de JWT owner/member y servicios locales controlados."
  non_goals:
    - "No cambiar contratos runtime de SST."
    - "No ejecutar smokes mutantes en auditoría read-only."
    - "No mover responsabilidad de emisión JWT desde node-auth hacia sst-bend."
```