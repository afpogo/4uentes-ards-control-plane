# CR-4UENTES-0026 - Revision De Conexion Jira MCP

Fecha: 2026-07-04

Modo: `mcp-read-only`.

## Politica Revisada

Documentos aplicados:

- `docs/requests/jira-mcp-endpoint-connection-policy.md`
- `docs/requests/jira-mcp-oauth-session-playbook.md`
- `docs/requests/jira-write-connection-contract.md`
- `docs/requests/jira-feature-ticket-policy.md`
- `state/jira-backlog-sync-machine.yaml`

Reglas relevantes:

- Jira es espejo operativo; el control-plane sigue siendo la fuente canonica.
- Las lecturas MCP son permitidas si no persisten secretos.
- Las escrituras Jira requieren aprobacion humana explicita por accion.
- No se deben registrar tokens, cookies, `cloudId`, URLs privadas, OAuth
  material, account IDs ni emails.
- Los repos hijos no ejecutan sincronizacion Jira por cuenta propia.

## Conexion MCP

Resultado:

- El remoto Atlassian MCP configurado para Codex esta disponible.
- El bootstrap local reporto conexion Atlassian exitosa y herramientas
  disponibles.
- La falla observada durante bootstrap corresponde a otro remoto MCP no Jira y
  no bloquea la disponibilidad de Atlassian.

Operacion directa:

- Se uso lectura MCP para listar recursos Atlassian accesibles.
- Se uso lectura MCP para consultar proyectos Jira visibles.
- No se ejecuto escritura externa.

## Resultado Jira

Hallazgos:

- Existe un recurso Atlassian accesible con scopes Jira de lectura/escritura.
- El proyecto Jira `SST` es visible.
- El proyecto Jira `4uentes-portfolio` con key `PORT` debe usarse como destino
  de escritura para Portfolio.
- `SST` expone issue types compatibles con el flujo actual, incluyendo `Epic`,
  `Tarea`, `Feature`, `Historia`, `Error`, `Subtask` y `Recurso`.

## Decision

`CR-4UENTES-0026` queda listo para mirror Jira real cuando se confirme por MCP
que el proyecto Jira `4uentes-portfolio`/`PORT` es visible y acepta issue type
`Epic` y `Tarea`.

No corresponde crear la Epic ni la task en `SST`, porque este trabajo pertenece
al scope no-SST de `4UENTES`.

## Proximo Paso Recomendado

Crear o habilitar el proyecto Jira `4uentes-portfolio` con key `PORT`. Despues,
repetir:

1. lectura MCP de proyecto;
2. lectura de issue types/campos;
3. busqueda de duplicados por summary/request id;
4. aprobacion humana explicita;
5. creacion de Epic y task mirror si corresponde.

## Seguridad

No se persisten:

- `cloudId`;
- URL privada del sitio Jira;
- tokens;
- cookies;
- headers de autorizacion;
- OAuth material;
- account IDs;
- emails.
