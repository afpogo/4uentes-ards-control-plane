# Agent Task Atomization Policy

## Proposito

Definir como dividir tareas grandes en unidades pequenas, verificables y
auditables.

## Alcance

Aplica a tareas agenticas de discovery, planificacion, documentacion,
implementacion, validacion y adopcion ARDS/SDD.

## Cuando aplica

- Cuando una tarea atraviesa varios archivos, repos, capas o dominios.
- Cuando el riesgo o incertidumbre impide ejecutar todo en una sola unidad.
- Cuando hay restricciones de recursos o contexto.
- Antes de delegar subtareas.

## Cuando no aplica

- No requiere fragmentar cambios triviales que ya son pequenos y claros.
- No permite partir una decision arquitectonica para evitar aprobaciones.
- No reemplaza el lifecycle de requests.

## Reglas obligatorias

Cada subtarea debe declarar, cuando corresponda:

- objetivo claro;
- inputs minimos;
- output esperado;
- archivos o dominios relevantes;
- riesgo;
- modelo o perfil sugerido;
- validacion o Definition of Done.

## Reglas recomendadas

- Mantener subtareas independientes cuando sea posible.
- Separar lectura, decision, edicion y validacion.
- Registrar follow-ups en vez de ampliar alcance silenciosamente.
- Preferir entregables pequenos que puedan revisarse en diff.

## Relacion con ARDS/SDD

La atomizacion conserva ownership, requests, contracts y evidence. No cambia el
modelo de autoridad ARDS/SDD.

## Relacion con otras policies

- Alimenta `agent-delegation-policy` con unidades delegables.
- Ayuda a `agent-resource-degradation-policy` bajo recursos bajos.
- Informa `agent-model-selection-policy` por riesgo y tamano.
- Debe respetar `agent-architecture-boundary-policy`.

## Ejemplos genericos

- Primero registrar policies, luego actualizar indices, luego validar.
- Separar adopcion en repos hijos como request futuro.
- Delegar una lectura documental acotada con output verificable.

## Anti-patrones

- Crear subtareas sin output verificable.
- Fragmentar para ocultar impacto cross-repo.
- Mezclar cambios funcionales con governance documental.
- Dejar subtareas sin owner, DoD o evidencia.

## Criterios de fallback

- Si no se puede completar una subtarea, registrar gap y siguiente accion.
- Si la subtarea revela mayor riesgo, reclasificarla antes de seguir.
- Si el contexto falta, reducir la unidad hasta poder verificarla.

## Definition of Done

- Las subtareas tienen objetivo, inputs, output y validacion.
- El alcance de cada unidad es auditable.
- Los follow-ups quedan separados del cambio actual.
