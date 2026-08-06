---
artifact_type: ards_audit_report
audit_template_id: ARDS-SDD-AUDIT-001
audit_template_version: 0.3.0
target_type: service_repository
target_repository: C:\Users\andre\Desktop\4uentes\apps\4uentes-infra\sst-4uentes-infra
target_commit: not_available
generated_at: 2026-06-28T19:23:32-03:00
report_path: C:\Users\andre\Desktop\4uentes\apps\4uentes-orchestor\.ards\audits\stack\20260628-190144\sst-4uentes-infra\20260628-192332\ards-sdd-audit-and-adoption.md
adoption_handoff: ready
---

### 1. Veredicto ejecutivo

- `overall_status`: `partial`
- `observed_profile`: `standard-partial`
- `confidence`: `high`

El repositorio auditado contiene una adopcion ARDS/SDD real y util: `AGENTS.md`, `specs/`, `docs/`, States, policies, capabilities, contract binding, manifests Kubernetes, Argo CD y CI. No es adopcion cosmetica. Sin embargo, no alcanza conformidad baseline completa porque hay drift interno en indices y estados, referencias `TODO:` usadas como rutas vigentes aunque existen archivos reales, handoffs cross-repo incompletos con `orchestrator_link.state_id: TODO`, y la ruta de validacion documentada no pudo completarse en el entorno auditado. La validacion falla antes de renderizar por `kubectl kustomize ... evalsymlink failure ... Access is denied`; ademas `npm run check` queda bloqueado por PowerShell ExecutionPolicy, aunque `npm.cmd run check` si ejecuta. Hay evidencia positiva fuerte, pero el estado vivo y la evidencia operativa no son suficientemente consistentes para marcar todos los MUST como `compliant`.

### 2. Alcance y limitaciones

- Raiz auditada: `C:\Users\andre\Desktop\4uentes\apps\4uentes-infra\sst-4uentes-infra`.
- Commit/branch: `not_available`; `git rev-parse` fallo por `fatal: detected dubious ownership`.
- Rutas excluidas: `.ards/audits/**`.
- Repos relacionados usados solo como contexto declarado: `4uentes-core`, `4uentes-orchestor`.
- Comandos ejecutados:
  - `rg --files -g '!**/.ards/audits/**'`: exit `0`; inventario de archivos obtenido.
  - `git rev-parse --show-toplevel; git rev-parse --abbrev-ref HEAD; git rev-parse HEAD; git status --short`: exit `1`; Git bloqueado por dubious ownership.
  - `npm run check`: exit `1`; PowerShell bloqueo `npm.ps1` por ExecutionPolicy.
  - `npm.cmd run check`: exit `1`; ejecuto scripts y fallo en `kubectl kustomize k8s-manifests/bootstrap/nginx-ingress` con `Access is denied`.
  - `kubectl version --client=true`: exit `0`; client `v1.29.2`, Kustomize `v5.0.4`.
  - `kubectl kustomize .\k8s-manifests\bootstrap\nginx-ingress`: exit `1`; mismo `evalsymlink failure ... Access is denied`.
- Comandos no ejecutados: `kubectl apply`, smokes HTTP, Docker, Argo CD live checks y cualquier accion con posible mutacion o dependencia runtime.
- Limitaciones: entorno read-only, Git no confiable por ownership, y Kustomize no renderizable desde este shell por denegacion de acceso aunque PowerShell si puede listar el directorio.

### 3. Resumen por dimension

| Dimension | Estado | Evidencia principal | Riesgo |
|---|---|---|---|
| A. Identidad, alcance y guia | compliant | `AGENTS.md:5-34`, `specs/00-index.yaml:2-12` | Bajo |
| B. Specs y SDD | partial | `specs/00-index.yaml`, `specs/states/00-index.yaml:9,21,33,39`, `specs/capabilities/outbound/00-index.yaml:10,19,49` | Alto |
| C. Docs humanos | partial | `docs/00-overview.md:50-64`, `docs/runbooks/README.md:15-35` | Medio |
| D. Validacion reproducible | partial | `package.json`, `AGENTS.md:46-62`, comandos `npm.cmd run check` exit `1` | Alto |
| E. Policies y guardrails | partial | `AGENTS.md:64-74`, `specs/integration/policies.yaml:34-72` | Medio |
| F. Continuidad, State y Evidence | partial | `specs/states/00-index.yaml`, `specs/states/prepare-public-development-url.yaml:58-85` | Alto |
| G. Capabilities cross-repo | partial | `specs/capabilities/outbound/00-index.yaml`, `specs/ards/contract-binding.yaml` | Alto |
| H. Portabilidad y automatizacion | partial | `docs/ai/policy.md`, `package.json`, CI workflows | Medio |
| I. Integridad anti-cosmetica | partial | referencias `TODO:`, drift de estados, check no completado | Alto |

