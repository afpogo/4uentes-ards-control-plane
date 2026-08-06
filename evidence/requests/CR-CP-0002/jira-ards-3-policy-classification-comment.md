# ARDS-3 avance de clasificacion de policies

Se ajusto el modelo local del control-plane para tratar policies como recursos
vivos con clasificacion explicita.

Resumen:

- `control-plane-link-policy` queda como `core-profile-scoped`, no como policy
  general para todos los repos.
- El canon reusable es `control_plane_link`.
- `orchestrator_link` queda como alias local del control-plane actual.
- Child repo rollout queda request-driven mediante `policy_adoption_manifest` o
  `policy_exception_manifest`.
- No se mutaron repos hijos.

Validacion:

- `4uentes-orchestor`: `npm.cmd run check` paso con `0 WARN / 0 FAIL`.
- `4uentes-ards-core`: `npm.cmd run check` paso con `0 errors / 0 warnings`.

Evidencia local:

- `specs/integration/policies.yaml`
- `state/policy-links.yaml`
- `templates/policy-adoption-manifest.template.yaml`
- `templates/policy-exception-manifest.template.yaml`
- `evidence/requests/CR-CP-0002/core-reconciliation-link-policy-summary.md`
- `evidence/requests/CR-CP-0002/template-alias-decision.md`
- `evidence/requests/CR-CP-0002/validation-results.md`
