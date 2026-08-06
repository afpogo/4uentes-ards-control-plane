# CR-SST-0106 - Reconciliacion De Bugfix State

## Alcance

Esta evidencia normaliza dos `bugfix_state` historicos que ya estaban en
`validated-local`, pero no tenian `request_ids` ni `evidence_refs`.

Registros reconciliados:

- `state/bugfixes/login-504-proxy-timeout.current.yaml`
- `state/bugfixes/sst-bend-emfile-watchers.current.yaml`

## Decision

`CR-SST-0106` no afirma ser el lifecycle original de implementacion de esos
bugfixes. Su rol es retrospectivo:

- registrar que los states existen y fueron observados por el validator;
- conectar los states a una request de gobernanza;
- proveer evidencia central minima para eliminar warnings recurrentes;
- conservar la distincion entre implementacion historica y reconciliacion del
  read-model.

## Login Proxy 504

Estado observado antes de la reconciliacion:

- `status`: `validated-local`
- `affected_services`: `sst-fend`, `4uentes-auth`
- `symptom`: `Login POST returned 504 through frontend dev proxy.`
- markers: `reproduced`, `root-caused`, `fix-implemented-local`,
  `regression-tested`

Reconciliacion aplicada:

- `request_ids`: `CR-SST-0106`
- `evidence_refs`: este archivo y `validation-results.md`
- `open_gaps`: reemplazado por nota de reconciliacion historica.

## SST Backend EMFILE Watchers

Estado observado antes de la reconciliacion:

- `status`: `validated-local`
- `affected_services`: `sst-bend`
- `symptom`: `Local backend watcher exhausted file handles and interrupted development feedback loops.`
- markers: `reproduced`, `root-caused`, `fix-implemented-local`,
  `regression-tested`

Reconciliacion aplicada:

- `request_ids`: `CR-SST-0106`
- `evidence_refs`: este archivo y `validation-results.md`
- `open_gaps`: reemplazado por nota de reconciliacion historica.

## Boundary

No se modificaron repos hijos. No se cambiaron contratos runtime. No se creo
evidencia falsa de ejecucion original.
