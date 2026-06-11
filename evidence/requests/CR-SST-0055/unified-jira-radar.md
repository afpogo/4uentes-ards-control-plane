# Unified Jira Radar

## Estado

- Fecha: 2026-06-07
- Request: CR-SST-0055
- Jira read-only ejecutado: si
- Jira writes ejecutados: no
- Feature-state tickets observados: 9
- Backlog mirror tickets observados: 6
- Total tickets en radar: 15

## Familias De Tickets

| Familia | Issues | Rol |
|---|---:|---|
| Feature-state tickets | 9 | Trabajo funcional/estado del producto ya modelado en `state/features/*.yaml` |
| Jira Backlog Mirror Tickets | 6 | Backlog diferido para trabajo futuro/priorizable |

## Feature-State Tickets

| Issue | State id | Jira status | Assignee | Proposed event |
|---|---|---|---|---|
| `SST-4` | `sst-tags-governance` | `Tareas por hacer` | no-asignado | `JIRA_WORK_PENDING` |
| `SST-5` | `robots` | `Tareas por hacer` | no-asignado | `JIRA_WORK_PENDING` |
| `SST-6` | `learning-content-tags` | `Tareas por hacer` | no-asignado | `JIRA_WORK_PENDING` |
| `SST-7` | `sst-chatbot` | `Tareas por hacer` | no-asignado | `JIRA_WORK_PENDING` |
| `SST-8` | `document-agent` | `En curso` | Fuentes Sandferand | `JIRA_WORK_STARTED` |
| `SST-9` | `ards-sdd-policy-unification` | `Tareas por hacer` | no-asignado | `JIRA_WORK_PENDING` |
| `SST-10` | `dictionary-tags` | `Tareas por hacer` | no-asignado | `JIRA_WORK_PENDING` |
| `SST-11` | `cluster-publication-ngrok-domain` | `Tareas por hacer` | Fuentes Sandferand | `JIRA_WORK_PENDING` |
| `SST-12` | `sst-tag-prefix-engine` | `Tareas por hacer` | no-asignado | `JIRA_WORK_PENDING` |

## Backlog Mirror Tickets

| Issue | Backlog id | Jira status | Priority | Assigned CR-SST |
|---|---|---|---|---|
| `SST-13` | `SST-BL-JIRA-001` | `Tareas por hacer` | medium | ninguno |
| `SST-14` | `SST-BL-JIRA-002` | `Tareas por hacer` | low-medium | ninguno |
| `SST-15` | `SST-BL-JIRA-003` | `Tareas por hacer` | low-medium | ninguno |
| `SST-16` | `SST-BL-JIRA-004` | `Tareas por hacer` | low | ninguno |
| `SST-17` | `SST-BL-JIRA-005` | `Tareas por hacer` | medium | ninguno |
| `SST-18` | `SST-BL-JIRA-006` | `Tareas por hacer` | low | ninguno |

## Correccion Del Radar

La recomendacion de `CR-SST-0054` fue incompleta porque reviso solo
`state/jira-backlog-registry.yaml`. Ese registry contiene los `Jira Backlog
Mirror Tickets`, pero no contiene los tickets feature-state `SST-4` a `SST-12`.

## Siguiente Issue Real A Tomar

La recomendacion corregida es:

| Campo | Valor |
|---|---|
| Jira issue | `SST-8` |
| State id | `document-agent` |
| Jira status | `En curso` |
| Assignee | Fuentes Sandferand |
| CR-SST relacionado | `CR-SST-0053` |
| Motivo | Es el unico issue observado en curso; debe continuarse/cerrarse o declararse bloqueado antes de abrir nuevo backlog tooling. |

## Siguiente Alternativa Si SST-8 Esta Bloqueado

Si `SST-8` no puede avanzar por falta de credenciales smoke, la siguiente
decision debe ser explicita:

1. registrar el bloqueo de `SST-8`;
2. elegir entre trabajo funcional pendiente (`SST-4`/`SST-5`, ambos
   `runtime-partial`) o tooling backlog (`SST-13`);
3. asignar un CR-SST real solo al issue seleccionado.

## Decision

No se asigna CR-SST automaticamente desde esta revision. El radar corregido
indica que `SST-8` debe estar primero porque ya esta en curso en Jira.
