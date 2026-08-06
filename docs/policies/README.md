# Policies

## Proposito

Esta carpeta contiene lectura humana para las policies operativas vivas del
ARDS/SDD adoptadas o documentadas por el control-plane.

El registry machine-readable esta en:

- `specs/integration/policies.yaml`

## Fuente Canonica

- `4uentes-ards-core` es la fuente canonica para las shared policies del stack
  ARDS/SDD.
- `4uentes-orchestor` consume ese canon, registra adopcion local y no redefine
  el texto normativo del core.

## Adopcion Local Del Orchestrator

- Las policies documentadas localmente en esta carpeta describen como opera el
  control-plane.
- La policy core-owned `http-qa-harness-policy` queda adoptada localmente y se
  rastrea desde `specs/integration/policies.yaml`, `AGENTS.md` y
  `state/policy-links.yaml`.
- `control-plane-link-policy` queda tratada como policy core-owned y
  profile-scoped: es requerida para el perfil `control-plane`, pero no se
  vuelve obligatoria global para todos los repos hijos.
- El bloque canonico reusable es `control_plane_link`. El control-plane actual
  mantiene `orchestrator_link` como alias local documentado y reconciliable.
- Las human docs de policies core-owned se consumen mediante
  `standard_source_ref` y el binding a `4uentes-ards-core`; no se copian al
  orchestrator. Esta carpeta conserva solamente documentos locales cuando el
  control-plane es origin repo o necesita una lectura de adopcion propia.

## Policies

- [human-doc-language-policy.md](human-doc-language-policy.md)
- [agent-model-selection-policy.md](agent-model-selection-policy.md)
- [agent-resource-degradation-policy.md](agent-resource-degradation-policy.md)
- [agent-task-atomization-policy.md](agent-task-atomization-policy.md)
- [agent-delegation-policy.md](agent-delegation-policy.md)
- [agent-context-management-policy.md](agent-context-management-policy.md)
- [agent-architecture-boundary-policy.md](agent-architecture-boundary-policy.md)
- [owner-documentation-authority-policy.md](owner-documentation-authority-policy.md)
- [work-tracker-control-plane-authority-policy.md](work-tracker-control-plane-authority-policy.md)

## Propagacion A Repos Hijos

- El rollout historico SST quedo cerrado en
  `requests/done/CR-SST-0077-sst-policy-adoption-sync-rollout.yaml`.
- Toda CR que permita o realice mutacion de repo hijo debe cerrar con
  `npm.cmd run check` del control-plane. Ese check ejecuta
  `scripts/verify-owner-documentation.js` y no puede reemplazarse por
  validaciones exclusivas del repo hijo.
- La propagacion futura fuera de ese rollout sigue siendo request-driven.
- Cada adopcion en child repos debe publicar `policy_adoption_manifest` o
  `policy_exception_manifest`, segun corresponda, dentro de un lifecycle
  aprobado antes de modificar el repo hijo.
- Para `control-plane-link-policy`, un repo hijo solo queda obligado cuando su
  profile, request aprobado o manifest local adopta la policy; en caso
  contrario debe quedar como no aplicable o pendiente de rollout, no como
  incumplimiento global.
- Las plantillas reutilizables viven en
  `templates/policy-adoption-manifest.template.yaml` y
  `templates/policy-exception-manifest.template.yaml`.

Estas policies complementan ARDS/SDD, AGENTS.md, specs, docs, playbooks,
requests y evidence. No reemplazan contratos funcionales ni ownership cross-repo.
