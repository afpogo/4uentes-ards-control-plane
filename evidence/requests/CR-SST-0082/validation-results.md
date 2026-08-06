# CR-SST-0082 - Resultados de validacion

Validado el 2026-06-21.

## sst-chatbot

| Comando | Resultado | Notas |
| --- | --- | --- |
| `.\.venv\Scripts\python.exe scripts\ards_check.py` | PASS | `ARDS/SDD check passed.` |
| `.\.venv\Scripts\python.exe scripts\check.py` | PASS | ARDS/SDD check passed, pytest colecciono 59 tests y pasaron 59. |

Advertencia observada:

- `PytestCacheWarning`: pytest no pudo escribir
  `.pytest_cache\v\cache\nodeids` por `Permission denied`. No afecto el
  resultado: `59 passed, 1 warning`.

## 4uentes-orchestor

| Comando | Resultado | Notas |
| --- | --- | --- |
| `npm.cmd run check` | PASS | `verify-catalog`, `verify-local-bindings --optional` y `verify-state-model` pasaron. |
| `rg -n "[A-Za-z]:\\|/Users/|~[\\/]" catalog solutions state` | PASS | Sin resultados; no se agregaron rutas absolutas en `catalog/`, `solutions/` ni `state/`. |

Warnings preexistentes observados por `npm.cmd run check`:

- Remotes no observables para seis bindings locales.
- Dos state files antiguos sin `request_ids` y sin `evidence_refs`.

No hubo failures.
