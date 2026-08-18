# CR-SST-0178 - Validacion Del Cluster

> Observación transitoria del 2026-08-13. No fue releída del cluster durante la
> reconciliación documental del 2026-08-18 y no demuestra persistencia GitOps.

## Resultado

El 13 de agosto de 2026 `sst-chatbot` quedo ejecutandose como servicio interno
en `kind-sst-cluster-dev`, namespace `4uentes-sst`.

Validaciones aprobadas:

- imagen local construida: `ghcr.io/afpogo/sst-chatbot:develop`;
- imagen cargada en los dos nodos kind;
- Deployment `sst-chatbot`: rollout exitoso y pod Ready;
- Service `sst-chatbot-service`: endpoint `10.244.1.20:8091` observado;
- `sst-bend -> GET /internal/health`: `200 {"status": "ok"}`;
- `sst-bend -> POST /internal/v1/chat/turns` sin credencial: `401`, esperado;
- Ingress `sst-ingress`: ninguna referencia a `sst-chatbot`.
- Secret efimero `sst-chat-m2m-secret` creado fuera de Git con credenciales
  aleatorias independientes para `sst-bend` y `sst-chatbot`;
- Auth reconciliado desplegado desde imagen local durante una ventana con
  auto-sync de Argo CD temporalmente pausado;
- emision `client_credentials` desde `sst-bend`: PASS;
- `sst-bend -> sst-chatbot` autenticado: `200 application/x-ndjson`, deltas y
  evento `completed` observados;
- login web, sesion revocable e introspeccion M2M: PASS durante el handshake;
- Socket.IO namespace `/sst-chat/v1`: PASS, transporte final `websocket`;
- mensaje `hola desde socket io`: deltas y `chat:assistant:completed` recibidos;
- facade durable `POST /api/chat/conversations`: `201`.

La primera revision fallo antes de arrancar porque `runAsNonRoot` no puede
verificar un usuario de imagen declarado solamente por nombre. Se corrigio el
contenedor y el manifest a UID/GID numericos `10001`; el rollout posterior paso.

## Checks Owner

- `sst-chatbot scripts/check.py`: PASS, 150 tests.
- `sst-4uentes-infra npm run check`: PASS, incluyendo render y dry-run del
  overlay development.
- build Docker: PASS.

## Ventana GitOps

Argo CD revirtio el primer intento porque `sst-app` tiene `selfHeal=true` y las
ramas de CR aun no estan publicadas. Para la validacion se pauso solamente
`spec.syncPolicy.automated`, se aplico el overlay local, se ejecutaron los
smokes y se restauro exactamente `{prune:true,selfHeal:true}`. La persistencia
GitOps requiere commit, push y merge de las ramas owner; no se declara como
completada en esta evidencia.

## Gate Abierto

La QA Chrome aislada no pudo iniciarse: el navegador integrado rechazo la
sesion por metadata de sandbox faltante y Chrome DevTools encontro su perfil
MCP generico bloqueado por una instancia existente. No se termino ningun
proceso porque faltaba autorizacion especifica para afectar esa sesion. El
Engine.IO expuesto por Ingress si respondio `200` y anuncio upgrade websocket;
queda pendiente repetir el recorrido UI en un perfil MCP realmente aislado.

No se registraron JWT, client secrets, passwords, cookies ni valores de Secret.
