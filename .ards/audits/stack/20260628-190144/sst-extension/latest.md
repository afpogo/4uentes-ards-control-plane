---
artifact_type: ards_audit_report
audit_template_id: ARDS-SDD-AUDIT-001
audit_template_version: 0.3.0
target_type: service_repository
target_repository: "C:\\Users\\andre\\Desktop\\4uentes\\apps\\4uentes-sst\\sst-extension"
target_commit: not_available
generated_at: "2026-06-28T19:20:00-03:00"
report_path: "C:\\Users\\andre\\Desktop\\4uentes\\apps\\4uentes-orchestor\\.ards\\audits\\stack\\20260628-190144\\sst-extension\\20260628-191531\\ards-sdd-audit-and-adoption.md"
adoption_handoff: ready
---

# 1. Veredicto ejecutivo

- `overall_status`: `partial`
- `observed_profile`: `standard`
- `confidence`: `high`

El repositorio `sst-extension` tiene una base ARDS/SDD real y útil: `AGENTS.md`, `specs/`, `docs/`, policies adoptadas, contract binding, capabilities inbound, ADRs, QA manual y scripts de validación. No es cumplimiento cosmético: varias specs tienen criterios verificables y hay implementación TypeScript y tests que cubren quick-save, sesiones, dictionary, PDF, storage, messaging y node-auth.

No alcanza `baseline_conformant` porque la ruta documentada de validación no pasa actualmente: `pnpm.cmd test` falla con 3 tests en `createNodeAuthSessionService`, y por transitividad `pnpm check` no puede considerarse verde. Además, parte de la continuidad/Evidence vive en el Control Plane y no queda completamente autocontenida en el target; algunas referencias cross-repo y policy docs son incompletas o no resolubles dentro del repositorio auditado. El build no pudo verificarse en sandbox read-only porque WXT intenta escribir en `.output`.

# 2. Alcance y limitaciones

- Raíz auditada: `C:\Users\andre\Desktop\4uentes\apps\4uentes-sst\sst-extension`.
- Repositorios relacionados usados solo como contexto:
  - `C:\Users\andre\Desktop\4uentes\apps\4uentes-core`
  - `C:\Users\andre\Desktop\4uentes\apps\4uentes-orchestor`
- Rutas excluidas: `.ards/audits/**` por regla del Audit Pack. No se detectó `.ards/` local en la raíz del target.
- Commit/branch: no observable directamente. `git rev-parse HEAD` y `git branch --show-current` fallaron por `fatal: detected dubious ownership`. Evidencia contextual en `4uentes-orchestor/evidence/requests/CR-SST-0077/sst-extension-child-sync-diff.yaml:8` registra `child_commit: "daf23d8"`, pero no se asumió como commit actual.
- Comandos ejecutados:
  - `node ./scripts/check.mjs`: exit code 0; output relevante: `Repository baseline check passed.`
  - `pnpm.cmd run check:baseline`: exit code 0; ejecuta `node ./scripts/check.mjs`; output relevante: `Repository baseline check passed.`
  - `pnpm run check:baseline`: exit code 1; bloqueado por PowerShell execution policy al resolver `pnpm.ps1`.
  - `pnpm.cmd test`: exit code 1; 20 test files, 19 passed, 1 failed; 83 tests, 80 passed, 3 failed.
  - `pnpm.cmd run build`: exit code 1; no verificable bajo read-only por `EPERM: operation not permitted, unlink ...\.output\chrome-mv3\options.html`.
- Comandos no ejecutados:
  - `pnpm check`: no ejecutado porque incluye `pnpm run test && pnpm run build`; `pnpm.cmd test` ya falla y `build` requiere escritura.
  - `pnpm install` y `pnpm dev`: no ejecutados por no ser validaciones read-only.

# 3. Resumen por dimensión

