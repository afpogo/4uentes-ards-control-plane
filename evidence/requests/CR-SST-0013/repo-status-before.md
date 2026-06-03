# CR-SST-0013 - Estado Previo De Repos Hijos

Observado el: 2026-05-24

## Resumen

Se verificaron los cinco repos hijos catalogados antes de aplicar reglas
documentales de `orchestrator_link`, politica de idioma y arquitectura de
documentacion.

## Working Trees

| Repo | Estado observado | Nota |
|---|---|---|
| `4uentes-auth` (`node-auth`) | dirty | Cambios existentes en runtime/document-agent y config; preservar. |
| `sst-fend` | dirty | Cambios existentes en UI/document-agent/build config; preservar. |
| `sst-bend` | dirty | Cambios existentes en document-agent jobs/API; preservar. |
| `sst-extension` | clean | Sin cambios observados al inicio de esta ejecucion. |
| `sst-4uentes-infra` | dirty | Cambios existentes en docs, specs y manifests; preservar. |

## Artefactos ARDS/SDD Existentes

Todos los repos hijos tienen:

- `AGENTS.md`
- `docs/`
- `docs/ai/policy.md`
- `specs/00-index.yaml`

Ninguno tenia, al inicio de esta ejecucion, los documentos humanos locales:

- `docs/idioma-markdown.md`
- `docs/documentation-information-architecture.md`

## Regla De Ejecucion

No se deben revertir, stashar, formatear ni limpiar cambios existentes. Esta
ejecucion agrega solo artefactos documentales/ARDS encima del estado actual.

