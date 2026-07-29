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

El transporte runtime real sigue abierto. El adapter fake local continua siendo
infraestructura de test hasta que un request aprobado seleccione HTTP, queue,
worker u otro mecanismo explicito.
