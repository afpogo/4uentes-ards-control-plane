# CR-CP-0004 / ARDS-5 - Handoff Para Core

## Objetivo

Promover `initiative-model` desde la observacion local del control-plane hacia
canon reusable de `4uentes-ards-core`.

## Entradas Desde Control-Plane

- `specs/initiatives/initiative-model.yaml`
- `docs/requests/initiative-model.md`
- `scripts/verify-initiatives.js`
- `evidence/requests/CR-CP-0004/ards-5-context-summary.md`
- `evidence/requests/CR-CP-0004/jira-mirror-boundary-decision.md`
- `evidence/requests/CR-CP-0004/initiative-model-core-mapping.md`

## Artefactos A Crear En Core

- `specs/initiatives/initiative-model.yaml`
- `templates/specs/initiatives/initiative.template.yaml`
- `templates/specs/initiatives/00-index.template.yaml`
- `templates/specs/initiatives/initiative-adoption.template.yaml`

## Artefactos A Actualizar En Core

- `specs/00-index.yaml`
- documentacion conceptual humana del modelo Initiative
- validacion YAML/link/tone existente si aplica

## Contenido Que No Debe Promoverse Como Canon

- IDs locales: `INIT-CP-*`, `INIT-SST-*`, `INIT-PORTFOLIO-*`
- issue keys Jira concretos
- evidencia local especifica del orchestrator
- decisiones propias de una solucion o producto
- estado local de una Initiative concreta

## Criterio De Aceptacion

- El core expone `initiative-model` como living resource reusable.
- Existe template para materializar una Initiative local.
- Existe template para adoptar o declarar no aplicabilidad.
- El modelo mantiene Jira como mirror con `source_of_truth: false`.
- `npm.cmd run check` pasa en core.
- `npm.cmd run check` pasa en control-plane despues de registrar la adopcion o handoff.

## Nota De Ejecucion

El workspace actual es `4uentes-orchestor`. Por politica local, este handoff no
escribe el core directamente.
