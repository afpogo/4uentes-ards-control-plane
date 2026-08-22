# CR-SST-0207 - Readback de deriva de base

Fecha: 2026-08-22.

Durante la adopción de `worktree-request-lifecycle-policy`, `origin/main`
avanzó tres commits y el worktree coordinador quedó `behind 3`.

## Commits observados

- `f163386`: canonicaliza y cierra `CR-SST-0199` y `CR-SST-0201`.
- `d693581`: registra blockers de QA manual.
- `17b8451`: merge del PR #35.

## Impacto

La deriva no introduce una nueva identidad `0202` a `0210`, pero modifica
artefactos que este worktree también reconcilia:

- INIT-SST-0007 e INIT-SST-0008;
- lifecycle running/done de `0199` y `0201`;
- evidencia y estado coordinador de `0178/0200`.

Por la policy recién adoptada no se ejecutó rebase, merge ni actualización
destructiva sobre cambios sin commit. El gate local pasa sobre la base actual,
pero la branch no está lista para publicación hasta integrar la nueva main.

## Resolución requerida antes del PR

1. Preservar esta reconciliación en commits auditables.
2. Integrar `origin/main` sin reescribir los commits ya fusionados.
3. Aceptar el `done` publicado de `0199/0201` y no recrear sus archivos
   `running`.
4. Reconciliar las iniciativas conservando tanto el read model nuevo como el
   namespace de `CR-SST-0207`.
5. Reejecutar request identity, owner documentation, policy y full checks sobre
   el merge result.

No se modificó ni retiró ningún otro worktree.
