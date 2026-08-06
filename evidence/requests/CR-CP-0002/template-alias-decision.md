# CR-CP-0002 Decision De Template Y Alias

## Nombre Canonico

El nombre canonico comun queda como `control_plane_link`.

Motivo:

- describe la relacion con cualquier control-plane adoptante;
- no hard-codea `4uentes-orchestor`;
- puede ser usado por otros repos o futuros control-planes ARDS/SDD;
- mantiene clara la separacion entre core canonico y adopcion local.

## Alias Local

`orchestrator_link` queda como alias local del control-plane actual.

El alias sigue siendo valido en `4uentes-orchestor` porque ya existe evidencia,
state model y docs vivas que lo usan. No debe promoverse como nombre canonico
global porque acopla el template al nombre local del orquestador.

## Clasificacion De Policy

`control-plane-link-policy` queda clasificada como `core-profile-scoped`, no
como `core-general`.

La policy es requerida para repos con perfil `control-plane`. Para repos hijos
queda como adopcion request-driven mediante `policy_adoption_manifest` o como
desviacion/no-aplicabilidad mediante `policy_exception_manifest`.

Esta decision corrige el riesgo de interpretar `control_plane_link` como
obligacion global para todo repo ARDS/SDD. El canon reusable existe, pero su
aplicacion depende de perfil, applicability y manifest.

## Regla De Convivencia

Un repo adoptante puede mantener un alias local si documenta:

- alias local;
- campo canonico equivalente;
- criterio de migracion o convivencia;
- evidencia de que el alias no redefine el canon del core.

## Template En Core

Template canonico creado:

- `templates/specs/integration/control-plane-link.template.yaml`

El template conserva claves tecnicas en ingles y contenido machine-readable,
segun `human-doc-language`.

## Convivencia Local

La adopcion local del control-plane declara:

- `local_alias`: `orchestrator_link`
- `maps_to`: `control_plane_link`
- `origin_repo`: `4uentes-orchestor`
- `canonical_owner`: `4uentes-ards-core`

No se migro ningun repo hijo en este CR.
