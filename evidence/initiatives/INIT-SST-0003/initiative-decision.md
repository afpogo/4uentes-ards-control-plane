# INIT-SST-0003 - Decision De Initiative

## Decision

Se crea `INIT-SST-0003 - SST Extension Construction` como Initiative local para
agrupar la construccion de `sst-extension`.

## Viabilidad

La direccion es viable y consistente con ARDS/SDD:

- `Initiative` agrupa el programa amplio.
- Jira `Epic` funciona como mirror operativo.
- Cada cambio ejecutable sigue viviendo como `CR-SST`.
- Cada `CR-SST` puede tener un ticket Jira bajo la Epic.
- Las subtareas de ejecucion pueden vivir como subtareas Jira o comentarios,
  pero no reemplazan evidencia ni request lifecycle.

## Motivo

La extension cruza varias superficies sensibles:

- captura de tabs autenticados;
- permisos de navegador;
- generacion de PDF/HTML/texto;
- cola local y handoff node-auth;
- futura relacion con `DictionarySecret`;
- futura entrada a `LearningWorkspace`;
- QA manual y automatizada de extension.

Por eso no conviene colgar todo de `INIT-SST-0002 Dictionary Management` ni de
`INIT-SST-0001 Tags Governance Continuity`. La extension necesita su propia
epica de construccion.

## Primer Corte De Backlog

- Corregir captura visual PDF tab-by-tab en `sst-extension`.
- Definir contrato `CredentialedWebSource` producido por extension.
- Integrar artifacts capturados con preview de `LearningWorkspace`.
- Endurecer QA de paginas privadas autenticadas.
- Definir reglas de evidencia sanitizada para extension.

## Boundary

Esta decision no autoriza mutar `sst-extension`. El primer cambio funcional debe
abrirse como CR separado bajo `INIT-SST-0003`.
