# Autorizacion Jira de inicio para CR-SST-0207

Fecha: 2026-08-23.

## Lote exacto

La aprobacion del usuario autoriza, una sola vez y solamente despues de publicar
el lifecycle `running`:

1. Verificar que `SST-117` refleja `CR-SST-0207`, es Subtask de `SST-113` y
   esta en `Tareas por hacer` sin resolucion.
2. Verificar que la transicion `En curso` tiene como destino `En curso`.
3. Transicionar solamente `SST-117` a `En curso`.
4. Releer status, categoria, resolucion, tipo y parent.

No se autorizan comentarios, campos, links, reparenting, creaciones, borrados ni
escrituras sobre `SST-113`, `SST-116` u otro issue.

Estado del lote: `authorized-pending-control-plane-running-merge`.
