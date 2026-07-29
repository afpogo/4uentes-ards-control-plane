# CR-CP-0002 - Correccion De Alcance SST-2

## Motivo

Durante la revision posterior al cierre de `ARDS-3` se detecto que la evidencia
de policy application quedo concentrada en `INIT-SST-0003 / SST-29`
(`sst-extension`) y no reflejo de forma explicita `INIT-SST-0002 / SST-25-SST-26`
(`Dictionary Management`).

## Correccion

Se agrego evidencia dedicada para `INIT-SST-0002`:

- `evidence/initiatives/INIT-SST-0002/policy-application.md`

Y se referencio desde:

- `initiatives/INIT-SST-0002-dictionary-management.yaml`

## Policies Incluidas Para SST-2

- Policies operativas agenticas comunes:
  `agent-model-selection-policy`, `agent-resource-degradation-policy`,
  `agent-task-atomization-policy`, `agent-delegation-policy`,
  `agent-context-management-policy`, `agent-architecture-boundary-policy`,
  `human-doc-language` y `owner-documentation-authority-policy`.
- `http-qa-harness-policy` cuando un CR de Dictionary valida o toca superficies
  HTTP owned por `sst-bend`, `4uentes-auth` o consumers BFF/frontend.
- Reglas de dominio Dictionary:
  `dictionary-secret-safe-policy`,
  `dictionary-secret-extreme-custody-exclusion`,
  `dictionary-tags-compatibility-policy`,
  `dictionary-evidence-redaction-policy` y
  `dictionary-owner-documentation-policy`.

## Limite

No se mutaron repos hijos. La correccion es de evidencia y modelado local del
control-plane.
