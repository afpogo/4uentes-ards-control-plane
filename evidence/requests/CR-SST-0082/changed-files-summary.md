# CR-SST-0082 - Resumen de archivos cambiados

## sst-chatbot

- `docs/ai/policy.md`: agrega el entrypoint agent-facing faltante para policy,
  boundary de handoff y validacion local.

## 4uentes-orchestor

- `requests/inbox/CR-SST-0082-sst-chatbot-core-orchestrator-sync-reconciliation.yaml`
- `requests/planned/CR-SST-0082-sst-chatbot-core-orchestrator-sync-reconciliation.yaml`
- `catalog/services/sst-chatbot.yaml`
- `docs/apps/sst-chatbot.md`
- `docs/cross-repo/sst-chatbot-orchestrator-handoff.md`
- `state/features/sst-chatbot.current.yaml`
- `evidence/requests/CR-SST-0082/intake-and-reconciliation-notes.md`
- `evidence/requests/CR-SST-0082/sst-chatbot-child-sync-diff.yaml`
- `evidence/requests/CR-SST-0082/validation-results.md`
- `evidence/requests/CR-SST-0082/changed-files-summary.md`
- `requests/done/CR-SST-0082-sst-chatbot-core-orchestrator-sync-reconciliation.yaml`

## Fuera De Alcance

- No se eligio transporte runtime real para el handoff.
- No se promovio
  `specs/capabilities/inbound/4uentes-orchestor--sst-chatbot-agent-handoff.yaml`
  fuera de `draft`.
- No se normalizaron cambios preexistentes del working tree en ninguno de los
  dos repos.

