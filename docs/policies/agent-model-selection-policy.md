# Agent Model Selection Policy

## Proposito

Definir como seleccionar modelo, perfil o subagente segun el peso de una tarea
agentica dentro del stack ARDS/SDD.

## Alcance

Aplica a agentes que planifican, investigan, documentan o ejecutan cambios bajo
este control-plane o repos que adopten sus policies.

## Cuando aplica

- Antes de planificar o ejecutar una tarea.
- Al registrar requests, planes, handoffs o evidencia agentica.
- Cuando una tarea puede requerir subagentes, perfiles distintos o mas
  razonamiento.

## Cuando no aplica

- No autoriza cambios funcionales por si misma.
- No reemplaza contratos, specs, ownership ni decisiones ARDS/SDD.
- No obliga a usar un proveedor especifico si el entorno usa otros aliases.

## Reglas obligatorias

- Clasificar la tarea como `short-defined-task`, `long-context-task` o
  `complex-high-risk-task`.
- Tratar los nombres de modelos como aliases configurables del entorno.
- Para trabajo planificado, registrar `task_weight`, `model_selection` y
  `subagent_deployment_plan`.
- Si el runtime no soporta subagentes, registrar fallback explicito.
- Escalar a mayor razonamiento cuando haya impacto sobre seguridad,
  autenticacion, autorizacion, RBAC, datos sensibles, contratos API, ownership
  cross-repo o arquitectura.

## Reglas recomendadas

- Usar `gpt-5.3-spark` como alias rapido para `short-defined-task`.
- Usar `gpt-5.4-fast-high` como alias de contexto amplio para
  `long-context-task`.
- Usar `gpt-5.5` como alias de mayor razonamiento para
  `complex-high-risk-task`.
- Preferir perfiles rapidos solo cuando el output sea acotado y verificable.

## Relacion con ARDS/SDD

Esta policy complementa ARDS/SDD. Define como ejecutar trabajo agentico, no que
contratos puede cambiar un agente.

## Relacion con otras policies

- Usa `agent-task-atomization-policy` para dividir tareas grandes.
- Usa `agent-delegation-policy` para decidir si subagentes son adecuados.
- Usa `agent-resource-degradation-policy` cuando los recursos sean limitados.
- Respeta `agent-architecture-boundary-policy` para tareas de alto riesgo.

## Ejemplos genericos

- `short-defined-task`: corregir una referencia documental puntual.
- `long-context-task`: revisar varios docs y crear un registry coherente.
- `complex-high-risk-task`: cambiar ownership cross-repo o reglas de auth.

## Anti-patrones

- Usar un modelo rapido para decisiones de seguridad o arquitectura.
- Bloquear la ejecucion porque un alias exacto no existe en el runtime.
- Registrar una clasificacion sin explicar drivers de riesgo.
- Usar esta policy para saltar el lifecycle de requests.

## Criterios de fallback

- Si falta el alias exacto, usar el perfil disponible mas cercano.
- Si no hay subagentes, ejecutar secuencialmente y registrar la limitacion.
- Si la tarea critica no puede resolverse con seguridad, declarar bloqueo.

## Definition of Done

- La tarea esta clasificada.
- El perfil/modelo elegido esta documentado cuando el trabajo es planificado.
- Los aliases se tratan como configuracion.
- Cualquier fallback queda registrado.
