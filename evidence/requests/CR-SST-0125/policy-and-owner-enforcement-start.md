# CR-SST-0125 - Policy And Owner Enforcement Start

## Estado

- Fecha: 2026-07-10
- Initiative: `INIT-SST-0001`
- Parent Jira mirror: `SST-6`
- Request: `CR-SST-0125`
- Target owner repo: `sst-bend`

## Policies Aplicadas

- `owner-documentation-authority-policy`
- `agent-architecture-boundary-policy`
- `agent-task-atomization-policy`
- `agent-delegation-policy`
- `agent-context-management-policy`

## Owner Boundary

`sst-bend` es autoridad primaria para el comportamiento runtime de
`LearningWorkspace` y para la capability outbound
`learning-workspace-context`.

El control-plane registra lifecycle, evidencia, Jira mirror y enforcement. No
reemplaza los docs/specs owner del repo hijo.

## Mutacion Permitida

Mutacion permitida solo en `sst-bend`:

- runtime preview/import normalization;
- pruebas enfocadas;
- owner docs/specs relacionados.

`node-auth` y `sst-fend` quedan verify-only salvo evidencia runtime contraria.

## Enforcement

Antes de cierre local deben existir:

- docs/specs owner actualizados en `sst-bend`;
- evidencia central con rutas exactas;
- checks de `sst-bend`;
- `npm.cmd run check` del control-plane con owner-documentation gate.
