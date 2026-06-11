# Validation Results

## Estado

- Fecha: 2026-06-08
- Request: CR-SST-0060
- Comando: `npm.cmd run check`
- Resultado: `PASS_WITH_KNOWN_WARNINGS`

## Resumen

- Catalog validation: pass.
- Local bindings validation: pass with known remote observation warnings.
- State model validation: pass with known bugfix state warnings.

## Warnings Observados

- Remotes de repos funcionales no observables desde este entorno.
- `state/bugfixes/login-504-proxy-timeout.current.yaml` no tiene
  `request_ids` ni `evidence_refs`.
- `state/bugfixes/sst-bend-emfile-watchers.current.yaml` no tiene
  `request_ids` ni `evidence_refs`.

## Decision

Los warnings no fueron introducidos por `CR-SST-0060` y no bloquean el intake
planificado de `sst-tags-governance`.
