# Cierre Local CR-CP-0007

## Decision

CR-CP-0007 queda cerrado localmente el 2026-07-12. La policy
`work-tracker-control-plane-authority-policy` esta definida, registrada,
adoptada y enlazada a `ards-sdd-policy-unification`.

El perfil Jira aplica obligatoriamente `jira-cr-mirror-hierarchy-policy`:

- una iniciativa activa que usa Jira tiene una Epic primaria;
- cada CR seleccionado tiene un Task o Subtask primario;
- una Subtask depende de una Task bajo la misma Epic;
- cualquier inconsistencia bloquea escritura y deriva a reconciliacion.

## Validacion Y Boundaries

- `npm.cmd run check`: exit code `0`, `0 WARN`, `0 FAIL`.
- No se agregaron runners, probes, gates, scripts, validators ni runtime.
- No se modifico `4uentes-ards-core` ni repos funcionales.
- El handoff a core permanece pendiente de un request separado.
- `INIT-CP-0003 / ARDS-13` permanece como futuro consumidor de runtime.

## Jira

El cierre local habilita un nuevo lote explicito limitado a observar
`ARDS-14`, transicionarlo mediante `41` a `Listo` y releerlo. No autoriza
comentarios, ediciones, creaciones ni otras transiciones.

El lote fue ejecutado y consumido. La lectura posterior confirmo `ARDS-14` en
`Listo`, con resolution `Listo`, tipo `Tarea` y parent `ARDS-1`. El workflow de
transicion asigno automaticamente el issue; no se ejecuto una edicion de
assignee separada.
