# Borrador de descripción Jira — CR-SST-0220

## Objetivo

Generalizar el contrato de derivación secuencial para que un artículo persistido pueda procesarse con un agente mediante dos modos explícitos: documento completo o lectura secuencial por párrafos.

## Alcance del plan

- Incorporar `Procesar con agente` en el detalle del artículo persistido.
- Registrar el modo, la fuente, la versión de prompt y las instrucciones como entradas inmutables de cada run.
- Producir un resultado técnico con procedencia y un resumen visible en estado borrador.
- Mantener la propuesta de memoria separada y en revisión; nunca adoptar memoria automáticamente.
- Crear nuevos runs al cambiar modo o prompt, preservando resultados anteriores.
- Prohibir truncamiento silencioso y tratar el contenido del artículo como entrada no confiable.

## Owners futuros

- `sst-bend`: autorización, persistencia de runs, resultados, resúmenes y propuestas.
- `sst-chatbot`: ejecución de ambos modos, composición de prompts y guardrails.
- `sst-fend`: acción, selección, progreso y revisión del resumen.
- integración y E2E: contratos de handoff y prueba final.

## Validación

El QA final se ejecutará exclusivamente con Chrome DevTools MCP, creando el artículo desde la interfaz y sin scripts de base ni seeders. Debe probar ambos modos, cambios de prompt, aislamiento frente a prompt injection, reintentos y separación entre resumen y memoria.

## Estado y límites

Este ticket está en gate de planificación del control plane. No autoriza cambios en repositorios hijos, runtime, datos, infraestructura ni Jira. La descripción final incorporará links de PR, checks, QA manual y readback sólo cuando exista evidencia terminal.
