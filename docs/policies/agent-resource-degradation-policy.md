# Agent Resource Degradation Policy

## Proposito

Definir como degradar estrategia cuando los recursos, tokens, tiempo,
capacidad de runtime o contexto disponible son limitados.

## Alcance

Aplica a agentes que trabajan sobre el control-plane, sus repos adoptantes o
workflows ARDS/SDD relacionados.

## Cuando aplica

- Cuando el contexto disponible es insuficiente para una revision amplia.
- Cuando los tokens, tiempo o capacidad del modelo son bajos.
- Cuando una herramienta requerida no esta disponible.
- Cuando una validacion critica no puede ejecutarse.

## Cuando no aplica

- No justifica omitir evidencia requerida para cambios de riesgo alto.
- No permite modificar contratos sensibles con informacion incompleta.
- No reemplaza requests, specs ni aprobaciones existentes.

## Reglas obligatorias

- Reducir alcance al objetivo verificable mas pequeno.
- Evitar analisis globales innecesarios.
- Atomizar tareas grandes antes de continuar.
- Priorizar cambios pequenos y auditables.
- Usar modelos rapidos solo para tareas verificables y de bajo riesgo.
- Escalar a perfiles fuertes si el riesgo es alto.
- Declarar bloqueo si una tarea critica no puede resolverse con seguridad.

## Reglas recomendadas

- Leer indices y manifests antes de archivos extensos.
- Registrar gaps como `TODO` cuando falte informacion.
- Separar hallazgos, decisiones y follow-ups.
- Postergar trabajo cross-repo no critico a requests futuros.

## Relacion con ARDS/SDD

La degradacion de recursos no reduce las obligaciones ARDS/SDD. Solo ajusta el
modo de ejecucion para mantener trazabilidad y seguridad.

## Relacion con otras policies

- Usa `agent-context-management-policy` para ahorrar contexto.
- Usa `agent-task-atomization-policy` para reducir alcance.
- Usa `agent-model-selection-policy` para elegir perfiles bajo restriccion.
- Respeta `agent-architecture-boundary-policy` cuando el riesgo sea alto.

## Ejemplos genericos

- Revisar solo los indices relevantes antes de abrir todos los docs.
- Crear una policy draft con gaps marcados en vez de inventar informacion.
- Separar adopcion en repos hijos como follow-up si no hay request aprobado.

## Anti-patrones

- Hacer cambios amplios porque no queda contexto para revisar impacto.
- Ignorar validaciones fallidas por falta de tiempo.
- Delegar decisiones sensibles a perfiles rapidos.
- Inventar estado del repo para evitar una lectura minima.

## Criterios de fallback

- Si una validacion no corre, registrar comando y motivo.
- Si una herramienta falta, usar revision manual acotada.
- Si el riesgo no puede reducirse, detener y declarar bloqueo.

## Definition of Done

- El alcance degradado queda claro.
- Los gaps y bloqueos quedan documentados.
- No se comprometen contratos criticos sin evidencia suficiente.
- La siguiente unidad de trabajo queda atomizada o registrada como follow-up.
