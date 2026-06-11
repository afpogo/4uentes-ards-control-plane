# Transition Scope Review

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0057
- Jira issue: `SST-4`
- State id: `sst-tags-governance`
- Current local status: `runtime-partial`
- Current Jira status observed in CR-SST-0055: `Tareas por hacer`
- Target Jira transition requested: `En curso`
- Jira write executed by this review: no

## Decision De Alcance

`CR-SST-0057` debe gobernar la transicion actual de `SST-4`.

Los CR-SST historicos relacionados no se reabren:

- `CR-SST-0010`
- `CR-SST-0014`
- `CR-SST-0015`
- `CR-SST-0016`

Esos CRs son provenance/evidencia del estado actual, no contenedores activos
para la transicion de hoy.

## Regla

Mover `SST-4` a `En curso` en Jira solo significa:

- el trabajo fue tomado operativamente;
- el control-plane debe seguir el trabajo bajo `CR-SST-0057`;
- `state/features/sst-tags-governance.current.yaml` permanece
  `runtime-partial` hasta que exista evidencia local de implementacion o
  cierre.

## Capacidad De Escritura

El control-plane todavia no tiene implementado el writer generico de
transiciones Jira. Ese pendiente existe como backlog mirror ticket:

- `SST-15` / `SST-BL-JIRA-003`: Controlled Jira workflow transitions.

Por eso, para transicionar `SST-4` ahora hay dos caminos:

1. transicion manual por operador en Jira y luego observacion read-only;
2. implementar primero el writer controlado de transiciones Jira.

## Recomendacion

Para avanzar sin bloquear el trabajo funcional, usar `CR-SST-0057` como
request gobernante y transicionar `SST-4` manualmente en Jira a `En curso`.
Despues ejecutar observacion read-only para registrar la senal.
