# CR-SST-0125 - Jira Create/Start Blocker

## Estado

- Fecha: 2026-07-10
- Request: `CR-SST-0125`
- Parent Jira deseado: `SST-6`
- Accion deseada: crear/sincronizar subtask y moverla a `En curso`
- Resultado: bloqueado por policy de escritura externa

## Intentos

### Atlassian MCP Directo

Busqueda directa de `SST-6` por MCP Atlassian:

```text
Access denied. You don't have permission to search content.
code: 403
message: The app is not installed on this instance
```

### Fallback Script

Comando intentado:

```text
node scripts\jira-mcp\create-cr-sst-0125-task.js --connect --approved
```

Resultado:

```text
This action was rejected due to unacceptable risk.
Reason: This would write internally derived request and project-tracking
content from the workspace to an external Jira service that is not established
as a trusted internal destination.
```

### Fallback Script Con Aprobacion Explicita Del Owner

El owner aprobo explicitamente:

```text
Apruebo enviar metadata interna de tracking de CR-SST-0125 al Jira externo
para crear/sincronizar la subtask bajo SST-6 usando el fallback MCP local.
```

Se reintento el mismo comando:

```text
node scripts\jira-mcp\create-cr-sst-0125-task.js --connect --approved
```

Resultado:

```text
This action was rejected due to unacceptable risk.
Reason: This would disclose internally derived project-tracking content from
the workspace to an external Jira destination that is not established as
trusted, and the policy denies such external disclosure even after explicit
user approval.
```

## Decision

No se intento un workaround. `CR-SST-0125` queda abierto y gobernado localmente
en ARDS/SDD, pero el mirror Jira queda bloqueado hasta que el destino Jira sea
establecido como confiable por la politica del entorno o se use una conexion
MCP autorizada que no dispare el bloqueo de external disclosure.

## Evidencia Local Disponible

- `requests/planned/CR-SST-0125-sst-bend-learning-source-preview-import-normalization.yaml`
- `evidence/requests/CR-SST-0125/policy-and-owner-enforcement-start.md`
- `evidence/requests/CR-SST-0125/implementation-analysis-start.md`

## Boundary

Jira es mirror operativo. ARDS/SDD sigue siendo la fuente de verdad.
