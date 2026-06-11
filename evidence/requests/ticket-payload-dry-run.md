# Dry Run De Payloads Jira

## Alcance

- Fecha: 2026-06-05
- Request: CR-SST-0036
- Fuente: `state/features/*.current.yaml`
- Jira board: `SST-Team`
- Jira project key: `SST`
- Issue type asumido: `Tarea`
- Feature states totales: 14
- Feature states en `done`: 5
- Feature states no `done`: 9
- Escritura Jira: no ejecutada

## Defaults

- Jira board: SST-Team
- Project key: SST
- Issue type: Tarea
- Labels base:
  - `ards-sdd`
  - `control-plane`
  - `feature-state`
  - `not-done`

## Orden

El orden se basa en prioridad operativa:

1. `runtime-partial`
2. `implemented-local`
3. `ards-documented`
4. `validated-local`
5. `validated-live`

Dentro de cada estado, se priorizan items con mas gaps abiertos y mayor alcance de servicios.

## Ticket 1

Summary:

```text
[SST][feature-state] Cerrar gaps runtime-partial de SST Tags Governance
```

Fields:

- `project_key`: `SST`
- `board_name`: `SST-Team`
- `issue_type`: `Tarea`
- `state_id`: `sst-tags-governance`
- `status`: `runtime-partial`
- `priority`: `High`
- `labels`: `ards-sdd`, `control-plane`, `feature-state`, `not-done`, `runtime-partial`
- `affected_services`: `sst-bend`, `4uentes-auth`, `sst-fend`, `sst-extension`
- `request_ids`: `CR-SST-0010`, `CR-SST-0014`, `CR-SST-0015`, `CR-SST-0016`

Description:

```text
Proceso de sincronizacion:
- CR-SST-0036

Procesos origen:
- CR-SST-0010
- CR-SST-0014
- CR-SST-0015
- CR-SST-0016

Estado actual: runtime-partial.

Objetivo:
Avanzar esta funcionalidad desde el read-model del control-plane y cerrar los gaps abiertos mediante el lifecycle aprobado.

Gaps abiertos:
- Promote article-tags from draft to an active governed SST capability.
- Adopt structured article tags in BFF and frontend create/update flows.
- Promote sst-tag-prefix-engine from backend POC to runtime preview/import endpoint.
- Keep real-time transcription as a separate future intake request.

State id:
- sst-tags-governance

Servicios afectados:
- sst-bend
- 4uentes-auth
- sst-fend
- sst-extension

Request ids relacionados:
- CR-SST-0010
- CR-SST-0014
- CR-SST-0015
- CR-SST-0016

Fuente control-plane:
- state/features/sst-tags-governance.current.yaml

Evidence refs:
- evidence/requests/CR-SST-0002/implementation-state-report.md
- evidence/requests/CR-SST-0002/findings.yaml
- evidence/requests/CR-SST-0002/runtime-readiness-summary.md
- evidence/requests/CR-SST-0014/implementation-state-analysis.md
- evidence/requests/CR-SST-0014/course-tags-analysis.md
- evidence/requests/CR-SST-0014/next-request-boundary.md
- evidence/requests/CR-SST-0015/java-spring-course-structure-analysis.md
- evidence/requests/CR-SST-0016/backend-poc-summary.md

Validation refs:
- ninguno

Criterio de cierre esperado:
- La decision o implementacion pendiente queda registrada en evidencia.
- Los cambios en repos funcionales, si hacen falta, entran por request aprobado.
- El feature_state se actualiza solo cuando la evidencia soporte una transicion de estado.
```

## Ticket 2

Summary:

```text
[SST][feature-state] Formalizar ownership runtime-partial de SST Robots
```

Fields:

- `project_key`: `SST`
- `board_name`: `SST-Team`
- `issue_type`: `Tarea`
- `state_id`: `robots`
- `status`: `runtime-partial`
- `priority`: `High`
- `labels`: `ards-sdd`, `control-plane`, `feature-state`, `not-done`, `runtime-partial`
- `affected_services`: `sst-fend`, `sst-bend`, `4uentes-auth`, `sst-extension`, `sst-4uentes-infra`
- `request_ids`: `CR-SST-0006`

Description:

