# CR-SST-0212 — readback de publicación owner

Fecha: 2026-08-23.

## Resultado

El PR owner [afpogo/sst-bend#22](https://github.com/afpogo/sst-bend/pull/22)
fue fusionado a `develop` en `357ac2a`. El head `6a1b894` es alcanzable desde
la ref remota autoritativa.

El commit fuente `efa955b` estaba montado sobre una branch histórica ajena. Se
portó selectivamente sobre el `develop` vigente, se resolvieron los índices de
memoria y retención sin perder entradas y se corrigió el `orchestrator_link`
de `CR-SST-0207` a `CR-SST-0212`.

## Validación owner

- `npm run test:phinance-facade-shell`: OK.
- `npm run build`: OK.
- `npm run check`: OK con la degradación permitida sin `SMOKE_JWT`.
- GitHub Node 18 y Node 20: success.
- GitHub `build-publish-update`: success.
- `git diff --check`: OK.
- Readback: `6a1b894` alcanzable desde `origin/develop` en `357ac2a`.

El gate se ejecutó con PostgreSQL, SST y Scrapper temporales; los procesos y
el contenedor PostgreSQL fueron detenidos al finalizar. No se habilitó proxy
financiero, no se escribió Jira y no se ejecutó `npm audit fix`.
