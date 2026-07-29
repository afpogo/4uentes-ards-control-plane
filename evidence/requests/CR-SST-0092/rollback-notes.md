# CR-SST-0092 - Rollback Notes

## Rollback DB

La migracion agregada es:

```text
db/migrations/20260630090000-create-learning-workspace-tables.js
```

Rollback esperado en `sst-bend`:

```bash
npm run migration:rollback
```

La funcion `down` elimina las tablas nuevas en orden inverso:

- `learning_import_provenance`
- `learning_import_warnings`
- `learning_spec_refs`
- `learning_lab_refs`
- `learning_asset_refs`
- `learning_content_block_refs`
- `learning_document_refs`
- `learning_source_refs`
- `learning_workspaces`

## Rollback Codigo

Para revertir el slice sin tocar cambios no relacionados:

- remover montaje de `/learning-workspaces` en
  `src/apps/sst/presentation/routes/index.js`;
- remover registros `Learning*` en `db/models/index.js`;
- remover archivos nuevos bajo:
  - `db/models/learning-*.js`
  - `src/apps/sst/domain/learning-workspaces/`
  - `src/apps/sst/application/learning-workspaces/`
  - `src/apps/sst/infrastructure/db/postgres/learning-workspaces/`
  - `src/apps/sst/presentation/*/learning-*`
  - `scripts/test-learning-workspace.js`
- remover script `test:learning-workspace` de `package.json`.

## Nota De Worktree

`sst-bend` tenia cambios dirty previos en archivos no relacionados. El rollback
de este CR no debe revertir esos cambios.
