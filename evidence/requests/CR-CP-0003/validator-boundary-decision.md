# CR-CP-0003 - Decision De Frontera De Validadores

## Decision

El core es owner de la forma reusable, templates, statuses canonicos y metadata
de adopcion del state read-model.

El control-plane es owner de la validacion local contra su catalogo,
soluciones, requests, evidencia, capability links y archivos de estado.

## Frontera

- Validator del core: valida integridad de archivos core, links, YAML, scope y
  forma semantica del living resource `feature-bugfix-state-model`.
- Validator del control-plane: valida estados locales materializados y sus
  referencias.
- Repos hijos: no deben mutarse ni considerarse adoptados sin request y registro
  local de adopcion, excepcion o no-aplicabilidad.

## Estabilidad De Validacion

El validator del core ya es deterministico para esta familia de recurso, pero
todavia no esta generalizado para toda futura clase de living resource. Ese gap
queda registrado en
`evidence/requests/CR-CP-0003/validation-stability-assessment.md`.

## Distincion Con Policy

No se creo una policy nueva. Una policy declararia reglas de gobernanza. Este
CR promueve un recurso de datos/read-model de estado con templates y metadata
de adopcion.
