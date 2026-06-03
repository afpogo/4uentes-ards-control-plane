# CR-SST-0009 - Resumen De Archivos Cambiados

Observado el: 2026-05-24

## Cambio Cerrado

Se agrego la V1 documental del `state read-model` para `features` y `bugfixes`.
El cambio vive solamente en el control-plane y no modifica repos funcionales.

## Archivos Principales

- `state/README.md`
- `state/00-index.yaml`
- `state/state-machine.yaml`
- `state/features/*.current.yaml`
- `state/bugfixes/*.current.yaml`
- `docs/requests/state-read-model.md`
- `specs/states/00-index.yaml`
- `specs/states/feature-bugfix-state-model.yaml`
- `scripts/verify-state-model.js`
- `package.json`
- `specs/00-index.yaml`

## Resultado Funcional

El repo ahora puede validar:

- que `state/00-index.yaml` liste todos los state files;
- que cada `feature_state` y `bugfix_state` tenga estructura minima;
- que `status` use el enum canonico;
- que `affected_services` existan en `catalog/services/*.yaml`;
- que `solution_id` exista en `solutions/*.yaml`;
- que `request_ids`, `spec_refs`, `evidence_refs` y `validation_refs` existan
  cuando se declaran;
- que un estado `done` tenga evidencia;
- que no existan paths absolutos locales dentro de `state/`.

## Repos Funcionales

No se modificaron repos funcionales.