### 4. Hallazgos priorizados

```yaml
id: FINDING-ARDS-001
control_ids: [ARDS-14, ARDS-15, ARDS-17, ARDS-18, ARDS-40]
type: fact
status: partial
severity: high
confidence: high
title: "La ruta unica de validacion existe pero no completa en el entorno auditado"
evidence:
  - kind: file
    reference: "package.json"
    detail: "Define check, check:bootstrap:nginx, check:development y comandos kubectl kustomize/apply --dry-run=client."
  - kind: command
    reference: "npm run check"
    detail: "exit 1; PowerShell bloquea C:\\Program Files\\nodejs\\npm.ps1 por ExecutionPolicy."
  - kind: command
    reference: "npm.cmd run check"
    detail: "exit 1; falla en kubectl kustomize k8s-manifests/bootstrap/nginx-ingress por evalsymlink failure: Access is denied."
impact: "No se puede demostrar reproducibilidad ejecutable del baseline ARDS/SDD desde este entorno."
minimum_remediation: "Registrar la variante Windows soportada (`npm.cmd run check`) y resolver el acceso de Kustomize o documentar una limitacion reproducible con Evidence de CI verde."
dependencies: []
```

```yaml
id: FINDING-ARDS-002
control_ids: [ARDS-05, ARDS-07, ARDS-24, ARDS-25, ARDS-38, ARDS-39]
type: fact
status: partial
severity: high
confidence: high
title: "Indices de State y Capabilities contienen rutas vigentes prefijadas con TODO pese a que los archivos existen"
evidence:
  - kind: file
    reference: "specs/states/00-index.yaml:9"
    detail: "spec: \"TODO: specs/states/bootstrap-ards-base.yaml\"."
  - kind: file
    reference: "specs/states/00-index.yaml:21"
    detail: "spec: \"TODO: specs/states/install-ingress-controller.yaml\"."
  - kind: file
    reference: "specs/capabilities/outbound/00-index.yaml:19"
    detail: "spec: \"TODO: specs/capabilities/outbound/platform-gitops-deployment.yaml\" aunque el archivo existe."
impact: "La descubribilidad es ambigua y un agente no puede distinguir ruta valida, deuda pendiente o placeholder."
minimum_remediation: "Normalizar indices: rutas reales sin prefijo TODO; mover deuda a `blockers`, `open_questions` o campos de estado."
dependencies: []
```

```yaml
id: FINDING-ARDS-003
control_ids: [ARDS-08, ARDS-24, ARDS-25, ARDS-26, ARDS-40]
type: conflict
status: partial
severity: high
confidence: high
title: "Hay drift entre estados resumidos, specs de estado y observaciones runtime"
evidence:
  - kind: file
    reference: "specs/states/00-index.yaml:19"
    detail: "install-ingress-controller aparece `done-development-2026-05-18`."
  - kind: file
    reference: "specs/states/install-ingress-controller.yaml:5"
    detail: "El archivo declara `current_status: implementation-defined`."
  - kind: file
    reference: "docs/00-overview.md:35"
    detail: "Argo CD se afirma `Synced/Healthy`."
  - kind: file
    reference: "specs/infra/gitops/sst-app.yaml:57-62"
    detail: "Observacion 2026-06-28 declara `Synced/Progressing` con blocker."
impact: "La continuidad no es confiable para retomar trabajo sin reinterpretar manualmente la version vigente."
minimum_remediation: "Crear un CR local de reconciliacion de State para alinear indices, estado vivo, docs y blockers con fecha de observacion."
dependencies: []
```

