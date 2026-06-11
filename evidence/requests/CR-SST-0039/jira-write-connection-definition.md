# Definicion De Conexion Jira Writer

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0039
- Resultado: CONNECTION-DEFINED
- Escritura Jira ejecutada: no

## Contexto

CR-SST-0039 preparo el batch de escritura:

- Proposed description updates: 8
- Proposed issue creates: 1
- Blocked correction items: 0
- Policy check: PASS

La escritura directa desde el agente fue bloqueada por policy del runtime.

## Conexion Definida

La conexion permitida debe ser:

```text
control-plane -> writer/gateway autorizado -> Jira
```

El writer/gateway consume:

- `evidence/requests/CR-SST-0039/correction-plan-preview.json`
- `evidence/requests/CR-SST-0039/jira-policy-check-summary.md`
- `evidence/requests/CR-SST-0039/doctor-summary.md`

Y solo puede ejecutar:

- `edit_issue_description` para los 8 issues seleccionados;
- `create_issue` para el candidato `sst-tag-prefix-engine`.

## Datos De Conexion Requeridos

- Jira project key: `SST`
- Jira board: `SST-Team`
- Issue type: `Tarea`
- Actor: service account u operador humano autorizado
- Auth: OAuth 2.1, API token externo o Jira REST API token externo
- Origen: dominio/IP autorizado por Atlassian Admin
- Token storage: externo, nunca Git

## Allowlist A Revisar

Si se usa MCP con OAuth 2.1:

- revisar `Atlassian Administration > Rovo > Rovo MCP server`;
- confirmar dominio permitido para el cliente/gateway.

Si se usa API token o Jira REST API:

- revisar permisos del actor;
- revisar IP allowlist de Atlassian Cloud/Jira si esta habilitada.

## Decision

Para evolucionar CR-SST-0039, el control-plane debe incorporar un writer
autorizado o una ejecucion manual autorizada desde un entorno permitido.

No se debe intentar rodear el bloqueo desde el mismo runtime.
