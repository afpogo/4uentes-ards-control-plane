# CR-SST-0193 - PromociÃ³n A GitHub

Fecha: 2026-08-20.

## Branch Y Commit

- repo: `afpogo/sst-bend`;
- base actualizada: `origin/develop@8fe60f4`;
- branch: `feat/SST-107/CR-SST-0193/canonical-user-memory`;
- commit: `f296c7a` (`feat(SST-107): add canonical user memory runtime`);
- rebase sobre `develop`: PASS sin conflictos;
- worktree posterior al commit/rebase: limpio.

## Pull Request

- PR draft: `https://github.com/afpogo/sst-bend/pull/17`;
- base: `develop`;
- head: `feat/SST-107/CR-SST-0193/canonical-user-memory`;
- mergeability observada: `MERGEABLE`;
- estado: abierto y draft.

## Checks GitHub

- `Node.js CI / sst (18.x)`: PASS en 40 s;
- `Node.js CI / sst (20.x)`: PASS en 31 s;
- `Build and Publish Development Image / build-publish-update`: PASS en 1 m
  52 s.

## Gate Restante

La publicaciÃ³n de branch, PR e imagen no cierra CR-SST-0193. ContinÃºa pendiente:

- adopciÃ³n del commit/imagen en un runtime de prueba;
- `USER_MEMORY_ENABLED=true`;
- JWT scoped y membership vÃ¡lidos;
- QA HTTP positivo, negativos de consentimiento y aislamiento cross-account.

No se modificÃ³ Jira y el PR no fue marcado ready ni fusionado.
