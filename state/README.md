# State Read Model

Este directorio guarda la proyeccion consolidada de estado actual para
`features` y `bugfixes` de SST gobernados por el control-plane.

Estos archivos no son runtime productivo. Resumen el estado conocido desde
`requests`, `specs`, evidencia local y notas de validacion para que un agente
pueda responder "donde esta este trabajo ahora?" sin reescribir evidencia
historica.

## Archivos

- `00-index.yaml` lista todos los documentos actuales de estado.
- `state-machine.yaml` define estados canonicos y `bugfix markers`.
- `features/*.current.yaml` guarda estado actual de `features`.
- `bugfixes/*.current.yaml` guarda estado actual de `bugfixes`.

## Reglas

- Mantener identidades estables del catalogo en `catalog/services/*.yaml`.
- Mantener paths locales host-specific fuera de este directorio.
- Referenciar `requests`, `specs` y evidencia con paths relativos al repo.
- Usar `open_gaps` para deuda de gobernanza, evidencia o lifecycle.
- Preferir `warnings` para deuda historica existente; fallar errores
  estructurales en documentos nuevos de `state/`.
