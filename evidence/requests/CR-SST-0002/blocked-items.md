# CR-SST-0002 - Items Bloqueados

Observado el: 2026-05-18

## Bloqueos Operativos

| Blocker | Estado | Detalle | Accion requerida |
|---|---|---|---|
| Local bindings faltantes | accepted warning | `environments/local/bindings.local.yaml` no existe. | Crear ignored local bindings antes de ejecucion futura que dependa de host paths. |
| Render de infra overlay | blocked | `kubectl kustomize k8s-manifests/overlays/development` fallo con access denied al resolver el overlay path. | Corregir issue local de filesystem/access y reejecutar. |
| Kubernetes dry-run | blocked | `kubectl apply --dry-run=client -k ...` fallo porque kube config no era legible. | Corregir kubeconfig access o proveer un kube context local limpio. |
| Live SST API QA | skipped | Requiere SST API corriendo en puerto 3005. | Ejecutar solo en ambiente local/staging aprobado. |
| Protected dictionary QA | skipped | Requiere JWT/account context y muta DB local via API. | Ejecutar solo con owner JWT y DB descartable o aprobacion explicita. |

## Items De Producto/Arquitectura No Cerrados

| Item | Estado | Motivo |
|---|---|---|
| translations | deferred | Existe domain artifact, pero public endpoint/adoption no esta completamente establecido. |
| aliases | deferred | Documentado con translations; runtime adoption no esta establecida. |
| extension account context | gap | La extension no tiene cableada seleccion/persistencia local de account-context. |
| final encryption-at-rest | deferred | Secure masking/reveal existe, pero encryption-at-rest queda explicitamente fuera del stage actual. |
| offline/server isolation model | deferred | El concepto existe en intake, no implementado como runtime. |
| `article-tags` handoff | deferred | Existe capability adyacente en `sst-bend`; no es target de completion para CR-SST-0002. |

## Decision

Estos bloqueos no invalidan la evidencia de implementacion de dictionary.
Impiden cerrar el request como completamente `done`.
