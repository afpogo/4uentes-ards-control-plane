# Gap Del Allowlist De Learning Preview

## Hallazgo

Despues del merge del PR #5 se revalidaron otra vez los SHAs y se inicio la
unidad allowlisted de Learning annotations en el worktree aislado de
`sst-bend`. La seleccion aplico migracion, modelos, repositorio, DTO, specs,
docs y tests de `CR-SST-0116/0122`.

El test `node scripts/test-learning-workspace.js`, ejecutado con las
dependencias del checkout principal mediante `NODE_PATH`, alcanzo la asercion
funcional y demostro que `previewStatePersisted` era `undefined` en lugar de
`true`.

## Causa

`src/apps/sst/application/learning-workspaces/preview-learning-source.usecase.js`
contiene el wiring estable que normaliza annotations y llama
`repository.persistPreview`. El allowlist lo habia quitado por compartir la
palabra `preview` con la cohorte diferida de article preview.

Son dominios distintos:

- Learning source preview ya es parte del contrato estable preservado por
  `CR-SST-0116/0122`;
- article preview resolution pertenece a `CR-SST-0137` y sigue diferido.

## Decision

Se agrega solamente el use case de Learning source preview y se estrecha la
exclusion a `application/articulos/preview-*` más el DTO específico de article
preview. No se habilitan migraciones, modelos, endpoints, capabilities ni UI de
article preview.

El worktree queda pausado con la primera unidad sin commit. No se publico una
rama hija ni se toco `develop`. Esta correccion debe recibir merge humano antes
de aplicar el path y repetir el test.
