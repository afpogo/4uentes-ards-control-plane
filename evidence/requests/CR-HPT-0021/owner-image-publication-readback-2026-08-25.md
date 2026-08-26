# Publicacion Y Readback De La Imagen Owner De CR-HPT-0021

Fecha: 2026-08-25.

## Owner Phinance

- Base canonica: `finanzas-personales origin/main@c81e11467de0901b90a88a41e1759fbc034b9ca7`.
- Worktree aislado: `worktrees/CR-HPT-0021-phinance-owner`.
- Commit owner: `bba9f944f22f2c0d33096638687c022aca8e1dac`.
- Pull request: `mena28/finanzas-personales#4`.
- Merge owner: `c4b66e06c749297f268e60ac986613bebd8750ef`.
- El contrato owner se releyo desde `origin/main` despues del merge.

## Validacion Local

- `node backend/scripts/check-contracts.js`: aprobado.
- Pytest aislado: `36 passed`, `4 skipped`; los cuatro skips requieren el
  PostgreSQL de QA explicitamente configurado.
- `docker build -f backend/Dockerfile -t phinance-api:cr-hpt-0021 backend`:
  aprobado.
- Usuario efectivo del contenedor: UID `10001`.
- `GET /health`: `200`, servicio `finanzas-personales-backend`, version `0.1.0`.
- `GET /ready` sin database/JWKS: `503` esperado.
- El contenedor temporal de smoke fue detenido al finalizar.

## Publicacion Inmutable

- Workflow de pull request `32919171214`: aprobado; construyo sin publicar.
- Workflow de `main` `32919255930`: aprobado y publico la imagen.
- Imagen: `ghcr.io/mena28/phinance-api:develop-c4b66e06c749297f268e60ac986613bebd8750ef`.
- Digest observado en el log del workflow:
  `sha256:b5c5233485871edd048937eefe932c90c7a775cc6cdedb110440d263c957b613`.

El paquete es privado. La consulta anonima devolvio `401` y el token local no
tiene scope `read:packages`; por eso el digest se obtuvo del log autenticado del
workflow exitoso. Esto confirma que infraestructura necesitara un pull secret
existente o aprobado antes de la activacion.

## Limites

- No se modificaron `sst-bend`, `4uentes-auth`, `sst-fend` ni infraestructura.
- No se accedio a valores de Secret ni a datos financieros.
- No se creo Ingress, workload o base de datos live.
- La activacion continua bloqueada hasta que el owner de infraestructura
  publique y valide la topologia privada y pase el preflight de runtime.
