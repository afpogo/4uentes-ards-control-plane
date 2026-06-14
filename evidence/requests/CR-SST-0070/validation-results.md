# CR-SST-0070 Resultados De Validacion

## Comandos

- `4uentes-auth`: `npm.cmd run check`
- `sst-extension`: `pnpm.cmd run check`
- `sst-chatbot`: `.\\.venv\\Scripts\\python.exe scripts\\check.py`
- `sst-4uentes-infra`: `npm.cmd run check`
- `4uentes-orchestor`: `npm.cmd run check`

## Resultados

`4uentes-auth`:

- Resultado: passed.
- Observacion: el primer intento fallo por `EPERM` al limpiar `dist`; el reintento fuera del sandbox paso con `[ARDS CHECK] OK`.

`sst-extension`:

- Resultado: passed.
- Baseline check passed.
- Tests: 20 test files passed, 81 tests passed.
- Build WXT passed.
- Observacion: el primer intento fallo por `EPERM` al limpiar `.output`; el reintento fuera del sandbox paso.

`sst-chatbot`:

- Resultado: passed.
- ARDS/SDD check passed.
- Tests: 59 passed.
- Advertencia: pytest no pudo escribir cache local en `.pytest_cache` por permiso denegado; no afecto el resultado.

`sst-4uentes-infra`:

- Resultado: passed.
- `kubectl kustomize` y `kubectl apply --dry-run=client` pasaron para bootstrap nginx y overlay development.
- Observacion: el primer intento fallo por `Access is denied` al leer kustomize; el reintento fuera del sandbox paso.

`4uentes-orchestor`:

- Resultado: passed.
- Advertencias preexistentes: observacion remota no disponible en bindings locales y dos state files antiguos sin request/evidence refs.

## Decision De Revision Core

Los cuatro repos sincronizados por CR-SST-0070 quedan con:

- `sync_status: synced`
- `candidate_for_core: 0`
- `conflicts: 0`
- `core_revision_decision: no-core-change-needed`

No se requiere revision de `4uentes-ards-core` a partir de esta evidencia.
