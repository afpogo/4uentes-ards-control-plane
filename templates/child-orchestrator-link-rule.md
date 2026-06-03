# Orchestrator Link Rule

Este repo esta gobernado por `4uentes-orchestor`.

Cuando una `feature`, `bugfix` o `capability` se implemente, cambie o valide
desde este repo sin haber nacido primero en el orchestrator, el artefacto
ARDS/SDD local debe incluir:

```yaml
orchestrator_link:
  orchestrator_repo: "4uentes-orchestor"
  state_kind: "feature_state"
  state_id: "TODO"
  capability_id: "TODO"
  work_origin: "child-repo"
  request_id: "TODO"
  evidence_ref: "TODO"
  status_hint: "implemented-local"
  correlation_id: "TODO"
```

Valores permitidos para `state_kind`:

- `feature_state`
- `bugfix_state`

Valores permitidos para `work_origin`:

- `child-repo`
- `orchestrator-request`
- `imported-evidence`
- `manual-reconciliation`

`status_hint` debe usar un estado canonico del orchestrator. El repo hijo solo
propone el estado; `4uentes-orchestor` lo reconcilia contra requests,
evidencia y validacion.

