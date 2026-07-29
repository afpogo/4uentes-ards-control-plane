# CR-SST-0119 - Owner Documentation Enforcement

## Politica Aplicada

- `owner-documentation-authority-policy`
- `agent-architecture-boundary-policy`
- `agent-task-atomization-policy`
- `human-doc-language`

## Decision

El cambio muta `sst-extension`, por lo que la documentacion owner del repo hijo
debia actualizarse antes del cierre local.

## Documentos Owner Actualizados

- `specs/features/sessions.yaml`
  - Define modos `auto`, `visual-only`, `text-only`, `prefer-text`.
  - Define outcomes `text-pdf` y `visual-capture-failed`.
  - Declara que la preferencia local no cambia el payload BFF.
- `docs/00-overview.md`
  - Resume el modo configurable de captura de sesiones.
- `docs/qa/session-capture-validation.md`
  - Agrega alcance CR-SST-0119 y casos minimos de QA.

## Enforcement

- `sst-extension pnpm.cmd check`: PASS.
- Control-plane `npm.cmd run check`: PASS.
- Owner documentation validator: PASS para `CR-SST-0119`.
