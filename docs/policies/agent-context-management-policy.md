# Agent Context Management Policy

## Proposito

Definir como administrar contexto para reducir consumo de recursos y mantener
evidencia suficiente.

## Alcance

Aplica a lectura, investigacion, planificacion, implementacion documental y
validacion agentica.

## Cuando aplica

- Antes de abrir archivos extensos.
- Al iniciar tareas en un repo desconocido o parcialmente conocido.
- Cuando hay indices, registries o manifests disponibles.
- Cuando el contexto empieza a ser un recurso limitante.

## Cuando no aplica

- No permite ignorar documentos normativos requeridos.
- No reemplaza validaciones cuando el cambio requiere evidencia.
- No autoriza inferir contratos sin leer la fuente aplicable.

## Reglas obligatorias

- Usar `AGENTS.md` como entrada operativa.
- Leer indices antes que archivos extensos.
- Leer specs, docs o playbooks relevantes para la tarea.
- Evitar abrir todo el repo sin necesidad.
- Resumir hallazgos cuando guien decisiones.
- Preservar evidencia y comandos relevantes.
- No repetir analisis ya realizados si hay evidencia vigente.

## Reglas recomendadas

- Usar busquedas focalizadas por ids, paths y conceptos.
- Preferir manifests machine-readable cuando existan.
- Separar facts observados de inferencias.
- Registrar gaps en vez de completar supuestos.

## Relacion con ARDS/SDD

El contexto se obtiene desde los artefactos ARDS/SDD aplicables: AGENTS,
catalogos, specs, requests, evidence, docs y playbooks.

## Relacion con otras policies

- Soporta `agent-resource-degradation-policy`.
- Alimenta `agent-model-selection-policy` con drivers de clasificacion.
- Reduce inputs para `agent-delegation-policy`.
- Ayuda a cumplir `agent-architecture-boundary-policy`.

## Ejemplos genericos

- Leer `specs/00-index.yaml` antes de abrir cada spec.
- Buscar una policy por id antes de crear una nueva.
- Reusar evidencia de requests previos cuando sea aplicable.

## Anti-patrones

- Abrir cientos de archivos sin pregunta concreta.
- Duplicar policies porque no se busco el registry.
- Mezclar observacion con decision sin evidencia.
- Repetir un analisis ya documentado sin motivo.

## Criterios de fallback

- Si no existe indice, usar busqueda focalizada.
- Si una fuente esperada falta, registrar gap.
- Si la evidencia es ambigua, pedir o crear una subtarea de discovery.

## Definition of Done

- Se revisaron entradas operativas e indices relevantes.
- Las decisiones citan o reflejan fuentes observadas.
- No se consumio contexto global innecesario.
- Los gaps quedan visibles.
