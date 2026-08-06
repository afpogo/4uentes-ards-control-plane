# Model and Subagent Selection Policy

## Proposito

Este anexo aplica la `agent-model-selection-policy` al planner del control
plane. Decide como ejecutar trabajo con Codex; no autoriza cambios funcionales
ni reemplaza requests, ownership, specs o validaciones.

## Clasificacion previa

El planner conserva estas categorias:

- `short-defined-task`
- `long-context-task`
- `complex-high-risk-task`

La clasificacion se deriva de alcance, cantidad de servicios, riesgo,
seguridad, contratos, incertidumbre y validaciones requeridas.

## Disponibilidad de recursos

`model_selection.resource_level` acepta `very-low`, `low`, `normal` y `high`.
Si el inbox no lo declara, el planner usa:

```yaml
resource_level: "normal"
resource_source: "default"
```

Un valor declarado usa `resource_source: "manual"`. La fuente `runtime` se
incorporara cuando ARDS-13 implemente la senal automatica.

## Routing Codex

| Recursos | Tarea corta | Contexto largo | Alto riesgo |
| --- | --- | --- | --- |
| `high` | `gpt-5.6-sol/high` | `gpt-5.6-sol/high` | `gpt-5.6-sol/max` |
| `normal` | `gpt-5.6-sol/low` | `gpt-5.6-sol/high` | `gpt-5.6-sol/max` |
| `low` | `gpt-5.3-spark/low` | `gpt-5.4-fast-high/high` | `gpt-5.5/high` |
| `very-low` | Spark solo para bajo riesgo | atomizar o bloquear | bloquear |

El mapa anterior se conserva como degradacion de recursos, no como evidencia
historica obsoleta ni como una segunda policy.

## Subagentes y seguridad

Las reglas de delegacion existentes no cambian. Un nivel bajo de recursos no
autoriza delegar seguridad, arquitectura o contratos a un perfil rapido. Bajo
`very-low`, el planner debe fallar si la tarea no puede reducirse a una unidad
corta, verificable y de bajo riesgo.

## Compatibilidad

- La policy conserva su id actual.
- Requests y evidencia existentes no se migran.
- Repos hijos adoptan la revision mediante request y manifest separados.
- `gpt-5.6` puede resolverse como alias de `gpt-5.6-sol`.
