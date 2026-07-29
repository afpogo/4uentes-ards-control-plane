# INIT-CP-0003 - Correccion De Jerarquia Jira

## Hallazgo

La primera sincronizacion de `INIT-CP-0003` creo tareas `ARDS-7` a `ARDS-12`
directamente bajo `ARDS-1`.

Eso fue incorrecto para el modelo ARDS/SDD local, porque las iniciativas se
mapean a Epics de Jira y los CRs se mapean a tareas bajo la Epic de la
iniciativa.

## Regla Validada

La regla ya existia en el repositorio:

- los YAML de iniciativas usan `tracking.jira.issue_type: "Epic"`;
- varias iniciativas documentan explicitamente `Initiative/Epic`;
- los CRs se asocian a una `epic_key` como mirror operativo;
- Jira no es source of truth, pero debe reflejar la jerarquia del ARDS/SDD.

## Correccion Ejecutada

Se creo una Epic dedicada:

- `INIT-CP-0003` -> `ARDS-13`

Se reparentaron las tareas:

- `CR-CP-0008` / `ARDS-7` -> `ARDS-13`
- `CR-CP-0009` / `ARDS-8` -> `ARDS-13`
- `CR-CP-0010` / `ARDS-9` -> `ARDS-13`
- `CR-CP-0011` / `ARDS-10` -> `ARDS-13`
- `CR-CP-0012` / `ARDS-11` -> `ARDS-13`
- `CR-CP-0013` / `ARDS-12` -> `ARDS-13`

`ARDS-1` queda como Epic relacionada/paraguas del track ARDS, no como parent
directo de los CRs de `INIT-CP-0003`.

## Evidencia

- `evidence/initiatives/INIT-CP-0003/jira-runtime-mvp-sync-summary.md`
- `evidence/initiatives/INIT-CP-0003/jira-runtime-epic-correction-summary.md`
- `evidence/initiatives/INIT-CP-0003/jira-runtime-epic-correction-result.json`

## Leccion Para Runtime Enforcement

Este caso confirma el gap de enforcement:

- la regla estaba documentada;
- el agente/script no la aplico correctamente en la primera ejecucion;
- la correccion fue posible porque la evidencia dejo trazabilidad.

El MVP de runtime debe convertir esta regla en control auditable:

```text
INIT -> Jira Epic
CR -> Jira Task under Initiative Epic
Parent/related epic only through explicit relationship
```

Ese control debe ejecutarse antes de crear tickets Jira para evitar
sincronizaciones jerarquicas incorrectas.
