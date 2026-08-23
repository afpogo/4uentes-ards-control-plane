# CR-HPT-0013 — resultados de validación owner observados

Fecha: 2026-08-22

El material recuperado reporta que el contrato owner `PrincipalContext v1`
quedó implementado localmente sin modificar runtime, dependencias, migraciones
ni infraestructura.

- Commit owner local: `ef4f8d0` (`docs(phinance): publish trusted principal context v1`).
- Rutas owner observadas: `backend/specs/api/sst-integration.yaml`,
  `backend/specs/api/00-index.yaml`, `backend/docs/architecture/README.md`,
  `backend/docs/api/README.md` y `backend/scripts/check-contracts.js`.
- Validación histórica registrada en el branch fuente:
  `node backend/scripts/check-contracts.js` OK;
  `backend/.venv/Scripts/python.exe -m pytest` con 10 passed y 2 skipped;
  `git diff --check` OK.

El contrato separa `phinance.trusted_sst_principal.v1` del
`PrincipalContext` local. `finance_profile_id` permanece bajo autoridad
exclusiva de Phinance.

Esta evidencia no afirma publicación remota: el commit está alcanzable desde
la branch local `feat/HPT-4/sst-boundary-account-scope`, mientras que el
readback remoto falló por falta de acceso SSH. El lifecycle permanece
`running` hasta verificar una ref remota autoritativa.
