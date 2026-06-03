# CR-SST-0021 - Resumen De Archivos Cambiados

Observado el: 2026-05-31

## 4uentes-orchestor

- Se agrego `requests/inbox/CR-SST-0021-ards-core-memory-runtime-phases.yaml`.
- Se agrego `requests/planned/CR-SST-0021-ards-core-memory-runtime-phases.yaml`
  mediante el planner; luego se corrigio la clasificacion de peso de tarea,
  modelo y subagentes a `complex-high-risk-task`.
- Se agrego evidencia bajo `evidence/requests/CR-SST-0021/`.
- Se actualizo `state/features/sst-chatbot.current.yaml`.
- Se actualizo `state/capability-links.yaml`.
- Se actualizo `inventory/evidence/git/sst-chatbot.md`.

## sst-chatbot

- Se agrego `src/app/memory/types.py`.
- Se agrego `src/app/memory/validation.py`.
- Se agrego `src/app/memory/store.py`.
- Se agrego `src/app/memory/phases.py`.
- Se agrego `src/app/memory/providers.py`.
- Se agrego `src/app/memory/visibility.py`.
- Se agrego `src/app/memory/handoff.py`.
- Se actualizo `src/app/memory/__init__.py`.
- Se agrego `tests/test_ards_memory_runtime.py`.
- Se actualizo `specs/capabilities/agent-lifecycle-and-orchestrator-boundary.yaml`.
- Se actualizo `specs/capabilities/user-activity-ards-memory.yaml`.
- Se actualizo `docs/architecture/agent-core-and-orchestrator-boundary.md`.
- Se actualizo `docs/architecture/user-activity-ards-memory.md`.

## Cambios Previos Del Repo Hijo No Pertenecientes A Este Request

Estos archivos ya estaban dirty antes de la implementacion de CR-SST-0021 y no
fueron revertidos:

- `docs/00-overview.md`
- `docs/playbooks/05-author-and-validate-prompts.md`
- `specs/capabilities/prompt-catalog-and-versioning.yaml`