| Dimensión | Estado | Evidencia principal | Riesgo |
|---|---|---|---|
| A. Identidad, alcance y guía operativa | compliant | `AGENTS.md:1-23`, `AGENTS.md:64-97`, `README.md:7-17` | Bajo |
| B. Specs como fuente de verdad y SDD | partial | `specs/00-index.yaml:17-159`, `specs/features/quick-save.yaml:31-91` | Medio |
| C. Docs como contexto humano | compliant | `docs/00-overview.md:3-19`, `docs/adr/0001-use-wxt.md:5-23` | Bajo |
| D. Validación reproducible | non_compliant | `package.json:14-15`; `pnpm.cmd test` exit 1 con 3 tests fallidos | Alto |
| E. Policies y guardrails | partial | `specs/integration/policies.yaml:24-74`, `docs/ai/policy.md:9-44` | Medio |
| F. Continuidad, State y Evidence | partial | `specs/ards/contract-binding.yaml:11-14`; evidence real en Control Plane, no autocontenida localmente | Alto |
| G. Capabilities cross-repo | partial | `specs/integration/00-index.yaml:29-55`; refs producer no resolubles dentro del target | Medio |
| H. Portabilidad y automatización gobernada | partial | `docs/ai/policy.md:46-56`, `package.json:14-15` | Medio |
| I. Integridad anti-cosmética | partial | baseline estructural pasa; tests fallan; policy docs individuales faltan | Alto |

# 4. Hallazgos priorizados

```yaml
id: FINDING-ARDS-001
control_ids: [ARDS-14, ARDS-15, ARDS-17, ARDS-18, ARDS-40]
type: fact
status: non_compliant
severity: high
confidence: high
title: "La ruta documentada de test falla y bloquea la validación agregada"
evidence:
  - kind: command
    reference: "pnpm.cmd test"
    detail: "Exit code 1. 20 test files: 19 passed, 1 failed. 83 tests: 80 passed, 3 failed."
  - kind: command
    reference: "pnpm.cmd test"
    detail: "Fallos: TypeError: area.remove is not a function en create-node-auth-session-service.test.ts."
  - kind: file
    reference: "package.json:12-15"
    detail: "`check` encadena `check:baseline`, `test` y `build`; al fallar `test`, `check` no puede considerarse exitoso."
  - kind: file
    reference: "src/platform/storage/extension-storage.ts:165-173"
    detail: "`clearLocalSnapshotState` requiere `area.remove`."
  - kind: file
    reference: "src/features/node-auth-session/create-node-auth-session-service.test.ts:375-406"
    detail: "El helper `createMemoryStorageArea` usado por los tests fallidos implementa `get` y `set`, pero no `remove`."
impact: "No hay evidencia ejecutable verde para cerrar cambios bajo la Definition of Done local; el baseline ARDS/SDD operativo queda degradado."
minimum_remediation: "Corregir el fixture o contrato de storage en los tests, ejecutar `pnpm.cmd test`, luego `pnpm.cmd run build` en entorno con escritura controlada y finalmente `pnpm.cmd run check`."
dependencies: []
```

```yaml
id: FINDING-ARDS-002
control_ids: [ARDS-14, ARDS-17]
type: fact
status: not_verifiable
severity: medium
confidence: high
title: "El build documentado no es verificable bajo sandbox read-only"
evidence:
  - kind: command
    reference: "pnpm.cmd run build"
    detail: "Exit code 1. WXT intentó `unlink` sobre `.output\\chrome-mv3\\options.html` y recibió EPERM."
  - kind: file
    reference: "package.json:10"
    detail: "`build` está definido como `wxt build`."
impact: "No se puede distinguir desde esta auditoría si el build falla por defecto del repo o por restricción de escritura del entorno."
minimum_remediation: "Ejecutar build en un workspace de validación con escritura permitida y registrar Evidence del resultado."
dependencies: [FINDING-ARDS-001]
```

