# Contrato De Eventos De Status Jira Y Propuestas De Transicion

## Proposito

Este contrato define como el control-plane debe interpretar cambios observados
en Jira sin ceder autoridad ARDS/SDD ni ejecutar transiciones automaticas.

Aplica a issues Jira generados o mantenidos por el flujo de tickets de
`feature_state` del proyecto `SST`.

## Regla De Autoridad

```text
Jira puede iniciar senales.
Control-plane decide transiciones.
Writer sincroniza Jira.
```

Jira no modifica directamente:

- `state/features/*.current.yaml`;
- `requests/inbox`;
- `requests/planned`;
- `requests/done`;
- repos funcionales.

## Entrada Permitida

La entrada inicial permitida es evidencia read-only generada por:

```powershell
npm.cmd run jira:mcp:status-observe -- --connect --request-id <CR-SST-****> --output-dir evidence/requests/<CR-SST-****>
```

Archivo esperado:

- `jira-status-observation-results.json`

Cada observacion debe incluir:

- `stateId`;
- `issueKey`;
- `jiraStatus`;
- `statusCategory`;
- `assignee`;
- `updated`;
- `proposedEvent`;
- `localTransitionAutomatic: false`.

## Eventos Locales Permitidos

Los eventos derivados de Jira son senales operativas:

| Evento | Significado | Transicion automatica |
|---|---|---|
| `JIRA_WORK_PENDING` | Jira indica trabajo pendiente | no |
| `JIRA_WORK_STARTED` | Jira indica trabajo tomado o en curso | no |
| `JIRA_WORK_BLOCKED` | Jira indica bloqueo operativo | no |
| `JIRA_WORK_CLOSED_OBSERVED` | Jira indica cierre operativo | no |

Estos eventos pueden generar propuestas, pero no actualizan estado por si solos.

## Propuesta De Transicion

Una propuesta local debe ser un artefacto de evidencia, no una mutacion.

Estructura minima:

```yaml
schema_version: "1.0"
kind: "jira_status_transition_proposal"
request_id: "CR-SST-****"
state_id: "<feature_state.id>"
jira_issue_key: "SST-000"
observed_event: "JIRA_WORK_STARTED"
current_feature_status: "<status local>"
proposed_control_plane_action: "continue-request"
automatic_local_transition: false
guards:
  control_plane_authoritative: true
  local_evidence_required: true
  duplicate_signal_checked: true
decision:
  status: "pending"
  approver: "TODO"
```

## Acciones Propuestas

El primer mapeo permitido es:

| Evento observado | Accion propuesta |
|---|---|
| `JIRA_WORK_PENDING` | `no-op` o `record-signal` |
| `JIRA_WORK_STARTED` | `continue-request` o `open-request-candidate` |
| `JIRA_WORK_BLOCKED` | `record-blocker-candidate` |
| `JIRA_WORK_CLOSED_OBSERVED` | `require-local-done-evidence-review` |

Ninguna accion cambia `feature_state.status` sin evidencia local y aprobacion.

## Guards

Todo runner futuro debe evaluar:

- `control_plane_authoritative`: Jira no reemplaza el estado local.
- `known_state_id`: el `stateId` existe en `state/features`.
- `known_issue_key`: el issue Jira esta reconciliado con el `stateId`.
- `duplicate_signal_checked`: la senal no fue procesada ya para el mismo
  `issueKey`, `event` y `updated`.
- `local_evidence_required`: cualquier avance de estado requiere evidencia
  local.
- `human_approval_required`: cualquier mutacion local o escritura externa
  requiere aprobacion explicita.
- `no_secret_material`: la evidencia no contiene secretos.

## Salida Permitida

CR-SST-0041 permite definir documentacion y evidencia.

Un runner futuro podra escribir:

- `jira-status-transition-proposals.json`;
- `jira-status-transition-proposals.md`;
- `validation-results.md`.

No podra escribir:

- Jira;
- `state/features/*.current.yaml`;
- lifecycle folders de requests;
- repos funcionales.

## Evolucion Recomendada

El siguiente CR-SST deberia implementar un generador dry-run de propuestas que
lea `jira-status-observation-results.json` y produzca propuestas auditables sin
mutaciones.

