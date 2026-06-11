# Jira MCP Ticketing Playbook

## Proposito

Este playbook define como el control-plane debe conectar Jira por MCP y crear
tickets para funcionalidades SST observadas en `state/features/*.current.yaml`.

La integracion es una operacion del control-plane. No pertenece a repos
funcionales como `sst-fend`, `sst-bend`, `sst-extension`, `sst-chatbot`,
`4uentes-auth` o `sst-4uentes-infra`.

## Decision De Ownership

- Repo responsable: `4uentes-orchestor`.
- Rol del repo: mantener el playbook, requests, evidencia, mapping de estados a
  tickets y payloads de dry-run.
- Responsable externo: admin de Atlassian/Jira.
- Rol del admin externo: autorizar el cliente MCP, confirmar plan/permisos,
  habilitar dominios o IPs requeridos, y aprobar el metodo de autenticacion.
- Repos funcionales: no configuran MCP, no guardan tokens Jira y no crean
  tickets directamente.

Si una funcionalidad termina requiriendo cambios en repos hijos, esos cambios
deben entrar por el lifecycle normal de requests del control-plane.

## Estado De Acceso Atlassian

Verificado el 2026-06-04 contra documentacion publica de Atlassian:

- El Atlassian Rovo MCP Server esta disponible para clientes Atlassian Cloud.
- El acceso no parece estar limitado a Jira Premium.
- Los limites dependen del plan:
  - Free: 500 calls por hora.
  - Standard: 1000 calls por hora.
  - Premium/Enterprise: 1000 calls por hora mas capacidad adicional por usuario,
    hasta 10000 calls por hora.
- Los Rovo agents de terceros con MCP dentro de Jira/Confluence son un caso
  distinto y requieren Rovo Premium o Enterprise.

Fuentes:

- https://www.atlassian.com/platform/remote-mcp-server
- https://support.atlassian.com/atlassian-rovo-mcp-server/docs/getting-started-with-the-atlassian-remote-mcp-server/
- https://support.atlassian.com/atlassian-rovo-mcp-server/docs/supported-tools/
- https://support.atlassian.com/rovo/docs/out-of-the-box-third-party-mcp-agents/

## Alcance Del MCP

El MCP debe usarse para:

- descubrir proyectos Jira visibles para el usuario;
- leer metadata de issue types y campos requeridos;
- crear tickets desde el read-model del control-plane;
- buscar tickets existentes para evitar duplicados;
- editar o comentar tickets solo con aprobacion humana explicita.

El MCP no debe usarse para:

- almacenar credenciales en Git;
- modificar repos funcionales;
- saltar el request lifecycle;
- crear tickets sin dry-run revisado;
- mover estados Jira de forma masiva sin aprobacion.

## Conexion MCP

La conexion se realiza fuera del repositorio, en el cliente MCP disponible para
el operador. El control-plane solo registra la decision y evidencia no secreta.

Metodo preferido:

1. Usar OAuth 2.1 para Atlassian Rovo MCP Server.
2. Autorizar el sitio Jira Cloud con un usuario que tenga permisos minimos para
   leer metadata y crear issues en el proyecto elegido.
3. Confirmar que el dominio del cliente MCP esta permitido por el admin de
   Atlassian.
4. Confirmar IP allowlist si la organizacion usa restriccion por IP.
5. Ejecutar una prueba de lectura: usuario actual, recursos accesibles,
   proyectos visibles y metadata del issue type elegido.

Metodo alternativo:

1. Usar API token solo si el admin lo habilita.
2. Guardar el token fuera del repo.
3. Registrar en evidencia solo que el metodo fue usado, nunca el valor del
   token.

## Flujo Para Crear Tickets

1. Leer `state/features/*.current.yaml`.
2. Filtrar funcionalidades con `status` distinto de `done`.
3. Generar un dry-run local con un issue por funcionalidad.
4. Buscar duplicados en Jira por label, summary o `state_id`.
5. Presentar el payload al usuario.
6. Crear tickets solo despues de aprobacion humana.
7. Guardar evidencia de ejecucion en `evidence/requests/<request-id>/`.

## Mapping Sugerido

Labels base:

- `ards-sdd`
- `control-plane`
- `feature-state`
- `not-done`

Labels por estado:

- `ards-documented`
- `implemented-local`
- `runtime-partial`
- `validated-local`
- `validated-live`

Prioridad sugerida:

- `runtime-partial`: alta.
- `implemented-local`: media.
- `ards-documented`: media.
- `validated-local`: baja/media.
- `validated-live`: baja, salvo gaps de release o operacion.

Campos minimos del ticket:

- `state_id`
- titulo de funcionalidad;
- estado actual;
- servicios afectados;
- request ids relacionados;
- gaps abiertos;
- referencias de evidencia o specs;
- criterio de cierre esperado.

## Criterio De Ready

La integracion esta lista para crear tickets cuando:

- el proyecto Jira y su key estan confirmados;
- el issue type esta confirmado;
- los campos obligatorios fueron leidos por MCP;
- existe dry-run de los tickets;
- no se detectaron duplicados o se decidio como tratarlos;
- el usuario aprobo la escritura en Jira.

## Evidencia Requerida

Para cerrar el request que habilita esta integracion, registrar:

- resumen de conexion MCP sin secretos;
- proyecto Jira elegido;
- issue type elegido;
- metadata de campos obligatorios;
- dry-run de tickets;
- resultado de busqueda de duplicados;
- resumen de tickets creados, si se aprueba la escritura.
