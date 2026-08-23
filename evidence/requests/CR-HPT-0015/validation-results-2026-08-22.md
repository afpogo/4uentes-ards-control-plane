# CR-HPT-0015 - Resultados de validación

Fecha: 2026-08-22.

## Gates

- `git diff --check`: PASS.
- `npm.cmd run check`: PASS.
- request identity validator: 646 archivos lifecycle, 0 FAIL y la advertencia
  histórica permitida de `CR-SST-0016`.
- worktree lifecycle policy: PASS.
- catálogo: 5 OK, 0 FAIL.
- state model: 56 OK, 0 FAIL.
- iniciativas: 20 OK, 0 FAIL; el índice contiene 18 iniciativas.
- owner documentation: 128 OK, 0 FAIL.
- visual documentation: 12 documentos y 12 mapas, 0 FAIL.

El binding local opcional no existe en el worktree limpio y produce sólo la
advertencia esperada. No se ejecutaron checks owner porque este request no
modifica repositorios funcionales.

## Readback de seguridad

No se portó el plan colisionado `CR-SST-0207`, no se conservaron lifecycle
`running` junto a `done`, no se copió el self-test obsoleto de bindings y no se
realizaron escrituras Jira ni owner.
