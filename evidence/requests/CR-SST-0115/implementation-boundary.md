# CR-SST-0115 - Boundary De Implementacion

## Decision

`CR-SST-0115` queda limitado a contrato control-plane. No modifica runtime de
`sst-fend`, `node-auth` ni `sst-bend`.

## Politicas Aplicadas

- `agent-architecture-boundary-policy`: el contrato cross-repo se documenta
  antes de implementar.
- `human-doc-language`: la evidencia humana se escribe en espanol y conserva
  identificadores tecnicos estables.
- `owner-documentation-authority-policy`: no requiere owner docs de repos hijos
  porque no hay mutacion de repos hijos en este CR.

## No Incluye

- endpoints nuevos en `node-auth`;
- modelos o migraciones en `sst-bend`;
- cambios de UI en `sst-fend`;
- persistencia de anotaciones;
- render Markdown/template;
- transicion Jira por MCP.

## Siguiente Corte

`CR-SST-0116 / SST-46` debe implementar persistencia y BFF/API runtime usando
este contrato como entrada. Ese corte si debe activar owner docs en
`node-auth` y `sst-bend`.
