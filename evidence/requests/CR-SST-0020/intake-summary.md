# CR-SST-0020 - Resumen De Intake

Observado el: 2026-05-29

## Objetivo

Analizar la aplicacion SST actualmente desplegada en el cluster Kubernetes
local y definir el camino controlado para publicarla en internet mediante
`ngrok` con un dominio productivo accesible.

## Contexto Runtime Inicial

Endpoint provisto por el usuario:

- `http://localhost:8088/`

Observado previamente en esta workstation:

- `http://localhost:8088/` devolvio `200`
- la respuesta incluyo un app root

Esta URL se trata como evidencia del `Ingress` local, no como URL publica final.

## Alcance Inicial

Servicios:

- `sst-fend`
- `sst-bend`
- `4uentes-auth`
- `sst-4uentes-infra`

Fuera de alcance hasta que el analisis indique lo contrario:

- `sst-extension`
- `sst-chatbot`

## Preguntas A Responder

- Que esta desplegado ahora en el cluster?
- Que servicios, pods, imagenes, reglas de `Ingress`, hosts y puertos estan
  activos?
- Que estrategia de URL publica deberia usar `ngrok`?
- Ya existe un plan durable de `ngrok edge` o dominio en docs o manifests de
  infra?
- Que target DNS/dominio se requiere para un dominio productivo accesible?
- Los builds GitOps/imagenes deberian moverse de `develop`/`dev` a `main`?
- Que politica de branch, tag o promocion evita romper el loop actual de
  desarrollo?
- Que secrets, TLS, callback URLs, CORS, cookies y configuracion de auth deben
  cambiar antes de la exposicion publica?
- Que gates de validacion se requieren antes de marcar la publicacion como
  lista?

## Estado Del Lifecycle

Esta request esta en intake/planificacion. Este archivo de evidencia por si
solo no autoriza cambios en repos hijos.
