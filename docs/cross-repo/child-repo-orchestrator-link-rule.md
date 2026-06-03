# Regla Para Repos Hijos: Orchestrator Link

## Proposito

Todo repo hijo gobernado por `4uentes-orchestor` debe poder informar trabajo de
`features` o `bugfixes` aunque ese trabajo haya empezado dentro del repo hijo y
no desde `requests/inbox/`.

La forma estandar es agregar metadata `orchestrator_link` en sus artefactos
ARDS/SDD locales de capability, estado o evidencia.

## Regla Obligatoria

Cuando un repo hijo cree, cambie o valide una capability gobernada por el
orchestrator, debe registrar:

```yaml
orchestrator_link:
  orchestrator_repo: "4uentes-orchestor"
  state_kind: "feature_state"
  state_id: "TODO"
  capability_id: "TODO"
  work_origin: "child-repo"
  request_id: "TODO"
  evidence_ref: "TODO"
  status_hint: "implemented-local"
  correlation_id: "TODO"
```

## Donde Ponerlo

El repo hijo debe ubicar esta metadata en el artefacto mas cercano al cambio:

- capability outbound o inbound;
- spec de feature;
- state local del repo;
- evidencia local de ejecucion;
- decision ARDS/SDD local.

Si existe mas de un artefacto, la capability debe ser el lugar principal y la
evidencia debe referenciar la misma `correlation_id`.

## Significado

- `orchestrator_repo`: siempre `4uentes-orchestor`.
- `state_kind`: `feature_state` o `bugfix_state`.
- `state_id`: id del estado vivo en `state/features` o `state/bugfixes`.
- `capability_id`: id estable de la capability que cambio o se ejecuto.
- `work_origin`: `child-repo` cuando empezo fuera del orchestrator.
- `request_id`: request asociado; puede ser `TODO` si falta reconciliacion.
- `evidence_ref`: path local o relativo a evidencia verificable.
- `status_hint`: estado sugerido por el repo hijo.
- `correlation_id`: id estable para unir capability, evidencia y request.

## Reconciliacion

El repo hijo no decide el estado final del orchestrator. El `status_hint` es
entrada para reconciliacion. El control-plane decide el estado final usando:

- `state/capability-links.yaml`;
- `requests/`;
- `evidence/`;
- validaciones ejecutadas;
- gaps abiertos.

## Onboarding De Nuevos Repos Hijos

Todo nuevo `catalog/services/*.yaml` debe declarar
`orchestrator_link_contract`. Si no lo hace, `npm run check` debe fallar.

