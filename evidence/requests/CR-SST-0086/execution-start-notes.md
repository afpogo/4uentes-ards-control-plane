# Notas De Inicio

## Contexto Revisado

- `AGENTS.md` del control-plane.
- `specs/integration/policies.yaml`.
- Policies locales en `docs/policies/`.
- `requests/done/CR-SST-0084-dictionary-secret-documentation-management.yaml`.
- `state/features/dictionary-secret-management.current.yaml`.

## Estado Inicial

`dictionary-secret-management` esta en `validated-local` y mantiene gaps abiertos
de master key runtime, smoke autenticado, integracion diferida de
`sst-extension`, materiales recovery no soportados y hardening DOM/a11y del
panel frontend.

## Decisiones Operativas

- El request nuevo queda creado antes de cualquier mutacion en repos hijos.
- `sst-extension` sigue fuera del cierre v1.
- `seed_phrase`, `mnemonic`, `recovery_phrase` y equivalentes siguen no
  soportados.
- Jira/MCP debe comenzar read-only y registrar blocker si el acceso sigue en
  `403`.
