# CR-SST-0068 Diseno De Vista Admin

## Primera Vista

La primera vista admin es un archivo HTML estatico local generado desde el read model. No es una UI productiva y no debe requerir servidor web, watcher, polling, base de datos ni servicio runtime.

## Modelo De Refresh

El refresh es on-demand:

1. El operador ejecuta el futuro comando de generacion de observabilidad.
2. El comando recalcula estado por repositorio, solucion y global.
3. El comando escribe artefactos YAML, JSON y HTML estatico.
4. El operador abre o recarga el archivo HTML estatico.

Este es el significado operativo inicial de "tiempo real" para CR-SST-0068.

## Tabla Requerida

El dashboard debe mostrar una tabla de repositorios con:

- Identidad de repositorio o servicio.
- Grupo de servicio.
- Estado actual.
- Drift abierto.
- Ultimo check.
- Accion recomendada.

## Acciones Esperadas

Las acciones recomendadas deben mantenerse como guia read-only, por ejemplo:

- "Ejecutar validacion local."
- "Revisar el ultimo `ards_child_sync_diff`."
- "Abrir un nuevo request antes de modificar un repositorio hijo."
- "Registrar TODO o excepcion."

El dashboard no debe ofrecer un boton de escritura automatica sobre repositorios hijos.

## Presentacion De Severidad

La vista debe distinguir:

- Conflictos core bloqueantes.
- Riesgos de servicios shared.
- Drift de servicios optional.
- Drift de infrastructure.
- Observaciones informativas de working tree dirty.

El drift optional e infrastructure debe seguir visible sin ocultar el baseline core.
