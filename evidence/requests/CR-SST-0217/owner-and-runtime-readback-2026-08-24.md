# Readback owner y runtime de CR-SST-0217

## Resultado

El gate tecnico que bloqueaba CR-SST-0207 quedo satisfecho. CR-SST-0217
permanece `running` porque su cierre ARDS/SDD y la escritura terminal en Jira
requieren gates separados; este readback no consume ninguna autorizacion Jira.

## Relevamiento ARDS/SDD y merges

- El control plane canonico observado fue `origin/main` en
  `e538cd0`, e incluye el cierre de CR-CP-0023 y la promocion a Core de la
  politica de publicacion de ejecucion y cierre de tracker. CR-SST-0217 habia
  comenzado antes de esa adopcion y no se retroajusta, pero su cierre seguira
  el mismo orden verificable.
- El PR owner de Infra
  [#17](https://github.com/afpogo/sst-4uentes-infra/pull/17) se fusiono a
  `develop` en `85ccc828cc8329d2319e778a9ccd7ac365ed3d61`.
- El `develop` canonico de Infra avanzo luego a
  `126f25eeed4d20b7ecba35036a7e35530482c946` por una actualizacion automatica
  de imagen de Bend. Ese merge preserva `CHAT_RETENTION_V1_ENABLED=true` y
  `CHAT_TEMPORARY_TTL_SECONDS=120` solo en el overlay development.
- El PR #27 de sst-bend se fusiono a `develop` y la imagen desplegada es
  `develop-fc5573a7f054`.
- El PR #11 de sst-chatbot se fusiono a `main`, no a `develop`. La imagen
  development `develop-5b96bbb4c087` no contiene por esa via el merge de
  CR-SST-0194. La deriva se registra como seguimiento separado y no se corrige
  dentro de este lifecycle de Infra.

## Validacion owner

En el worktree aislado de `sst-4uentes-infra`, `npm run check` termino con
codigo 0 el 2026-08-24. Pasaron los renders Kustomize de bootstrap y
development y los dos `kubectl apply --dry-run=client`. El dry-run que antes
fallaba por indisponibilidad del API ahora completo contra el cluster
recuperado.

## Readback runtime secret-safe

- contexto: `kind-sst-cluster-dev`;
- nodos control-plane y worker: `Ready`;
- `Application/sst-app`: `Synced`, `Healthy`, revision
  `126f25eeed4d20b7ecba35036a7e35530482c946`, operacion `Succeeded`;
- todos los pods observados en `4uentes-sst`: `Running` y ready;
- ConfigMap de Bend: retencion `true`, TTL temporal `120` segundos;
- imagen Bend: `ghcr.io/afpogo/sst-bend:develop-fc5573a7f054`;
- Redis: pod ready y Secret opaco presente con las keys esperadas
  `CHAT_REDIS_URL` y `REDIS_PASSWORD`; no se leyeron, decodificaron ni
  persistieron valores;
- `http://localhost:8088/`: HTTP 200;
- JWKS por localhost: HTTP 200;
- edge ngrok reservado: respuesta de redireccion a autenticacion; la URL
  privada no se persistio.

El control-plane Docker/Kind que estaba indisponible se recupero sin que el
intento manual autorizado lograra reiniciarlo. No hubo recreacion de cluster,
`kubectl apply`, sync manual, cambio de Secret, datastore ni produccion.

## Jira

El readback del 2026-08-24 muestra:

- `SST-118`: `En curso`, sin resolucion, Subtask de `SST-113`, sin comentarios;
- `SST-117`: `En curso`, sin resolucion, Subtask de `SST-113`, conservando el
  comentario historico del bloqueo.

Jira esta atrasado respecto del gate tecnico recuperado. La sincronizacion y
el cierre requieren una autorizacion exacta posterior a la publicacion de esta
evidencia.

## Handoff

CR-SST-0207 puede reanudar la matriz integrada con identidades y datos
sinteticos. No se considera cerrada ninguna fila hasta probarla en localhost y
en el edge reservado, y la limpieza debe usar solamente contratos de producto.
