# CR-SST-0020 - Analisis De Auth Para Exposicion Publica

Observado el: 2026-05-31

## Resumen

El modelo mas seguro para esta fase es un solo origin publico HTTPS:

- UI en `/`
- BF/auth y API en `/api`
- JWKS en `/.well-known/jwks.json`

Ese modelo evita CORS cross-origin para el flujo SPA principal y mantiene las
cookies bajo el mismo sitio del dominio publico.

## Cookies, SameSite Y Secure

`node-auth` usa cookies:

- `refresh_token`: HttpOnly
- `csrf_token`: legible por el SPA
- `Path=/`
- `SameSite=Lax`
- `Secure=true` solo cuando `NODE_ENV=production`

El overlay actual de infra define `NODE_ENV=development` para `node-auth`. Bajo
un dominio HTTPS publico de `ngrok`, eso deja cookies sin `Secure`. Para una
exposicion publica, aunque sea controlada por OAuth de edge, esto debe
resolverse antes de declarar readiness.

Decision recomendada:

- si FE y API comparten el mismo origin publico, mantener `SameSite=Lax` y
  exigir cookies `Secure`;
- si FE y API se separan en dominios distintos, evaluar `SameSite=None; Secure`
  y CORS con credentials;
- no publicar con cookies de sesion sin `Secure` bajo HTTPS publico.

## CSRF

El contrato vigente usa double-submit:

- cookie `csrf_token`;
- header `x-csrf-token`;
- refresh/logout fallan si ambos no coinciden.

El frontend ya envia `withCredentials` y `x-csrf-token` en refresh/logout. Hay
un gap menor: el frontend tiene fallback hacia `GET /auth/csrf`, pero esa ruta
no esta expuesta por `node-auth`. No bloquea login normal, pero debe quedar en
la matriz de smoke cuando se pruebe HTTPS publico.

## CORS

No se observo CORS como requisito para el modelo de un solo origin publico,
porque `/`, `/api` y JWKS viven bajo el mismo hostname. Ese modelo es el
recomendado para la siguiente fase.

Si se decide separar frontend/API o soportar extension con requests
cross-origin directos, entonces debe agregarse un contrato CORS explicito:

- origenes permitidos;
- `Access-Control-Allow-Credentials`;
- headers permitidos, incluyendo `Authorization` y `x-csrf-token`;
- comportamiento de preflight.

## JWKS

`/.well-known/jwks.json` esta alineado con Ingress y responde `200` localmente.
Si OAuth de `ngrok` protege todo el edge, JWKS tambien requerira sesion OAuth
desde fuera. Eso es aceptable para demo privada, pero no para validadores
externos que necesiten leer JWKS sin sesion humana.

Decision para siguiente fase:

- para publicacion privada/controlada: JWKS detras de OAuth de edge es
  aceptable;
- para integracion externa real: evaluar una excepcion de policy para JWKS o un
  endpoint publico sin OAuth.

## Ngrok OAuth Y Authorization Bearer

OAuth de `ngrok` no deberia interferir con `Authorization: Bearer`, porque la
sesion de edge usa cookies propias. Esta propiedad es clave para no romper
flujos de `node-auth`, `sst-fend` y extension.

No usar Basic Auth de edge: Basic Auth consume `Authorization: Basic` y compite
con `Authorization: Bearer`.

## Smokes De Auth Requeridos

La siguiente fase debe repetir por `https://<reserved-ngrok-domain>`:

- `GET /`
- `GET /.well-known/jwks.json`
- `POST /api/auth/login`
- `POST /api/auth/refresh` con cookies y `x-csrf-token`
- `POST /api/auth/logout` con cookies y `x-csrf-token`
- `GET /api/auth/extension/session` sin bearer debe devolver un auth status
  controlado, no 404 de Ingress
- una ruta funcional minima protegida con `Authorization: Bearer`

No registrar credenciales, JWTs, refresh tokens ni cookies completas en la
evidencia.
