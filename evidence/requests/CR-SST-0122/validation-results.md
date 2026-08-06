# CR-SST-0122 Validation Results

## Estado

- Fecha: 2026-07-05
- Request: `CR-SST-0122`
- Resultado: PASS local para el defecto corregido.

## Validaciones

### sst-bend targeted test

- Comando: `npm.cmd run test:learning-workspace`
- Resultado: PASS
- Salida relevante: `Learning workspace tests passed: 15/15`

Cobertura agregada:

- `serverAnnotationId` de 64 caracteres no se envia al filtro SQL de columna UUID `id`.
- UUID interno sigue siendo aceptado como identificador de anotacion.
- El filtro comun de accept/reject evita comparaciones hash-vs-UUID.

### BF/API smoke runtime

- Ruta base: `http://localhost:4000/api/learning-workspaces`
- Flujo validado:
  - `POST /sources/preview`
  - `POST /sources/:previewId/accept` con `annotationIds=[serverAnnotationId]`
  - `GET /context`
- Resultado: PASS

Resumen sanitizado:

```json
[
  {
    "step": "preview",
    "status": "ok",
    "previewId": "6d11bb860524594061ea1d28e888042d68d867090eb5a1a4111e95d8de231f0e",
    "serverAnnotationIdLength": 64,
    "annotations": 1
  },
  {
    "step": "accept-by-annotationIds",
    "status": "ok",
    "accepted": true,
    "idempotent": false,
    "annotationIds": 1
  },
  {
    "step": "context-after-accept",
    "status": "ok",
    "contractVersion": "sst-learning-workspace-context.v1",
    "documents": 2,
    "annotations": 2,
    "blocks": 2
  }
]
```

### sst-bend ARDS/SDD check

- Comando: `npm.cmd run check`
- Resultado de proceso: PASS
- Salida relevante: `[ARDS CHECK] OK`

Observacion:

- El harness reporta cobertura protegida parcial `1/2 endpoints (50%)` y omite smoke autenticado por falta de `SMOKE_JWT`, pero el comando finaliza con codigo 0. Esta observacion existia como condicion de harness, no como regresion del fix.

### node-auth ARDS/SDD check

- Comando: `npm.cmd run check`
- Resultado: PASS
- Salida relevante: `[ARDS CHECK] OK`

## Decision

El defecto que bloqueaba `CR-SST-0118 / SST-48` queda corregido localmente en `sst-bend`. El siguiente paso es sincronizar Jira mirror para `CR-SST-0122` y luego retomar la validacion E2E de `CR-SST-0118`.
