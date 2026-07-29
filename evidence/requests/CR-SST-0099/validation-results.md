# CR-SST-0099 - Validation results

Fecha: 2026-07-04

Validacion `sst-extension`:

- `pnpm.cmd test -- --run src/features/sessions/create-session-capture-service.test.ts src/platform/storage/extension-storage.test.ts src/platform/api/node-auth-browser-extension-session.test.ts`
  - Resultado: PASS
  - Observacion: Vitest ejecuto la suite completa por configuracion del script.
  - Resultado observado: 25 test files passed, 99 tests passed.
- `pnpm.cmd check`
  - Resultado: PASS con ejecucion escalada por permisos de escritura fuera del
    workspace principal.
  - Incluye:
    - `pnpm run check:baseline`: PASS
    - `pnpm run test`: PASS, 25 test files / 99 tests
    - `pnpm run build`: PASS, WXT build chrome-mv3
- `pnpm.cmd run build:safe`
  - Resultado: PASS con ejecucion escalada.
  - Observacion: antes de escalar, WXT fallo con `EPERM` al intentar limpiar
    `.output-safe`; con permisos adecuados el build completo paso.

Validacion adicional:

- `pnpm.cmd exec tsc --noEmit`
  - Resultado: FAIL
  - Observacion: reporta deuda preexistente amplia en tests/UI/runtime no limitada
    a CR-SST-0099. El check oficial del repositorio no usa este comando y paso.

Assertions cubiertos:

- PDF visual y PDF textual fallback son distinguibles mediante
  `snapshot.outcome`.
- `snapshot.captureMode` identifica `visual-pdf` o `textual-pdf`.
- `snapshot.warnings` filtra codigos no reconocidos y elimina duplicados.
- Items legacy sin outcome normalizan compatiblemente.
- El payload hacia `node-auth` no incluye campos locales de outcome/warnings.
- No se registro contenido privado, PDF real, cookies, JWTs, secretos ni plaintext
  en evidencia.
