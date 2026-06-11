# Jira MCP OAuth Session Playbook

## Proposito

Este playbook define como iniciar, reutilizar, diagnosticar y recuperar sesiones
OAuth para scripts Jira/MCP del control-plane.

El objetivo es separar escenarios operativos. Cada `CR-SST` es una ejecucion,
pero no todas las ejecuciones tienen el mismo riesgo ni el mismo tipo de
autenticacion.

Este playbook aplica solo al control-plane `4uentes-orchestor`. No se propaga
a repos funcionales hijos.

## Clasificacion Operativa

Antes de ejecutar scripts MCP, clasificar la ejecucion:

- `local-dry-run`: no usa red, OAuth ni Jira.
- `mcp-read-only`: usa OAuth y herramientas Jira/Atlassian de lectura.
- `mcp-approved-write`: usa OAuth y herramientas Jira de escritura con
  aprobacion humana explicita.
- `oauth-init`: ejecucion cuyo objetivo principal es iniciar o reparar la
  sesion OAuth.
- `oauth-recovery`: diagnostico de una sesion bloqueada, expirada, con puerto
  ocupado o con re-registro fallido.

Para ARDS/SDD, cualquier ejecucion que toque OAuth, permisos Jira o escritura
externa debe tratarse como `complex-high-risk-task`, salvo que sea un dry-run
local puro.

## Reglas De Seguridad

- No registrar tokens, cookies, authorization codes, client secrets ni headers
  de autorizacion.
- No persistir JWT ni credenciales en evidencia.
- No usar `--approved` si no existe aprobacion humana explicita para esa
  escritura.
- No detener procesos locales solo por estar en `node`; primero identificar
  puerto, ruta HTTP y riesgo.
- No cambiar puertos OAuth como workaround automatico si eso fuerza
  re-registracion del cliente MCP.
- No mezclar evidencia de dry-run, read-only y write en el mismo resultado sin
  declarar el modo.

## Endpoint Operativo Observado

La policy viva de este patron es:

```text
docs/requests/jira-mcp-endpoint-connection-policy.md
```

La configuracion documental historica uso:

```powershell
https://mcp.atlassian.com/v1/mcp/authv2
```

