# CR-HPT-0012 — resultados de validación

Fecha: 2026-08-22

## Preflight del control plane

`npm run check` pasó antes de mutar el owner:

- catálogo: 5 OK, 0 FAIL;
- bindings: 41 OK, 4 WARN preexistentes por URLs remotas, 0 FAIL;
- state: 56 OK, 0 FAIL;
- iniciativas: 22 OK, 0 FAIL;
- owner documentation: 113 OK, 0 FAIL;
- documentación visual: 10 mapas, 0 FAIL.

`git diff --check` también pasó.

## Owner y runtime

- Python observado: `3.13.13`.
- FastAPI resuelto: `0.141.1`.
- Uvicorn resuelto: `0.52.4`.
- Pytest resuelto: `9.1.1`.
- Cliente de tests: `httpx2 2.12.0`, alineado con Starlette `1.6.0`.
- `.venv\\Scripts\\python.exe -m pytest`: 3 passed, sin warnings.
- `node scripts\\check-contracts.js`: PASS.
- `python qa\\http\\smoke.py --base-url http://127.0.0.1:8766`: PASS.

El harness vivo verificó HTTP 200 y payloads para health/readiness, además de
OpenAPI con los únicos paths ejecutables `/health` y `/ready`.

## QA Chrome DevTools

PASS parcial. Ver `manual-qa-partial.md`. La única observación fue el favicon
404 solicitado automáticamente al abrir JSON directo; no afecta el contrato.

## Cierre local

- commit owner: `055d9c9`;
- gate final del control plane: PASS, incluidos 113 checks de owner docs;
- `git diff --check`: PASS en ambos repositorios;
- proceso temporal Uvicorn detenido luego del QA;
- commit del control plane: registrado en el historial local que contiene esta evidencia.
