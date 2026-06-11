# Status Sync Policy Analysis

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0040
- Escritura Jira ejecutada: no
- Feature states modificados: no

## Problema

Despues de CR-SST-0039, Jira refleja los 9 feature states abiertos del
control-plane. Falta definir como se mantiene la sincronizacion cuando:

- una persona toma un issue Jira y lo mueve a `En curso`;
- el control-plane abre o continua un CR-SST relacionado;
- Jira marca un issue como cerrado;
- el control-plane marca un feature como `done`.

## Regla De Autoridad

La regla base debe ser:

```text
Jira puede iniciar senales.
Control-plane decide transiciones.
Writer sincroniza Jira.
```

Jira no debe modificar directamente `state/features/*.current.yaml` ni mover
requests CR-SST entre lifecycle folders.

## Estados Separados

Se deben tratar como dimensiones separadas:

```text
feature_state.status  -> estado ARDS/SDD canonico
jira_issue.status     -> estado operativo del tablero
request.status        -> lifecycle del CR-SST
```

Ejemplo:

```yaml
feature_state.status: "implemented-local"
jira_issue.status: "En curso"
```

Esto significa que el trabajo fue tomado operativamente, pero el estado real de
la funcionalidad no cambio todavia.

## Flujo Jira A Control-Plane

Cuando Jira cambia:

1. El control-plane ejecuta una reconciliacion read-only.
2. Se registra evidencia `jira_status_observed`.
3. Se propone un evento local, por ejemplo `JIRA_WORK_STARTED`.
4. El control-plane decide si abre, continua o ignora un CR-SST.
5. Solo con evidencia local se actualiza `feature_state.status`.

No debe existir una transicion automatica Jira `Done` -> feature `done` sin
evidencia local.

## Flujo Control-Plane A Jira

Cuando el control-plane cambia:

1. Existe request CR-SST planned o done con evidencia.
2. El doctor detecta el cambio local.
3. El writer/gateway propone actualizacion Jira.
4. Con aprobacion, Jira recibe comentario, descripcion, label o transition.
5. La escritura queda registrada en evidencia.

## Mapeo Inicial Recomendado

| Jira status | Evento control-plane propuesto | Transicion local automatica |
|---|---|---|
| Por hacer | `JIRA_WORK_PENDING` | no |
| En curso | `JIRA_WORK_STARTED` | no |
| Bloqueado | `JIRA_WORK_BLOCKED` | no |
| Done/Cerrado | `JIRA_WORK_CLOSED_OBSERVED` | no |

La automatizacion inicial debe limitarse a evidencia y propuestas, no a cambios
directos de `feature_state.status`.

## Observacion Read-Only Implementada

La primera pieza tecnica es una observacion read-only de status Jira. Debe leer:

- issue key;
- summary;
- `State id`;
- Jira status;
- assignee si existe;
- updated timestamp si esta disponible.

Y escriba evidencia local como:

- `jira-status-observation-summary.md`
- `jira-status-observation-results.json`

Comando definido:

```powershell
npm.cmd run jira:mcp:status-observe -- --connect --request-id CR-SST-0040 --output-dir evidence/requests/CR-SST-0040
```

El comando no escribe en Jira ni modifica `feature_state`.

## Decision

CR-SST-0040 debe cerrar con una politica auditable antes de implementar
transiciones automaticas o status writer.
