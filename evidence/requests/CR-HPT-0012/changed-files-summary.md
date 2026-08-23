# CR-HPT-0012 — resumen de cambios

## Owner `finanzas-personales/backend`

- `pyproject.toml`: baseline instalable Python 3.13/FastAPI y dependencias de test.
- `src/phinance_api/`: composición FastAPI y endpoints operativos.
- `tests/`: tests de liveness, readiness y límite OpenAPI.
- `qa/http/smoke.py`: harness HTTP vivo reproducible.
- `specs/policies/http-qa-harness-adoption.yaml`: adopción explícita de la policy core-owned.
- specs y Markdown del owner: runtime ejecutable, comandos y límites actualizados.
- `scripts/check-contracts.js`: gate entre runtime, contrato y adopción de policy.

## Control plane

- lifecycle completo de CR-HPT-0012 antes de la mutación hija.
- promoción de CR-HPT-0012 a request conocido en INIT-HPT-0002.
- evidencia de autorización, QA, archivos y validación.

No se modificaron repositorios SST ni se agregaron base de datos, migraciones,
auth, endpoints financieros, OCR o infraestructura.
