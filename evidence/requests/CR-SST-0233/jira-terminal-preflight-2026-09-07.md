# Preflight del lote terminal Jira de CR-SST-0233

## Autoridad y alcance

Evidencia del control-plane para preparar la sincronización de estado de
SST-125. No autoriza escritura. El PR terminal #280 quedó MERGED con head
aa513c5568ce99c08594f5c26c9fc3bc1fb5db83 y merge
3bebeacd55a64ce5751bebcf2f80a0f6327ddf43, el 2026-09-08T00:31:25Z.
Se verificaron la presencia del done en origin/main y la inclusión del head.

## Lecturas verificadas

- Proyecto SST; issue SST-125, tipo Subtask.
- Summary: [SST][CR-SST-0233] Reconcile fresh-database migration baseline.
- Parent SST-122, tipo Tarea, bajo la Epic SST-105 de INIT-SST-0010.
- Estado Tareas por hacer (10005), resolution null.
- JQL project = SST AND text ~ "CR-SST-0233": un resultado, SST-125,
  página final; no duplicados encontrados.
- Transición 41, Listo, disponible, global y sin pantalla; destino Finalizada
  (10008), categoría done.

## Lote exacto pendiente de aprobación

```yaml
request_id: CR-SST-0233
provider: jira
project: SST
issue_key: SST-125
issue_type: Subtask
parent_issue_key: SST-122
epic_key: SST-105
authorization_status: pending
expected_current_status: "Tareas por hacer"
expected_current_status_id: "10005"
write_count: 1
operations:
  - action: transition
    transition_id: "41"
    target_status: "Finalizada"
    target_status_id: "10008"
  - action: read-back
    fields: [status, resolution, parent, issuetype, summary]
execution_window: "one execution turn following approval and renewed preconditions"
forbidden_operations: [comment, edit, link, create, delete, write-other-issues]
```

La transición sincroniza el estado real de cierre sin simular estados
intermedios históricos. La resolución se observará después; no se presupone
su valor ni se autoriza editarla por separado. Si cambian las precondiciones,
se suspende la escritura para reconciliar el cambio.

Este lote conserva el contenido y las relaciones existentes. La autorización
de creación anterior está consumida; la policy work-tracker-control-plane-authority-policy
requiere aprobación del nuevo lote antes de escribir.
