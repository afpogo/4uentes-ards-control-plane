# CR-SST-0070 Intake Y Notas De Ejecucion

## Alcance

Sincronizar los bindings ARDS/SDD de los repos hijos SST que no fueron cubiertos por CR-SST-0065:

- `4uentes-auth`
- `sst-extension`
- `sst-chatbot`
- `sst-4uentes-infra`

## Clasificacion

Segun `docs/ai/model-selection-policy.md`, esta tarea se clasifica como `complex-high-risk-task` porque modifica evidencia de contrato cross-repo en repos hijos y alimenta el gate de revision core definido por CR-SST-0068.

## Fallback De Subagentes

La politica requiere subagentes. En esta sesion no hay autorizacion explicita para delegar en subagentes, por lo que la ejecucion se hace secuencialmente con el agente principal y se registra este fallback.

## Observacion Inicial

Lectura inicial de bindings locales:

- Los cuatro repos tienen `specs/00-index.yaml`.
- Los cuatro repos tienen `docs/00-overview.md`.
- Ninguno de los cuatro repos tiene `specs/ards/contract-binding.yaml` al inicio de CR-SST-0070.

## Limite

Este request no modifica `4uentes-ards-core`. Si algun sync diff resulta en `needs-core-review`, debe abrirse un request separado antes de tocar core.