```yaml
id: FINDING-ARDS-003
control_ids: [ARDS-24, ARDS-25, ARDS-26, ARDS-27, ARDS-28]
type: inference
status: partial
severity: high
confidence: high
title: "State y Evidence existen por Control Plane, pero no quedan autocontenidos en el target"
evidence:
  - kind: file
    reference: "specs/ards/contract-binding.yaml:11-14"
    detail: "Declara orchestrator `4uentes-orchestor`, `last_validated_at: 2026-06-13` y `last_report_ref: evidence/requests/CR-SST-0077/sst-extension-child-sync-diff.yaml`."
  - kind: absence
    reference: "root directory listing"
    detail: "No hay directorios locales top-level `.ards`, `evidence`, `state`, `requests`, `backlog` o `capabilities` en el target."
  - kind: file
    reference: "4uentes-orchestor/evidence/requests/CR-SST-0077/sst-extension-child-sync-diff.yaml:1-12"
    detail: "El Control Plane sí contiene evidence contextual con `sync_status: synced` y `child_commit: daf23d8`."
impact: "Un agente puede retomar parte del contexto si conoce el Control Plane, pero el repo target por sí solo no contiene un estado vivo completo con implementado/parcial/pendiente/bloqueado y Evidence local."
minimum_remediation: "Agregar o enlazar explícitamente un mecanismo local mínimo de State/Evidence que resuelva hacia el Control Plane con rutas inequívocas y estado por capability/CR."
dependencies: []
```

```yaml
id: FINDING-ARDS-004
control_ids: [ARDS-29, ARDS-30, ARDS-31, ARDS-38, ARDS-40]
type: fact
status: partial
severity: medium
confidence: high
title: "Algunas referencias de capabilities upstream no son resolubles desde el target"
evidence:
  - kind: file
    reference: "specs/integration/inbound/node-auth--browser-extension-article-ingestion.yaml:12-20"
    detail: "Declara verificación contra sibling `node-auth` y refs `../../node-auth/specs/capabilities/outbound/...`."
  - kind: file
    reference: "docs/integration/inbound/node-auth--browser-extension-article-ingestion.md:31-40"
    detail: "Afirma `verified-local`, contrato upstream existente e implementación local."
  - kind: absence
    reference: "Test-Path specs\\capabilities\\outbound\\browser-extension-article-ingestion.yaml"
    detail: "False dentro del target; lo mismo para session, text-article-pdf y dictionary-domain-management-v1."
impact: "La adopción inbound está bien modelada, pero la auditoría del target no puede reproducir completamente la verificación upstream sin el repo productor `node-auth`, que no fue provisto como related repo."
minimum_remediation: "Registrar refs producer con repo explícito y/o snapshot/hash de publication validada; si depende de repo sibling no disponible, marcar `verification_status` con alcance y fecha."
dependencies: [FINDING-ARDS-003]
```

```yaml
id: FINDING-ARDS-005
control_ids: [ARDS-19, ARDS-20, ARDS-38, ARDS-39]
type: fact
status: partial
severity: medium
confidence: high
title: "La adopción de policies tiene registry útil, pero docs individuales faltan o son referenciados sin existir"
evidence:
  - kind: file
    reference: "specs/integration/policies.yaml:34-70"
    detail: "Cada policy referencia `source_human_doc` en Core y `human_doc: docs/policies/README.md`."
  - kind: absence
    reference: "Test-Path docs\\policies\\agent-model-selection-policy.md ... agent-architecture-boundary-policy.md"
    detail: "Los seis paths individuales evaluados devuelven False."
  - kind: file
    reference: "docs/policies/README.md:18-23"
    detail: "La lista de policies adoptadas muestra caracteres corruptos antes de `gent-*`, probablemente pérdida de `a` por carácter de control."
impact: "La policy machine-readable existe, pero la lectura humana local es mínima y tiene drift/corrupción menor; puede dificultar adopción por humanos y agentes."
minimum_remediation: "Corregir encoding/listado de `docs/policies/README.md` y decidir si los docs humanos individuales se adoptan localmente o se enlazan explícitamente a Core/Control Plane."
dependencies: []
```

