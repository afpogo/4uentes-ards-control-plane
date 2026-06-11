# CR-SST-0027 - Resumen De Implementacion

Observado el: 2026-06-04

## Resumen

Se inicio y cerro el lifecycle de CR-SST-0027 dentro del orquestador para
definir el contrato de derivacion secuencial por parrafos que alimenta el
ARDS/SDD de usuario.

La fase documenta como una fuente normalizada debe convertirse en propuestas
ARDS trazables mediante procesamiento secuencial, contexto acumulado,
derivaciones por parrafo y resumen final.

## Superficies Implementadas

- Contrato conceptual para `paragraph_sequence`.
- Contrato conceptual para `paragraph_derivation_run`.
- Contrato conceptual para `context_chain`.
- Contrato conceptual para `paragraph_derivation`.
- Contrato conceptual para `final_derivation_summary`.
- Mapping hacia `ards_proposal` definido en CR-SST-0026.
- Boundary de autoridad entre `sst-chatbot` y `sst-bend`.
- Evidencia de prompt versioning y provenance.
- Evidencia de fallback de subagentes.
- Cierre del request en `requests/done/`.

## Boundary

No se implemento codigo runtime, endpoints, migraciones, storage, UI, provider
real ni mutaciones de repos funcionales.

La decision principal es que el primer motor debe ser un pipeline secuencial
unico. No debe empezar con un subagente por parrafo, porque la continuidad
contextual es la funcionalidad central.

## Secuencia

CR-SST-0028 puede comenzar despues de aceptar esta evidencia. Ese request debe
definir como SST persistira, mostrara y permitira revisar las propuestas
generadas por este contrato.