```text
Proceso de sincronizacion:
- CR-SST-0036

Procesos origen:
- CR-SST-0006

Estado actual: runtime-partial.

Objetivo:
Avanzar esta funcionalidad desde el read-model del control-plane y cerrar los gaps abiertos mediante el lifecycle aprobado.

Gaps abiertos:
- Future work needs a request boundary before functional repository changes.
- Capability ownership is not yet formalized.

State id:
- robots

Servicios afectados:
- sst-fend
- sst-bend
- 4uentes-auth
- sst-extension
- sst-4uentes-infra

Request ids relacionados:
- CR-SST-0006

Fuente control-plane:
- state/features/robots.current.yaml

Evidence refs:
- evidence/requests/CR-SST-0006/implementation-state-report.md
- evidence/requests/CR-SST-0006/cross-repo-summary.md
- evidence/requests/CR-SST-0006/validation-results.md

Validation refs:
- ninguno

Criterio de cierre esperado:
- La decision o implementacion pendiente queda registrada en evidencia.
- Los cambios en repos funcionales, si hacen falta, entran por request aprobado.
- El feature_state se actualiza solo cuando la evidencia soporte una transicion de estado.
```

## Ticket 3

Summary:

```text
[SST][feature-state] Completar ruta runtime de SST Learning Content Tags
```

Fields:

- `project_key`: `SST`
- `board_name`: `SST-Team`
- `issue_type`: `Tarea`
- `state_id`: `learning-content-tags`
- `status`: `implemented-local`
- `priority`: `Medium`
- `labels`: `ards-sdd`, `control-plane`, `feature-state`, `not-done`, `implemented-local`
- `affected_services`: `sst-bend`, `sst-fend`
- `request_ids`: `CR-SST-0015`, `CR-SST-0016`

Description:

```text
Proceso de sincronizacion:
- CR-SST-0036

Procesos origen:
- CR-SST-0015
- CR-SST-0016

Estado actual: implemented-local.

Objetivo:
Avanzar esta funcionalidad desde el read-model del control-plane y cerrar los gaps abiertos mediante el lifecycle aprobado.

Gaps abiertos:
- Promote learning-content parser from POC module to runtime import/preview endpoint.
- Define frontend rendering for clase, nota, recordar, ejemplo, image, docs, and code blocks.
- Keep generated lab artifacts excluded from ingestion by default.

State id:
- learning-content-tags

Servicios afectados:
- sst-bend
- sst-fend

Request ids relacionados:
- CR-SST-0015
- CR-SST-0016

Fuente control-plane:
- state/features/learning-content-tags.current.yaml

Evidence refs:
- evidence/requests/CR-SST-0015/java-spring-course-structure-analysis.md
- evidence/requests/CR-SST-0015/parser-boundary-recommendation.md
- evidence/requests/CR-SST-0016/backend-poc-summary.md

Validation refs:
- ninguno

Criterio de cierre esperado:
- La decision o implementacion pendiente queda registrada en evidencia.
- Los cambios en repos funcionales, si hacen falta, entran por request aprobado.
- El feature_state se actualiza solo cuando la evidencia soporte una transicion de estado.
```

## Ticket 4

Summary:

```text
[SST][feature-state] Promover SST Tag Prefix Engine de POC a boundary runtime
```

Fields:

- `project_key`: `SST`
- `board_name`: `SST-Team`
- `issue_type`: `Tarea`
- `state_id`: `sst-tag-prefix-engine`
- `status`: `implemented-local`
- `priority`: `Medium`
- `labels`: `ards-sdd`, `control-plane`, `feature-state`, `not-done`, `implemented-local`
- `affected_services`: `sst-bend`
- `request_ids`: `CR-SST-0016`

Description:

```text
Proceso de sincronizacion:
- CR-SST-0036

Procesos origen:
- CR-SST-0016

Estado actual: implemented-local.

Objetivo:
Avanzar esta funcionalidad desde el read-model del control-plane y cerrar los gaps abiertos mediante el lifecycle aprobado.

Gaps abiertos:
- Expose parser preview or import runtime endpoint in a later request.
- Decide when TagDefinition moves from code registry to persisted DB governance.
- Adopt reference-chip rendering in BFF/frontend after runtime API is published.

State id:
- sst-tag-prefix-engine

Servicios afectados:
- sst-bend

Request ids relacionados:
- CR-SST-0016

Fuente control-plane:
- state/features/sst-tag-prefix-engine.current.yaml

Evidence refs:
- evidence/requests/CR-SST-0016/backend-poc-summary.md

Validation refs:
- ninguno

Criterio de cierre esperado:
- La decision o implementacion pendiente queda registrada en evidencia.
- Los cambios en repos funcionales, si hacen falta, entran por request aprobado.
- El feature_state se actualiza solo cuando la evidencia soporte una transicion de estado.
```

