# Revision De Adopcion Del Canon Core

## Scope

CR-CP-0005 revisa solamente la adopcion local de recursos promovidos por
CR-CP-0001 a CR-CP-0004. No modifica `4uentes-ards-core` ni repos hijos.

## Canon Observado

El binding local resuelve `4uentes-ards-core` al repo configurado y el HEAD
observado por lectura directa es `f07ca6a`, igual al `core_ref` registrado.

| Recurso | Canon core observado | Adopcion local | Resultado |
| --- | --- | --- | --- |
| Policies comunes | `specs/integration/policies.yaml` y `docs/policies/` | Registry local y `state/policy-links.yaml` | Adoptado por referencia |
| `control-plane-link-policy` | Policy y template core | Registry/state link con alias `orchestrator_link` | Adoptado; rollout child sigue request-driven |
| `feature-bugfix-state-model` | Spec y templates core | `state-read-model-adoption.yaml` | Adoptado; se agrego binding canonico al spec local |
| `initiative-model` | Spec y templates core | `initiative-adoption.yaml` | Adoptado; se corrigio estado local de draft a active |

## Cambios Locales

- Se actualizo la evidencia de validacion del contract binding sin cambiar el
  ref canonico `f07ca6a`.
- `specs/00-index.yaml` declara Initiatives como `active-core-adopted`.
- El modelo local de Initiative queda `active` y conserva ownership de IDs,
  requests, evidencia y mirrors Jira.
- El state model local declara source of truth, CR de promocion, core ref y
  manifest de adopcion.
- El indice humano aclara que las policies core-owned se consumen por referencia
  y no se duplican como documentos locales.

## Gaps Conservados

- Las diferencias de metadata de clasificacion del registry core requieren un
  lifecycle separado con ownership de core; no se reescriben desde CR-CP-0005.
- `work-tracker-control-plane-authority-policy` sigue siendo origin-repo-policy
  local y su promocion a core requiere un CR independiente.
- Todo rollout a child repos permanece request-driven.