```yaml
id: FINDING-ARDS-004
control_ids: [ARDS-29, ARDS-30, ARDS-31, ARDS-32, ARDS-33]
type: fact
status: partial
severity: high
confidence: high
title: "Capabilities y handoff cross-repo existen, pero la reconciliacion con orchestrator esta incompleta"
evidence:
  - kind: file
    reference: "specs/ards/contract-binding.yaml:6-14"
    detail: "Declara core contract y orchestrator last_report_ref."
  - kind: file
    reference: "specs/capabilities/outbound/platform-public-development-url.yaml:6-15"
    detail: "orchestrator_link existe, pero `state_id: TODO`."
  - kind: file
    reference: "specs/states/plan-sst-extension-public-api-origin.yaml:6-15"
    detail: "`state_id` y `request_id` siguen TODO."
impact: "El Control Plane no puede evaluar impacto cross-repo de forma determinista sin reconciliacion manual."
minimum_remediation: "Reconciliar IDs con `4uentes-orchestor/state/capability-links.yaml` y registrar Evidence refs estables."
dependencies: ["4uentes-orchestor"]
```

```yaml
id: FINDING-ARDS-005
control_ids: [ARDS-19, ARDS-20, ARDS-22, ARDS-23]
type: fact
status: partial
severity: medium
confidence: high
title: "Las policies estan adoptadas, pero algunos guardrails criticos siguen pendientes"
evidence:
  - kind: file
    reference: "specs/integration/policies.yaml:34-72"
    detail: "Seis policies heredadas aparecen `adopted`, sin gaps."
  - kind: file
    reference: "specs/infra/environments/development.yaml:98-113"
    detail: "`protected_branches: TODO`, rollback y secretos/GHCR con blockers."
  - kind: file
    reference: "docs/infra/README.md:100-103"
    detail: "Credencial runtime de Argo CD con token local debe reemplazarse por mecanismo aprobado."
impact: "La operacion es gobernada, pero promotion/rollback/credenciales no estan cerrados."
minimum_remediation: "Cerrar guardrails de branch, rollback, credencial GitOps y secreto GHCR o explicitarlos como blockers de promocion."
dependencies: []
```

```yaml
id: FINDING-ARDS-006
control_ids: [ARDS-10, ARDS-11, ARDS-12, ARDS-13]
type: fact
status: partial
severity: medium
confidence: high
title: "Docs humanos son amplios pero conservan runbooks criticos como TODO"
evidence:
  - kind: file
    reference: "docs/runbooks/README.md:15-35"
    detail: "Lista runbooks pendientes para bootstrap kind, rotacion de secretos, smoke, node-auth y Gateway API."
  - kind: file
    reference: "docs/00-overview.md:76-90"
    detail: "Decisiones faltantes documentadas, incluyendo staging/production, healthchecks y credencial Argo CD."
impact: "El contexto humano es util, pero no basta para operacion completa sin conocimiento externo."
minimum_remediation: "Priorizar runbooks que bloquean validacion reproducible y promocion: bootstrap kind, secretos, smoke y rollback."
dependencies: []
```

```yaml
id: FINDING-ARDS-007
control_ids: [ARDS-38, ARDS-39, ARDS-40, ARDS-41]
type: fact
status: partial
severity: medium
confidence: high
title: "Existe CI de guardrails, pero no cubre completamente el contrato ARDS/SDD ni se verifico resultado actual"
evidence:
  - kind: file
    reference: ".github/workflows/ci-pipeline.yml:18-43"
    detail: "Valida presencia de archivos, referencias a localhost, workflows YAML y ausencia de apply directo/secretos evidentes."
  - kind: file
    reference: ".github/workflows/deploy.yml:31-48"
    detail: "Renderiza overlay y busca recursos esperados."
  - kind: command
    reference: "git rev-parse / git status"
    detail: "No se pudo determinar branch, commit ni estado CI asociado por dubious ownership."
impact: "Hay automatizacion positiva, pero la auditoria no puede atar el resultado CI a un commit auditado."
minimum_remediation: "Agregar Evidence de CI por commit o un artefacto local de validacion ARDS que registre comando, commit y resultado."
dependencies: []
```

### 5. Matriz completa de controles

