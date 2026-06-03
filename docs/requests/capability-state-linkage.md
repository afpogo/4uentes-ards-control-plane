# Capability-State Linkage

## Proposito

El `capability-state linkage` conecta las `capabilities` que publican o adoptan
los repos hijos con el `state read-model` del control-plane.

La regla que agrega es:

```text
si una ejecucion nace fuera del orchestrator, el repo hijo debe dejar metadata
ARDS/SDD suficiente para que el orchestrator pueda vincular esa ejecucion con
un feature_state o bugfix_state.
```

Esto evita que el orchestrator sea el unico lugar donde se entiende el estado.
Los repos hijos tambien conservan claridad local sobre que capability cambio,
que trabajo representa y como se relaciona con otros repos.

## Modelo Mental

```text
repo hijo capability
        |
        v
capability-state link
        |
        v
feature_state / bugfix_state
        |
        v
request, evidencia, validacion, gaps
```

El repo hijo puede iniciar trabajo, pero si ese trabajo esta gobernado por el
orchestrator debe dejar una huella ARDS/SDD enlazable.

## Metadata Minima En Repos Hijos

Cuando un repo hijo cambia o ejecuta trabajo gobernado, su capability o evidencia
local debe dejar estos datos:

```yaml
orchestrator_link:
  orchestrator_repo: "4uentes-orchestor"
  state_kind: "feature_state"
  state_id: "sst-tags-governance"
  capability_id: "sst-tags-governance"
  work_origin: "child-repo"
  request_id: "TODO"
  evidence_ref: "TODO"
  status_hint: "implemented-local"
  correlation_id: "TODO"
```

`request_id` puede ser `TODO` cuando el trabajo se detecta despues de iniciado,
pero entonces el orchestrator debe crear o asociar un request de reconciliacion.

## Estados Permitidos Como Hint

`status_hint` debe usar los mismos estados canonicos del `state read-model`:

```text
unknown
intake
discovered
ards-documented
planned
implementation-pending
runtime-partial
implemented-local
validated-local
validated-live
ready-for-release
released
done
blocked
deferred
rejected
deprecated
```

El hint no decide el estado final. El orchestrator lo toma como input y lo
reconcilia contra requests, evidencia y validaciones.

## Reglas

- Cada `capability_id` gobernada debe enlazar a un `state_id`.
- El `state_id` debe existir en `state/features/*.current.yaml` o
  `state/bugfixes/*.current.yaml`.
- El `producer_service` debe existir en `catalog/services/*.yaml`, salvo el
  productor interno `4uentes-orchestor`.
- Si el repo hijo no paso por `requests/inbox`, debe dejar `work_origin:
  child-repo` y evidencia para reconciliacion.
- `done` sigue requiriendo evidencia en el control-plane.
- El control-plane valida el mapa vivo en `state/capability-links.yaml`.

## Alcance V1

V1 no inspecciona automaticamente todos los repos hijos. Define el contrato,
valida el mapa local y deja la forma esperada para que los repos hijos agreguen
metadata ARDS/SDD compatible.
