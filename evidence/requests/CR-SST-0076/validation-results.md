# CR-SST-0076 - Resultados de validacion

## Estado

- Fecha: 2026-06-24
- Request: `CR-SST-0076`
- Jira: `SST-24`

## 4uentes-orchestor

Comando:

```bash
npm.cmd run check
```

Resultado:

- PASS.
- `verify-catalog`: 0 FAIL.
- `verify-local-bindings`: 0 FAIL, warnings de remotes no observables.
- `verify-state-model`: 0 FAIL, warnings preexistentes en bugfix states.

## sst-fend

Documentacion ARDS/SDD local confirmada:

- `docs/34-dictionary-frontend.md`
- `specs/34-dictionary-frontend.yml`
- `specs/capabilities/inbound/node-auth--sst-tags-governance.yaml`
- `docs/capabilities/inbound/node-auth--sst-tags-governance.md`
- `specs/capabilities/inbound/00-index.yaml`
- `docs/capabilities/00-overview.md`

Comando:

```bash
npm.cmd run css:types
```

Resultado:

- PASS.
- Se actualizo `src/pages/Dictionary/styles.module.scss.d.ts`.

Comando:

```bash
npm.cmd run build
```

Resultado:

- PASS.
- Webpack compilo con 3 warnings de performance por bundle grande.
- No hubo errores TypeScript ni errores de CSS modules.

Comando:

```bash
npm.cmd run check
```

Resultado:

- FAIL por baseline preexistente de ESLint/Prettier en multiples archivos no
  tocados por este CR.
- No se reportaron errores en los archivos de Dictionary modificados en este
  CR.
- El fallo principal observado es line ending/prettier en areas de Articles y
  Auth, mas warnings existentes de `react-hooks/exhaustive-deps`.

## 4uentes-auth

Comando:

```bash
npm.cmd run check
```

Resultado:

- PASS.
- `[ARDS CHECK] OK`.

## sst-bend

Comando:

```bash
npm.cmd run check
```

Resultado:

- PASS por codigo de salida 0.
- El check reporto coverage protegida parcial por falta de `SMOKE_JWT`.
- La ruta publica `/public/gallery` respondio 200.
- Quedaron omitidos smokes protegidos, incluyendo Diccionario y tags, por falta
  de JWT runtime.

Comando:

```bash
npm.cmd run test:diccionario:stage3
```

Resultado:

- PASS 11/11.
- Cubre root sheet, create/update/move/delete, secure reveal, import y tag list
  envelopes.

Comando:

```bash
npm.cmd run qa:diccionario:stage3
```

Resultado:

- BLOCKED.
- Requiere `SMOKE_JWT` o `DICCIONARIO_JWT`.

Comando:

```bash
npm.cmd run test:tag-engine
```

Resultado:

- PASS 7/7.
- Cubre registry, prefixes, aliases, preview boundary y materializacion
  gobernada.

## Resultado operativo

- Implementacion frontend compilada.
- BFF validado sin cambios runtime.
- Backend validado con unit/smoke local sin JWT protegido.
- QA runtime protegida queda pendiente de JWT real.
