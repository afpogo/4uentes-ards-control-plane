# Última revisión manual del contrato — CR-SST-0220

## Propósito

Esta revisión humana cierra el alcance documental del control plane. No sustituye el QA funcional posterior con Chrome DevTools MCP, que depende de implementar e integrar los owner slices.

## Checklist

- [ ] La acción nace en un artículo persistido y autorizado.
- [ ] V1 ofrece exactamente `full_document` y `sequential_paragraphs`; `hybrid` queda diferido.
- [ ] Cada cambio de modo, fuente o prompt crea un run nuevo o fork explícito.
- [ ] Todo run mantiene una cadena de contexto; en modo completo permanece vacía en versión 0.
- [ ] El modo completo no crea derivaciones por párrafo.
- [ ] El modo secuencial conserva orden, checkpoint, idempotencia y procedencia de `CR-SST-0219`.
- [ ] No existe truncamiento silencioso.
- [ ] Resultado técnico, resumen visible y propuesta de memoria son capas separadas.
- [ ] Publicar un resumen no acepta memoria.
- [ ] Artículo, contexto y prompt del usuario se tratan como datos no confiables frente a los guardrails.
- [ ] Bend, chatbot y Fend conservan límites de autoridad explícitos.
- [ ] Los repositorios hijos requieren requests posteriores y ARDS/SDD locales.
- [ ] El QA funcional final usa sólo Chrome DevTools MCP, UI y fixture sintético; no DB ni seeders.

## Resultado

Estado: `PENDIENTE`.

La aceptación o corrección debe ser registrada explícitamente por `4uentes` después de fusionar y leer de vuelta este gate. `CR-SST-0220` no puede pasar a `done` con este resultado pendiente.
