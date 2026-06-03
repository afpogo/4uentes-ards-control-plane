# CR-SST-0021 - Baseline

Observado el: 2026-05-31

## Control Plane

`4uentes-orchestor` ya tenia un working tree dirty antes de este request. Esta
implementacion agrega nuevos artefactos de request/evidencia y no debe revertir
cambios existentes.

## Repo Hijo

`sst-chatbot` ya tenia un working tree dirty antes de la implementacion:

- `docs/00-overview.md`
- `docs/playbooks/05-author-and-validate-prompts.md`
- `specs/capabilities/prompt-catalog-and-versioning.yaml`

Esos cambios preexistentes estan fuera del scope de esta implementacion y no
deben revertirse.

## Boundary

`sst-chatbot` puede implementar la primera capability runtime.
`4uentes-orchestor` conserva el gobierno del request lifecycle.
`4uentes-ards-core` sigue siendo la fuente de estandar y no se modifica en este
request.
