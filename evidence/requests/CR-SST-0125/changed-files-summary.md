# CR-SST-0125 - Resumen De Archivos Cambiados

## Runtime SST Bend

- `src/apps/sst/application/learning-workspaces/normalize-learning-source.service.js`
  - Normaliza texto, HTML y manifests suministrados.
  - Aplica limites, selectors, exclusion de generados y warnings de assets.
- `src/apps/sst/application/learning-workspaces/preview-learning-source.usecase.js`
  - Integra normalizacion con el preview, anotaciones y fingerprint vigentes.
- `src/apps/sst/application/learning-workspaces/index.js`
  - Exporta el servicio de normalizacion y validacion de assets.
- `src/apps/sst/presentation/schemas/learning-workspace.dto.js`
  - Amplia el DTO de forma compatible y mantiene campos de anotaciones.

## Pruebas

- `scripts/test-learning-workspace.js`
  - Cubre CourseSource, WebArticleSource suministrado, exclusions, warnings,
    assets, compatibilidad legacy y regresion de anotaciones.

## ARDS/SDD Owner

- `specs/api/learning-workspaces.yaml`
- `docs/api/26-learning-workspaces.md`
- `specs/api/routing.yaml`
- `docs/api/03-routing.md`
- `specs/capabilities/outbound/learning-workspace-context.yaml`
- `docs/capabilities/outbound/learning-workspace-context.md`

## Repositorios No Mutados

- `4uentes-auth`/`node-auth`: verificacion read-only del passthrough.
- `sst-fend`: fuera del boundary autorizado.
