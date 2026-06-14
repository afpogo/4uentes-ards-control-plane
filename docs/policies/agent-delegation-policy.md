# Agent Delegation Policy

## Proposito

Definir cuando delegar trabajo a subagentes, perfiles rapidos u otros modelos
sin perder control de arquitectura, seguridad o contratos.

## Alcance

Aplica a agentes principales que reparten subtareas de discovery, revision,
documentacion, validacion o implementacion acotada.

## Cuando aplica

- La tarea es acotada.
- El contexto esta definido.
- El riesgo es bajo o medio controlado.
- La salida es verificable.
- La subtarea no redefine contratos ni arquitectura.

## Cuando no aplica

No delegar a modelos rapidos cuando la subtarea incluye:

- seguridad;
- autenticacion;
- autorizacion;
- RBAC;
- datos sensibles;
- contratos API criticos;
- ownership cross-repo;
- migraciones criticas;
- decisiones arquitectonicas.

## Reglas obligatorias

- El agente principal conserva responsabilidad sobre integracion y decision.
- Toda delegacion debe tener input minimo y output esperado.
- Las salidas delegadas deben verificarse antes de aplicarse.
- No delegar redefinicion de baseline ARDS/SDD.
- Registrar fallback si los subagentes requeridos no estan disponibles.

## Reglas recomendadas

- Delegar lectura o comparacion documental acotada.
- Usar modelos rapidos para tareas mecanicas, repetitivas o de bajo riesgo.
- Mantener decisions finales en el agente principal o en el proceso humano
  definido.

## Relacion con ARDS/SDD

La delegacion es una tecnica de ejecucion, no una transferencia de ownership ni
autoridad de contrato.

## Relacion con otras policies

- Depende de `agent-task-atomization-policy` para definir subtareas.
- Usa `agent-model-selection-policy` para elegir perfiles.
- Usa `agent-context-management-policy` para inputs minimos.
- Respeta `agent-architecture-boundary-policy`.

## Ejemplos genericos

- Delegar la busqueda de referencias a una policy existente.
- Delegar una revision de formato YAML.
- No delegar una decision sobre boundaries de auth o RBAC.

## Anti-patrones

- Delegar con contexto ambiguo.
- Aplicar output no verificado.
- Usar un subagente para decidir arquitectura.
- Usar delegacion para saltar aprobaciones o requests.

## Criterios de fallback

- Si no hay subagentes, ejecutar secuencialmente y registrar fallback.
- Si el output delegado no es verificable, descartarlo o reducir alcance.
- Si aparece riesgo alto, reclasificar y detener delegacion rapida.

## Definition of Done

- La delegacion tiene scope, inputs y output.
- El resultado fue verificado por el agente principal.
- No se transfirio autoridad sobre contratos, seguridad o arquitectura.
