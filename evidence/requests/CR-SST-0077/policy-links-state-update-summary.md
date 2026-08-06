# CR-SST-0077 Resumen De Actualizacion Del Estado De Policy Links

## Proposito

Registrar como `CR-SST-0077` cambio la vista del control-plane sobre la
adopcion de agent operating policies.

## Actualizaciones

- `agent-model-selection-policy` -> `linked`
- `agent-resource-degradation-policy` -> `linked`
- `agent-task-atomization-policy` -> `linked`
- `agent-delegation-policy` -> `linked`
- `agent-context-management-policy` -> `linked`
- `agent-architecture-boundary-policy` -> `linked`

## Significado

Estas seis policies ya no se rastrean como `pending-core-handoff` en el
orchestrator. El core ahora expone el registry canonico de policies y los child
repos de SST exponen los artefactos minimos de adopcion local requeridos por el
contrato de sync.

## Items Abiertos Restantes

- `human-doc-language` todavia necesita una decision separada de handoff al core.
- El rollout mas amplio fuera de la solucion SST sigue siendo trabajo futuro.
- Algunos comandos de validacion a nivel repo todavia fallan y se rastrean por separado en
  `evidence/requests/CR-SST-0077/validation-results.md`.
