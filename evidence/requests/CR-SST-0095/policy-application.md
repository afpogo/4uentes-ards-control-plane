# CR-SST-0095 - Aplicacion De Policies

## Policies Aplicadas

- `agent-model-selection-policy`
- `agent-task-atomization-policy`
- `agent-delegation-policy`
- `agent-architecture-boundary-policy`
- `human-doc-language`
- `owner-documentation-authority-policy`

## Clasificacion

Clasificacion: `complex-high-risk-task`.

Drivers:

- captura de paginas privadas autenticadas;
- permisos de extension y APIs de browser;
- futura relacion con `DictionarySecret`;
- posible ingreso a `LearningWorkspace`;
- creacion futura de tickets Jira bajo Epic `SST-29`;
- riesgo de mezclar bugfix con arquitectura.

## Lenguaje De Documentacion

Regla aplicada:

- Markdown humano en espanol.
- YAML/specs en ingles.
- IDs estables sin traducir: `INIT-SST-0003`, `CR-SST-0095`,
  `sst-extension`, `CredentialedWebSource`, `LearningWorkspace`.

## Atomizacion

Cada unidad propuesta debe tener:

- objetivo;
- inputs;
- output esperado;
- archivos/dominios;
- riesgo;
- perfil sugerido;
- subtareas;
- Definition of Done.

No se permite un unico CR que combine:

- fix de tabs/PDF;
- nuevo contrato `CredentialedWebSource`;
- integracion con `LearningWorkspace`;
- DictionarySecret backend capture;
- QA completa.

## Owner Documentation Authority

Regla aplicada:

- El control-plane es autoridad para `INIT-SST-0003`, `SST-29`, CRs, planes y
  evidencia.
- `sst-extension` es autoridad owner para comportamiento runtime, specs,
  docs, tests y contracts que implementa o consume dentro del repo.
- Cualquier CR que modifique `sst-extension` debe actualizar las specs/docs
  owner del repo hijo en el mismo lifecycle o registrar una excepcion explicita.
- El cierre de una CR de implementacion no puede basarse solo en evidencia del
  control-plane.

Impacto sobre backlog:

- `CR-SST-0096` ya queda reservado para `owner-documentation-authority-policy`.
- `CR-SST-0097` ya queda reservado para remediacion owner-doc de `sst-bend`.
- Los candidatos de extension comienzan en `CR-SST-0098`.
- Cada candidato de implementacion debe incluir una subtarea de owner docs.

## Delegacion / Subagentes

Subtareas delegables:

- discovery de estructura y specs;
- clustering de bugs observados;
- redaccion preliminar de subtareas Jira;
- revision mecanica de formato.

Subtareas no delegables a perfiles rapidos:

- decision de boundary de secretos;
- decision de auth/session;
- contrato con `node-auth`;
- contrato de ingreso a `LearningWorkspace`;
- aprobacion de mutacion en repos hijos.

## Fallback

En esta pasada no se invocaron subagentes externos. La lectura se hizo
secuencialmente por el agente principal y se registro el plan de delegacion para
futuras ejecuciones.
