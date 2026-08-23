# Publicación owner draft de CR-SST-0205

## Resultado

La implementación source-only quedó publicada como PR draft
`afpogo/sst-4uentes-infra#14` desde
`feat/CR-SST-0205/development-redis-runtime@764499cb355ade0ffc31b14fa17c8f189d3ffae2`,
basada en `origin/develop@b8d8f9fdffe7120a3abd08389fdbd3f98a4f3d2b`.

El checkout canónico sucio se preservó intacto. Todo el trabajo owner ocurrió
en `worktrees/CR-SST-0205-infra-owner`.

## Slice implementado

- Redis `7.4.10-alpine3.21` como `Deployment` volátil sin PVC.
- `Service` exclusivamente `ClusterIP`, sin Ingress, NodePort ni LoadBalancer.
- `NetworkPolicy` de ingreso sólo desde pods `app=sst-bend` por TCP 6379.
- Password y `CHAT_REDIS_URL` en `sst-chat-redis-secret`, que debe crearse fuera
  de Git antes de cualquier reconciliación autorizada.
- `CHAT_RETENTION_V1_ENABLED=false`; la PR no activa retención V1.
- Recursos, PING autenticado, `INFO stats`, `INFO commandstats`, latency monitor
  y slowlog metadata documentados sin imprimir credenciales ni payloads.
- Owner specs y runbook alineados con `sst-bend@f58e0a9`: temporales en memoria
  del proceso Bend con TTL; PostgreSQL autoridad durable; Redis sólo cache-aside
  fail-open de conversaciones guardadas.

## Validación

- `kubectl kustomize k8s-manifests/overlays/development`: PASS.
- Aserciones de render para Deployment, ClusterIP, NetworkPolicy, Secret ref,
  feature flag apagado y ausencia de exposición externa: PASS.
- `git diff --check`: PASS.
- Scan secret-safe de patrones de credenciales: PASS.
- `npm run check`: BLOCKED_ENVIRONMENT antes del dry-run development. El
  contexto configurado intenta acceder a `https://127.0.0.1:57569`, pero el API
  del cluster kind está apagado. No se inició el cluster porque no existe
  autorización operacional para hacerlo.
- Checks GitHub owner: PASS en `validate-repository`, `validate-desired-state`
  y ambos jobs `validate-manifests`; la PR quedó `CLEAN` y mergeable.

## Límites y siguiente gate

La PR permanece draft. No se fusionó, no se creó el Secret runtime, no se
sincronizó Argo CD, no se ejecutó `kubectl apply`, y no hubo cambios en Jira,
producción ni repos funcionales.

Antes de evaluar merge/reconciliación debe repetirse el check owner completo
con el API kind disponible y provisionarse el Secret fuera de Git bajo
autorización separada.
