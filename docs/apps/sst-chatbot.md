# sst-chatbot

## Catalog Role

`sst-chatbot` is the SST agent runtime and integration repository. It owns
provider-agnostic agent contracts, private prompt handling, retrieval/RAG
contracts, generated ARDS/SDD workspace proposals, and structured handoff
payloads for `4uentes-orchestor`.

The control plane catalogs it as:

- service: `sst-chatbot`
- service kind: `agent-runtime`
- ARDS kind: `backend-api`
- solution: `sst`
- status: `active`

`backend-api` is used because the current ARDS standard models repos that
publish runtime or cross-repo capabilities as backend capability producers.

## Source Refs

- Catalog: `catalog/services/sst-chatbot.yaml`
- Local binding evidence: `inventory/evidence/git/sst-chatbot.md`
- Orchestrator inbound capability:
  `specs/capabilities/inbound/4uentes-orchestor--sst-chatbot-agent-handoff.yaml`
- State: `state/features/sst-chatbot.current.yaml`

## Observed Child Capabilities

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

## Control Plane Boundary

`sst-chatbot` may propose structured operation intents and validated agent
results. `4uentes-orchestor` owns acceptance, queueing, retry policy, execution
timing, audit, and cross-repo reconciliation.

The child repo has ARDS/SDD documentation and tests. Adoption of the explicit
`orchestrator_link` metadata remains pending in the child repo.
