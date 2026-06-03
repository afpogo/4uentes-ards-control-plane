# CR-SST-0020 - Validacion De Cierre De Etapa

Observado el: 2026-06-02

## Resultado

La etapa se cierra con estado operativo:

- Public origin reservado de `ngrok` validado.
- OAuth GitHub de borde validado para `afpogo`.
- Modelo single-origin confirmado.
- JWKS protegido por OAuth en esta fase.
- Runtime local `localhost:8088` usado como upstream.
- No hubo mutacion Kubernetes ni cambios funcionales en repos hijos.

## Smokes Aceptados Para Esta Etapa

Esta etapa acepto smokes no destructivos:

- requests publicos sin sesion redirigen a `idp.ngrok.com`;
- acceso manual OAuth con `afpogo` llega al runtime;
- `/` sirve UI SST despues de OAuth;
- `/.well-known/jwks.json` responde JSON despues de OAuth;
- `/api/auth/extension/session` sin bearer responde auth status controlado
  cuando llega al backend;
- no hay exposicion publica directa de `sst-bend`.

## No Validado En Esta Etapa

No se valido:

- login web de la aplicacion;
- refresh/logout con cookies de app;
- bearer real de extension;
- create/read/delete de articulos;
- persistencia de datos;
- pull fresco desde GHCR privado/publico;
- servicio Windows de `ngrok`;
- host publico agregado al Ingress versionado.

## Proximo Corte Recomendado

Abrir un request nuevo para cualquiera de estos caminos:

1. Durabilidad del edge: instalar/reconciliar `ngrok` como servicio Windows.
2. Validacion funcional: login web, refresh/logout y ruta protegida.
3. Persistencia: create/read/delete con credenciales fuera de Git.
4. Release readiness: tags/digests inmutables e image pull policy.
5. Ingress durable: agregar host publico al desired state versionado.
