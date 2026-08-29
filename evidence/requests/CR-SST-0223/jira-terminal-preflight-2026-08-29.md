# Preflight Jira terminal de CR-SST-0223

## Resultado de lectura

El `2026-08-29`, Atlassian MCP confirmó sin escrituras:

| Campo | Valor observado |
| --- | --- |
| Issue | `SST-123` |
| Tipo | `Subtask` (`10006`) |
| Parent | `SST-122` |
| Estado | `En curso` (`10006`) |
| Categoría | `En curso` |
| Resolución | vacía |
| Resumen | `[SST][CR-SST-0223] Persist governed article processing runs and summaries` |
| Transición terminal disponible | `41`, `Listo` → `Finalizada` (`10008`) |

La descripción actual coincide con el alcance owner planificado y todavía no
contiene el resultado de implementación.

## Lote exacto propuesto

El lote sólo podrá ejecutarse después de fusionar y leer nuevamente la
reconciliación owner del control plane y de recibir una autorización humana
explícita nueva.

1. Reemplazar únicamente la descripción de `SST-123` con el contenido exacto
   de `evidence/requests/CR-SST-0223/jira-terminal-description-draft-2026-08-29.md`.
2. Aplicar únicamente la transición `41` sobre `SST-123`.
3. Leer nuevamente issue, parent, estado, categoría, resolución y descripción.

Escrituras máximas permitidas si se autoriza: `2`. El readback no cuenta como
escritura.

Quedan prohibidos comentarios, links, cambios de resumen, assignee, labels,
prioridad, parent, otros campos, otros issues o cualquier transición distinta.
Si el estado, parent, resumen, descripción o transición disponible difieren del
preflight, el lote debe bloquearse y volver a revisión.

## Autorización

Estado: `pendiente`. La autorización usada para crear y llevar `SST-123` a
`En curso` está consumida y no habilita este lote terminal.
