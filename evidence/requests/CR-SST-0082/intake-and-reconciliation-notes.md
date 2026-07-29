# CR-SST-0082 - Notas de intake y reconciliacion

## Contexto

`CR-SST-0082` se abrio el 2026-06-21 para reconciliar `sst-chatbot` con la
vista del control-plane.

El repo hijo ya tenia cambios ARDS/SDD previos antes de abrir este lifecycle.
Esta desviacion de orden queda registrada explicitamente: el request no fue el
origen de todos los cambios observados en el hijo, sino el cierre de
reconciliacion para que el control-plane tenga evidencia propia y vigente.

## Divergencia observada

- `requests/done/CR-SST-0077-sst-policy-adoption-sync-rollout.yaml` reportaba
  `sst-chatbot` como `synced`.
- `evidence/requests/CR-SST-0077/sst-chatbot-child-sync-diff.yaml` todavia
  reportaba `sync_status: needs-child-update`.
- El faltante concreto era `docs/ai/policy.md`.

## Decision de alcance

- Se agrega solo `sst-chatbot/docs/ai/policy.md` en el repo hijo.
- Se actualiza el catalogo y la documentacion del control-plane para marcar
  `docs_ai_policy: true` y `orchestrator_link_contract.status: adopted`.
- La capability inbound de `sst-chatbot` permanece en `draft`.
- El transporte runtime real no se selecciona en este request.

## Clasificacion operativa

- `task_weight`: `complex-high-risk-task`
- Driver principal: reconciliacion retroactiva de lifecycle cross-repo.
- Modelo/perfil esperado: alias de mayor razonamiento disponible.
- Subagentes: no disponibles en este runtime; la revision se ejecuto
  secuencialmente por el agente principal.

