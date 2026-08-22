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

## Readback posterior a la integración

La branch fue preservada en un commit auditable y luego rebasada sobre
`17b8451`, la `origin/main` observada. Los conflictos se resolvieron aceptando
el lifecycle `done` ya publicado de `CR-SST-0199`, conservando el read model
nuevo de las iniciativas y aplicando el namespace reconciliado.

Después de la integración, `npm.cmd run check` y `git diff --check` pasaron.
La branch quedó entonces sin deriva respecto de esa base y fue publicada en el
PR #38.

## Segunda deriva observada en el PR #38

Después de publicar la branch, `origin/main` avanzó hasta `1b5327d` mediante
el PR #36. Ese merge incorporó el cierre más reciente de `CR-SST-0203` y
produjo conflictos add/add en su evidencia y lifecycle, además de conflictos
de contenido en `INIT-SST-0007` e `INIT-SST-0008`.

La resolución preservó la versión más nueva de `CR-SST-0203` publicada en
`main`, incluida su evidencia de deriva post-write. En las iniciativas se
combinaron ese read model nuevo y el mapa de namespace de `CR-SST-0207`.

La branch fue rebasada sobre `1b5327d`; `npm.cmd run check` y `git diff
--check` volvieron a pasar antes de actualizar el PR.
