# ARDS-4 / CR-CP-0003

Inicio CR-CP-0003 para promover `feature_state` y `bugfix_state` como
state read-model reusable del core.

Decision de clasificacion:

- no se crea una policy nueva;
- `feature-bugfix-state-model` queda como living resource core-owned;
- `4uentes-orchestor` queda como origin repo y adopta localmente el recurso;
- `4uentes-ards-core` queda como canonical owner del canon reusable;
- adopcion requerida para perfil `control-plane`;
- adopcion opt-in/request-driven para repos hijos u otros perfiles;
- no hubo mutacion de repos hijos.

Evidencia local:

- `evidence/requests/CR-CP-0003/state-model-core-mapping.md`
- `evidence/requests/CR-CP-0003/validator-boundary-decision.md`
- `evidence/requests/CR-CP-0003/validation-results.md`
