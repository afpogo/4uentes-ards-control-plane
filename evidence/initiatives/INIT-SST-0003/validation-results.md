# INIT-SST-0003 - Resultados De Validacion

## Validacion Ejecutada

```powershell
npm.cmd run check
```

## Resultado

Estado: `PASS`.

Resumen observado:

- `verify-catalog.js`: 5 OK, 0 WARN, 0 FAIL.
- `verify-local-bindings.js --optional`: 28 OK, 6 WARN, 0 FAIL.
- `verify-state-model.js`: 23 OK, 4 WARN, 0 FAIL.
- `verify-initiatives.js`: 6 OK, 0 WARN, 0 FAIL.

Warnings no bloqueantes:

- remotes de repos locales no observables para varios bindings;
- dos bugfix states preexistentes no tienen `request_ids` ni `evidence_refs`.
