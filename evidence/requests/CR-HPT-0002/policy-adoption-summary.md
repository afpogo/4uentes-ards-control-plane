# CR-HPT-0002 — adopción de policies

Fecha: 2026-08-22

| Policy | Resultado owner | Límite |
|---|---|---|
| `control-plane-link-policy` | manifest e instancia `control_plane_link` adoptados | el `status_hint` del hijo es advisory |
| `http-qa-harness-policy` | `.http` canónico agregado y smoke Python conservado | sólo cubre el scaffold ejecutable |
| `owner-documentation-authority-policy` | specs, docs y AGENTS actualizados junto al cambio | el control plane no sustituye al owner |
| `agent-architecture-boundary-policy` | sin cambios de runtime, auth, dominio o infraestructura | gaps SST continúan explícitos |

No se copiaron los textos completos del core. Los manifests referencian a
`4uentes-ards-core` como owner canónico.
