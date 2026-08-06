# CR-SST-0105 - Resultados De Validacion

## Resultado

Validacion ejecutada el 2026-07-02.

## Checks

- `node --check scripts\verify-owner-documentation.js` - PASS
- `npm.cmd run check:owner-docs` - PASS
- `npm.cmd run check:initiatives` - PASS
- `npm.cmd run check` - PASS

## Owner Documentation Gate

`npm.cmd run check:owner-docs` valido:

- cableado de `package.json` para `check:owner-docs`;
- presencia del validator dentro de `npm.cmd run check`;
- requerimiento de check del control-plane en CRs con
  `child_repo_mutation_allowed: true`;
- deteccion del campo YAML real de mutacion, no menciones textuales;
- bloques `owner_documentation` de `CR-SST-0092` a `CR-SST-0103`.

Resumen del gate: 8 OK, 0 WARN, 0 FAIL.

## Warnings Preexistentes

El `npm.cmd run check` completo mantiene warnings ajenos a este CR:

- local bindings no pudieron observar remote para varios repos hijos;
- `state/bugfixes/login-504-proxy-timeout.current.yaml` no tiene
  `request_ids` ni `evidence_refs`;
- `state/bugfixes/sst-bend-emfile-watchers.current.yaml` no tiene
  `request_ids` ni `evidence_refs`.

No hay failures.
