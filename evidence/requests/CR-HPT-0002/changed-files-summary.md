# CR-HPT-0002 — resumen de cambios

## Owner `finanzas-personales/backend`

- `specs/integration/control-plane-link.yaml`: correlación canónica entre
  capability, state, request y evidencia.
- `specs/policies/control-plane-link-adoption.yaml`: adopción request-driven de
  la policy core-owned.
- `qa/http/phinance-api.http`: harness manual versionado requerido por el
  perfil `backend-api`.
- `qa/http/smoke.py`: se conserva como automatización complementaria.
- binding, source map, índices, policies, AGENTS y docs reconciliados.
- checker contractual ampliado para impedir drift en links y harnesses.

Commit owner: `1e98966`.

## Control plane

- catálogo actualizado con runtime y validación observables;
- state de onboarding promovido a `implemented-local`;
- Initiative reconciliada con CR-HPT-0002/0003 finalizados;
- lifecycle y evidencia de CR-HPT-0002 completados.

El archivo histórico de lluvia de ideas que ya estaba modificado permanece
fuera del commit y sin alteraciones de este CR.
