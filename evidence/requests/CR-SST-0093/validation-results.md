# CR-SST-0093 - Resultados De Validacion

## Validacion Ejecutada

Comando:

```powershell
npm.cmd run check
```

## Resultado

Estado: `PASS`.

Resumen observado:

- `verify-catalog.js`: 5 OK, 0 WARN, 0 FAIL.
- `verify-local-bindings.js --optional`: 28 OK, 6 WARN, 0 FAIL.
- `verify-state-model.js`: 23 OK, 4 WARN, 0 FAIL.
- `verify-initiatives.js`: 5 OK, 0 WARN, 0 FAIL.

Warnings no bloqueantes:

- remotes de repos locales no observables para varios bindings;
- `state/bugfixes/login-504-proxy-timeout.current.yaml` no tiene
  `request_ids` ni `evidence_refs`;
- `state/bugfixes/sst-bend-emfile-watchers.current.yaml` no tiene
  `request_ids` ni `evidence_refs`.

No se observaron fallos de validacion.
