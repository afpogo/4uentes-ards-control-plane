# Preflight bloqueado de CR-SST-0207

Fecha: 2026-08-23.

## Resultado

La matriz integrada de retencion no se inicio. El runtime de development no
cumple dos prerrequisitos de la solicitud:

- el endpoint durable `http://localhost:8088` rechaza conexiones desde el host;
- `CHAT_RETENTION_V1_ENABLED` permanece en `false` en el ConfigMap administrado
  por Argo CD.

No se crearon identidades ni datos sinteticos y no se ejecuto ninguna accion
destructiva del producto.

## Evidencia read-only

- contexto observado: `kind-sst-cluster-dev`;
- Argo Application `sst-app`: `Synced` y `Healthy`;
- deployments y stateful sets de `4uentes-sst`: listos;
- imagen frontend: `ghcr.io/afpogo/sst-fend:develop-317b17247cb6`;
- imagen Auth: `ghcr.io/afpogo/4uentes-auth:develop-b9c38fc8f829`;
- imagen Bend: `ghcr.io/afpogo/sst-bend:develop-845491b20809`;
- JWKS a traves de Ingress desde el nodo kind: HTTP `200`;
- Docker declara `127.0.0.1:8088 -> 32080/tcp`, pero no existe un listener
  utilizable desde el host y `curl` recibe conexion rechazada;
- el servicio automatico de ngrok esta `Running` y su tunel SST apunta al
  upstream aprobado `http://127.0.0.1:8088`;
- el edge publico responde `302` hacia autenticacion, lo que valida el borde
  de acceso pero no demuestra que la aplicacion sea alcanzable mientras el
  upstream local esta caido;
- el ConfigMap `sst-bend-config` administrado por `sst-app` contiene
  `CHAT_RETENTION_V1_ENABLED=false` y
  `CHAT_TEMPORARY_TTL_SECONDS=86400`;
- la fuente GitOps observada es branch `develop`, path
  `k8s-manifests/overlays/development`; la referencia local de
  `origin/develop` en `9d351d121edde80c0cbe316e6efa4790635c3a37` conserva esos
  valores en `k8s-manifests/base/sst-bend/configmap.yml`.

No se conservan dominios privados, cookies, JWT, tokens, credenciales, cuerpos
de mensajes ni datos personales.

## Impacto sobre la matriz

Las ocho filas quedan bloqueadas tanto para `localhost` como para el dominio
ngrok reservado. Ejecutarlas con el flag apagado produciria falsos negativos;
ejecutarlas solo dentro del cluster no validaria las superficies aprobadas.
El TTL de 24 horas tambien impide completar la fila de expiracion en una
ventana de QA razonable sin una configuracion o estrategia temporal aprobada.

## Limites respetados

CR-SST-0207 no autoriza despliegues, cambios de feature flag, mutacion directa
del cluster ni cambios en repositorios hijos. Por eso no se reinicio Docker o
kind, no se creo un `port-forward`, no se edito GitOps y no se modificaron
datastores.

## Siguiente gate requerido

Se requiere un lifecycle separado y aprobado de infraestructura para:

1. restaurar el acceso durable del host a `localhost:8088`;
2. promover por GitOps `CHAT_RETENTION_V1_ENABLED=true` en development;
3. definir un TTL de QA acotado o una estrategia reproducible de control del
   tiempo;
4. verificar que el tunel reservado alcanza la misma superficie despues de
   recuperar su upstream.

Una vez cerrado ese gate, CR-SST-0207 puede reanudar la matriz sin cambiar su
alcance funcional.

## Lote Jira autorizado

La aprobacion del operador de 2026-08-23 autoriza, despues de fusionar esta
evidencia, un unico comentario de bloqueo en `SST-117`. El comentario debe
mantener el issue `En curso`, enlazar la evidencia publicada y resumir los dos
prerrequisitos faltantes. No autoriza transiciones, edicion de campos, links ni
cambios de parent.
