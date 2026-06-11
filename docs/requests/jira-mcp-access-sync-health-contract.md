# Contrato De Acceso MCP Jira Y Salud De Sincronizacion

## Proposito

Este contrato define como el control-plane usa MCP para observar Jira y como
evalua si los tickets `SST-*` estan sincronizados con los procesos `CR-SST-*`
y los `feature_state` locales.

CR-SST-0043 no autoriza escrituras externas. Define la frontera para decidir
cuando MCP es suficiente, cuando se requiere writer/gateway y cuando solo se
debe generar evidencia local.

## Regla Base

```text
MCP observa y reconcilia.
El control-plane propone y decide.
El writer/gateway sincroniza Jira con aprobacion.
```

Jira sigue siendo espejo operativo. El control-plane sigue siendo la fuente
canonica para ARDS/SDD, `state/features/*.current.yaml`, requests CR-SST y
evidencia.

La sincronizacion Jira/Confluence no se propaga a repos hijos. Solo
`4uentes-orchestor` ejecuta MCP Jira/Confluence y conserva evidencia de esa
sincronizacion.

## Endpoint MCP Permitido

La policy viva de endpoints es:

```text
docs/requests/jira-mcp-endpoint-connection-policy.md
```

El endpoint operativo observado para scripts del control-plane es:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
```

El endpoint `authv2` queda tratado como superficie historica/de autenticacion
o diagnostico, no como endpoint operativo recomendado cuando falla en
`registerClient`. El endpoint `sse` heredado no debe incorporarse como
configuracion nueva.

## Niveles De Acceso

### Nivel 1 - MCP Read/Search

Permitido para diagnostico y evidencia:

- confirmar proyecto `SST`;
- confirmar board `SST-Team`;
- leer metadata de Jira;
- buscar issues por JQL;
- leer issues `SST-*`;
- observar status, assignee, labels, description y updated;
- detectar duplicados;
- reconciliar Jira contra `state/features`.

Este nivel puede usar `--connect`, pero solo produce evidencia local no
secreta.

### Nivel 2 - Propuestas Locales

No requiere conexion MCP directa si ya existe evidencia de observacion.

Permitido:

- leer `jira-status-observation-results.json`;
- leer `state/features/*.current.yaml`;
- generar `jira-status-transition-proposals.*`;
- generar futuros reportes `sync-health.*`.

Prohibido:

- escribir Jira;
- mutar `feature_state`;
- mover requests CR-SST.

### Nivel 3 - Escritura Aprobada

Reservado para writer/gateway o comando explicitamente aprobado.

Acciones posibles, siempre gated:

- crear issues;
- actualizar descripcion;
- actualizar labels/campos;
- agregar comentarios;
- transicionar status Jira.

Requiere:

- request `planned`;
- evidencia read-only previa;
- policy check PASS;
- propuesta sin bloqueos;
- aprobacion humana explicita;
- permisos MCP o REST API adecuados;
- evidencia no secreta post-write.

## Superficie De APIs Y Herramientas

| Necesidad | Via preferida | Mutacion |
|---|---|---|
| Verificar proyecto `SST` | MCP read o Jira REST project | no |
| Verificar board `SST-Team` | MCP read/search o Jira Agile board API | no |
| Buscar tickets por `state_id` | MCP search o JQL REST search | no |
| Leer issue `SST-*` | MCP read o Jira REST issue | no |
| Leer changelog | Jira REST changelog | no |
| Leer transiciones disponibles | Jira REST transitions | no |
| Crear issue | writer/gateway por MCP write o REST | si |
| Actualizar issue | writer/gateway por MCP write o REST | si |
| Comentar issue | writer/gateway por MCP write o REST | si |
| Transicionar issue | writer/gateway por MCP write o REST | si |
| Guardar metadata estructurada | issue properties REST | si |
| Recibir eventos inmediatos | webhooks REST | no para recibir, si para registrar webhook |

## Permisos Y Controles

El acceso MCP debe tratarse como acceso de usuario o actor autorizado:

- OAuth 2.1 es el camino principal.
- API token puede aplicar si la organizacion lo permite.
- Las acciones respetan permisos del usuario/actor.
- Los administradores pueden permitir o bloquear permisos de lectura,
  busqueda y escritura por app.
- Si la organizacion usa IP allowlisting, las solicitudes MCP deben cumplir esa
  politica.
- Las acciones clave quedan disponibles para auditoria organizacional.

No se permite persistir en Git:

- tokens;
- cookies;
- cloudId;
- URLs privadas de sitio Jira;
- material OAuth;
- headers de autorizacion.

## Modelo De Sync Health

El futuro comando `jira:mcp:sync-health` debe producir un estado por
`feature_state` no `done` y por issue Jira observado.

Estados permitidos:

| Estado | Significado |
|---|---|
| `IN_SYNC` | Jira y control-plane coinciden para el contrato minimo. |
| `MISSING_JIRA` | Existe feature local sin ticket Jira reconciliado. |
| `ORPHAN_JIRA` | Existe ticket Jira control-plane sin `state_id` local. |
| `DUPLICATE_JIRA` | Hay mas de un issue para el mismo `state_id`. |
| `DESCRIPTION_DRIFT` | La descripcion no contiene el template vigente. |
| `LABEL_DRIFT` | Labels Jira no reflejan estado o politica local. |
| `STATUS_SIGNAL_PENDING` | Jira cambio y existe propuesta pendiente. |
| `CLOSURE_CONFLICT` | Jira esta cerrado pero feature local no esta `done`. |
| `LOCAL_DONE_PENDING_JIRA` | Feature local esta `done` y Jira no refleja cierre. |
| `STALE_OBSERVATION` | La evidencia Jira observada es vieja. |
| `WRITE_APPROVAL_REQUIRED` | La correccion requiere escritura externa aprobada. |

## Criterio Minimo De `IN_SYNC`

Un item esta `IN_SYNC` si:

- el `state_id` local existe;
- hay un unico issue Jira reconciliado;
- el summary esperado coincide;
- el ticket contiene `Proceso de sincronizacion`;
- el ticket contiene `Procesos origen`;
- labels base existen;
- el status Jira observado no contradice el estado local;
- no hay propuesta pendiente bloqueante;
- la evidencia de observacion no esta vencida.

## Drift Cuando Jira Se Mueve

Cuando una persona mueve Jira:

```text
Jira cambia
  -> status-observe por MCP
  -> status-proposals local
  -> sync-health local
  -> decision/aprobacion
  -> writer/gateway o evento local futuro
```

No se permite:

```text
Jira Done -> feature_state done automatico
```

Jira `Done` debe generar `CLOSURE_CONFLICT` o
`require-local-done-evidence-review` si falta evidencia local.

## Metadata Estructurada Recomendada

Para evolucionar sin parsear descripcion, el writer/gateway deberia poder
escribir issue properties con una clave estable, por ejemplo:

```text
com.4uentes.control-plane.sync
```

Payload no secreto recomendado:

```json
{
  "stateId": "document-agent",
  "lastSyncRequestId": "CR-SST-0043",
  "featureStatus": "implemented-local",
  "lastObservedJiraStatus": "Tareas por hacer",
  "lastProposalKind": "jira_status_transition_proposal"
}
```

La escritura de issue properties es externa y requiere Nivel 3.

## Comandos Actuales

Read/search MCP:

```powershell
npm.cmd run jira:mcp:verify -- --connect --request-id <CR-SST-****> --output-dir evidence/requests/<CR-SST-****>
npm.cmd run jira:mcp:metadata -- --connect --request-id <CR-SST-****> --output-dir evidence/requests/<CR-SST-****>
npm.cmd run jira:mcp:duplicates -- --connect --request-id <CR-SST-****> --output-dir evidence/requests/<CR-SST-****>
npm.cmd run jira:mcp:reconcile -- --connect --request-id <CR-SST-****> --output-dir evidence/requests/<CR-SST-****>
npm.cmd run jira:mcp:status-observe -- --connect --request-id <CR-SST-****> --output-dir evidence/requests/<CR-SST-****>
```

Local proposal:

```powershell
npm.cmd run jira:mcp:status-proposals -- --request-id <CR-SST-****> --input-dir evidence/requests/<source-CR-SST-****> --output-dir evidence/requests/<CR-SST-****>
```

Write-gated:

```powershell
npm.cmd run jira:mcp:create -- --connect --approved --request-id <CR-SST-****> --output-dir evidence/requests/<CR-SST-****>
npm.cmd run jira:mcp:update-existing -- --connect --approved --request-id <CR-SST-****> --output-dir evidence/requests/<CR-SST-****>
npm.cmd run jira:writer:apply -- --request-id <CR-SST-****> --output-dir evidence/requests/<CR-SST-****> --actions update,create --approved
```

## Siguiente Implementacion Recomendada

CR-SST-0044 deberia implementar:

```powershell
npm.cmd run jira:mcp:sync-health -- --request-id CR-SST-0044 --input-dir evidence/requests/CR-SST-0042 --output-dir evidence/requests/CR-SST-0044
```

Ese comando debe leer:

- feature states locales;
- reconciliacion Jira si existe;
- observaciones Jira;
- propuestas de status;
- requests CR-SST relevantes.

Y producir:

- `jira-sync-health-summary.md`;
- `jira-sync-health-results.json`;
- cero escrituras Jira;
- cero transiciones locales.

## Referencias Oficiales

- Atlassian Rovo MCP Server getting started:
  `https://support.atlassian.com/atlassian-rovo-mcp-server/docs/getting-started-with-the-atlassian-remote-mcp-server/`
- Atlassian Rovo MCP Server supported tools:
  `https://support.atlassian.com/atlassian-rovo-mcp-server/docs/supported-tools/`
- Atlassian Rovo MCP Server permissions:
  `https://support.atlassian.com/security-and-access-policies/docs/Configure-Atlassian-Rovo-MCP-server-permission/`
- Jira issue properties REST API:
  `https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-properties/`
- Jira webhooks REST API:
  `https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-webhooks/`