| ID | Nivel | Estado | Evidencia | Nota |
|---|---|---|---|---|
| ARDS-01 | MUST | compliant | `AGENTS.md:1-3` | Existe en raiz. |
| ARDS-02 | MUST | compliant | `AGENTS.md:28-83` | Estructura, comandos, restricciones y cierre definidos. |
| ARDS-03 | MUST | compliant | `AGENTS.md:5-9`, `specs/00-index.yaml:2-6` | Servicio, proposito y owner identificados. |
| ARDS-04 | SHOULD | partial | Solo `AGENTS.md` raiz | No hay overrides; aceptable pero no especializado. |
| ARDS-05 | MUST | partial | `specs/00-index.yaml`, `specs/states/00-index.yaml` | Indices existen, pero contienen `TODO:` en rutas. |
| ARDS-06 | MUST | compliant | `specs/infra/**`, `specs/infra/deployment-contracts/node-auth.yaml` | Requisitos, contratos y validaciones presentes. |
| ARDS-07 | MUST | partial | `specs/states/**`, `specs/capabilities/outbound/**` | Trazabilidad util pero con IDs orchestrator TODO. |
| ARDS-08 | MUST | partial | `docs/00-overview.md:35`, `specs/infra/gitops/sst-app.yaml:57-62` | Drift Synced/Healthy vs Synced/Progressing. |
| ARDS-09 | SHOULD | partial | Estados y status fields | No hay mecanismo formal de deprecacion/versionado completo. |
| ARDS-10 | MUST | compliant | `docs/00-overview.md:1-64` | Overview suficiente. |
| ARDS-11 | MUST | partial | `docs/runbooks/README.md:15-35` | Runbooks criticos pendientes. |
| ARDS-12 | SHOULD | partial | `docs/reference-sources.md`, `docs/infra/*` | Decisiones registradas, no ADR formal completo. |
| ARDS-13 | MUST | compliant | `docs/00-overview.md:50-64` | Declara specs como fuente normativa. |
| ARDS-14 | MUST | partial | `AGENTS.md:46-62`, `package.json` | Ruta documentada existe pero falla en auditoria. |
| ARDS-15 | MUST | partial | `npm.cmd run check` exit `1` | Comandos existen; ejecucion no completa. |
| ARDS-16 | MUST | compliant | `AGENTS.md:76-83` | Checklist de cierre definido. |
| ARDS-17 | MUST | partial | Outputs de `npm run check` y `npm.cmd run check` | Distingue fallo de shell y fallo Kustomize, sin exito. |
| ARDS-18 | SHOULD | compliant | `package.json` script `check` | Comando agregado existe. |
| ARDS-19 | MUST | compliant | `AGENTS.md:64-74` | Guardrails locales claros. |
| ARDS-20 | MUST | partial | `specs/integration/policies.yaml:9-14` | Adopta Core, pero no se verifico core ref por Git. |
| ARDS-21 | MUST | compliant | `AGENTS.md:66-74`, `docs/cross-repo/orchestrator-link-rule.md` | Limites de agente claros. |
| ARDS-22 | MUST | partial | `AGENTS.md:70`, `specs/infra/security/no-plaintext-secrets.yaml` | Tratamiento explicito; estrategia aun parcial. |
| ARDS-23 | SHOULD | partial | `specs/infra/environments/development.yaml:98-113` | Aprobaciones/rollback incompletos. |
| ARDS-24 | MUST | partial | `specs/states/00-index.yaml` | State existe, con drift. |
| ARDS-25 | MUST | partial | `specs/states/00-index.yaml:4-88` | Estados diferenciados, pero inconsistentes. |
| ARDS-26 | MUST | partial | `specs/states/prepare-public-development-url.yaml:58-85` | Evidence existe; no uniforme para todos los states. |
| ARDS-27 | MUST | compliant | Archivos versionados `specs/states/**` | No depende solo de chat. |
| ARDS-28 | SHOULD | partial | `specs/states/**`, capabilities | Enlaces existen con TODOs. |
| ARDS-29 | MUST | partial | `specs/capabilities/outbound/00-index.yaml` | Declaradas, algunas specs con `TODO:`. |
| ARDS-30 | MUST | partial | `platform-public-development-url.yaml`, `platform-gitops-deployment.yaml` | Contratos utiles, estados/index con drift. |
| ARDS-31 | MUST | partial | `orchestrator_link` en specs/states | Handoff existe, IDs incompletos. |
| ARDS-32 | SHOULD | compliant | `specs/ards/contract-binding.yaml:1-14` | Binding explicito. |
| ARDS-33 | SHOULD | partial | `specs/ards/contract-binding.yaml`, capabilities | Senales existen; drift requiere interpretacion. |
| ARDS-34 | MUST | compliant | `AGENTS.md:71`, specs/docs | Tool-agnostic declarado. |
| ARDS-35 | MUST | compliant | `docs/ai/policy.md`, `specs/integration/policies.yaml` | Adaptadores no son unica fuente. |
| ARDS-36 | SHOULD | partial | `package.json`, `.github/workflows/*.yml` | Automatizacion existe; check local falla. |
| ARDS-37 | MAY | not_applicable | No se requieren skills/subagentes locales | No penaliza. |
| ARDS-38 | MUST | partial | `TODO:` en indices y rutas docs absolutas | Referencias criticas ambiguas. |
| ARDS-39 | MUST | partial | `rg TODO` en specs/docs | TODOs visibles; algunos en campos normativos. |
| ARDS-40 | MUST | partial | Drift GitOps y validacion no completada | Afirmaciones no siempre coinciden con Evidence actual. |
| ARDS-41 | SHOULD | partial | `.github/workflows/ci-pipeline.yml` | Check parcial de contrato ARDS/SDD. |

