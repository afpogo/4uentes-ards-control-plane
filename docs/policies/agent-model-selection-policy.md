# Agent Model Selection Policy

## Proposito

Definir como seleccionar modelos Codex segun el peso y riesgo de la tarea y la
disponibilidad operativa de recursos, preservando una degradacion segura.

## Alcance

Esta extension aplica solamente al proveedor `codex`. Conserva el id
`agent-model-selection-policy` y su intencion original. No crea una policy v2.

Hasta que `INIT-CP-0003` / `ARDS-13` provea una senal de runtime,
`resource_level` se declara manualmente y usa `normal` por defecto.

## Datos requeridos

El trabajo planificado registra:

- `provider`
- `resource_level`
- `resource_source`
- `primary_profile`
- `reasoning_effort`
- `fallback_profile`
- `reason`

Los niveles validos son `very-low`, `low`, `normal` y `high`. Las fuentes
validas son `default`, `manual` y `runtime`. `runtime` queda reservado para
ARDS-13.

## Matriz de seleccion

| Recursos | `short-defined-task` | `long-context-task` | `complex-high-risk-task` |
| --- | --- | --- | --- |
| `high` | Sol `high` | Sol `high` | Sol `max` |
| `normal` | Sol `low` | Sol `high` | Sol `max` |
| `low` | `gpt-5.3-spark` `low` | `gpt-5.4-fast-high` `high` | `gpt-5.5` `high` |
| `very-low` | Spark `low`, solo si es acotada y de bajo riesgo | atomizar, reducir o bloquear | bloquear |

Sol se registra como `gpt-5.6-sol`; `gpt-5.6` puede resolverse como alias
equivalente cuando el entorno lo exponga.

## Reglas obligatorias

- Clasificar la tarea antes de seleccionar modelo.
- Usar `normal/default` cuando no exista una senal explicita.
- Registrar cualquier override manual y el nivel efectivo de recursos.
- Tratar la falta de Sol como degradacion y aplicar la fila correspondiente.
- No degradar silenciosamente trabajo de seguridad, auth, RBAC, datos
  sensibles, contratos, ownership o arquitectura.
- En `very-low`, ejecutar solamente unidades cortas, verificables y de bajo
  riesgo con Spark; atomizar o bloquear el resto.
- Mantener requests y evidencia historica sin reescribir aliases anteriores.

## Relacion con otras policies

- `agent-resource-degradation-policy` gobierna reduccion de alcance y bloqueo.
- `agent-task-atomization-policy` permite convertir trabajo amplio en unidades
  seguras bajo recursos muy bajos.
- `agent-delegation-policy` conserva las restricciones de subagentes.
- `agent-architecture-boundary-policy` impide degradar decisiones sensibles.

## Fallback

Para recursos `low` se reutiliza el mapa anterior completo. Para recursos
`normal` o `high`, el perfil anterior correspondiente a la clasificacion se
registra como fallback. Si usarlo no conserva seguridad y verificabilidad, el
agente reduce alcance o declara bloqueo.

## Definition of Done

- La tarea y el nivel de recursos estan registrados.
- Modelo y reasoning coinciden con la matriz.
- El origen de la senal queda documentado.
- La degradacion no reduce obligaciones ARDS/SDD.
- Cualquier fallback o bloqueo queda como evidencia.
