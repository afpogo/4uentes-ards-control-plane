# Autorización correctiva de bindings Jira

Fecha local de aprobación: `2026-09-12T02:42:51.4939519-03:00`.

La persona usuaria autorizó con el texto `autorizo` un lote correctivo máximo de
tres escrituras Jira. La ventana será de 30 minutos y comenzará únicamente tras
fusionar y releer este ledger desde la rama canónica. Jira es un espejo
operativo; ARDS/SDD conserva la autoridad.

## Operaciones exactas

| Orden | Request | Resumen exacto | Parent | Epic | Tipo | Estado esperado |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `CR-SST-0241` | `[SST][INIT-SST-0009][CR-SST-0241] Align SST local Compose with the raw-v2 development release` | `SST-102` | `SST-101` | `Subtask` | `Tareas por hacer` |
| 2 | `CR-SST-0244` | `[SST][INIT-SST-0011][CR-SST-0244] Implement the onboarding hub and resumable Home invitation` | `SST-128` | `SST-127` | `Subtask` | `Tareas por hacer` |
| 3 | `CR-SST-0245` | `[SST][INIT-SST-0011][CR-SST-0245] Validate integrated onboarding and rollout readiness` | `SST-128` | `SST-127` | `Subtask` | `Tareas por hacer` |

No se autorizan comentarios, transiciones, modificaciones de issues existentes
ni otras escrituras Jira. Tampoco se autoriza mutación de repositorios owner,
runtime, infraestructura o datos.

## Descripciones canónicas

Cada descripción se enviará como ADF `doc` versión `1`, con exactamente seis
nodos `paragraph`; cada párrafo tendrá exactamente un nodo `text`, sin marcas,
`hardBreak` ni nodos adicionales. El readback se comparará por tipos de nodo y
texto de cada párrafo para evitar el falso positivo de serialización Markdown
que consumió el lote anterior.

### CR-SST-0241

1. `ARDS/SDD source of truth: CR-SST-0241 (planned). Jira is an operational mirror.`
2. `Objective: Align local Compose build and runtime with explicit raw-v2 development defaults and reproducible readiness evidence while preserving the secure Dockerfile fallback outside an explicit release profile.`
3. `Owner: sst-fend.`
4. `Initiative: INIT-SST-0009.`
5. `Coordinator: CR-SST-0222 / SST-102.`
6. `Execution is not authorized by this issue creation.`

### CR-SST-0244

1. `ARDS/SDD source of truth: CR-SST-0244 (planned). Jira is an operational mirror.`
2. `Objective: Implement a protected onboarding hub and resumable Home invitation that consume durable Bend state through the published Auth relay without activating runtime or treating route visits as completion.`
3. `Owner: sst-fend.`
4. `Initiative: INIT-SST-0011.`
5. `Coordinator: CR-SST-0240 / SST-128.`
6. `Execution is not authorized by this issue creation.`

### CR-SST-0245

1. `ARDS/SDD source of truth: CR-SST-0245 (planned). Jira is an operational mirror.`
2. `Objective: Validate integrated onboarding across published owner revisions and raw-v2 Compose parity using synthetic evidence, without authorizing deployment, cohort rollout or real-data mutation.`
3. `Owner: 4uentes-orchestor.`
4. `Initiative: INIT-SST-0011.`
5. `Coordinator: CR-SST-0240 / SST-128.`
6. `Execution is not authorized by this issue creation.`

## Controles y fail-stop

Antes de escribir se repetirán JQL de unicidad, jerarquía y metadata del tipo.
Después de cada creación se hará readback directo y JQL exacto. Cualquier
duplicado, drift de parent/tipo/estado/resumen, estructura ADF no equivalente,
incertidumbre o expiración consume la autorización y detiene las escrituras
restantes. El resultado se publicará posteriormente en ARDS/SDD, tanto si el
lote completa como si aplica fail-stop.