```yaml
id: FINDING-ARDS-006
control_ids: [ARDS-03, ARDS-07, ARDS-31]
type: fact
status: partial
severity: low
confidence: medium
title: "El commit actual no es observable por configuración Git de ownership"
evidence:
  - kind: command
    reference: "git rev-parse HEAD"
    detail: "Exit code 1: `fatal: detected dubious ownership in repository`."
  - kind: command
    reference: "git branch --show-current"
    detail: "Exit code 1 por la misma causa."
impact: "La auditoría no puede anclar el resultado al SHA actual desde el target, reduciendo reproducibilidad del informe."
minimum_remediation: "Ejecutar auditorías desde un usuario/entorno con safe.directory configurado o registrar commit por el runner antes de invocar el auditor."
dependencies: []
```

# 5. Matriz completa de controles

| ID | Nivel | Estado | Evidencia | Nota |
|---|---|---|---|---|
| ARDS-01 | MUST | compliant | `AGENTS.md:1-8` | Existe en raíz y describe repo, rol y estado. |
| ARDS-02 | MUST | compliant | `AGENTS.md:25-50`, `AGENTS.md:64-97`, `AGENTS.md:138-145` | Incluye comandos, estructura, fuentes de verdad y checklist. |
| ARDS-03 | MUST | compliant | `AGENTS.md:9-23`, `specs/00-index.yaml:1-16` | Propósito y límites del Service están explícitos; owner técnico aparece por spec en features. |
| ARDS-04 | SHOULD | partial | `AGENTS.md:18-23`, sin overrides subdirectorio | Hay reglas por capa fuente, no instrucciones locales por subdirectorio. |
| ARDS-05 | MUST | compliant | `specs/00-index.yaml:17-159` | Índice canónico amplio y descubrible. |
| ARDS-06 | MUST | compliant | `specs/features/quick-save.yaml:31-91` | Requisitos, constraints y acceptance criteria verificables. |
| ARDS-07 | MUST | partial | `specs/features/sessions.yaml` refs a `src/...`; tests existentes | Hay trazas spec-code, pero validation actual falla. |
| ARDS-08 | MUST | partial | `pnpm.cmd test` exit 1; `docs/qa/quick-save-sync-validation.md:14` | Docs exigen checks previos, pero tests actuales no pasan. |
| ARDS-09 | SHOULD | partial | `specs/00-index.yaml:160-166`, statuses active/accepted/draft | Hay status y planned, pero no lifecycle formal de deprecación. |
| ARDS-10 | MUST | compliant | `docs/00-overview.md:3-19` | Overview suficiente. |
| ARDS-11 | MUST | compliant | `docs/00-overview.md:86-129`, `docs/architecture/runtime-contexts.md`, `docs/integration/*` | Operación, límites e integración enlazados. |
| ARDS-12 | SHOULD | compliant | `docs/adr/0001-use-wxt.md:5-23` | ADRs conservan contexto, decisión y consecuencias. |
| ARDS-13 | MUST | compliant | `docs/00-overview.md:18-19`, `AGENTS.md:87-90` | Docs complementan specs y no las reemplazan. |
| ARDS-14 | MUST | non_compliant | `package.json:14-15`, `pnpm.cmd test` exit 1 | Ruta existe pero no está verde. |
| ARDS-15 | MUST | partial | `pnpm.cmd run check:baseline` exit 0; `pnpm.cmd test` exit 1 | Comandos reales, no placeholders; uno falla. |
| ARDS-16 | MUST | compliant | `AGENTS.md:138-145`, `docs/qa/quick-save-sync-validation.md:14` | DoD local indica test/build/check y QA. |
| ARDS-17 | MUST | non_compliant | `pnpm.cmd test` exit 1; `pnpm.cmd run build` EPERM | Se distingue fallo real de test y limitación read-only de build. |
| ARDS-18 | SHOULD | non_compliant | `package.json:15` | `check` existe, pero queda bloqueado por test fallido y build no verificable. |
| ARDS-19 | MUST | compliant | `AGENTS.md:121-136`, `AGENTS.md:147-151`, `docs/ai/policy.md:9-44` | Guardrails locales suficientes. |
| ARDS-20 | MUST | partial | `specs/integration/policies.yaml:34-72`, `docs/policies/README.md:18-23` | Policies adoptadas, pero docs humanos mínimos/corruptos y refs Core no verificadas desde target. |
| ARDS-21 | MUST | compliant | `docs/ai/policy.md:25-44`, `AGENTS.md:138-145` | Límite por evidencia/checks antes de cierre. |
| ARDS-22 | MUST | compliant | `AGENTS.md:147-151`, `.gitignore:1-6`, `.env.example:1-6` | Secretos y auth storage tratados explícitamente. |
| ARDS-23 | SHOULD | partial | `docs/ai/model-selection-policy.md`, `docs/cross-repo/orchestrator-link-rule.md:24-31` | Reglas de aprobación humana no están completamente materializadas en el target. |
| ARDS-24 | MUST | partial | `specs/ards/contract-binding.yaml:11-14`, Control Plane evidence | Retoma vía orchestrator, no autocontenido localmente. |
| ARDS-25 | MUST | partial | `specs/features/00-index.yaml:8-27`, `specs/integration/00-index.yaml:9-58` | Diferencia implemented/draft/planned, pero no estado vivo completo de trabajo. |
| ARDS-26 | MUST | partial | `4uentes-orchestor/evidence/...:1-12`; no `evidence/` local | Evidence existe contextual, no en target. |
| ARDS-27 | MUST | compliant | `specs/ards/contract-binding.yaml`, `4uentes-orchestor/state/*` | No depende exclusivamente de conversación IA. |
| ARDS-28 | SHOULD | partial | `4uentes-orchestor/state/capability-links.yaml:1-15`; target ref local | Enlaces existen en Control Plane, no plenamente reflejados localmente. |
| ARDS-29 | MUST | compliant | `specs/integration/00-index.yaml:29-49` | Capabilities inbound declaradas. |
| ARDS-30 | MUST | partial | `specs/integration/inbound/node-auth--browser-extension-article-ingestion.yaml:1-69` | Identifica contrato/productor/estado; validación upstream no reproducible desde target. |
| ARDS-31 | MUST | partial | `docs/cross-repo/orchestrator-link-rule.md:5-21`, `specs/ards/contract-binding.yaml:11-14` | Handoff modelado; refs exactas dependen de Control Plane/productor. |
| ARDS-32 | SHOULD | compliant | `specs/ards/contract-binding.yaml:1-14` | Contract binding local existe. |
| ARDS-33 | SHOULD | partial | `scripts/check.mjs:3-117`, `specs/ards/contract-binding.yaml` | Señales existen, pero check ARDS es solo existencia de archivos. |
| ARDS-34 | MUST | compliant | `docs/ai/policy.md:46-50`, `specs/` | Conocimiento crítico está en ARDS/SDD local, no solo prompts. |
| ARDS-35 | MUST | compliant | `docs/ai/policy.md:5-7`, `AGENTS.md:162-183` | Policies provider-agnostic adoptadas. |
| ARDS-36 | SHOULD | partial | `scripts/check.mjs:1-117`, `package.json:14-15` | Automatización existe, pero validación completa no pasa. |
| ARDS-37 | MAY | not_applicable | No requerido para baseline | No se evaluó madurez por skills/MCP locales. |
| ARDS-38 | MUST | partial | `pnpm.cmd run check:baseline` exit 0; Test-Path outbound capability refs False | Índices principales pasan; algunas refs cross-repo/locales no resuelven desde target. |
| ARDS-39 | MUST | partial | `specs/templates/*.yaml` contienen TODO intencional; `.env.example:1-6` placeholder explícito | No hay archivos vacíos; TODOs son explícitos, pero varios permanecen en índices planned. |
| ARDS-40 | MUST | non_compliant | `pnpm.cmd test` exit 1; `docs/qa/quick-save-sync-validation.md:14` | Afirmaciones de validación no coinciden con test actual. |
| ARDS-41 | SHOULD | partial | `scripts/check.mjs:3-117` | Check ARDS estructural existe, pero valida presencia, no semántica profunda. |

