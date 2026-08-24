# Descripción Jira Propuesta Para CR-SST-0219

## Autoridad

Jira es el espejo operativo. El lifecycle, alcance, decisiones y evidencia
autoritativos viven en `4uentes-ards-control-plane` bajo `CR-SST-0219` e
`INIT-SST-0010`.

## Objetivo

Adoptar el contrato ARDS/SDD de derivación secuencial de fuentes largas por
párrafos. Cada `DERIVATION_RUN` mantiene una `CONTEXT_CHAIN`, produce
`PARAGRAPH_DERIVATION` ordenadas y puede finalizar en una propuesta durable
pendiente de revisión humana.

## Alcance

- Definir agregado, entidades, orden, estados, provenance e idempotencia.
- Definir `open-general-analysis` como prompt default gobernado.
- Permitir profiles e instrucciones de usuario versionadas.
- Definir que cambiar el prompt crea otra corrida o fork.
- Preservar `sst-bend` como autoridad de memoria y `sst-chatbot` como analista.
- Ordenar los CRs posteriores de Bend, chatbot, integración, frontend y E2E.
- Exigir ARDS/SDD owner y QA manual de última revisión en cada cierre.

## Fuera De Alcance

- Código o runtime en repos funcionales.
- Despliegue, producción, provider externo, embeddings o vector store.
- Adopción automática de memoria.
- Contenido privado, prompts reales o datos de usuarios en Jira.

## Dependencias Cerradas

- `CR-SST-0192`: contrato de memoria.
- `CR-SST-0193`: runtime canónico.
- `CR-SST-0210`: identidad y scope.
- `CR-SST-0194`: proposal y recall del chatbot.

## Gates De Cierre

- Contrato materializado y consistente con owner boundaries.
- QA manual de última revisión aprobado por `4uentes`.
- `npm run check` y `git diff --check` en PASS.
- Descripción Jira actualizada con el resultado final.
- Comentario y transición terminal sólo después del lifecycle local `done`.

## Estado Inicial Propuesto

`Tareas por hacer`. La transición a `En curso` requiere lifecycle publicado,
preflight Jira repetido y autorización exacta del lote.
