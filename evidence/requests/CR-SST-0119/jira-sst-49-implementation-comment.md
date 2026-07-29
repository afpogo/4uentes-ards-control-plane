CR-SST-0119 / SST-49 - avance de implementacion

Resultado local:

- Implementado modo configurable de captura de sesion en `sst-extension`.
- Modos cubiertos: `auto`, `visual-only`, `text-only`, `prefer-text`.
- `auto` conserva visual-first con fallback textual.
- `visual-only` no genera PDF textual silencioso cuando falla la captura visual; deja outcome/warnings sanitizados.
- `text-only` y `prefer-text` usan camino textual intencional.
- La preferencia queda en storage local de extension y no cambia el payload de `POST /api/extension/sessions`.

Owner docs / ARDS-SDD:

- `sst-extension/specs/features/sessions.yaml`
- `sst-extension/docs/00-overview.md`
- `sst-extension/docs/qa/session-capture-validation.md`
- Evidencia control-plane:
  - `evidence/requests/CR-SST-0119/implementation-summary.md`
  - `evidence/requests/CR-SST-0119/validation-results.md`
  - `evidence/requests/CR-SST-0119/owner-documentation-enforcement.md`

Validacion:

- `sst-extension pnpm.cmd vitest run ...`: PASS, 24 tests.
- `sst-extension pnpm.cmd check`: PASS, 104 tests + build WXT.
- `4uentes-orchestor npm.cmd run check`: PASS, owner documentation gate valido para CR-SST-0119.

Pendiente antes de cierre Jira:

- QA manual en Chrome de selector y comportamiento runtime de los cuatro modos.
- Confirmar si se transiciona SST-49 a estado de revision/cierre despues del QA manual.

Boundary:

- No hubo cambios en `node-auth`, `sst-fend` ni `sst-bend`.
- `CR-SST-0120` / `SST-50` mantiene el contrato de preview image.
- No se registro contenido privado, raw PDFs, screenshots sensibles, cookies, JWTs ni secretos en Jira/evidencia.

