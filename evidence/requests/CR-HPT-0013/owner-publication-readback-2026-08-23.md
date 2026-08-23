# CR-HPT-0013 — readback de publicación owner

Fecha: 2026-08-23.

## Resultado

El PR owner [mena28/finanzas-personales#1](https://github.com/mena28/finanzas-personales/pull/1)
fue fusionado a `main` en `b68c960`. El head publicado `588e030` contiene el
contrato `PrincipalContext v1`; Git confirmó que es alcanzable desde la ref
remota autoritativa.

El remoto `main` todavía estaba en `edf4c9c`, por lo que el PR debió publicar
la cadena gobernada de prerequisitos antes de `ef4f8d0`. Se incluyeron los
commits correspondientes a `CR-HPT-0011`, `CR-HPT-0012`, `CR-HPT-0002` y
`CR-HPT-0008`. Se excluyó expresamente `daa66e5`, que pertenece al adapter
posterior y no forma parte de `CR-HPT-0013`.

## Validación

- `node backend/scripts/check-contracts.js`: OK.
- Pytest owner: 10 passed, 2 skipped.
- `git diff --check`: OK.
- PR: CLEAN/MERGEABLE antes del merge.
- Readback: `588e030` alcanzable desde `origin/main` en `b68c960`.

La modificación dirty preexistente del documento de lluvia de ideas no entró
al worktree ni al PR. No se modificaron repos SST ni Jira durante esta
publicación.
