# 4uentes-ards-core

## Catalog Role

`4uentes-ards-core` is the source of standard for ARDS/SDD kinds, profiles,
schemas, capability templates, and handoff rules.

It is not modeled as an SST service. The control plane consumes it through local
binding evidence and references it as the standard source.

The control plane tracks it as:

- binding id: `4uentes-ards-core`
- repo role: `ards-standard-source`
- ARDS role: standard/governance
- status: observed local source

## Source Refs

- Local binding: `environments/local/bindings.local.yaml`
- Local binding template: `environments/local/bindings.local.example.yaml`
- Git evidence: `inventory/evidence/git/4uentes-ards-core.md`
- Standard ref: `standard/ARDS_KIND_MODEL_v1.md`

## Control Plane Boundary

`4uentes-orchestor` consumes this repo as a standard. It must not redefine ARDS
kinds or profiles locally when the standard already owns them.

Do not modify `4uentes-ards-core` from this repo workflow.
