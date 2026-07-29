# CR-SST-0116 - Validation Results

Fecha: 2026-07-04

## `sst-bend`

Comando:

```bash
npm.cmd run migration:run
```

Resultado:

- PASS: migration `20260704120000-create-learning-annotation-refs` applied.

Comando:

```bash
npm.cmd run test:learning-workspace
```

Resultado:

- PASS: `Learning workspace tests passed: 15/15`.
- Cubre flujo legacy y flujo annotated-selection con preview -> accept by
  `annotationIds` -> accepted context.

Comando:

```bash
npm.cmd run check
```

Resultado:

- PASS: exit code 0.
- WARN: protected smoke coverage parcial por falta de `SMOKE_JWT` /
  `SMOKE_JWT_OWNER`, baseline preexistente del repo.

## `node-auth`

Comando:

```bash
npm.cmd run check
```

Resultado:

- PASS: `[ARDS CHECK] OK`.
- Nota: requirio rerun fuera del sandbox porque el primer intento fallo con
  `EPERM` al limpiar `dist`.

## Control Plane

```bash
npm.cmd run check
```

Resultado:

- PASS: catalog.
- PASS: local bindings.
- PASS: state model.
- PASS: initiatives.
- PASS: owner documentation enforcement for `CR-SST-0116`.
