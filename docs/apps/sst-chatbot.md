# sst-chatbot

## Rol En El Catalogo

`sst-chatbot` es el runtime agentico y repositorio de integracion de SST. Es
dueno de contratos agenticos provider-agnostic, manejo de prompts privados,
contratos de retrieval/RAG, propuestas de workspaces ARDS/SDD generados y
payloads estructurados de handoff hacia `4uentes-orchestor`.

El control-plane lo cataloga como:

- service: `sst-chatbot`
- service kind: `agent-runtime`
- ARDS kind: `backend-api`
- solution: `sst`
- status: `active`

`backend-api` se usa porque el standard ARDS vigente modela repos que publican
capabilities runtime o cross-repo como productores backend.

## Referencias Fuente

- Catalogo: `catalog/services/sst-chatbot.yaml`
- Evidencia de binding local: `inventory/evidence/git/sst-chatbot.md`
- Capability inbound del orchestrator:
  `specs/capabilities/inbound/4uentes-orchestor--sst-chatbot-agent-handoff.yaml`
- Estado: `state/features/sst-chatbot.current.yaml`
- Evidencia de reconciliacion: `evidence/requests/CR-SST-0082/`

## Capabilities Observadas En El Hijo

- `provider-abstraction`
- `ards-structure-generation`
- `retrieval-augmented-generation`
- `retriever-strategies`
- `user-workspace-provisioning`
- `generated-workspace-governance`
- `agent-lifecycle-and-orchestrator-boundary`
- `user-activity-ards-memory`
- `application-context-connector`
- `plaud-transcript-derivations`
- `prompt-catalog-and-versioning`

## Boundary Del Control-Plane

`sst-chatbot` puede proponer operation intents estructurados y resultados
agenticos validados. `4uentes-orchestor` conserva ownership sobre aceptacion,
queueing, retry policy, timing de ejecucion, audit y reconciliacion cross-repo.

El repo hijo ya tiene documentacion ARDS/SDD, `docs/ai/policy.md` y adopcion
documentada de `orchestrator_link` reconciliada bajo `CR-SST-0082`.

El primer corte conectado seleccionó una frontera híbrida: `sst-fend` usa
Socket.IO contra `sst-bend`, y `sst-bend` invoca a `sst-chatbot` mediante HTTP
NDJSON interno. Ese corte quedó validado históricamente para local/dev de una
sola instancia bajo `INIT-SST-0007`.

La selección del transporte no equivale a publicación persistente. La
validación del cluster del 13 de agosto fue transitoria; `CR-SST-0178` continúa
`running` hasta persistir el wiring GitOps y cerrar el E2E con un navegador
aislado. El contrato de sesión vigente es `CR-SST-0180`, no la implementación
histórica de rotación de `CR-SST-0166`.

Referencias de reconciliación:

- `initiatives/INIT-SST-0007-sst-chatbot-first-connected-version.yaml`
- `evidence/initiatives/INIT-SST-0007/canonical-reconciliation-2026-08-18.md`
- `evidence/requests/CR-SST-0178/current-status-reconciliation-2026-08-18.md`