# 6. Backlog de remediación propuesto

1. CR local del Service: reparar tests de `createNodeAuthSessionService`.
   - Alcance: `src/features/node-auth-session/create-node-auth-session-service.test.ts` y, si corresponde, contrato de storage mock.
   - Riesgo: alto.
   - Dependencias: ninguna.

2. CR local del Service: ejecutar y registrar validación completa.
   - Alcance: `pnpm.cmd test`, `pnpm.cmd run build`, `pnpm.cmd run check`.
   - Riesgo: alto.
   - Dependencias: tests verdes y entorno con escritura para build.

3. CR local del Service + CR del Control Plane: formalizar State/Evidence local mínimo.
   - Alcance: `specs/ards/contract-binding.yaml`, `specs/00-index.yaml`, posible carpeta local o ref explícita hacia `4uentes-orchestor`.
   - Riesgo: alto.
   - Dependencias: decisión humana sobre si Evidence se duplica localmente o se referencia al Control Plane.

4. INIT cross-repo: normalizar handoffs de capabilities producer/consumer.
   - Alcance: `specs/integration/inbound/*.yaml`, docs inbound, producer `node-auth` si está disponible en otra ejecución.
   - Riesgo: medio.
   - Dependencias: acceso al repo productor o snapshot/hash aprobado.

