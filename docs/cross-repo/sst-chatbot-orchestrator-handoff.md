# Handoff Entre sst-chatbot Y Orchestrator

## Proposito

Este documento registra la vista del control-plane sobre como `sst-chatbot`
queda gobernado por `4uentes-orchestor`.

`sst-chatbot` no puede ejecutar trabajo de servidor directamente. Puede emitir
operation intents validados y payloads de resultados agenticos. El orchestrator
decide si acepta, encola, reintenta, agenda, rechaza o reconcilia ese trabajo.

## Flujo Actual

```text
sst-bend event or SST request
  -> 4uentes-orchestor schedules agent work
  -> sst-chatbot produces structured validated output
  -> 4uentes-orchestor validates and records outcome
  -> SST-owned service consumes accepted result
```

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

## Gap Abierto

El transporte real del handoff sigue sin seleccion. HTTP, queue y worker siguen
como opciones abiertas. La capability inbound permanece en `draft` hasta que un
request aprobado seleccione e implemente un transporte runtime real.

## Recomendacion De Siguiente Corte

La recomendacion vigente del control-plane es abrir el primer boundary runtime
con `HTTP ingress` hacia `4uentes-orchestor`, dejando queueing, retries y
scheduling como concerns internos del orchestrator despues de la aceptacion.

Motivo:

- preserva mejor la frontera proposal-only de `sst-chatbot`;
- concentra auth, idempotency, audit y rechazo temprano en el punto de
  aceptacion del orchestrator;
- evita exponer una queue directa como si fuera el contrato externo primario.

Esta recomendacion queda registrada en `CR-SST-0083`. No promueve la capability
fuera de `draft` ni autoriza implementacion runtime por si sola.
