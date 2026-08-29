# CR-SST-0229: readback runtime por capas

Fecha: 2026-08-28
Resultado: `PASS` para el alcance read-only autorizado

## Autorización y límites

La instrucción `ok avancemos al proximo gate` autorizó consultas read-only de
listeners del host, publicaciones Docker, Kind/Kubernetes, Ingress, workloads,
Argo CD, contratos HTTP locales y navegador. No autorizó aplicar manifests,
recrear el clúster, reiniciar host, Docker o workloads, acceder a Secrets o
backups, modificar repositorios owner ni escribir Jira.

## Matriz observada

| Capa | Evidencia actual | Resultado |
| --- | --- | --- |
| Host API | `127.0.0.1:16443` escucha bajo `com.docker.backend`; `/readyz` y `/livez` responden `ok` | PASS |
| Host Ingress | `127.0.0.1:8088` escucha bajo `com.docker.backend` | PASS |
| Docker Kind | control-plane publica `127.0.0.1:16443 -> 6443` y `127.0.0.1:8088 -> 32080`; ambos nodos están `Up` | PASS |
| Kubernetes | contexto `kind-sst-cluster-dev`; control-plane y worker `Ready` | PASS |
| Workloads | pods esperados de SST, Argo CD, DNS, storage e ingress están `Running` y listos | PASS |
| Ingress | Service nginx expone `80:32080`; deployment y pod del controller están `1/1` | PASS |
| Argo CD | `sst-app` está `Synced/Healthy` en `d672fc463d268b99049f87373d5d2439b1fa38b9` | PASS |
| HTTP cluster | `/` `200`, `/healthz` `200`, JWKS `200`, sesión extension sin token `401` | PASS |
| Chrome cluster | `localhost:8088` renderiza SST; consola vacía; 8 de 8 requests iniciales `200` | PASS |
| Desarrollo local | `localhost:4090` renderiza SST; 7 de 7 requests iniciales `200` | PASS con observación |

## Controles contra falsos positivos

- `8088` es HTTP hacia nginx-ingress, no el API server Kubernetes ni un
  endpoint HTTPS. El intento TLS falló por protocolo y no se clasificó como
  caída.
- `16443` es el API server Kubernetes. Se verificó por listener, publicación
  Docker, `kubectl cluster-info`, `/readyz` y `/livez`.
- `4090` es el frontend de desarrollo Docker. Se validó separado de `8088` y
  no se usó como sustituto de la salud del clúster.
- `docker compose ps` desde la raíz del repo owner informó que allí no existe
  un compose file; `docker ps` y Kubernetes aportaron las señales runtime
  aplicables. Ese error de ubicación no se trató como caída.
- Contenedores `Up` no bastaron para cerrar: se comprobaron nodos, pods,
  controller, rutas, Argo CD, HTTP y navegador de manera independiente.
- El primer controlador del navegador integrado no inició por metadata de
  sandbox ausente. El MCP Chrome DevTools configurado por stdio sí completó el
  readback; la degradación de herramienta no se atribuyó a SST.

## Observación de desarrollo

El build de `localhost:4090` mostró una advertencia de future flag de React
Router y tres mensajes React de desarrollo relacionados con `fetchPriority` y
`findDOMNode`. No bloquearon render ni requests y no aparecieron en el build de
clúster servido por `localhost:8088`. Se registran como deuda frontend separada,
no como falla de infraestructura ni como autorización para modificar `sst-fend`.

## Estado y próximo gate

La matriz runtime vigente cumple el criterio read-only de CR-SST-0229. La
documentación owner se actualizó después mediante un worktree limpio y el lote
exacto `specs/infra/clusters/sst-dev-kind.yaml` más
`specs/states/stabilize-kind-api-server-port.yaml`. `npm run check`, parseo YAML
y diff check pasaron; el PR owner `#22` se fusionó y leyó desde `develop` en el
merge `0d4ba889b856819257af652050da37cd38bdd122`. El árbol histórico dirty se
preservó y el worktree limpio fue retirado.

La publicación terminal mueve `CR-SST-0229` a `done` junto con esta evidencia,
la reconciliación del coordinador y la Initiative. El contrato de cierre exige
merge y readback canónico antes de retirar el worktree; ese readback es un gate
operativo posterior al merge y no requiere un commit recursivo.

Jira permanece fuera de alcance. La corrección de identidad de `SST-119` queda
separadamente gated bajo `CR-SST-0222` y no se presenta como ejecutada.