En `CR-SST-0057` y `CR-SST-0058`, ese endpoint fallo durante OAuth dynamic
client registration con HTML `404` antes de exponer tools. El endpoint operativo
observado para sesiones ya autenticadas y tools Jira fue:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
```

Usar este override para ejecuciones read-only o write-gated mientras `authv2`
continue fallando en `registerClient`. Remover la variable despues de la
ejecucion si la terminal se reutiliza:

```powershell
Remove-Item Env:\JIRA_MCP_ARGS
```

## Inventario De Scripts

### Local Sin OAuth

Estos comandos no deberian abrir navegador ni requerir sesion Atlassian:

```powershell
npm.cmd run jira:mcp:dry-run -- --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
npm.cmd run jira:mcp:policy-check -- --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
npm.cmd run jira:mcp:status-proposals -- --request-id <CR-SST> --input-dir evidence/requests/<source-CR-SST> --output-dir evidence/requests/<CR-SST>
npm.cmd run jira:mcp:sync-health -- --request-id <CR-SST> --input-dir evidence/requests/<source-CR-SST> --output-dir evidence/requests/<CR-SST>
npm.cmd run jira:mcp:backlog-review -- --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
npm.cmd run jira:mcp:backlog-dry-run -- --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
npm.cmd run jira:mcp:doctor -- --request-id <CR-SST> --output-dir evidence/requests/<CR-SST> --mode read-only
```

### MCP Read-Only Con OAuth

Estos comandos pueden iniciar OAuth y abrir navegador:

```powershell
npm.cmd run jira:mcp:verify -- --connect --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
npm.cmd run jira:mcp:metadata -- --connect --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
npm.cmd run jira:mcp:duplicates -- --connect --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
npm.cmd run jira:mcp:reconcile -- --connect --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
npm.cmd run jira:mcp:status-observe -- --connect --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
npm.cmd run jira:mcp:backlog-observe -- --connect --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
npm.cmd run jira:mcp:sync-machine -- --connect --request-id <CR-SST> --output-dir evidence/requests/<CR-SST> --mode read-only
```

Si el endpoint default falla por `authv2`/`registerClient`/`404`, repetir con
el override operativo:

```powershell
$env:JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'
npm.cmd run jira:mcp:verify -- --connect --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
Remove-Item Env:\JIRA_MCP_ARGS
```

### MCP Write Con Aprobacion

Estos comandos escriben en Jira o pueden actualizar estado local despues de una
escritura exitosa. Requieren `--connect --approved` y una decision aprobada en
el request.

```powershell
npm.cmd run jira:mcp:create -- --connect --approved --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
npm.cmd run jira:mcp:update-existing -- --connect --approved --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
npm.cmd run jira:mcp:backlog-create -- --connect --approved --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
node scripts\jira-mcp\transition-sst-8-close.js --connect --approved --request-id CR-SST-0058 --output-dir evidence\requests\CR-SST-0058
```

## Escenario A: Preflight Local

Usar cuando se quiere validar configuracion, payloads o politica sin depender
de Atlassian.

1. Crear o seleccionar el `CR-SST`.
2. Ejecutar comandos locales sin `--connect`.
3. Guardar evidencia en `evidence/requests/<CR-SST>/`.
4. Ejecutar `npm.cmd run check`.

Resultado esperado:

- sin navegador;
- sin OAuth;
- sin escritura Jira;
- evidencia reproducible.

## Escenario B: OAuth Init Read-Only

Usar cuando una sesion MCP no existe o puede estar expirada.

1. Ejecutar primero:

```powershell
npm.cmd run jira:mcp:verify -- --connect --request-id <CR-SST> --output-dir evidence/requests/<CR-SST>
```

2. Si el navegador se abre, completar autorizacion con el usuario Jira
   autorizado.
3. Volver a correr el mismo comando.
4. Confirmar que la evidencia declara herramientas descubiertas o proyecto
   visible.

No continuar a comandos `--approved` hasta que un read-only pase.

## Escenario C: Sesion Ya Autenticada

Usar cuando `verify --connect` pasa y el operador solo necesita continuar un
flujo.

Orden recomendado:

1. `verify --connect`
2. comando read-only especifico (`metadata`, `duplicates`, `reconcile`,
   `status-observe` o `backlog-observe`)
3. dry-run o proposal local
4. aprobacion humana
5. comando write con `--approved`, solo si aplica
6. read-only post-write para reconciliar

## Escenario D: Puerto OAuth Ocupado

Sintomas conocidos:

- `MCP process exited with code 1`
- `EADDRINUSE`
- `address already in use 127.0.0.1:<port>`
- el puerto responde en `/oauth/callback` con `Error: No authorization code received`

Diagnostico seguro en Windows:

```powershell
netstat -ano | findstr :39570
curl.exe -s -i http://127.0.0.1:39570/oauth/callback
Get-Process -Id <PID> | Select-Object Id,ProcessName,Path
```

Decision:

- Si el proceso no puede identificarse con confianza, no detenerlo desde el
  agente.
- Registrar evidencia del bloqueo.
- Pedir aprobacion explicita para detener solo ese PID, indicando el riesgo.
- Si el operador libera el proceso manualmente, repetir `verify --connect`.

No usar un puerto alternativo automaticamente. En `mcp-remote`, el puerto
posicional alternativo puede forzar re-registracion OAuth y fallar antes de
listar herramientas.

## Escenario E: OAuth Re-Registration O 404

Sintomas conocidos:

- Atlassian devuelve HTML `404`.
- El proceso falla durante `registerClient`.
- El comando nunca llega a `tools/list`.

Accion:

1. No ejecutar comandos write.
2. Registrar stderr sanitizado en evidencia.
3. Probar el override operativo a `https://mcp.atlassian.com/v1/mcp`.
4. Ejecutar `verify --connect` como iniciador unico.
5. Si el override operativo pasa, continuar el flujo con ese override y
   registrar la decision.
6. Si persiste, escalar a operador/admin Atlassian para reautorizar el cliente
   MCP o limpiar la sesion externa.

## Escenario F: Write Gate

Antes de cualquier escritura Jira:

1. El request debe estar planificado o contener decision aprobada.
2. Debe existir evidencia read-only reciente o una razon documentada para no
   tenerla.
3. El comando debe incluir `--connect --approved`.
4. La salida debe escribir evidencia local sanitizada.
5. Despues de escribir, ejecutar una lectura de reconciliacion.

Si cualquiera de estos puntos falla, detener la escritura y registrar el gap.

## Escenario G: Agente No Puede Autenticar Sesion

Cuando la sesion requiere interaccion de navegador, el operador humano es el
iniciador de OAuth. El agente puede:

- ejecutar preflight y dry-run;
- abrir o intentar el comando read-only si fue aprobado;
- detectar bloqueos de puerto o re-registro;
- redactar evidencia;
- proponer el siguiente comando.

El agente no debe:

- inventar credenciales;
- persistir tokens;
- confirmar autorizacion OAuth que no observo;
- cerrar procesos ambiguos sin aprobacion explicita.

## Evidencia Minima

Cada ejecucion MCP debe registrar:

- `request_id`;
- modo: `local-dry-run`, `mcp-read-only`, `mcp-approved-write`,
  `oauth-init` u `oauth-recovery`;
- comando ejecutado, sin secretos;
- resultado;
- escritura externa: `si` o `no`;
- rutas de evidencia;
- bloqueos y decision tomada.

## Referencias

- `docs/requests/jira-mcp-ticketing-playbook.md`
- `docs/requests/jira-mcp-access-sync-health-contract.md`
- `docs/requests/jira-backlog-sync-state-machine.md`
- `docs/requests/jira-backlog-registry-policy.md`
- `evidence/requests/CR-SST-0058/jira-mcp-oauth-port-blocker.md`
