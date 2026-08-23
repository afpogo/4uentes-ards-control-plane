# CR-HPT-0002 — resultados de validación

Fecha: 2026-08-22

## Preflight

Antes de mutar el owner, `npm run check` pasó con 0 fallas. Los cuatro warnings
de bindings por diferencias de remote son preexistentes.

## Owner

- `.venv\\Scripts\\python.exe -m pytest`: 3 passed.
- `node scripts\\check-contracts.js`: PASS, incluidos `.http`, request/state
  link y manifests.
- smoke contra Uvicorn local: PASS para health, readiness y OpenAPI.
- `git diff --check`: PASS.
- commit: `1e98966`.

El proceso temporal de Uvicorn se detuvo después del smoke. La lluvia de ideas
histórica modificada por el usuario quedó fuera del staging y del commit.

## Control plane

- `npm run check`: PASS.
  - catálogo: 5 OK, 0 FAIL;
  - bindings: 41 OK, 4 WARN preexistentes, 0 FAIL;
  - state: 56 OK, 0 FAIL;
  - iniciativas: 22 OK, 0 FAIL;
  - owner documentation: 115 OK, 0 FAIL;
  - documentación visual: 10 mapas, 0 FAIL.
- `git diff --check`: PASS.

El primer intento del gate detectó que el catálogo local todavía exige el
alias `orchestrator_link`. Se corrigió documentando la convivencia: el catálogo
conserva el alias por compatibilidad y el owner adopta la clave canónica
`control_plane_link`, con mapping explícito entre ambas.