5. CR local del Service: corregir policy docs humanos.
   - Alcance: `docs/policies/README.md`, `specs/integration/policies.yaml`.
   - Riesgo: medio.
   - Dependencias: decidir si docs individuales viven en Core o se materializan localmente.

6. CR del Control Plane o runner: registrar commit/branch antes de auditoría cuando Git tenga `dubious ownership`.
   - Alcance: runner de auditoría o configuración segura de `safe.directory`.
   - Riesgo: bajo.
   - Dependencias: aprobación humana de configuración Git.

# 7. Evidencia positiva

- `AGENTS.md` es operativo y específico: define estructura, golden paths, seguridad, checklist y políticas heredadas (`AGENTS.md:25-50`, `AGENTS.md:98-145`, `AGENTS.md:162-183`).
- `specs/00-index.yaml` cataloga runtime, integración, features, templates, policies y gobernanza del orchestrator (`specs/00-index.yaml:17-209`).
- Las specs no son vacías: quick-save incluye comportamiento, constraints y acceptance criteria concretos (`specs/features/quick-save.yaml:31-91`).
- Docs humanos explican propósito y navegación, y declaran que `specs/` es la fuente canónica (`docs/00-overview.md:18-19`, `docs/00-overview.md:39-51`).
- Hay ADRs con contexto, decisión y consecuencias (`docs/adr/0001-use-wxt.md:5-23`).
- El baseline estructural automatizado pasa (`node ./scripts/check.mjs`, exit 0; `pnpm.cmd run check:baseline`, exit 0).
- Hay tests sustantivos: `pnpm.cmd test` descubrió 83 tests, con 80 passing antes de los 3 fallos.
- La implementación muestra separación razonable entre feature, platform y storage: `src/features/quick-save/create-quick-save-service.ts`, `src/platform/api/quick-save-bff-gateway.ts`, `src/platform/storage/extension-storage.ts`.
- El Control Plane relacionado contiene Evidence de sync CR-SST-0077 para `sst-extension` (`4uentes-orchestor/evidence/requests/CR-SST-0077/sst-extension-child-sync-diff.yaml:1-12`).

# 8. Preguntas abiertas

