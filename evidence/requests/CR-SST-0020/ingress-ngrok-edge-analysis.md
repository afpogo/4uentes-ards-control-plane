# CR-SST-0020 - Analisis Ingress Y Ngrok Edge

Observado el: 2026-05-31

## Punto De Entrada Actual

El punto de entrada local aprobado es `http://localhost:8088/`. En esta fase se
confirmo:

- `/` responde `200`.
- `/.well-known/jwks.json` responde `200`.
- El Ingress acepta los hosts `localhost`, `sst.local`, `sst-bend.local`,
  `node-auth.local` y `sst-fend.local`.

## Dominio Publico Recomendado

Usar un dominio HTTPS reservado de `ngrok` para que la URL publica sea estable.
Un dominio aleatorio de tunnel no sirve para flujos de extension, cookies,
smoke repetible ni evidencia auditable.

El borde publico debe protegerse con OAuth de `ngrok`, preferentemente GitHub,
por estas razones:

- no consume el header `Authorization: Bearer` de la aplicacion;
- permite restringir acceso humano al edge sin cambiar `node-auth`;
- evita exponer el cluster local directamente durante la fase de validacion.

No usar Basic Auth de edge para esta fase porque compite con el header
`Authorization` que la aplicacion usa como `Bearer`.

## Host Rewrite Vs Host Publico En Ingress

Estrategia para la siguiente fase:

1. Smoke temporal: configurar `ngrok` para upstream `http://127.0.0.1:8088` y
   rewrite de `Host` a `localhost`.
2. Implementacion durable: agregar el dominio publico aprobado al Ingress en
   `sst-4uentes-infra`, con las mismas rutas que `localhost`.

El host rewrite permite validar sin tocar manifests, pero tiene limites:

- el Ingress no ve el hostname real publico;
- puede ocultar problemas de cookies, CORS, redirects y observabilidad;
- no deja desired state GitOps completo.

Agregar el host publico al Ingress es mas durable porque:

- queda versionado y auditable;
- valida el hostname real del navegador;
- reduce dependencia de configuracion opaca del edge;
- permite construir rollback por Git.

## Rutas Publicas Esperadas

El host publico SST debe servir un solo origin:

| Path | Backend esperado |
|---|---|
| `/` | `sst-fend-service:80` |
| `/api` | `node-auth-service:4000` |
| `/.well-known/jwks.json` | `node-auth-service:4000` |

No se recomienda publicar como hosts publicos directos:

- `sst-bend.local`
- `node-auth.local`
- `sst-fend.local`

`sst-bend` debe seguir principalmente detras de `node-auth`.

## TLS

Para la siguiente fase, TLS publico debe terminar inicialmente en `ngrok`.
El upstream hacia `localhost:8088` puede seguir en HTTP mientras el objetivo sea
publicacion controlada del cluster local.

TLS end-to-end entre `ngrok` y Kubernetes no es requisito de esta fase; si se
exige, debe agregarse como decision separada porque implica certificados,
secrets y cambios de manifests.

## Recomendacion

Avanzar con dominio reservado de `ngrok` + OAuth GitHub + upstream local a
`http://127.0.0.1:8088`. Usar rewrite a `Host: localhost` solo para el primer
smoke. Para dejar la publicacion en estado durable, abrir una fase de ejecucion
aprobada que agregue el host publico al Ingress y valide el trafico con el
hostname real.
