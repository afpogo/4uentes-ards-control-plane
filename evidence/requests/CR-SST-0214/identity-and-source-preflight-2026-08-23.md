# CR-SST-0214 - Preflight de identidad y fuente

Fecha observada: 2026-08-23.

`CR-SST-0214` no estaba reservado en `origin/main@cc632c5`, refs remotas ni
pull requests. Sólo aparecía en el commit local `a9ef5f8`, dentro del worktree
`cr-sst-0214-reservation`, limpio pero 23 commits detrás del canon observado.

El ID se conserva porque no colisiona. La reserva se reconstruye sobre el
`main` actual sin rebase, merge ni reescritura del worktree fuente. Éste queda
en cuarentena hasta demostrar equivalencia e integración de su único archivo.

## Fuente preservada

- reserva local: `a9ef5f8`;
- implementación owner histórica en `4uentes-auth`: `33a5dc8`;
- asignación histórica colisionada: `CR-SST-0208`;
- Jira mirror observado en la fuente: `HPT-6`.

La publicación del inbox no adopta todavía el runtime owner ni autoriza Jira.
Ambas acciones requieren plan, validación y autorización de alcance propios.
