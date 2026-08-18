# Handoff Entre sst-chatbot Y Orchestrator

## Proposito

Este documento registra la vista del control-plane sobre como `sst-chatbot`
queda gobernado por `4uentes-orchestor`.

`sst-chatbot` no puede ejecutar trabajo de servidor directamente. Puede emitir
operation intents validados y payloads de resultados agenticos. El orchestrator
decide si acepta, encola, reintenta, agenda, rechaza o reconcilia ese trabajo.

## Flujo Conectado Validado Históricamente

```text
sst-fend
  -> Socket.IO autenticado hacia sst-bend
  -> sst-bend persiste la conversación canónica
  -> HTTP NDJSON interno hacia sst-chatbot
  -> sst-chatbot produce deltas y resultados estructurados
  -> sst-bend persiste y emite el resultado
  -> el handoff gobernado conserva receipt durable y estado de revisión
```

Este flujo fue validado en local/dev de una sola instancia. El control-plane
conserva la autoridad sobre lifecycle, aceptación gobernada y evidencia, pero
no sustituye los contratos owner de `sst-bend` ni `sst-chatbot`.

## Contrato Inbound Requerido

La capability inbound del control-plane es:

```text
specs/capabilities/inbound/4uentes-orchestor--sst-chatbot-agent-handoff.yaml
```

La primera capability upstream mapeada es:

```text
agent-lifecycle-and-orchestrator-boundary
```

Capabilities upstream relacionadas:

- `plaud-transcript-derivations`
- `ards-structure-generation`
- `user-activity-ards-memory`
- `generated-workspace-governance`
- `prompt-catalog-and-versioning`

## Estado De Adopcion

El repo hijo tiene material ARDS/SDD, `docs/ai/policy.md`, policy registry local
y adopcion documentada de `orchestrator_link` reconciliada bajo `CR-SST-0082`.

La evidencia vigente esta en:

- `evidence/requests/CR-SST-0082/sst-chatbot-child-sync-diff.yaml`
- `evidence/requests/CR-SST-0082/validation-results.md`

## Estado Y Gap Abierto

El feature conectado queda `validated-local`, no `released`. La evidencia
histórica cubre HTTP NDJSON, Socket.IO, persistencia, replay y receipts en el
corte local/dev. La capability inbound específica del control-plane permanece
`draft`: este repositorio no contiene un runtime de aceptación de operation
intents y no puede atribuirse la implementación owner de `sst-bend`.

`CR-SST-0178` permanece `running` porque faltan el wiring GitOps persistente y
el cierre con un navegador aislado. Además, cualquier reanudación debe consumir
el contrato de sesión vigente de `CR-SST-0180`; la garantía histórica de
refresh/logout de `CR-SST-0166` quedó superada.

La reconciliación canónica y sus límites están en:

- `evidence/initiatives/INIT-SST-0007/canonical-reconciliation-2026-08-18.md`
- `evidence/requests/CR-SST-0178/current-status-reconciliation-2026-08-18.md`