## Ticket 5

Summary:

```text
[SST][feature-state] Seleccionar transporte runtime para handoff SST Chatbot
```

Fields:

- `project_key`: `SST`
- `board_name`: `SST-Team`
- `issue_type`: `Tarea`
- `state_id`: `sst-chatbot`
- `status`: `implemented-local`
- `priority`: `Medium`
- `labels`: `ards-sdd`, `control-plane`, `feature-state`, `not-done`, `implemented-local`
- `affected_services`: `sst-chatbot`, `sst-fend`, `sst-bend`, `4uentes-auth`, `sst-extension`, `sst-4uentes-infra`
- `request_ids`: `CR-SST-0007`, `CR-SST-0016`, `CR-SST-0021`, `CR-SST-0022`

Description:

```text
Proceso de sincronizacion:
- CR-SST-0036

Procesos origen:
- CR-SST-0007
- CR-SST-0016
- CR-SST-0021
- CR-SST-0022

Estado actual: implemented-local.

Objetivo:
Avanzar esta funcionalidad desde el read-model del control-plane y cerrar los gaps abiertos mediante el lifecycle aprobado.

Gaps abiertos:
- Transport for runtime orchestrator handoff is not selected; CR-SST-0022 implements a local/fake adapter only.

State id:
- sst-chatbot

Servicios afectados:
- sst-chatbot
- sst-fend
- sst-bend
- 4uentes-auth
- sst-extension
- sst-4uentes-infra

Request ids relacionados:
- CR-SST-0007
- CR-SST-0016
- CR-SST-0021
- CR-SST-0022

Fuente control-plane:
- state/features/sst-chatbot.current.yaml

Evidence refs:
- inventory/evidence/git/sst-chatbot.md
- evidence/requests/CR-SST-0007/capabilities-trace.md
- evidence/requests/CR-SST-0007/orchestrator-boundary-summary.md
- evidence/requests/CR-SST-0007/adoption-gaps.md
- evidence/requests/CR-SST-0016/onboarding-summary.md
- evidence/requests/CR-SST-0021/baseline.md
- evidence/requests/CR-SST-0021/implementation-summary.md
- evidence/requests/CR-SST-0021/changed-files-summary.md
- evidence/requests/CR-SST-0022/baseline.md
- evidence/requests/CR-SST-0022/implementation-summary.md
- evidence/requests/CR-SST-0022/changed-files-summary.md

Validation refs:
- evidence/requests/CR-SST-0016/validation-results.md
- evidence/requests/CR-SST-0021/validation-results.md
- evidence/requests/CR-SST-0022/validation-results.md

Criterio de cierre esperado:
- La decision o implementacion pendiente queda registrada en evidencia.
- Los cambios en repos funcionales, si hacen falta, entran por request aprobado.
- El feature_state se actualiza solo cuando la evidencia soporte una transicion de estado.
```

## Ticket 6

Summary:

```text
[SST][feature-state] Formalizar evidencia de SST Document Agent Workflows
```

Fields:

- `project_key`: `SST`
- `board_name`: `SST-Team`
- `issue_type`: `Tarea`
- `state_id`: `document-agent`
- `status`: `implemented-local`
- `priority`: `Medium`
- `labels`: `ards-sdd`, `control-plane`, `feature-state`, `not-done`, `implemented-local`
- `affected_services`: `sst-fend`, `4uentes-auth`, `sst-bend`
- `request_ids`: `CR-SST-0008`

Description:

```text
Proceso de sincronizacion:
- CR-SST-0036

Procesos origen:
- CR-SST-0008

Estado actual: implemented-local.

Objetivo:
Avanzar esta funcionalidad desde el read-model del control-plane y cerrar los gaps abiertos mediante el lifecycle aprobado.

Gaps abiertos:
- CR-SST-0008 needs planned request and formal evidence.

State id:
- document-agent

Servicios afectados:
- sst-fend
- 4uentes-auth
- sst-bend

Request ids relacionados:
- CR-SST-0008

Fuente control-plane:
- state/features/document-agent.current.yaml

Evidence refs:
- ninguno

Validation refs:
- ninguno

Criterio de cierre esperado:
- La decision o implementacion pendiente queda registrada en evidencia.
- Los cambios en repos funcionales, si hacen falta, entran por request aprobado.
- El feature_state se actualiza solo cuando la evidencia soporte una transicion de estado.
```

