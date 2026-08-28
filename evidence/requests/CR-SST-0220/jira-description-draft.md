# Borrador de descripción Jira — CR-SST-0220

## Objetivo

Generalizar el contrato de derivación secuencial para que un artículo persistido pueda procesarse con un agente mediante dos modos explícitos: documento completo o lectura secuencial por párrafos.

## Contrato V1 aprobado

El control plane publicó y aprobó manualmente `sst-article-agent-processing-v1@1.0.0`. El contrato separa resultado técnico, resumen visible y propuesta de memoria; mantiene una `CONTEXT_CHAIN` por `DERIVATION_RUN`; y admite `full_document` y `sequential_paragraphs` sin truncamiento silencioso.

## Alcance de adopción

- Incorporar `Procesar con agente` en el detalle del artículo persistido.
- Registrar el modo, la fuente, la versión de prompt y las instrucciones como entradas inmutables de cada run.
- Producir un resultado técnico con procedencia y un resumen visible en estado borrador.
- Mantener la propuesta de memoria separada y en revisión; nunca adoptar memoria automáticamente.
- Crear nuevos runs al cambiar modo o prompt, preservando resultados anteriores.
- Prohibir truncamiento silencioso y tratar el contenido del artículo como entrada no confiable.

## Lifecycles owner reservados

- `CR-SST-0223`: autorización y persistencia en `sst-bend`.
- `CR-SST-0224`: pipeline, prompts y guardrails en `sst-chatbot`.
- `CR-SST-0225`: integración durable Bend–chatbot.
- `CR-SST-0226`: acción, selección, progreso y revisión en `sst-fend`.
- `CR-SST-0227`: QA end-to-end y gate de adopción.

La reserva de estos lifecycles no autoriza todavía cambios en repositorios hijos.

## Validación

El QA final se ejecutará exclusivamente con Chrome DevTools MCP, creando el artículo desde la interfaz y sin scripts de base ni seeders. Debe probar ambos modos, cambios de prompt, aislamiento frente a prompt injection, reintentos y separación entre resumen y memoria.

## Estado y límites

Este ticket espeja el contrato activo del control plane. No autoriza por sí mismo cambios en repositorios hijos, runtime, datos o infraestructura. Los links de PR owner, checks, QA manual y readbacks se incorporarán cuando cada lifecycle alcance evidencia terminal.
