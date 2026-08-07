# Proyecto Control-Plane

## Alcance

Contenedor para gobierno local de `4uentes-orchestor`.

Incluye:

- lifecycle de requests
- state read-model
- iniciativas
- validators
- politicas locales
- Jira mirror
- evidence y reglas de owner documentation

## Docs Canonicos

- Overview: [../../00-overview.md](../../00-overview.md)
- Information architecture: [../../documentation-information-architecture.md](../../documentation-information-architecture.md)
- Request execution model: [../../requests/execution-model.md](../../requests/execution-model.md)
- Initiative model: [../../requests/initiative-model.md](../../requests/initiative-model.md)
- Capability state linkage: [../../requests/capability-state-linkage.md](../../requests/capability-state-linkage.md)
- Orchestrator boundary: [../../cross-repo/orchestrator-boundary.md](../../cross-repo/orchestrator-boundary.md)
- Child repo onboarding: [../../cross-repo/child-repo-onboarding.md](../../cross-repo/child-repo-onboarding.md)
- Release allowlists: [../../cross-repo/release-allowlists.md](../../cross-repo/release-allowlists.md)

## Politicas

- [policies README](../../policies/README.md)
- [owner documentation authority](../../policies/owner-documentation-authority-policy.md)
- [agent architecture boundary](../../policies/agent-architecture-boundary-policy.md)
- [human documentation language](../../policies/human-doc-language-policy.md)

## Regla De Idioma

La policy [human-doc-language](../../policies/human-doc-language-policy.md)
aplica a Markdown humano del control-plane: prosa en espanol, sin traducir IDs,
comandos, rutas, YAML keys ni nombres tecnicos estables.

## Iniciativa

- [INIT-CP-0001](../../../initiatives/INIT-CP-0001-control-plane-lifecycle-enforcement.yaml)

## Limite Operativo

Este contenedor documenta gobierno y orquestacion. No debe convertirse en
documentacion owner de comportamiento runtime de repos hijos.