## Ticket 7

Summary:

```text
[SST][feature-state] Completar handoff y adopcion de ARDS/SDD Policy Unification
```

Fields:

- `project_key`: `SST`
- `board_name`: `SST-Team`
- `issue_type`: `Tarea`
- `state_id`: `ards-sdd-policy-unification`
- `status`: `ards-documented`
- `priority`: `Medium`
- `labels`: `ards-sdd`, `control-plane`, `feature-state`, `not-done`, `ards-documented`
- `affected_services`: `4uentes-auth`, `sst-fend`, `sst-bend`, `sst-extension`, `sst-chatbot`, `sst-4uentes-infra`
- `request_ids`: `CR-SST-0024`, `CR-SST-0025`

Description:

```text
Proceso de sincronizacion:
- CR-SST-0036

Procesos origen:
- CR-SST-0024
- CR-SST-0025

Estado actual: ards-documented.

Objetivo:
Avanzar esta funcionalidad desde el read-model del control-plane y cerrar los gaps abiertos mediante el lifecycle aprobado.

Gaps abiertos:
- Move universal policy canon into 4uentes-core with source validation.
- Have 4uentes-core adopt policies as first-class ARDS/SDD components.
- Handoff human-doc-language from docs/idioma-markdown.md to 4uentes-core as a reusable policy while preserving its orchestrator origin.
- Resolve canonical identity for 4uentes-core versus 4uentes-ards-core.
- Define and adopt a child-repo policy_adoption manifest through future approved requests.
- Close observed gaps for sst-chatbot docs_ai_policy and orchestrator_link adoption.
- Close observed validation.check_command TODO for sst-4uentes-infra.

State id:
- ards-sdd-policy-unification

Servicios afectados:
- 4uentes-auth
- sst-fend
- sst-bend
- sst-extension
- sst-chatbot
- sst-4uentes-infra

Request ids relacionados:
- CR-SST-0024
- CR-SST-0025

Fuente control-plane:
- state/features/ards-sdd-policy-unification.current.yaml

Evidence refs:
- evidence/requests/CR-SST-0024/policy-model.md
- evidence/requests/CR-SST-0024/subagent-deployment-evidence.md
- evidence/requests/CR-SST-0024/implementation-summary.md
- evidence/requests/CR-SST-0024/changed-files-summary.md
- evidence/requests/CR-SST-0024/validation-results.md
- evidence/requests/CR-SST-0025/policy-component-model.md
- evidence/requests/CR-SST-0025/subagent-deployment-evidence.md
- evidence/requests/CR-SST-0025/changed-files-summary.md
- evidence/requests/CR-SST-0025/validation-results.md

Validation refs:
- ninguno

Criterio de cierre esperado:
- La decision o implementacion pendiente queda registrada en evidencia.
- Los cambios en repos funcionales, si hacen falta, entran por request aprobado.
- El feature_state se actualiza solo cuando la evidencia soporte una transicion de estado.
```

## Ticket 8

Summary:

```text
[SST][feature-state] Completar validacion live y cierre de gobernanza de SST Dictionary Tags
```

Fields:

- `project_key`: `SST`
- `board_name`: `SST-Team`
- `issue_type`: `Tarea`
- `state_id`: `dictionary-tags`
- `status`: `validated-local`
- `priority`: `Low-Medium`
- `labels`: `ards-sdd`, `control-plane`, `feature-state`, `not-done`, `validated-local`
- `affected_services`: `sst-bend`, `4uentes-auth`, `sst-fend`, `sst-extension`, `sst-4uentes-infra`
- `request_ids`: `CR-SST-0002`, `CR-SST-0014`

Description:

```text
Proceso de sincronizacion:
- CR-SST-0036

Procesos origen:
- CR-SST-0002
- CR-SST-0014

Estado actual: validated-local.

Objetivo:
Avanzar esta funcionalidad desde el read-model del control-plane y cerrar los gaps abiertos mediante el lifecycle aprobado.

Gaps abiertos:
- Live runtime endpoint validation was not executed.
- TagDefinition governance is not closed as a public managed surface.
- Dictionary close criteria must explicitly exclude or accept broader SST-level article/course/bitacora tag expansion.

State id:
- dictionary-tags

Servicios afectados:
- sst-bend
- 4uentes-auth
- sst-fend
- sst-extension
- sst-4uentes-infra

Request ids relacionados:
- CR-SST-0002
- CR-SST-0014

Fuente control-plane:
- state/features/dictionary-tags.current.yaml

Evidence refs:
- evidence/requests/CR-SST-0002/implementation-state-report.md
- evidence/requests/CR-SST-0002/findings.yaml
- evidence/requests/CR-SST-0002/validation-results.md
- evidence/requests/CR-SST-0014/implementation-state-analysis.md

Validation refs:
- ninguno

Criterio de cierre esperado:
- La decision o implementacion pendiente queda registrada en evidencia.
- Los cambios en repos funcionales, si hacen falta, entran por request aprobado.
- El feature_state se actualiza solo cuando la evidencia soporte una transicion de estado.
```

## Ticket 9

Summary:

```text
[SST][feature-state] Cerrar gaps release-readiness de Cluster publication
```

Fields:

- `project_key`: `SST`
- `board_name`: `SST-Team`
- `issue_type`: `Tarea`
- `state_id`: `cluster-publication-ngrok-domain`
- `status`: `validated-live`
- `priority`: `Low-Medium`
- `labels`: `ards-sdd`, `control-plane`, `feature-state`, `not-done`, `validated-live`
- `affected_services`: `sst-fend`, `sst-bend`, `4uentes-auth`, `sst-4uentes-infra`
- `request_ids`: `CR-SST-0020`

Description:

```text
Proceso de sincronizacion:
- CR-SST-0036

Procesos origen:
- CR-SST-0020

Estado actual: validated-live.

Objetivo:
Avanzar esta funcionalidad desde el read-model del control-plane y cerrar los gaps abiertos mediante el lifecycle aprobado.

Gaps abiertos:
- Install or reconcile ngrok as a Windows service if startup durability is required.
- Run app login, refresh/logout and protected-route smokes in a later approved phase with credentials outside Git.
- Run persistence create/read/delete smoke in a later approved phase.
- Promote app images by immutable release tag or digest before release readiness.
- Reconcile infra orchestrator_link.state_id with feature_state id cluster-publication-ngrok-domain.

State id:
- cluster-publication-ngrok-domain

Servicios afectados:
- sst-fend
- sst-bend
- 4uentes-auth
- sst-4uentes-infra

Request ids relacionados:
- CR-SST-0020

Fuente control-plane:
- state/features/cluster-publication-ngrok-domain.current.yaml

Evidence refs:
- evidence/requests/CR-SST-0020/intake-summary.md
- evidence/requests/CR-SST-0020/analysis-plan.md
- evidence/requests/CR-SST-0020/current-cluster-state.md
- evidence/requests/CR-SST-0020/ingress-ngrok-edge-analysis.md
- evidence/requests/CR-SST-0020/auth-public-exposure-analysis.md
- evidence/requests/CR-SST-0020/branch-image-policy-analysis.md
- evidence/requests/CR-SST-0020/validation-release-gates.md
- evidence/requests/CR-SST-0020/subagent-deployment-evidence.md
- evidence/requests/CR-SST-0020/infra-operational-edge-result.md
- evidence/requests/CR-SST-0020/stage-close-validation.md

Validation refs:
- ninguno

Criterio de cierre esperado:
- La decision o implementacion pendiente queda registrada en evidencia.
- Los cambios en repos funcionales, si hacen falta, entran por request aprobado.
- El feature_state se actualiza solo cuando la evidencia soporte una transicion de estado.
```

## Readiness Para Escritura Jira

Este dry-run esta listo para revision humana, pero no esta listo para escritura Jira hasta que:

- Jira MCP este configurado en el runtime;
- Jira board `SST-Team` este confirmado;
- Jira project key `SST` este verificado por MCP;
- issue type y campos obligatorios esten confirmados por MCP;
- duplicate search este ejecutado;
- el usuario apruebe explicitamente la creacion.
