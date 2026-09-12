# Autorización del lote de bindings Jira para onboarding SST

Fecha local: 2026-09-12.

## Autoridad y alcance

El usuario autorizó expresamente «autorizo lote jira» y confirmó su posterior
publicación en ARDS/SDD. El control-plane continúa siendo la fuente de verdad y
Jira es únicamente el espejo operativo.

Después de fusionar y releer canónicamente este ledger comienza una ventana
máxima de 30 minutos. El lote permite exactamente cuatro escrituras de
creación, sin comentarios, transiciones ni ediciones posteriores:

| Orden | CR | Summary exacto | Parent | Epic | Estado esperado |
| --- | --- | --- | --- | --- | --- |
| 1 | `CR-SST-0238` | `[SST][INIT-SST-0009][CR-SST-0238] Reconcile SST authenticated entry and React compatibility` | `SST-102` | `SST-101` | `Tareas por hacer` |
| 2 | `CR-SST-0241` | `[SST][INIT-SST-0009][CR-SST-0241] Align SST local Compose with the raw-v2 development release` | `SST-102` | `SST-101` | `Tareas por hacer` |
| 3 | `CR-SST-0244` | `[SST][INIT-SST-0011][CR-SST-0244] Implement the onboarding hub and resumable Home invitation` | `SST-128` | `SST-127` | `Tareas por hacer` |
| 4 | `CR-SST-0245` | `[SST][INIT-SST-0011][CR-SST-0245] Validate integrated onboarding and rollout readiness` | `SST-128` | `SST-127` | `Tareas por hacer` |

Todos los issues deben crearse como `Subtask`. Antes de la primera escritura se
repetirá la búsqueda JQL individual de los cuatro IDs y se exigirán cero
coincidencias. También se releerán los parents, las Epics y el metadata del tipo
`Subtask`. Después de cada creación se realizará un readback de key, summary,
descripción, tipo, parent, estado y resolución.

## Descripciones exactas

### CR-SST-0238

```text
ARDS/SDD source of truth: CR-SST-0238 (planned). Jira is an operational mirror.

Objective: Reconcile the SST entry journey from public Landing through authentication to the authorized default module, and remove the reproducible fetchPriority, findDOMNode/StrictMode and React Router future warnings through supported owner contracts.

Owner: sst-fend.
Initiative: INIT-SST-0009.
Coordinator: CR-SST-0222 / SST-102.
Execution is not authorized by this issue creation.
```

### CR-SST-0241

```text
ARDS/SDD source of truth: CR-SST-0241 (planned). Jira is an operational mirror.

Objective: Align local Compose build and runtime with explicit raw-v2 development defaults and reproducible readiness evidence while preserving the secure Dockerfile fallback outside an explicit release profile.

Owner: sst-fend.
Initiative: INIT-SST-0009.
Coordinator: CR-SST-0222 / SST-102.
Execution is not authorized by this issue creation.
```

### CR-SST-0244

```text
ARDS/SDD source of truth: CR-SST-0244 (planned). Jira is an operational mirror.

Objective: Implement a protected onboarding hub and resumable Home invitation that consume durable Bend state through the published Auth relay without activating runtime or treating route visits as completion.

Owner: sst-fend.
Initiative: INIT-SST-0011.
Coordinator: CR-SST-0240 / SST-128.
Execution is not authorized by this issue creation.
```

### CR-SST-0245

```text
ARDS/SDD source of truth: CR-SST-0245 (planned). Jira is an operational mirror.

Objective: Validate integrated onboarding across published owner revisions and raw-v2 Compose parity using synthetic evidence, without authorizing deployment, cohort rollout or real-data mutation.

Owner: 4uentes-orchestor.
Initiative: INIT-SST-0011.
Coordinator: CR-SST-0240 / SST-128.
Execution is not authorized by this issue creation.
```

## Stop conditions

Cualquier duplicado, drift de proyecto, tipo, parent, Epic o estado, fallo de
credenciales, respuesta incierta o readback incompleto consume el lote y
bloquea las escrituras restantes. El resultado se publicará y releerá en
ARDS/SDD antes de iniciar `CR-SST-0238`.

No se autorizan cambios en repos hijos, Infra, runtime, migraciones, flags,
datos reales, QA integrada ni otros issues Jira.