1. ¿El repositorio productor `node-auth` debe incluirse como related repo obligatorio para futuras auditorías de capabilities inbound de `sst-extension`?
2. ¿La política de State/Evidence deseada es centralizada exclusivamente en `4uentes-orchestor` o debe existir un índice local mínimo en cada child repo?
3. ¿El runner de auditoría debe configurar `safe.directory` o capturar commit/branch fuera del proceso Codex para evitar el bloqueo por `dubious ownership`?

# Handoff para adopción por humano + agente IA constructor

## Objetivo de adopción

Llevar `sst-extension` desde `partial / standard observado` a `baseline_conformant_with_observations`, con validación ejecutable verde, State/Evidence trazable y referencias cross-repo reproducibles sin depender del historial conversacional.

## Brecha resumida

La estructura ARDS/SDD está presente y es útil, pero el cierre operativo falla porque `pnpm.cmd test` no pasa. La continuidad existe principalmente en el Control Plane, no como entrada autocontenida del target. Las capabilities inbound están documentadas, pero su verificación upstream no puede reproducirse sin `node-auth` o snapshots/hashes. La adopción de policies es machine-readable, pero los docs humanos locales son mínimos y tienen drift menor.

## Secuencia recomendada

1. CR local del Service para reparar tests de node-auth session.
2. CR local del Service para generar Evidence de validación completa.
3. CR local del Service + CR del Control Plane para formalizar State/Evidence local o refs inequívocas.
4. INIT cross-repo para normalizar verification de capabilities con producer `node-auth`.
5. CR local del Service para corregir policy docs humanos.
6. CR del Control Plane/runner para commit capture robusto.

## Unidad de cambio sugerida por paso

- Paso 1: CR local del Service.
- Paso 2: CR local del Service.
- Paso 3: INIT cross-repo o CR local + CR Control Plane, según decisión de ownership.
- Paso 4: INIT cross-repo.
- Paso 5: CR local del Service.
- Paso 6: CR del Control Plane.

## Alcance por paso

- Paso 1: `src/features/node-auth-session/create-node-auth-session-service.test.ts`; verificar interacción con `src/platform/storage/extension-storage.ts`.
- Paso 2: `package.json`, `scripts/check.mjs`, Evidence de outputs; no cambiar build system salvo fallo real.
- Paso 3: `specs/ards/contract-binding.yaml`, `specs/00-index.yaml`, `docs/cross-repo/orchestrator-link-rule.md`; Control Plane `state/` y `evidence/` como contexto.
- Paso 4: `specs/integration/inbound/*.yaml`, `docs/integration/inbound/*.md`; producer `node-auth` cuando esté disponible.
- Paso 5: `docs/policies/README.md`, `specs/integration/policies.yaml`.
- Paso 6: runner de auditoría o documentación operativa de ejecución.

## Criterios de aceptación

- Paso 1: `pnpm.cmd test` termina con exit code 0.
- Paso 2: `pnpm.cmd run build` y `pnpm.cmd run check` terminan con exit code 0 en entorno con escritura; outputs quedan registrados como Evidence.
- Paso 3: un agente puede encontrar desde el target el estado vivo, el Evidence ref y el Control Plane owner sin inferencias.
- Paso 4: cada adoption inbound indica producer ref, versión/hash o razón `not_verifiable`; no hay `verified-local` irreproducible.
- Paso 5: policy docs humanos no tienen caracteres corruptos y las refs faltantes están resueltas o explícitamente delegadas a Core.
- Paso 6: auditorías futuras reportan commit/branch o registran una limitación controlada por el runner.

## Evidence requerida

- Output de `pnpm.cmd test`.
- Output de `pnpm.cmd run build`.
- Output de `pnpm.cmd run check`.
- Diff o manifest de State/Evidence actualizado.
- Snapshot/hash de capabilities producer o evidencia de lectura del repo productor.
- Registro del commit auditado.

## Policies y guardrails aplicables

