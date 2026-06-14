# CR-SST-0068 Diseno Del Read Model De Observabilidad

## Proposito

El read model debe responder si los contratos ARDS/SDD estan sincronizados en el sistema local SST sin usar operaciones de escritura como parte de la observacion.

## Estado Por Repositorio

Cada fila de repositorio debe incluir:

- `service_id`
- `service_group`: `core`, `shared`, `optional` o `infrastructure`
- `sync_status`
- `core_ref`
- `resolved_contract_version`
- `child_commit`
- `dirty_state`
- `manifest_hash`
- `required_paths`
- `todos_or_exceptions`
- `latest_sync_report`
- `local_validation`
- `core_revision_decision`
- `recommended_actions`

`latest_sync_report` debe reutilizar el formato `ards_child_sync_diff` usado por evidencia previa de binding de hijos, incluyendo los sync diff de CR-SST-0065 para `sst-fend` y `sst-bend`.

El campo `core_revision_decision` debe seguir `evidence/requests/CR-SST-0068/core-revision-decision-gate.md` y usar uno de estos valores:

- `no-core-change-needed`
- `needs-core-review`
- `needs-child-request`
- `unknown-needs-sync-diff`

## Entradas De Sync

El calculo por repositorio debe comparar:

- La referencia actual del contrato core ARDS/SDD.
- La evidencia de binding local del servicio.
- Los archivos reales observados en el repositorio hijo.

Los conteos vivos pueden mostrarse como contexto, pero no deben ser el criterio principal de estado. El estado debe surgir principalmente de drift de contrato, presencia de paths requeridos, mismatch de binding, mismatch de manifest, TODOs declarados y excepciones explicitas.

## Estado De Solucion

El estado de la solucion `sst` debe derivarse de `solutions/sst.yaml` y preservar estos grupos:

- `core`: `sst-fend`, `sst-bend`
- `shared`: `4uentes-auth`
- `optional`: `sst-extension`, `sst-chatbot`
- `infrastructure`: `sst-4uentes-infra`

El estado core debe representar el baseline por defecto del servicio SST. El estado optional e infrastructure debe ser visible y accionable, pero solo debe bloquear el estado core cuando cree un conflicto explicito de contrato con servicios core.

## Estado Global

El estado global debe incluir:

- `overall_sync_status`
- `last_refresh`
- `solution_count`
- `repository_count`
- `open_drift_summary`
- `blocking_conflicts`
- `recommended_actions`
- `core_revision_summary`

## Artefactos Sugeridos

La implementacion deberia preferir scripts Node locales siguiendo el estilo actual de `scripts/verify-*.js`. Artefactos generados sugeridos:

- `state/observability/ards-sdd-system-read-model.yaml`
- `state/observability/ards-sdd-system-read-model.json`
- `state/observability/ards-sdd-system-dashboard.html`

Esos paths son sugerencias para el futuro request de implementacion, no artefactos producidos por este intake de diseno.
