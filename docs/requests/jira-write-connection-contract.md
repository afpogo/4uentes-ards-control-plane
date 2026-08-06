# Contrato De Conexion Jira Writer

## Proposito

Este documento define el camino permitido para que el control-plane escriba en
Jira sin depender de una accion directa del agente sobre un destino externo no
verificado.

La lectura por MCP ya esta validada. La escritura requiere una conexion
autorizada, con actor, origen, permisos y evidencia controlados.

## Decision

La conexion de escritura recomendada es:

```text
control-plane
  -> correction-plan-preview.json
  -> writer/gateway autorizado
  -> Jira REST API o Jira MCP write tools
  -> evidencia local no secreta
```

El agente no debe escribir directamente en Jira si el runtime bloquea el
destino. El writer/gateway debe ser el componente autorizado para publicar los
payloads aprobados.

## Orden De Conexion Operativa

Para cualquier lectura o escritura Jira desde el control-plane, el orden
operativo es:

1. MCP Jira como primera intencion, usando las tools Atlassian disponibles en el
   runtime del agente cuando el recurso cloud esta resuelto y la accion queda
   acotada.
2. Scripts `scripts/jira-mcp/*` como fallback preferente. Estos scripts siguen
   usando MCP, resuelven `cloudId` dinamicamente, aplican sanitizacion, y escriben
   evidencia local no secreta.
3. Jira REST API o writer externo solo como ultimo fallback, cuando MCP no este
   disponible o no pueda ejecutar la accion requerida. Este camino requiere
   credenciales externas, aprobacion explicita y evidencia de bloqueo MCP.

No se debe saltar directamente a Jira REST API si MCP o los scripts MCP estan
operativos.

## Roles

### Control-Plane

Responsable de:

- leer `state/features/*.current.yaml`;
- generar `correction-plan-preview.json`;
- ejecutar `policy-check`;
- validar que `blocked=0`;
- registrar evidencia;
- conservar la fuente de verdad local.

### Writer/Gateway

Responsable de:

- validar el request id;
- validar el correction plan;
- validar la policy;
- validar aprobacion humana;
- aplicar escrituras permitidas en Jira;
- registrar resultado no secreto.

### Jira

Jira es espejo operativo. No decide el estado final del control-plane.

Los repos funcionales hijos no ejecutan esta conexion ni sincronizan Jira por
cuenta propia. Cualquier trabajo funcional derivado de Jira debe entrar por un
`CR-SST` gobernado desde `4uentes-orchestor`.

## Conexion Permitida

La conexion debe declarar:

- policy de endpoint MCP: `docs/requests/jira-mcp-endpoint-connection-policy.md`;
- patron operativo MCP: `JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'`;
- project key permitido: `SST`;
- board permitido: `SST-Team`;
- issue type permitido: `Tarea`;
- actor autorizado: service account o usuario operador;
- origen permitido: dominio o IP fija del gateway;
- acciones permitidas:
  - actualizar descripcion de issues seleccionados;
  - crear issues candidatos seleccionados;
- acciones prohibidas:
  - borrar issues;
  - transicionar issues;
  - updates masivos no acotados;
  - escribir fuera del project key `SST`.

## Allowlist Requerido

La conexion debe pasar por dos controles de Atlassian cuando apliquen:

- domain allowlist del Rovo MCP Server, si se usa MCP con OAuth 2.1;
- IP allowlist de Atlassian Cloud/Jira, si la organizacion restringe accesos
  por IP.

Para API token o Jira REST API, la domain allowlist MCP puede no aplicar, pero
la IP allowlist y los permisos Jira siguen aplicando.

Para MCP OAuth, la divulgacion de endpoints y comandos debe seguir el patron
canonico definido en `docs/requests/jira-mcp-endpoint-connection-policy.md`.

## Auth

Opciones aceptadas:

- OAuth 2.1 para MCP, con usuario autorizado;
- API token externo para MCP, si el admin lo permite;
- Jira REST API con service account y token externo;
- operador manual que ejecute los comandos desde un entorno autorizado.

No se permite guardar tokens, cookies, cloudId, URLs privadas del sitio Jira ni
secretos en Git.

## Gates Previos A Escritura

Antes de cualquier write:

- existe request `planned`;
- existe `doctor-summary.md`;
- existe `correction-plan-preview.json`;
- existe `jira-policy-check-summary.md`;
- `policy-check` registra `PASS`;
- `correction-plan-preview` registra `blocked: 0`;
- la aprobacion humana nombra acciones permitidas;
- el writer esta en dominio/IP permitidos;
- el actor tiene permisos Jira minimos.

## Aplicacion A CR-SST-0039

CR-SST-0039 ya tiene:

- metadata Jira read-only;
- duplicate search read-only;
- reconciliation read-only;
- doctor read-only;
- correction plan con 8 updates y 1 create;
- policy-check PASS;
- write directo bloqueado por runtime.

El siguiente avance no es cambiar el payload. Es definir y habilitar el actor
de escritura autorizado.

## Configuracion Local

El ejemplo vive en:

- `environments/local/jira-writer.local.example.yaml`

El archivo real debe llamarse:

- `environments/local/jira-writer.local.yaml`

Ese archivo esta ignorado por Git y debe mantener cualquier dato sensible fuera
del repositorio.

## Writer CLI Inicial

La primera implementacion del writer/gateway es una CLI local:

```powershell
npm.cmd run jira:writer:apply -- --request-id CR-SST-0039 --output-dir evidence/requests/CR-SST-0039 --actions update,create --dry-run
```

Para ejecucion real requiere aprobacion explicita y credenciales externas:

```powershell
$env:JIRA_BASE_URL="https://<site>.atlassian.net"
$env:JIRA_EMAIL="<service-account-email>"
$env:JIRA_API_TOKEN="<external-token>"

npm.cmd run jira:writer:apply -- --request-id CR-SST-0039 --output-dir evidence/requests/CR-SST-0039 --actions update,create --approved
```

El modo real queda reservado para un entorno autorizado. El modo `--dry-run`
debe usarse para validar seleccion de acciones sin escribir en Jira.
