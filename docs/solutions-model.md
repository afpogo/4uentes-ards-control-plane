# Solutions Model

## Logical solution

A solution is a logical grouping of services that together deliver a product or
operational capability.

Solutions are modeled in `solutions/*.yaml` and reference service IDs from
`catalog/services/*.yaml`.

## Service groups

Solutions may group services by role:

- `core`
- `shared`
- `optional`
- `infrastructure`

These groups are logical and do not imply folder layout or deployment topology.

## Shared services

Shared services, such as `4uentes-auth`, can be referenced by more than one
solution. The catalog should mark them as shared and preserve their canonical
identity.

Legacy aliases like `node-auth` may be recorded as aliases, but they must not be
used as service IDs.

## Solution repos

Fase 1B does not create `sst-solution` or `fulbito-solution`.

SST and Fulbito are modeled as logical solutions first. A dedicated solution repo
should be created only after a later explicit decision.