### 6. Backlog de remediacion propuesto

1. `CR local del Service`: Reconciliar indices ARDS/SDD.
   - Alcance: `specs/states/00-index.yaml`, `specs/capabilities/outbound/00-index.yaml`.
   - Objetivo: quitar `TODO:` de rutas existentes y mover deuda a campos de blockers/open_questions.

2. `CR local del Service`: Reconciliar State y runtime docs.
   - Alcance: `specs/states/**`, `specs/infra/gitops/sst-app.yaml`, `docs/00-overview.md`, `docs/infra/README.md`.
   - Objetivo: una sola version vigente para Argo CD, Ingress, smoke y status de development.

3. `CR local del Service`: Estabilizar validacion local Windows.
   - Alcance: `package.json`, `AGENTS.md`, `specs/00-index.yaml`, docs de validacion.
   - Objetivo: documentar `npm.cmd run check` o wrapper portable y resolver fallo Kustomize `Access is denied`.

4. `INIT cross-repo`: Reconciliar orchestrator links.
   - Alcance: `specs/**/orchestrator_link`, `4uentes-orchestor/state/capability-links.yaml`.
   - Objetivo: reemplazar `state_id/request_id TODO` por IDs reales o registrar excepciones.

5. `CR local del Service`: Cerrar guardrails de secretos, GitOps credential, rollback y protected branches.
   - Alcance: `specs/infra/environments/development.yaml`, `docs/infra/README.md`, `docs/runbooks/README.md`, security specs.
   - Objetivo: criterios de promocion y recuperacion verificables.

6. `CR local del Service`: Completar runbooks bloqueantes.
   - Alcance: `docs/runbooks/README.md` y runbooks especificos.
   - Objetivo: bootstrap kind, secretos, smoke development, migraciones, node-auth in-cluster y Gateway API.

7. `CR del Control Plane`: Registrar Evidence de validacion por commit.
   - Alcance: artefactos de auditoria/control plane, no necesariamente repo service.
   - Objetivo: que el Control Plane pueda detectar drift sin conversaciones.

### 7. Evidencia positiva

