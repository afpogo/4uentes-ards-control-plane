# Jira MCP Endpoint Connection Policy

## Proposito

Esta policy es el recurso vivo ARDS/SDD para conectar el control-plane con MCP
Jira/Confluence. Define como se declaran, divulgan y usan endpoints MCP en
scripts, evidencia y playbooks.

La regla principal es que la conexion operativa debe hacerse por patron, no por
endpoints ad hoc.

## Autoridad

Esta policy gobierna:

- scripts `scripts/jira-mcp/*`;
- playbooks Jira/MCP;
- contratos de acceso y escritura Jira;
- evidencia en `evidence/requests/<CR-SST>/`;
- ejecuciones read-only y write-gated contra Jira/Confluence MCP.

Jira y Confluence siguen siendo superficies externas. El control-plane conserva
la fuente canonica ARDS/SDD local.

## Boundary Con Repos Hijos

Esta policy no se propaga a repos funcionales hijos.

El unico repositorio que mantiene sincronizacion con Jira/Confluence es:

```text
4uentes-orchestor
```

Los repos hijos (`sst-fend`, `sst-bend`, `sst-extension`, `4uentes-auth`,
`sst-4uentes-infra`, `sst-chatbot`) no deben:

- configurar endpoints MCP Jira/Confluence;
- ejecutar scripts `jira:mcp:*`;
- guardar credenciales Jira/Confluence;
- sincronizar estados Jira por cuenta propia;
- asumir que Jira es fuente canonica de ARDS/SDD.

Si un ticket Jira dispara trabajo en un repo hijo, el control-plane debe crear
o avanzar el `CR-SST` correspondiente y entregar el trabajo por el lifecycle
normal. El repo hijo solo ejecuta su parte funcional bajo ese request.

## Patron Canonico

Para ejecuciones MCP operativas en este entorno, usar:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
npm.cmd run jira:mcp:<script> -- --connect --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
Remove-Item Env:\JIRA_MCP_ARGS
```

Para scripts directos:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
node scripts\jira-mcp\<script>.js --connect --request-id <CR-SST> --output-dir evidence\requests\<CR-SST>
Remove-Item Env:\JIRA_MCP_ARGS
```

Si el script escribe en Jira, agregar `--approved` solo cuando el request tenga
aprobacion humana explicita.

## Roles De Endpoint

| Endpoint | Rol | Uso permitido |
|---|---|---|
| `https://mcp.atlassian.com/v1/mcp` | MCP operativo | Conexion read-only y write-gated mediante `JIRA_MCP_ARGS`. |
| `https://mcp.atlassian.com/v1/mcp/authv2` | OAuth/DCR historico o documental | Solo diagnostico de autenticacion cuando aplique; no divulgarlo como endpoint operativo recomendado. |
| `https://mcp.atlassian.com/v1/sse` | Heredado | No incorporarlo como configuracion nueva. |

## Evidencia Observada

`CR-SST-0057` y `CR-SST-0058` observaron:

- `authv2` fallo durante OAuth dynamic client registration con HTML `404`
  antes de exponer tools.
- `/v1/mcp` conecto con `mcp-remote`, expuso tools Jira y permitio leer issues.
- `/v1/mcp` ejecuto una escritura aprobada para cerrar `SST-8`.

Por lo tanto, `/v1/mcp` es el endpoint operativo vigente para el control-plane
mientras la evidencia no indique lo contrario.

## Divulgacion Permitida

En documentos, requests y evidencia, divulgar endpoints MCP asi:

- nombrar `/v1/mcp` como endpoint operativo observado;
- nombrar `authv2` solo como endpoint de autenticacion/DCR historico o
  diagnostico;
- incluir siempre el patron `JIRA_MCP_ARGS` completo cuando se indique un
  comando operativo;
- aclarar si el comando es `read-only` o `write-gated`;
- registrar que la variable debe removerse al terminar la ejecucion.

No divulgar:

- URLs privadas del sitio Jira;
- cloudId;
- authorization codes;
- bearer tokens;
- cookies;
- headers de autorizacion;
- account ids, emails o avatares de usuarios.

## Reglas De Ejecucion

### Read-Only

Permitido con `--connect`:

- `jira:mcp:verify`;
- `jira:mcp:metadata`;
- `jira:mcp:duplicates`;
- `jira:mcp:reconcile`;
- `jira:mcp:status-observe`;
- `jira:mcp:backlog-observe`;
- `jira:mcp:sync-machine --mode read-only`.

Debe producir evidencia local no secreta.

### Write-Gated

Permitido solo con `--connect --approved` y request aprobado:

- crear issues;
- editar issues;
- comentar issues;
- transicionar issues.

Debe existir:

- request `planned` o `done` con decision aprobada;
- evidencia read-only previa o razon documentada para no tenerla;
- comando con `JIRA_MCP_ARGS` y `/v1/mcp`;
- evidencia post-write sanitizada;
- validacion local del control-plane.

## Manejo De OAuth

La sesion OAuth vive fuera del repo en la cache externa de `mcp-remote` o en el
runtime autorizado del operador. El control-plane:

- no lee tokens;
- no persiste tokens;
- no imprime tokens;
- no asume que puede autenticar interactivamente por si solo.

Si el navegador se abre, el operador humano aprueba OAuth. Si ya hay sesion
valida, `/v1/mcp` puede reutilizarla.

## Fallos Conocidos

### `authv2` 404 En `registerClient`

Accion:

1. No ejecutar write.
2. Registrar stderr sanitizado.
3. Repetir con el patron canonico `/v1/mcp`.
4. Si `/v1/mcp` conecta, continuar con ese endpoint y registrar evidencia.
5. Si `/v1/mcp` no conecta, escalar a operador/admin Atlassian.

### Puerto OAuth Ocupado

Accion:

1. Identificar puerto y PID con `netstat`.
2. Probar `/oauth/callback` solo para confirmar callback local, sin secretos.
3. No detener procesos ambiguos sin aprobacion explicita.
4. Registrar el bloqueo.

## Policy Check

Los checks locales deben distinguir:

- endpoint de autenticacion configurado;
- endpoint operativo usado por `JIRA_MCP_ARGS`;
- escritura externa ejecutada o no;
- evidencia sanitizada.

Un policy-check no debe fallar solo porque la configuracion historica conserve
`authv2`, siempre que la ejecucion operativa documentada use el patron
`JIRA_MCP_ARGS` con `/v1/mcp` cuando corresponda.

## Referencias

- `docs/requests/jira-mcp-oauth-session-playbook.md`
- `docs/requests/jira-mcp-access-sync-health-contract.md`
- `docs/requests/jira-write-connection-contract.md`
- `requests/done/CR-SST-0057-sst-4-work-start-transition.yaml`
- `requests/done/CR-SST-0058-sst-8-jira-close-transition-execution.yaml`
- `requests/done/CR-SST-0059-operational-mcp-oauth-session-playbook.yaml`
