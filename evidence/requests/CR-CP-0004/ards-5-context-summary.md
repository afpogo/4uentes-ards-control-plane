# CR-CP-0004 / ARDS-5 - Contexto De Inicio

## Objetivo

Promover el modelo `Initiative` local a canon reusable del core ARDS/SDD.

El modelo debe permitir agrupar resultados amplios, CRs conocidos, CRs
candidatos o descubiertos, evidencia, boundaries y tracking Jira como mirror.

## Contexto Desde ARDS-4

ARDS-4 / `CR-CP-0003` promovio `feature-bugfix-state-model` como living
resource del core.

Aprendizajes relevantes:

- un living resource no es una policy;
- el core debe poseer la forma reusable y templates;
- el control-plane debe conservar la materializacion local y validaciones
  contra catalogo, requests, evidence y state;
- child repo rollout debe seguir siendo request-driven;
- cuando no hay validator maduro, el gap debe quedar documentado.

Evidencia fuente:

- `evidence/requests/CR-CP-0003/state-model-core-mapping.md`
- `evidence/requests/CR-CP-0003/validator-boundary-decision.md`
- `evidence/requests/CR-CP-0003/validation-stability-assessment.md`
- `evidence/requests/CR-CP-0003/validation-results.md`

## Modelo Local De Initiative

Fuente local:

- `specs/initiatives/initiative-model.yaml`
- `docs/requests/initiative-model.md`
- `initiatives/00-index.yaml`
- `scripts/verify-initiatives.js`

Regla central:

```text
Initiative = resultado amplio / programa de cambio
CR         = cambio concreto, auditable y ejecutable
Evidence   = prueba local de decisiones, validaciones y resultados
```

## Jira Mirror

La regla local existente es:

```text
ARDS/SDD Initiative ~= Jira Epic
ARDS/SDD CR         ~= Jira Task / Story / Subtask
```

Jira no asigna IDs `INIT` ni `CR`, no decide cierre ARDS/SDD y no reemplaza la
fuente de verdad local.

La correccion reciente de `INIT-CP-0003` confirma el riesgo:

- primero se crearon tasks bajo `ARDS-1`;
- luego se corrigio creando `ARDS-13` como Epic dedicada de `INIT-CP-0003`;
- `ARDS-7` a `ARDS-12` se reparentaron bajo `ARDS-13`.

Esa experiencia debe entrar al canon como boundary:

- una Initiative puede tener una Epic Jira mirror;
- una Epic relacionada/paraguas no debe confundirse con la Epic propia de la
  Initiative;
- los CRs se cuelgan de la Epic de su Initiative, no de una Epic paraguas.

## Boundary De ARDS-5

ARDS-5 debe promover:

- shape reusable de `initiative`;
- statuses canonicos;
- campos minimos;
- reglas de relacion con CRs;
- reglas de Jira mirror;
- template reusable;
- expectativas de validacion.

ARDS-5 no debe promover:

- IDs concretos como `INIT-CP-0002`;
- issue keys concretos como `ARDS-1`, `ARDS-13` o `SST-36`;
- evidencia local especifica;
- decisiones de una solucion concreta como canon global.

## Validacion Inicial Esperada

- `npm.cmd run check:initiatives`
- `npm.cmd run check`
- check del core cuando se materialice la promocion.
