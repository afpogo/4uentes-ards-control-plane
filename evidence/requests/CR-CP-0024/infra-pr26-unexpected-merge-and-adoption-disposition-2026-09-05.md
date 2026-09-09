# Merge inesperado del PR #26 y disposición de la adopción de Infra

Fecha: 2026-09-05

Request gobernante: `CR-CP-0024`

Owner slice: `CR-HPT-0024` / `HPT-16`

## Observación

El PR #26 fue fusionado externamente el `2026-09-05T18:36:52Z` por `afpogo`
con head `67c4874b2404235d70dc56ce143343954f5c707e`. El agente no ejecutó ni tenía
autorizado ese merge.

La lectura del estado `MERGED` ocurrió después de publicar por HTTPS el commit
owner `83bac64d5a7323276af4b691b666890c9cda81fe` en la misma rama. GitHub conserva
en el PR cerrado el head que fue fusionado, por lo que el commit nuevo no forma
parte de `develop`.

## Estado exacto

- `develop`: `4ab3e7e9f0869c7c035d75a85149977994aa0af9`;
- merge del PR #26: `4ab3e7e9f0869c7c035d75a85149977994aa0af9`;
- head fusionado: `67c4874b2404235d70dc56ce143343954f5c707e`;
- head remoto preservado de la rama:
  `83bac64d5a7323276af4b691b666890c9cda81fe`;
- comparación rama contra `develop`: `ahead 1`, `behind 1`;
- delta pendiente: cinco archivos documentales o de validación, sin manifests
  de runtime.

## Contenido pendiente

El commit pendiente:

- declara Learning, playbooks y runbooks como convención local owner;
- separa Core, control plane e Infra por autoridad;
- evita listar como adoptada una policy sin fuente publicada y versionada;
- corrige identificadores dañados en el índice local de policies;
- endurece `verify-human-documentation.js` contra una adopción canónica falsa.

`npm run check`, `npm run check:human-docs` y `git diff --check` concluyeron
correctamente antes del commit y de la publicación.

## Disposición

Se preservan el worktree, la rama y el commit. No se hace rebase, force-push,
merge ni mutación de `develop`.

Para integrar el delta pendiente hace falta un gate nuevo que autorice abrir un
PR correctivo desde la misma rama. Ese gate no autorizará fusionarlo, cambiar
runtime, cerrar Jira ni adoptar formalmente
`knowledge-to-execution-documentation-policy` antes de contar con una fuente
versionada publicada y su manifest.
