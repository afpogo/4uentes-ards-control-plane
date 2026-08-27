# Plan de adopción de procesamiento de artículos con agente

## Propósito del gate

`CR-SST-0220` amplía el contrato de derivación secuencial de `CR-SST-0219` para que la acción nazca en un artículo persistido. Este gate sólo publica el plan del control plane: no implementa botones, endpoints, persistencia, agentes ni escrituras en Jira.

La primera versión ofrece dos estrategias explícitas:

- `full_document`: el agente interpreta la fuente completa y produce una derivación final.
- `sequential_paragraphs`: el agente recorre la secuencia de párrafos, conserva una cadena de contexto acotada y después produce la derivación final.

El modo híbrido queda fuera de alcance hasta contar con evidencia de límites de tamaño, calidad y costo.

## Decisiones del contrato

1. La acción `Procesar con agente` sólo puede iniciarse sobre un artículo que ya tiene identidad persistida.
2. Cada acción crea un `DERIVATION_RUN`; no modifica ejecuciones previas.
3. El modo, la versión de fuente, el perfil de prompt y las instrucciones del usuario son entradas inmutables del run.
4. `ARTICLE_PROCESSING_RESULT` conserva el resultado técnico y su procedencia.
5. `ARTICLE_SUMMARY` es la proyección visible y revisable asociada al artículo. Publicarla exige una decisión explícita.
6. `DERIVATION_MEMORY_PROPOSAL` es opcional y nace en `needs_review`. No se acepta memoria automáticamente.
7. El contenido del artículo se trata como dato no confiable; no puede cambiar guardrails, autorización, esquema de salida ni política de memoria.
8. No hay truncamiento silencioso. Si el documento excede el límite, la interfaz debe explicar el límite y permitir elegir el modo secuencial o una estrategia acotada aprobada.

## Mapa del gate y sus hijos

<!-- visual-map:start -->

```yaml
visual_map:
  schema_version: "1.0"
  id: "article-agent-processing-adoption-gates"
  type: "lifecycle"
  question: "¿Cómo avanza el contrato base hasta la adopción y validación del procesamiento de artículos?"
  abstraction_level: "Gates de adopción del control plane y futuros owners."
  source_refs:
    - "requests/planned/CR-SST-0220-generalize-agent-processing-modes-for-articles.yaml"
    - "requests/planned/CR-SST-0219-adopt-paragraph-sequential-derivation-contract.yaml"
  observed_at: "2026-08-27"
  authority_boundary: "Vista derivada; los request lifecycle y los ARDS/SDD de cada owner conservan autoridad."
  textual_fallback_required: true
  request_ids: ["CR-SST-0219", "CR-SST-0220"]
```

```mermaid
flowchart LR
    BASE["CR-SST-0219 contrato secuencial [validated]"]
    PLAN["CR-SST-0220 plan general de artículos [planned]"]
    RUN["Contrato versionado [gate]"]
    OWNERS["Bend + chatbot + Fend [gate]"]
    QA["QA manual Chrome DevTools [gate]"]
    CLOSE["Publicación terminal [gate]"]
    BASE -->|"base secuencial reutilizada"| PLAN
    PLAN -->|"merge y readback habilitan autorización"| RUN
    RUN -->|"reserva requests hijos antes de mutar"| OWNERS
    OWNERS -->|"integración desplegada habilita"| QA
    QA -->|"PASS humano habilita"| CLOSE
    classDef validated fill:#dcfce7,stroke:#15803d,color:#052e16
    classDef planned fill:#e0f2fe,stroke:#0284c7,color:#082f49
    classDef gate fill:#fef3c7,stroke:#d97706,color:#451a03
    class BASE validated
    class PLAN planned
    class RUN,OWNERS,QA,CLOSE gate
```

### Fallback textual

```text
CR-SST-0219 aporta el contrato secuencial validado. CR-SST-0220 generaliza esa base para artículos y permanece planned hasta su merge y readback. Una autorización posterior permite materializar el contrato versionado. Ese contrato habilita reservar requests separados para Bend, chatbot, Fend, integración y E2E antes de cualquier mutación. La integración aprobada habilita el QA manual por Chrome DevTools; sólo un PASS humano habilita la publicación terminal.
```

<!-- visual-map:end -->

## Flujo funcional propuesto

El usuario guarda el artículo y luego abre `Procesar con agente`. El diálogo muestra el modo, el prompt abierto por defecto y la posibilidad de seleccionar otro perfil o escribir instrucciones. Al confirmar, la interfaz envía una intención idempotente; el backend autoriza el artículo y crea el run; el chatbot ejecuta el modo elegido; el backend persiste resultado y procedencia; finalmente la interfaz presenta el resumen como borrador para revisar, publicar, rechazar o volver a ejecutar.

En modo completo hay cero `PARAGRAPH_DERIVATION` y una `CONTEXT_CHAIN` vacía en V1. En modo secuencial se conserva la regla de `CR-SST-0219`: cero o más derivaciones ordenadas, una cadena de contexto versionada y una derivación final sólo tras completar el recorrido válido.

## Orden de adopción

1. Fusionar este inbox, plan, mapa, estado y QA; validar el `main` remoto.
2. Solicitar autorización explícita para promover `CR-SST-0220` a `running` y materializar el contrato versionado.
3. Reservar requests numéricos diferentes para persistencia Bend, pipeline chatbot, experiencia Fend, integración y E2E.
4. Implementar cada owner sólo después de publicar y autorizar su lifecycle; actualizar su ARDS/SDD local.
5. Ejecutar la última revisión exclusivamente con Chrome DevTools MCP, sin scripts de base ni seeders.
6. Cerrar el lifecycle y reconciliar Jira únicamente con un lote exacto y autorizado.

## Fuera de alcance

- Cambiar código de `sst-bend`, `sst-chatbot` o `sst-fend`.
- Convertir automáticamente un resumen en memoria canónica.
- Procesar artículos aún no persistidos.
- Guardar credenciales, prompts privados o contenido bruto en Jira, capturas o logs operativos.
- Definir el modo híbrido o políticas finales de límites antes de medir el runtime.

## Criterio de salida de este gate

El gate termina cuando los artefactos planeados pasan `npm run check` y `git diff --check`, quedan fusionados y se verifica su lectura desde `origin/main`. El próximo gate será la autorización separada para `running`; este documento no la concede.
