# CR-SST-0007 - Artefactos Buscados

Observado el: 2026-05-20

## Repo Inspeccionado

Path local:

```text
C:\Users\andre\Desktop\4uentes\apps\4uentes-sst\chatboot-integration\sst_chatbot
```

Estado Git observado:

- `sst_chatbot` no tiene `.git` propio.
- El repo Git padre es `C:\Users\andre\Desktop\4uentes\apps\4uentes-sst`.
- `chatboot-integration/sst_chatbot/` aparece como untracked dentro del repo
  padre.

## Archivos Leidos

- `AGENTS.md`
- `specs/00-index.yaml`
- `specs/capabilities/provider-abstraction.yaml`
- `specs/capabilities/ards-structure-generation.yaml`
- `specs/capabilities/retrieval-augmented-generation.yaml`
- `specs/capabilities/retriever-strategies.yaml`
- `specs/capabilities/user-workspace-provisioning.yaml`
- `specs/capabilities/generated-workspace-governance.yaml`
- `specs/capabilities/agent-lifecycle-and-orchestrator-boundary.yaml`
- `specs/integrations/sst-agent-feed.yaml`
- `specs/pocs/agent-lifecycle-orchestrator-boundary-poc.yaml`
- `docs/architecture/agent-core-and-orchestrator-boundary.md`

## Busquedas Ejecutadas

En `sst_chatbot`:

- `rg --files | rg -i "capabil|ards|orchestr|orchestor|4uentes"`
- `rg -n -i "orchestr|orchestor|handoff|operation_intent|Fake|idempotency|correlation" src tests docs pocs specs`

En `4uentes-orchestor`:

- `rg -n -i "sst_chatbot|sst-chatbot|chatbot|agent-lifecycle-and-orchestrator-boundary|provider-abstraction|ards-structure-generation|retrieval-augmented-generation|retriever-strategies|user-workspace-provisioning|generated-workspace-governance" catalog solutions docs inventory evidence requests specs`

## Resultado

- `sst_chatbot` tiene ARDS/SDD local y capabilities propias.
- `4uentes-orchestor` no conocia esas capabilities antes de `CR-SST-0007`.
- La unica capability con handoff directo al orquestador es
  `agent-lifecycle-and-orchestrator-boundary`.
