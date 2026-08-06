# CR-SST-0113 - Delegacion De Subagentes

## Objetivo

Aplicar la politica de subagentes antes de implementar `SST-43`, manteniendo al
agente principal como responsable de la decision final y de la integracion.

## Politicas Aplicadas

- `agent-delegation-policy`
- `agent-task-atomization-policy`
- `owner-documentation-authority-policy`
- `human-doc-language`

## Clasificacion

- Tarea: implementacion frontend con mutacion de repo hijo.
- Riesgo: medio.
- Owner enforcement: obligatorio.
- Arquitectura sensible: controlada; no se delega decision de contrato ni
  persistencia.

## Subagentes Desplegados

### Subagente 1 - Revision ARDS/SDD

- Tipo: explorer.
- Scope: solo lectura en `4uentes-orchestor`.
- Inputs:
  - `requests/planned/CR-SST-0113-sst-fend-editable-text-sheet-first-slice.yaml`
  - `evidence/requests/CR-SST-0112/ux-contract.md`
  - `evidence/requests/CR-SST-0111/tagging-intent-contract.md`
  - policies de delegacion, atomizacion y owner docs.
- Output esperado:
  - readiness del plan;
  - riesgos/gaps;
  - owner enforcement esperado;
  - DoD recomendado.

### Subagente 2 - Readiness De `sst-fend`

- Tipo: explorer.
- Scope: solo lectura en `sst-fend`.
- Inputs:
  - `AGENTS.md`
  - `package.json`
  - `specs/00-index.yaml`
  - `docs/00-overview.md`
  - referencias a `LearningWorkspace`, Article creation, Text tab y owner docs.
- Output esperado:
  - readiness del hijo;
  - rutas probables de codigo/docs/tests;
  - comandos de validacion;
  - riesgos de owner docs o arquitectura.

## Reglas De Integracion

- Los subagentes no editan archivos.
- El agente principal verifica los hallazgos antes de aplicarlos.
- Si aparece riesgo de contrato o arquitectura, se registra gap antes de
  implementar.
- Ningun resultado delegado reemplaza owner documentation del repo hijo.
