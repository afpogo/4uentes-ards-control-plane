# CR-HPT-0015 - Preflight de identidad y fuente

Fecha: 2026-08-22.

## Reserva local

`CR-HPT-0015` no aparece en `origin/main`, el árbol actual, ninguna ref Git,
ninguna branch local ni un path de worktree existente antes de esta reserva.
`CR-HPT-0014` no se reutilizó porque el material dirty ya lo menciona como una
intención futura de adapter Phinance, aunque todavía no tenga lifecycle
canónico publicado.

No se ejecutó una consulta Jira live y no hay escritura Jira autorizada. Jira
permanece como mirror y no como fuente de identidad; cualquier lote futuro
debe repetir el preflight local y externo inmediatamente antes de escribir.

## Fuente preservada

La raíz dirty conserva ocho patches únicos sobre la branch heredada
`agent/cr-sst-0152-sst-fend-evidence`:

`5e6e19d`, `049c0d3`, `22ca50f`, `8800a3c`, `7ad8d9a`, `27c2ffe`,
`83bc374` y `08af86a`.

La branch está 85 commits detrás de `origin/main`. Además, el working tree
modifica `INIT-HPT-0002` para referenciar un plan SST-Phinance identificado
localmente como `CR-SST-0207`; ese ID colisiona con el QA de retención de chat
publicado en el canon SST.

## Decisión de ejecución

Se crea un worktree limpio desde `origin/main@659e1fe` y un lifecycle dedicado.
La recuperación se hará por artefactos y request IDs, nunca mediante merge o
cherry-pick total de la secuencia histórica. La raíz dirty permanece intacta.
