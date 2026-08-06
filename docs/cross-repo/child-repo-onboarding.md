# Onboarding De Repos Hijos

## Proposito

Este documento define que necesita un nuevo repo hijo para quedar gobernado por
`4uentes-orchestor` con capacidades de estado, capability linkage y
reconciliacion ARDS/SDD.

## Reglas De Entrada

Todo repo hijo nuevo debe tener una entrada en `catalog/services/*.yaml` basada
en:

- `templates/service-catalog-entry.template.yaml`

La entrada debe incluir:

```yaml
orchestrator_link_contract:
  required: true
  status: pending-child-adoption
  rule_ref: "docs/cross-repo/child-repo-orchestrator-link-rule.md"
  template_ref: "templates/child-orchestrator-link-rule.md"
  metadata_key: "orchestrator_link"
  capability_state_map: "state/capability-links.yaml"
```

Sin esta seccion, `npm run check` debe fallar.

## Regla Local En El Repo Hijo

El repo hijo debe adoptar el template:

- `templates/child-orchestrator-link-rule.md`

La regla local puede vivir en `AGENTS.md`, `docs/ai/policy.md`, un spec ARDS/SDD
local, o el lugar equivalente definido por el repo hijo.

## Poderes Que Recibe El Repo Hijo

Al adoptar la regla, el repo hijo puede:

- declarar que una capability cambio;
- proponer `status_hint` para un `feature_state` o `bugfix_state`;
- dejar evidencia local enlazable;
- permitir reconciliacion aunque el trabajo no haya nacido en el orchestrator;
- compartir estado con otros repos mediante capabilities, no solo por el
  control-plane.

## Gate Del Control-Plane

El control-plane valida:

- que el servicio exista en catalogo;
- que declare `orchestrator_link_contract`;
- que el rule/template exista;
- que use `metadata_key: orchestrator_link`;
- que apunte a `state/capability-links.yaml`;
- que las capabilities gobernadas esten vinculadas a estados vivos.

## Adopcion Posterior

Cuando el repo hijo agregue la regla local, actualizar:

```yaml
orchestrator_link_contract:
  status: adopted
```

Mientras no se haya verificado, el estado correcto es
`pending-child-adoption`.

## Policies Y Manifests

La adopcion de policies en repos hijos no se modela solo con
`orchestrator_link_contract`. Cuando el rollout de policies aplique, el repo
hijo debe incluir uno de estos artefactos segun corresponda:

- `templates/policy-adoption-manifest.template.yaml`
- `templates/policy-exception-manifest.template.yaml`

La seleccion depende de si el repo hijo adopta la policy sin desviacion o si
registra una excepcion acotada con cierre planificado.
