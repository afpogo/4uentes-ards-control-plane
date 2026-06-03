# CR-SST-0011 - Resumen Del Contrato

Observado el: 2026-05-24

## Cambio

Se agrego el enlace `capability -> state` para que las capabilities de repos
hijos puedan vincularse con `feature_state` o `bugfix_state` del orchestrator.

## Artefactos

- `docs/requests/capability-state-linkage.md`
- `specs/states/capability-state-linkage.yaml`
- `state/capability-links.yaml`
- `scripts/verify-state-model.js`

## Regla Nueva

Si un trabajo empieza en un repo hijo sin pasar primero por el orchestrator, ese
repo debe dejar metadata `orchestrator_link` en ARDS/SDD local para que el
control-plane pueda reconciliar:

- `capability_id`
- `state_kind`
- `state_id`
- `status_hint`
- `request_id`
- `evidence_ref`
- `correlation_id`

## Limite V1

V1 no inspecciona automaticamente repos hijos. El contrato y el mapa local ya
existen; la adopcion en cada repo hijo debe hacerse con requests separados.

