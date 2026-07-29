# CR-CP-0002 Resumen De Policy `control_plane_link`

## Decision

`CR-CP-0002` promueve el patron local `orchestrator_link` a una forma canonica
generica en core llamada `control_plane_link`.

La decision evita hard-codear `4uentes-orchestor` en el canon comun y permite
que cada control-plane adoptante documente su repo concreto en adopcion local.

La policy no queda clasificada como regla general para todos los repos. Queda
como `core-profile-scoped`: requerida para el perfil `control-plane` y
adoptable por repos hijos solo mediante profile, request aprobado o manifest de
adopcion. Los repos hijos que no adopten la policy no deben tratarse como
incumplidores globales por defecto.

## Resultado En Core

Repo core esperado:

- `4uentes-ards-core`

Archivos nuevos:

- `docs/policies/control-plane-link-policy.md`
- `templates/specs/integration/control-plane-link.template.yaml`

Archivos actualizados:

- `docs/policies/README.md`
- `specs/integration/policies.yaml`
- `docs/reference-sources.md`

## Semantica Canonica

El bloque canonico es:

```yaml
control_plane_link:
  control_plane_repo: "TODO"
  state_kind: "feature_state"
  state_id: "TODO"
  capability_id: "TODO"
  work_origin: "child-repo"
  request_id: "TODO"
  evidence_ref: "TODO"
  status_hint: "implemented-local"
  correlation_id: "TODO"
```

`status_hint` es advisory. El control-plane adoptante debe reconciliarlo contra
request lifecycle, evidence, state read-model, validation results, gaps y
exceptions antes de cambiar estado.

## Clasificacion Viva

- `policy_id`: `control-plane-link-policy`
- `policy_class`: `core-profile-scoped`
- `origin_repo`: `4uentes-orchestor`
- `canonical_owner`: `4uentes-ards-core`
- `applicability`: control-planes adoptantes y repos hijos que adopten metadata
  de reconciliacion hacia un control-plane.
- `adoption_mode`: requerida por perfil `control-plane`; request-driven para
  child repos.
- `required_for_profiles`: `control-plane`
- `optional_for_profiles`: `child-repo`, `http-owner`, `frontend-web`,
  `frontend-extension`, `infra-gitops`
- `template_binding`:
  `templates/specs/integration/control-plane-link.template.yaml`
- `local_alias`: `orchestrator_link` mapea a `control_plane_link` solo para
  `4uentes-orchestor` y repos que ya lo adoptaron bajo lifecycle previo.

## Limite

- No se mutaron repos hijos.
- No se migro `orchestrator_link` en repos hijos.
- La adopcion child repo queda request-driven.
- En esta ejecucion del control-plane no se modifico `4uentes-ards-core`
  directamente; la clasificacion local y el handoff quedan trazados en
  `specs/integration/policies.yaml`, `state/policy-links.yaml` y templates de
  manifest.
