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

Estado del lote: `consumed-2026-08-23`.

El lote se ejecuto despues de confirmar el merge del lifecycle `running` en
`3d3b02f635141c03cf721686da51214b1c858595`. El readback sanitizado vive en
`jira-start-readback-2026-08-23.md`.
