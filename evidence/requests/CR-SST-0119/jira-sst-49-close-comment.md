CR-SST-0119 / SST-49 - cierre de alcance

Resultado:

- QA manual del usuario confirmado: el selector de modo de captura funciona de forma fluida.
- SST-49 cumple su objetivo: agregar modo configurable en `sst-extension`.
- Modos cubiertos: `auto`, `visual-only`, `text-only`, `prefer-text`.
- Owner docs actualizadas y enforcement ejecutado.

Validacion:

- `sst-extension pnpm.cmd check`: PASS.
- `4uentes-orchestor npm.cmd run check`: PASS.
- Owner documentation gate valido para `CR-SST-0119`.

Decision tecnica:

- Los riesgos detectados en revision no se incorporan silenciosamente a SST-49.
- Se reserva follow-up separado `CR-SST-0121` para hardening de reliability/privacy/limits.
- `CR-SST-0120` / `SST-50` sigue separado y enfocado en preview image contract.

Evidencia:

- `evidence/requests/CR-SST-0119/closure-decision.md`
- `evidence/requests/CR-SST-0119/code-review-risk-assessment.md`
- `requests/planned/CR-SST-0121-sst-extension-session-capture-hardening.yaml`

Boundary:

- Jira es mirror operativo; ARDS/SDD permanece como fuente de verdad.
- No se incluye contenido privado, raw PDFs, screenshots sensibles, cookies, JWTs ni secretos.

