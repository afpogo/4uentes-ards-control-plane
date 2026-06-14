# Unified Jira Radar Live Review

## Estado

- Fecha: 2026-06-11
- Request: CR-SST-0062
- Modo: mcp-read-only
- Endpoint operativo: `JIRA_MCP_ARGS='--yes mcp-remote@latest https://mcp.atlassian.com/v1/mcp'`
- Jira read-only ejecutado: si
- Jira writes ejecutados: no
- Transiciones locales automaticas: 0
- Feature-state tickets observados: 9
- Backlog mirror tickets observados: 6
- Total tickets en radar: 15

## Resultado MCP

- Jira project `SST`: visible
- Confluence space `SST`: no visible en esta verificacion
- Tools MCP Jira/Confluence: descubiertas
- Tokens, cookies, cloudId y URLs privadas: no registrados

## Feature-State Tickets

| Issue | State id | Jira status | Assignee | Proposed event |
|---|---|---|---|---|
| `SST-4` | `sst-tags-governance` | `En curso` | Fuentes Sandferand | `JIRA_WORK_STARTED` |
| `SST-5` | `robots` | `Tareas por hacer` | no-asignado | `JIRA_WORK_PENDING` |
| `SST-6` | `learning-content-tags` | `En curso` | Fuentes Sandferand | `JIRA_WORK_STARTED` |
| `SST-7` | `sst-chatbot` | `Tareas por hacer` | no-asignado | `JIRA_WORK_PENDING` |
| `SST-8` | `document-agent` | `Finalizada` | Fuentes Sandferand | `JIRA_WORK_CLOSED_OBSERVED` |
| `SST-9` | `ards-sdd-policy-unification` | `Tareas por hacer` | no-asignado | `JIRA_WORK_PENDING` |
| `SST-10` | `dictionary-tags` | `En curso` | Fuentes Sandferand | `JIRA_WORK_STARTED` |
| `SST-11` | `cluster-publication-ngrok-domain` | `Tareas por hacer` | Fuentes Sandferand | `JIRA_WORK_PENDING` |
| `SST-12` | `sst-tag-prefix-engine` | `En curso` | Fuentes Sandferand | `JIRA_WORK_STARTED` |

## Backlog Mirror Tickets

| Issue | Backlog id | Jira status | Priority | Assigned CR-SST |
|---|---|---|---|---|
| `SST-13` | `SST-BL-JIRA-001` | `Tareas por hacer` | medium | ninguno |
| `SST-14` | `SST-BL-JIRA-002` | `Tareas por hacer` | low-medium | ninguno |
| `SST-15` | `SST-BL-JIRA-003` | `Tareas por hacer` | low-medium | ninguno |
| `SST-16` | `SST-BL-JIRA-004` | `Tareas por hacer` | low | ninguno |
| `SST-17` | `SST-BL-JIRA-005` | `Tareas por hacer` | medium | `CR-SST-0059` |
| `SST-18` | `SST-BL-JIRA-006` | `Tareas por hacer` | low | ninguno |

## Cambios Contra CR-SST-0055

- `SST-8` / `document-agent` ya no es el unico issue en curso; ahora esta `Finalizada`.
- `SST-4` / `sst-tags-governance` esta `En curso`.
- `SST-6` / `learning-content-tags` esta `En curso`.
- `SST-10` / `dictionary-tags` esta `En curso`.
- `SST-12` / `sst-tag-prefix-engine` esta `En curso`.
- `SST-17` conserva backlog status local `active` con `CR-SST-0059`, pero su Jira status sigue `Tareas por hacer`.

## Recomendacion Operativa

El control-plane debe tratar `SST-8` como cierre observado en Jira y no como
trabajo activo pendiente. Antes de abrir tooling de backlog, conviene elegir
explicitamente uno de los cuatro feature-state tickets en curso:

1. `SST-4` / `sst-tags-governance`
2. `SST-6` / `learning-content-tags`
3. `SST-10` / `dictionary-tags`
4. `SST-12` / `sst-tag-prefix-engine`

La seleccion no debe ser automatica: Jira es una superficie de visibilidad, no
la fuente canonica ARDS/SDD. Cualquier avance funcional debe entrar por request
aprobado y evidencia local.

## Decision

Esta ejecucion no actualiza `state/features/*.yaml`, no mueve requests a done
por estado Jira, no escribe en Jira y no modifica repos funcionales hijos.
