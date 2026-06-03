# Decision Gate 0 - Bootstrap De Fase 0

Observado el: 2026-05-17
Estado de decision: accepted-with-warnings

## Decision

El catalogo inicial del control-plane ARDS/SDD de 4uentes queda aceptado para
Fase 0.

El catalogo estable modela solo identidades logicas. Los paths absolutos locales
siguen siendo evidencia en archivos de inventario y no deben usarse como
configuracion canonica.

## Catalogo Aceptado

| Service ID | Decision | Notas |
|---|---|---|
| `4uentes-auth` | accepted | Shared auth provider para SST y Fulbito planificado |
| `sst-fend` | accepted | Frontend SPA requerido para SST |
| `sst-bend` | accepted | API/backend requerido para SST |
| `sst-extension` | accepted optional | Runtime Manifest V3 real, no requerido por defecto |
| `sst-4uentes-infra` | accepted | Gobierno de deployment GitOps/Kubernetes |

## Confirmaciones Del Gate

| Check | Resultado |
|---|---|
| `4uentes-auth` kind es `shared-auth-provider` | pass |
| `node-auth` es solo alias legacy/local, no identidad canonica | pass |
| `sst-extension` es optional-active o equivalente | pass |
| `sst-4uentes-infra` es infra/GitOps/deployment governance | pass |
| El catalogo estable no contiene paths locales absolutos | pass |
| `solutions/sst.yaml` referencia servicios existentes | pass |
| Los archivos de servicio incluyen campos minimos requeridos | pass |

## Warnings Aceptados

| Warning | Motivo de aceptacion |
|---|---|
| Dirty working trees observados en `sst-fend`, `sst-bend` y `sst-4uentes-infra` | Fase 0 solo registra evidencia y no congela esos cambios como baseline estable |
| `sst-extension` no tiene HEAD/commit inicial valido | El runtime y ARDS/SDD existen localmente, pero el bootstrap Git debe resolverse despues |
| `sst-4uentes-infra` no tiene check command capturado | La validacion de infra se tratara con trabajo posterior del verifier |
| Existen paths absolutos en evidencia de inventory | Son explicitamente evidence-only y no configuracion estable de catalogo |

## No Bloquean Fase 1

- Dirty working trees en repos funcionales.
- Commit inicial faltante para `sst-extension`.
- Scripts automatizados de verifier faltantes en el control-plane.

## Criterios De Entrada Para Fase 1

Fase 1 puede empezar con implementacion de verifiers:

1. `verify-catalog` para parseo YAML, campos requeridos y referencias de
   soluciones.
2. `verify-local-bindings` para checks de paths locales evidence-only.
3. Modelado de requests despues de que los checks de catalogo sean
   deterministas.
