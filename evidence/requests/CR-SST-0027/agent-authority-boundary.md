# CR-SST-0027 - Boundary De Autoridad Agentica

Observado el: 2026-06-04

## Correccion 2026-06-05

CR-SST-0030 reemplaza "ARDS/SDD final del usuario" por "memoria interna de
usuario SST".

El boundary sigue siendo valido: `sst-chatbot` propone hechos, intenciones,
resumenes o recuerdos; `sst-bend` o el backend autorizado valida scope,
permisos, idempotencia y persistencia antes de guardar memoria durable.

## Decision

`sst-chatbot` produce propuestas ARDS. No muta directamente el ARDS/SDD final
del usuario.

## Flujo Permitido

```text
sst-chatbot
  -> paragraph_derivation_run
  -> paragraph_derivation[]
  -> final_derivation_summary
  -> ards_proposal
  -> sst-bend validation
  -> optional user review
  -> user ARDS/SDD mutation
```

## Flujo No Permitido

```text
sst-chatbot
  -> direct write to user ARDS/SDD
```

## Responsabilidades

### `sst-chatbot`

- Segmenta o consume segmentacion de texto.
- Procesa secuencialmente.
- Mantiene contexto acumulado.
- Emite derivaciones estructuradas.
- Registra provenance y validation flags.
- Devuelve `ards_proposal`.

### `sst-bend`

- Valida identidad, scope, idempotencia y permisos.
- Acepta, rechaza o marca propuesta para revision.
- Decide persistencia durable del ARDS/SDD de usuario.
- Expone estados a la UI.

### `4uentes-orchestor`

- Registra lifecycle y evidencia.
- No ejecuta el agente ni persiste conocimiento del usuario.

## Relacion Con CR-SST-0021 Y CR-SST-0022

CR-SST-0021 implemento memoria operacional ARDS en `sst-chatbot`. Esa memoria
sirve para registros operacionales del agente.

CR-SST-0022 implemento un handoff fake local con estados de aceptacion para
revision. Ese handoff no equivale a ejecucion productiva ni mutacion real.

CR-SST-0027 usa esos antecedentes como boundaries: el agente puede producir
datos estructurados y validados, pero el ARDS/SDD final del usuario requiere
validacion y autoridad backend.
