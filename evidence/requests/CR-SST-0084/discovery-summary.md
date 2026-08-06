# CR-SST-0084 - Discovery

Fecha: 2026-06-24.

## Fuentes revisadas

- `AGENTS.md`
- `specs/integration/policies.yaml`
- `docs/policies/agent-architecture-boundary-policy.md`
- `docs/policies/agent-model-selection-policy.md`
- `docs/policies/agent-task-atomization-policy.md`
- `docs/policies/agent-context-management-policy.md`
- `state/features/dictionary-tags.current.yaml`
- `catalog/services/sst-bend.yaml`
- `catalog/services/4uentes-auth.yaml`
- `catalog/services/sst-fend.yaml`
- `solutions/sst.yaml`

## Hechos observados

- El control-plane no debe reemplazar ARDS/SDD local de repos funcionales.
- Los cambios cross-repo deben avanzar por request y plan antes de modificar
  repos hijos cuando sea factible.
- `dictionary-tags` esta `validated-live`, con `CR-SST-0076` en curso para el
  cierre gobernado de Diccionario.
- `sst-bend`, `4uentes-auth` y `sst-fend` son servicios activos de la solucion
  `sst`.
- `sst-extension` es opcional y queda fuera del corte v1.

## Decision de alcance

`CR-SST-0084` se separa de tags y de `CR-SST-0076`. La nueva capacidad queda
nombrada `dictionary-secret-management-v1` y se trata como trabajo de seguridad
alto riesgo por manejar datos sensibles, auth/account scope y auditoria.

## Limitacion operativa

Este registro no contiene valores secretos reales. La implementacion en repos
hijos debe revisar los `AGENTS.md` locales y registrar evidencia no secreta.
