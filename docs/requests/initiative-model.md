# Modelo Initiative

## Proposito

Una `Initiative` representa un resultado amplio. Agrupa varios `CR` y permite
descubrir nuevos cambios durante la ejecucion sin perder trazabilidad.

En terminos de Jira o Scrum, una `Initiative` puede mapearse a una Epic. Esa
asociacion es operativa: Jira ayuda a visibilidad, prioridad y conversacion,
pero el source of truth ARDS/SDD sigue viviendo en el control-plane.

## Relacion Con CR

```text
Initiative = resultado amplio / programa de cambio
CR         = cambio concreto, auditable y ejecutable
Evidence   = prueba local de decisiones, validaciones y resultados
```

Una `Initiative` no reemplaza al request lifecycle. Cada cambio ejecutable debe
seguir entrando por `requests/inbox/`, pasar por `requests/planned/` y cerrarse
con evidencia propia cuando corresponda.

## Dinamismo

Una `Initiative` puede empezar con una hipotesis y una lista inicial de CRs.
Durante la ejecucion puede descubrir CRs adicionales.

Ejemplo:

```text
INIT-CP-0001
  known_change_requests:
    - CR-SST-0085
  candidate_change_requests:
    - CR-SST-0086
    - CR-SST-0087
  discovered_change_requests:
    - CR-CORE-XXXX
```

El descubrimiento no invalida la Initiative. El valor de la Initiative es
registrar esa evolucion de alcance como parte del programa, sin convertir un
CR individual en un cambio gigante.

## Jira Como Mirror

El mapeo inicial es:

```text
ARDS/SDD Initiative ~= Jira Epic
ARDS/SDD CR         ~= Jira Task / Story / Subtask
```

Reglas:

- Jira no asigna IDs `INIT` ni `CR`.
- Jira no decide cierre ARDS/SDD.
- Una Epic Jira puede reflejar una Initiative cuando exista aprobacion de
  escritura.
- Si Jira no esta disponible, la Initiative local sigue siendo valida.

## Adopcion Local

El modelo vive inicialmente como adopcion local del control-plane:

- `specs/initiatives/initiative-model.yaml`
- `initiatives/00-index.yaml`
- `initiatives/INIT-CP-0001-control-plane-lifecycle-enforcement.yaml`

La promocion a `4uentes-ards-core` queda como trabajo futuro y debe avanzar por
un CR separado.
