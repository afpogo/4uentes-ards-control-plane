# CR-SST-0020 - Validation Y Release Gates

Observado el: 2026-05-31

## Estado De Validacion Del Orquestador

`npm run check` del orquestador fue reportado como PASS por el track de
validacion, con `0 FAIL` y warnings existentes fuera de esta request. Esta
fase no ejecuto checks de repos hijos ni modifico repos funcionales.

## Smoke Local Minimo

Antes de abrir exposicion publica:

| Check | URL / Accion | Esperado |
|---|---|---|
| UI | `GET http://localhost:8088/` | `200 text/html` |
| JWKS | `GET http://localhost:8088/.well-known/jwks.json` | `200 application/json` |
| Auth protected route | `GET http://localhost:8088/api/auth/extension/session` sin bearer | `401` controlado, no `404` |
| Login | `POST /api/auth/login` | access token y cookies sin registrar secretos |
| Refresh | `POST /api/auth/refresh` con cookies + `x-csrf-token` | nuevo access token/cookies |
| Logout | `POST /api/auth/logout` con cookies + `x-csrf-token` | revocacion y limpieza de cookies |
| Ruta funcional minima | ruta SST protegida via `/api` | respuesta esperada con bearer valido |

## Smoke Publico Ngrok

Repetir la matriz local bajo `https://<reserved-ngrok-domain>` y registrar:

- status HTTP;
- content type;
- headers relevantes sin secretos;
- si OAuth de `ngrok` permitio acceso;
- que `Authorization: Bearer` llega a la app cuando corresponde;
- flags de cookies (`Secure`, `SameSite`, `Path`, `HttpOnly` donde aplique);
- que `sst-bend` no queda publicado como host publico directo.

## Release Gates

No avanzar a implementacion hasta cerrar estos gates:

- decision humana registrada para fase de ejecucion;
- request aprobado antes de modificar `sst-4uentes-infra` o repos app;
- dominio reservado de `ngrok` confirmado fuera de Git;
- OAuth de edge configurado fuera de Git;
- estrategia `Host` decidida:
  - temporal: rewrite a `localhost`;
  - durable: host publico agregado a Ingress;
- cookies seguras para HTTPS publico;
- modelo CORS explicitado si aparece cross-origin;
- imagenes promovidas por tag/digest inmutable;
- rollback documentado;
- `npm run check` del orquestador con `0 FAIL`;
- checks de repos afectados o fallback manual documentado.

## Rollback Requerido Para La Siguiente Fase

La fase de implementacion debe documentar y probar al menos como dry-run:

- revert del commit GitOps de `sst-4uentes-infra`;
- restauracion de tag/digest anterior;
- desactivacion del endpoint/tunnel de `ngrok`;
- revert de host publico en Ingress;
- revert de callbacks/origins si se cambian;
- rotacion de secretos si algun valor sensible quedo expuesto;
- verificacion de que `http://localhost:8088/` sigue funcionando.

## Recomendacion De Cierre De Analisis

La recomendacion concreta para implementar es:

- dominio reservado de `ngrok`;
- OAuth de borde con GitHub;
- un solo origin publico HTTPS para UI, `/api` y JWKS;
- rewrite a `Host: localhost` solo para smoke temporal;
- host publico agregado al Ingress para estado durable;
- imagenes por release tag o digest inmutable;
- `main` como fuente de release, no como tag mutable directo del cluster.
