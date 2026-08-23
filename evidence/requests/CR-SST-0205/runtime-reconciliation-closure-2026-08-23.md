# Reconciliacion y cierre de CR-SST-0205

## Publicacion owner

- Repositorio owner: `afpogo/sst-4uentes-infra`.
- PR de implementacion: `#14`, fusionado a `develop` en
  `5feac6aa998d574f7572c0e0c16d49fe9c369d8a`.
- PR correctivo de permisos Argo: `#15`, fusionado en
  `7a50cbfafe5f7723ceee46a1c92e446213676f48`.
- PR correctivo del PodSpec Redis: `#16`, fusionado en
  `9d351d121edde80c0cbe316e6efa4790635c3a37`.
- Los cuatro checks GitHub de cada PR correctivo pasaron: repository,
  desired-state y ambos validate-manifests.

## Reconciliacion development

La autorizacion del usuario posterior al merge habilito provisionar el Secret
runtime y permitir la reconciliacion local de development. Se creo
`Secret/sst-chat-redis-secret` fuera de Git con las keys `REDIS_PASSWORD` y
`CHAT_REDIS_URL`. El readback se limito a metadata: 64 y 101 bytes,
respectivamente; ningun valor fue impreso, decodificado o persistido como
evidencia.

La primera operacion Argo fue rechazada porque `AppProject/sst-project` no
permitia `networking.k8s.io/NetworkPolicy`. El PR #15 agrego solamente ese kind,
sin wildcard. La definicion fusionada fue aplicada al AppProject y Argo creo el
Deployment, Service y NetworkPolicy.

El primer pod Redis tuvo `StartError`: el token automatico del ServiceAccount
intentaba montar bajo `/var/run/secrets` con root filesystem read-only. Redis no
consume la API Kubernetes, por lo que el PR #16 agrego
`automountServiceAccountToken: false`, preservando el hardening y eliminando una
credencial innecesaria. Un `hard refresh` del Application forzo solamente la
relectura del commit ya fusionado; el sync posterior siguio siendo automatico.

## Readback final secret-safe

- `Application/sst-app`: `Synced`, `Healthy`, revision
  `9d351d121edde80c0cbe316e6efa4790635c3a37`, operacion `Succeeded`.
- `Deployment/sst-chat-redis`: `1/1` ready y available.
- `Service/sst-chat-redis-service`: `ClusterIP`, TCP 6379, endpoint interno
  presente.
- `NetworkPolicy/sst-chat-redis-ingress`: presente con selector
  `app=sst-chat-redis`.
- PodSpec Redis: `automountServiceAccountToken=false`.
- `Deployment/sst-bend`: rollout exitoso.
- `CHAT_RETENTION_V1_ENABLED=false`; el slice no activo la feature.
- PING autenticado ejecutado dentro del pod: `PONG`, leyendo la password desde
  el volumen sin imprimirla.

## Validacion y limites

- `npm run check` del owner: PASS para ambos slices correctivos.
- Renders y ambos `kubectl apply --dry-run=client`: PASS.
- `AppProject` dry-run y asercion sin wildcard: PASS.
- `git diff --check`: PASS.
- No hubo escritura Jira, produccion ni mutacion de repos funcionales.
- La correccion del forwarding host de Kind queda fuera del slice; el API
  interno del mismo cluster se uso para validacion y reconciliacion.
- El cierre no autoriza habilitar la feature ni iniciar `CR-SST-0206`.
