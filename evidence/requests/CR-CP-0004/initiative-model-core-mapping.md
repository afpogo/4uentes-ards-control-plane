# CR-CP-0004 / ARDS-5 - Mapping Del Modelo Initiative Al Core

## Decision

`initiative-model` debe promoverse como `core-profile-scoped-living-resource`.

No es una policy. Es un recurso vivo reusable para control-planes y repos que
necesiten agrupar programas de cambio, CRs, evidencia y mirrors operativos como
Jira Epic.

## Fuente Local

- Spec tecnica: `specs/initiatives/initiative-model.yaml`
- Documentacion humana: `docs/requests/initiative-model.md`
- Indice local: `initiatives/00-index.yaml`
- Validator local: `scripts/verify-initiatives.js`

## Canon Esperado En Core

Artefactos sugeridos:

- `specs/initiatives/initiative-model.yaml`
- `templates/specs/initiatives/initiative.template.yaml`
- `templates/specs/initiatives/00-index.template.yaml`
- `templates/specs/initiatives/initiative-adoption.template.yaml`
- entrada `living_resources` en `specs/00-index.yaml`
- entrada `templates` en `specs/00-index.yaml`
- referencia humana en `docs/concepts/` o `docs/requests/`, segun taxonomia final del core

## Clasificacion

```yaml
resource_id: "initiative-model"
resource_kind: "living-resource"
resource_class: "core-profile-scoped-living-resource"
origin_repo: "4uentes-orchestor"
canonical_owner: "4uentes-ards-core"
adoption_mode: "profile-required-or-request-driven"
required_for_profiles:
  - "control-plane"
optional_for_profiles:
  - "multi-repo-solution"
  - "child-repo-with-local-program-tracking"
```

## Reglas Que Deben Quedar En Core

- `Initiative` agrupa resultados amplios; no reemplaza ejecucion de CRs.
- Todo cambio ejecutable sigue pasando por request lifecycle.
- Una Initiative puede descubrir CRs durante ejecucion.
- Jira es mirror operativo, no source of truth ARDS/SDD.
- `Initiative ~= Jira Epic` solo como mirror.
- `CR ~= Jira Task / Story / Subtask` solo como mirror.
- Una Epic paraguas no reemplaza la Epic propia de una Initiative.
- El canon core no debe incluir IDs locales como `INIT-CP-0002` ni issue keys como `ARDS-5`.

## Validacion Esperada

El core deberia validar al menos:

- `kind: initiative`
- formato de `id`
- status canonico
- campos requeridos
- paths referenciados existentes cuando correspondan
- ausencia de rutas absolutas locales
- `tracking.jira.source_of_truth: false` cuando exista tracking Jira
- CRs referenciados existentes en el request lifecycle local del repo adoptante

## Boundary

Este CR prepara la promocion y deja evidencia local. La escritura canonica debe
ejecutarse dentro del workspace de `4uentes-ards-core` o por un workflow de core.

No se mutan repos hijos.
