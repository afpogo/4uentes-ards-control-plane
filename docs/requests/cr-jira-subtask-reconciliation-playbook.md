# CR Jira Subtask Reconciliation Playbook

## Proposito

Este playbook documenta como reconciliar un nuevo `CR-(PROYECTO)-xxxx` contra
Jira cuando el trabajo real vive en un request del control-plane y Jira funciona
como superficie operativa de visibilidad.

Aplica al patron que ya usamos en `SST-4` con subtareas como `SST-20`,
`SST-21`, `SST-22`, `SST-23` y `SST-24`.

## Boundary

- Repo responsable: `4uentes-orchestor`.
- Jira no reemplaza el lifecycle local de `requests/*.yaml`.
- La conciliacion no autoriza por si sola una escritura Jira.
- Repos funcionales hijos no ejecutan este flujo.

## Inputs Minimos

- request `planned`: `requests/planned/CR-(PROYECTO)-xxxx-*.yaml`
- `feature_state` relacionado
- contrato o spec de la funcionalidad, si existe
- parent Jira conocido, por ejemplo `SST-4`

## Outputs Esperados

- evidencia read-only en `evidence/requests/<CR>/`
- request `planned` con `jira_issue_key` y estado observado
- vista de CR activos actualizada si cambia la atribucion Jira
- playbook o nota de decision si hubo excepcion

## Cortes Recomendados

### Merge 1: Preflight Local

Objetivo: confirmar que el request local es la fuente canonica del slice.

Checklist:

- el `CR` existe en `requests/planned/`
- el scope y los servicios afectados ya estan definidos
- el `feature_state` padre esta identificado
- el parent Jira esperado esta claro

No hacer en este corte:

- no escribir Jira
- no mover el request a `done`

### Merge 2: Bootstrap MCP

Objetivo: verificar que la sesion MCP puede leer Jira.

Comandos:

```powershell
npm.cmd run mcp:auth:list
npm.cmd run mcp:auth:connect
```

Si Atlassian requiere el endpoint operativo observado:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
```

Refs:

- `docs/requests/mcp-auth-bootstrap-playbook.md`
- `docs/requests/jira-mcp-endpoint-connection-policy.md`

### Merge 3: Observar El Parent Jira

Objetivo: leer el issue padre y sus subtareas reales antes de tocar el request.

Comando recomendado:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
node scripts\jira-mcp\observe-parent-subtasks.js --connect --request-id <CR> --output-dir evidence\requests\<CR> --issue-key <PARENT>
Remove-Item Env:\JIRA_MCP_ARGS
```

Validar:

- el parent correcto existe
- la lista de subtareas coincide con la secuencia del feature
- el `CR` actual ya existe como subtarea o todavia no fue creado

### Merge 4: Observar O Crear La Subtarea Del CR

Si la subtarea ya existe, observarla:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
node scripts\jira-mcp\observe-issue.js --connect --request-id <CR> --output-dir evidence\requests\<CR> --issue-key <CHILD>
Remove-Item Env:\JIRA_MCP_ARGS
```

Si no existe:

1. generar dry-run o payload local;
2. pedir aprobacion humana;
3. crear la subtarea via flujo write-gated;
4. volver a correr la observacion read-only.

### Merge 5: Reconciliar El Request Local

Objetivo: reflejar Jira en el control-plane sin invertir la autoridad.

Actualizar en `requests/planned/<CR>.yaml`:

- `jira_issue_key`
- `current_jira_status_observed`
- `jira_observation_ref`
- refs de dependencia si ayudan a leer el slice

Actualizar tambien:

- `docs/requests/jira-cr-activos-y-atribucion.md`
- evidencia del `CR`
- `feature_state` si la nueva evidencia agrega trazabilidad relevante

Regla:

- Jira refleja el estado operativo; el request local sigue siendo canonico.

### Merge 6: Arranque Operativo

Objetivo: solo despues de la reconciliacion, decidir si la subtarea debe pasar
de `Por hacer` a `En curso`.

Prerequisitos:

- read-only reciente
- aprobacion humana si hay write
- decision registrada en el request

Resultado esperado:

- comentario de arranque o transicion Jira
- evidencia sanitizada
- request local actualizado con el nuevo estado observado

### Merge 7: Cierre

Objetivo: cerrar la subtarea Jira y el `CR` local cuando la evidencia tecnica
lo soporte.

Checklist:

- checks locales en PASS o con bloqueos explicitados
- smoke o QA acordes al slice
- comentario final Jira generado
- transicion terminal ejecutada
- `requests/planned/` reconciliado
- `requests/done/` creado
- docs y `feature_state` alineados

## Decision Table

| Caso | Accion |
|---|---|
| parent existe y subtarea existe | observar, reconciliar local y seguir |
| parent existe y subtarea no existe | preparar create write-gated |
| parent no existe | detener y reconciliar feature ticket primero |
| Jira search global falla pero read-only directo funciona | seguir con `observe-parent-subtasks.js` y `observe-issue.js` |
| Jira y request local se contradicen | registrar evidencia, no asumir que Jira manda |

## Comandos Minimos Reproducibles

Bootstrap:

```powershell
npm.cmd run mcp:auth:list
npm.cmd run mcp:auth:connect
```

Parent:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
node scripts\jira-mcp\observe-parent-subtasks.js --connect --request-id <CR> --output-dir evidence\requests\<CR> --issue-key <PARENT>
Remove-Item Env:\JIRA_MCP_ARGS
```

Child:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
node scripts\jira-mcp\observe-issue.js --connect --request-id <CR> --output-dir evidence\requests\<CR> --issue-key <CHILD>
Remove-Item Env:\JIRA_MCP_ARGS
```

Validacion local:

```powershell
npm.cmd run check
```

## Referencias

- `docs/requests/jira-mcp-ticketing-playbook.md`
- `docs/requests/jira-mcp-oauth-session-playbook.md`
- `docs/requests/jira-mcp-endpoint-connection-policy.md`
- `docs/requests/jira-cr-activos-y-atribucion.md`