- `AGENTS.md` define proposito, limites, estructura, comandos, reglas de agente y checklist de cierre.
- `specs/00-index.yaml` es un indice rico con repo, profile, docs, policies, runtime refs, solution repos y validacion.
- `package.json` contiene una ruta agregada `check` y comandos no mutantes declarados.
- `k8s-manifests/base/kustomization.yml` y `k8s-manifests/overlays/development/kustomization.yml` modelan estado Kubernetes real, con imagenes GHCR versionadas por short SHA.
- `argocd/argocd-app.yml` declara sync automatizado con prune/selfHeal hacia `k8s-manifests/overlays/development`.
- `.github/workflows/ci-pipeline.yml` incluye guardrails contra workflows XML, `kubectl apply` directo, `argocd app sync` y patrones de secretos.
- `specs/ards/contract-binding.yaml` declara binding con Core y Orchestrator.
- `specs/integration/policies.yaml` adopta policies heredadas y mantiene provider-agnostic.
- Busqueda de secretos no encontro valores reales; los hits son ejemplos `REPLACE_*`, textos de prohibicion o CRD schema fields.

### 8. Preguntas abiertas

- ¿Debe el estado vigente de Argo CD al 2026-06-28 considerarse `Synced/Progressing` o ya fue recuperado a `Synced/Healthy` fuera del repo?
- ¿Cual es el `state_id` canonico en `4uentes-orchestor` para `CR-SST-0020` y para `platform-sst-extension-public-api-origin`?
- ¿El fallo `kubectl kustomize ... Access is denied` es propio de esta sesion/sandbox o reproduce en una terminal humana Windows normal?

### Handoff para adopcion por humano + agente IA constructor

1. Objetivo de adopcion: llevar `sst-4uentes-infra` a `baseline_conformant_with_observations` y perfil observado `standard`, preservando el alcance infra/GitOps y sin cambiar runtime de aplicaciones.

2. Brecha resumida: la base ARDS/SDD existe y es util, pero hay drift entre indices, State, docs y runtime; validacion local no completa; y handoff cross-repo con Orchestrator queda incompleto.

3. Secuencia recomendada:
   - CR local: reconciliar indices y eliminar `TODO:` de rutas reales.
   - CR local: reconciliar State/docs/runtime observations.
   - CR local: estabilizar `npm run check`/`npm.cmd run check` y documentar limitaciones Windows.
   - INIT cross-repo: asignar/reconciliar IDs de Orchestrator.
   - CR local: cerrar guardrails de secretos, rollback, protected branches y credencial GitOps.
   - CR local: completar runbooks bloqueantes y Evidence de smoke.

4. Unidad de cambio sugerida por paso: usar CR locales para cambios confinados a este repo; usar INIT cross-repo cuando requiera `4uentes-orchestor` o `4uentes-core`.

5. Alcance por paso:
   - Indices: `specs/states/00-index.yaml`, `specs/capabilities/outbound/00-index.yaml`.
   - State/docs: `specs/states/**`, `specs/infra/gitops/sst-app.yaml`, `docs/00-overview.md`, `docs/infra/README.md`.
   - Validacion: `package.json`, `AGENTS.md`, `specs/00-index.yaml`, `docs/runbooks/README.md`.
   - Orchestrator: campos `orchestrator_link` existentes y mapa central en repo control plane.
   - Guardrails: `specs/infra/environments/development.yaml`, `specs/infra/security/**`, `docs/infra/README.md`.
   - Runbooks: `docs/runbooks/**`.

6. Criterios de aceptacion:
   - Todos los indices resuelven sin prefijo `TODO:` para archivos existentes.
   - No hay contradiccion vigente entre State index, state file y docs overview para Argo CD/smoke/development.
   - Una variante documentada de check corre hasta exito o registra limitacion reproducible no atribuible al repo.
   - `orchestrator_link` tiene IDs reales o excepcion explicitada con Evidence.
   - Secretos, rollback, protected branches y credenciales GitOps tienen decision o blocker gobernado.
   - Runbooks criticos tienen pasos y Evidence esperada sin exponer secretos.

7. Evidence requerida:
   - Output completo de `npm.cmd run check` o equivalente portable.
   - Render Kustomize y dry-run client para bootstrap nginx y overlay development.
   - Diff de State/docs antes/despues.
   - Referencia a CR/INIT en Orchestrator.
   - Evidencia de CI por commit o artefacto local con commit/fecha/comando/resultado.
   - Evidencia negativa de secretos: busqueda de patrones y revision de ejemplos.

