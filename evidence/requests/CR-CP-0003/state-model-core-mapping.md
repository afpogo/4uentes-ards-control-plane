# CR-CP-0003 - State Model Core Mapping

## Decision

`feature-bugfix-state-model` is promoted as a core living resource, not as a
new policy.

## Core Canon

- Spec: `specs/states/feature-bugfix-state-model.yaml`
- Adoption template: `templates/specs/states/state-read-model-adoption.template.yaml`
- Feature template: `templates/specs/states/feature-state.template.yaml`
- Bugfix template: `templates/specs/states/bugfix-state.template.yaml`
- State machine template: `templates/specs/states/state-machine.template.yaml`
- States index template: `templates/specs/states/00-index.template.yaml`

## Local Adoption

- Adoption manifest: `specs/states/state-read-model-adoption.yaml`
- Local index: `specs/states/00-index.yaml`
- Local state machine: `state/state-machine.yaml`
- Local feature states: `state/features/*.current.yaml`
- Local bugfix states: `state/bugfixes/*.current.yaml`
- Local capability links: `state/capability-links.yaml`

## Applicability

The resource is required for `control-plane` repos that own cross-repo request
lifecycle, state read models, capability-state links, or validation evidence.
For child repos and other profiles, adoption is opt-in and request-driven.

No child repositories were mutated by this CR.
