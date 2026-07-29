# INIT-CP-0003 - Scope Runtime Enforcement ARDS/SDD

## Intencion

Construir el MVP del runtime de enforcement del stack ARDS/SDD empezando por
hacer cumplir policies y recursos vivos.

El objetivo no es crear una plataforma completa en el primer paso. El objetivo
es convertir policies criticas en controles ejecutables, con probes
reutilizables, gates claros y evidencia auditable.

## Fuentes

La iniciativa toma como referencia:

- `RFC-ARDS-Audit-Runtime-v0.1`
- arquitectura de referencia `control_plane-core/v1`
- `specs/integration/policies.yaml`
- `specs/policies/ards-sdd-policy-component-model.yaml`
- `evidence/requests/CR-CP-0003/policy-enforcement-gap-analysis.md`
- `evidence/requests/CR-CP-0003/audit-runtime-policy-enforcement-review.md`

## Principio De Diseno

El runtime debe aplicar SOLID y DRY:

- controles desacoplados de policies concretas;
- probes reutilizables;
- gates configurables por severidad;
- templates para agregar nuevas policies sin duplicar scripts;
- evidencia normalizada por corrida;
- separacion auditor-constructor cuando el riesgo lo requiera.

## Cadena Objetivo

```text
Policy -> Control -> Probe -> Gate -> Evidence -> State/CR
```

## MVP

El MVP debe cubrir:

- `AuditBinding` local;
- primer `Audit Pack` para policy enforcement;
- registry de controles/probes/gates;
- validator para `human-doc-language`;
- validator para metadata/adopcion de policies;
- `Audit Capsule` como evidencia normalizada;
- integracion inicial con `npm.cmd run check`;
- tickets Jira como mirror bajo la epica `ARDS-1`.

## Boundary

- No se mutan repos hijos en el MVP inicial.
- No se implementa autonomia runtime completa.
- No se cierran remediaciones automaticamente.
- Jira es mirror operativo, no source of truth.