8. Policies y guardrails aplicables:
   - No instalar dependencias ni levantar containers sin aprobacion explicita.
   - No aplicar manifests ni modificar infraestructura real desde adopcion documental.
   - No introducir secretos, tokens ni credenciales.
   - No cambiar logica runtime de `sst-fend`, `sst-bend`, `node-auth` ni `sst-extension`.
   - Cualquier exposicion publica, smoke con credenciales reales o modificacion de cluster requiere aprobacion humana.

9. Riesgos y no-objetivos:
   - No usar la adopcion ARDS para ocultar drift runtime.
   - No resolver fallos con cambios de infraestructura real sin CR separado.
   - No convertir docs narrativos en segunda fuente de verdad.
   - No reemplazar secretos manuales por valores versionados.
   - No promover staging/production en este ciclo.

10. Primer siguiente paso recomendado: `CR local del Service` para reconciliar indices ARDS/SDD, porque desbloquea descubribilidad y reduce ambiguedad para los siguientes agentes sin tocar runtime.

```yaml
adoption_handoff:
  readiness: ready
  recommended_first_unit:
    type: CR
    id_suggestion: "CR-INFRA-ARDS-INDEX-RECONCILE"
    title: "Reconciliar indices ARDS/SDD de State y Capabilities"
    reason: "Es el cambio de menor riesgo que corrige descubribilidad y evita que agentes interpreten rutas reales como placeholders."
  ordered_units:
    - order: 1
      type: CR
      scope: "specs/states/00-index.yaml y specs/capabilities/outbound/00-index.yaml"
      acceptance_criteria:
        - "Las rutas a specs existentes no tienen prefijo TODO."
        - "La deuda pendiente queda en blockers u open_questions."
        - "rg 'spec: \"TODO:' specs/states specs/capabilities no devuelve rutas existentes."
      required_evidence:
        - "Diff de indices."
        - "Listado rg de rutas TODO remanentes justificado."
      human_approval: not_required
    - order: 2
      type: CR
      scope: "specs/states/**, specs/infra/gitops/sst-app.yaml, docs/00-overview.md, docs/infra/README.md"
      acceptance_criteria:
        - "Estado vigente de Argo CD y smoke queda consistente en indice, state y docs."
        - "Cada blocker tiene fecha, alcance y Evidence o condicion de cierre."
      required_evidence:
        - "Tabla de estados reconciliados."
        - "Referencias a evidencia runtime existente o not_verifiable."
      human_approval: conditional
    - order: 3
      type: CR
      scope: "package.json, AGENTS.md, specs/00-index.yaml y docs de validacion"
      acceptance_criteria:
        - "La ruta Windows documentada evita el bloqueo npm.ps1 o lo explica."
        - "kubectl kustomize y dry-run quedan verificados o clasificados como limitacion de entorno."
      required_evidence:
        - "Output de npm.cmd run check o equivalente."
        - "Version de kubectl/kustomize."
      human_approval: not_required
    - order: 4
      type: INIT
      scope: "orchestrator_link en specs locales y 4uentes-orchestor/state/capability-links.yaml"
      acceptance_criteria:
        - "CR-SST-0020 y capabilities relacionadas tienen state_id/request_id reconciliados."
        - "El Control Plane puede seguir la capability sin interpretar conversaciones."
      required_evidence:
        - "Referencia a INIT/CR del Orchestrator."
        - "Mapa capability-state actualizado o excepcion documentada."
      human_approval: required
    - order: 5
      type: CR
      scope: "specs/infra/environments/development.yaml, specs/infra/security/**, docs/infra/README.md, docs/runbooks/**"
      acceptance_criteria:
        - "Rollback, protected branches, credencial GitOps y secretos tienen decision o blocker gobernado."
        - "Runbooks criticos de bootstrap, secretos y smoke tienen pasos reproducibles."
      required_evidence:
        - "Docs actualizados."
        - "Checklist de no-secretos."
      human_approval: conditional
  blockers:
    - "Git metadata no verificable en esta auditoria por dubious ownership."
    - "Validacion Kustomize falla en este entorno por Access is denied."
    - "IDs de Orchestrator no asignados para algunos handoffs."
  non_goals:
    - "No aplicar manifests al cluster."
    - "No levantar Docker, kind, Argo CD ni ngrok."
    - "No modificar runtime de aplicaciones consumidoras."
    - "No commitear secretos ni credenciales."
```