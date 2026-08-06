# CR-SST-0119 - Closure Decision

## Estado

- Fecha: 2026-07-05
- Request: `CR-SST-0119`
- Jira: `SST-49`
- Decision: cerrar SST-49 y continuar con `CR-SST-0120` / `SST-50`.
- Jira mirror: `SST-49` transicionado a `Listo`.

## Resultado

El usuario confirmo QA manual positivo: el selector de modo de captura funciona
de forma fluida y cumple la intencion de SST-49.

SST-49 queda cerrado por alcance:

- `auto`: comportamiento visual-first con fallback textual.
- `visual-only`: evita fallback textual silencioso.
- `text-only`: genera PDF textual intencionalmente.
- `prefer-text`: usa camino textual en esta version.

## Decision Tecnica

Los riesgos detectados en revision de codigo son reales, pero no deben meterse
silenciosamente en SST-49 porque cambian el alcance hacia reliability,
privacidad, limites y lifecycle de extension.

Se reserva un follow-up separado:

- `CR-SST-0121`: `Harden sst-extension session capture reliability, privacy, and limits`.

`CR-SST-0120` / `SST-50` permanece separado y enfocado en preview image contract
para articulos derivados de sesion.

## Evidencia

- `evidence/requests/CR-SST-0119/implementation-summary.md`
- `evidence/requests/CR-SST-0119/validation-results.md`
- `evidence/requests/CR-SST-0119/owner-documentation-enforcement.md`
- `evidence/requests/CR-SST-0119/code-review-risk-assessment.md`
- `requests/planned/CR-SST-0121-sst-extension-session-capture-hardening.yaml`
- `evidence/requests/CR-SST-0119/jira-sst-49-close-transition-summary.md`

## Boundary

- No se ejecuta implementacion de hardening en este cierre.
- No se cambia `node-auth`, `sst-fend` ni `sst-bend`.
- No se registran contenidos privados, raw PDFs, screenshots, cookies, JWTs ni secretos.
