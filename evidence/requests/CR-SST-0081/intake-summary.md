# CR-SST-0081 Resumen De Intake

## Proposito

Registrar el mecanismo reusable para futuras adopciones de policies en child
repos despues del cierre historico de `CR-SST-0077`.

## Estado Local Del Orchestrator

- `4uentes-ards-core` sigue siendo la fuente canonica de shared policies.
- `4uentes-orchestor` adopta localmente `http-qa-harness-policy` y lo registra
  en `specs/integration/policies.yaml` y `state/policy-links.yaml`.
- No se redefine el texto normativo del core en este repo.
- Los manifests reutilizables quedan modelados en
  `templates/policy-adoption-manifest.template.yaml` y
  `templates/policy-exception-manifest.template.yaml`.

## Regla Reusable Para Child Repos

- Cada rollout futuro sigue siendo request-driven.
- Ningun child repo puede modificarse sin lifecycle aprobado.
- Cada child repo debe publicar `policy_adoption_manifest` o
  `policy_exception_manifest`, segun corresponda.

## Corte Historico

- `CR-SST-0077` ya cerro la sincronizacion SST previa.
- La propagacion fuera de ese rollout queda preparada pero pendiente de
  ejecucion por `CR-SST-0081` o requests derivados.