- Seguir `AGENTS.md`: actualizar spec, docs, implementación y validación en ese orden cuando cambie comportamiento observable (`AGENTS.md:66-70`).
- No inventar rutas, comandos, dependencias ni contratos (`AGENTS.md:121-123`).
- No presentar arquitectura planeada como implementada (`docs/ai/policy.md:15`).
- No cerrar trabajo gobernado sin specs/docs alineadas, capability changes registradas y `orchestrator_link` presente o reconciliado (`AGENTS.md:185-193`).
- Aprobación humana requerida para definir ownership de State/Evidence y para cualquier cambio cross-repo.

## Riesgos y no-objetivos

- No modificar producer `node-auth` desde este CR local salvo INIT cross-repo aprobado.
- No convertir `scripts/check.mjs` en una certificación semántica completa sin diseño previo.
- No ejecutar build en sandbox read-only esperando éxito; requiere entorno con escritura controlada.
- No ocultar el fallo de tests marcando el repo como conforme por presencia de archivos.

## Primer siguiente paso recomendado

Crear un CR local del Service para reparar los 3 tests fallidos de `createNodeAuthSessionService` y recuperar `pnpm.cmd test` verde. Es el bloqueo más directo para la validación agregada y para cualquier adopción posterior.

```yaml
adoption_handoff:
  readiness: ready
  recommended_first_unit:
    type: CR
    id_suggestion: "CR-SST-EXT-VALIDATION-001"
    title: "Repair node-auth session tests and restore documented validation"
    reason: "The documented validation path is currently non-compliant because `pnpm.cmd test` fails, blocking `pnpm check`."
  ordered_units:
    - order: 1
      type: CR
      scope: "sst-extension local tests for node-auth session storage behavior"
      acceptance_criteria:
        - "`pnpm.cmd test` exits 0"
        - "The memory storage test double supports the storage contract used by `clearLocalSnapshotState`"
      required_evidence:
        - "Command output for `pnpm.cmd test`"
      human_approval: not_required
    - order: 2
      type: CR
      scope: "sst-extension validation evidence for build and check"
      acceptance_criteria:
        - "`pnpm.cmd run build` exits 0 in a writable validation workspace"
        - "`pnpm.cmd run check` exits 0"
      required_evidence:
        - "Command output for build"
        - "Command output for check"
      human_approval: conditional
    - order: 3
      type: INIT
      scope: "State/Evidence ownership between sst-extension and 4uentes-orchestor"
      acceptance_criteria:
        - "Target repo has a discoverable local State/Evidence entrypoint or unambiguous Control Plane refs"
        - "State differentiates implemented, partial, pending, blocked, discarded and not incorporated where applicable"
      required_evidence:
        - "Updated contract binding or local state index"
        - "Control Plane evidence ref"
      human_approval: required
    - order: 4
      type: INIT
      scope: "Cross-repo capability verification for node-auth inbound adoptions"
      acceptance_criteria:
        - "Each inbound capability has producer version/hash or explicit not_verifiable rationale"
        - "`verified-local` claims are reproducible from available repos or snapshots"
      required_evidence:
        - "Producer capability refs or snapshots"
        - "Updated inbound adoption records"
      human_approval: required
    - order: 5
      type: CR
      scope: "Local policy documentation cleanup"
      acceptance_criteria:
        - "`docs/policies/README.md` lists policies without corrupted characters"
        - "Human docs references are either resolvable or explicitly delegated to Core"
      required_evidence:
        - "Updated docs/policies README"
        - "Baseline check output"
      human_approval: conditional
  blockers:
    - "Current `pnpm.cmd test` failure prevents baseline executable conformance."
    - "Build verification requires writable workspace because WXT writes `.output`."
    - "Producer repo `node-auth` was not available as related repo in this audit envelope."
  non_goals:
    - "Do not implement product changes while repairing ARDS/SDD validation."
    - "Do not mutate Control Plane state from the Service CR without an approved cross-repo INIT."
    - "Do not mark upstream capability verification as complete without producer evidence."
```