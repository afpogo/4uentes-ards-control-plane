# SST-48 / CR-SST-0118 - Validacion e2e bloqueada por defecto

Se ejecuto la validacion local de CR-SST-0118.

Resultado:

- Gates requeridos ejecutados:
  - `4uentes-orchestor npm.cmd run check`: OK
  - `sst-fend npm.cmd run check`: OK con warnings preexistentes
  - `node-auth npm.cmd run check`: OK
  - `sst-bend npm.cmd run check`: OK con cobertura protegida parcial por falta de `SMOKE_JWT`
- Browser Chrome DevTools MCP:
  - `http://localhost:4090/learning` redirige a portada publica por falta de sesion autenticada.
  - Se confirma bloqueo de login interactivo para browser e2e completo.
- BF/API:
  - `GET /api/learning-workspaces/me`: OK con JWT smoke compatible.
  - `GET /api/learning-workspaces/context`: OK.
  - `POST /api/learning-workspaces/sources/preview`: OK con anotacion valida.
  - `POST /api/learning-workspaces/sources/:previewId/accept` sin `annotationIds`: OK; contexto posterior devuelve documento, anotacion y bloque aceptado.
  - `POST /api/learning-workspaces/sources/:previewId/accept` con `annotationIds=[serverAnnotationId]`: falla con 500.

Defecto detectado:

- `sst-bend` compara `server_annotation_id` hash hex de 64 caracteres contra la columna UUID `id`.
- Postgres devuelve `invalid input syntax for type uuid`.
- Impacta el contrato documentado de aceptar selecciones especificas por `annotationIds`.

Decision:

- No transicionar SST-48 a Listo.
- Mantener SST-48 En curso / bloqueado por defecto runtime.
- Requiere CR de implementacion para corregir `accept(annotationIds)` en `sst-bend` o ajustar formalmente el contrato.

Evidencia ARDS/SDD:

- `evidence/requests/CR-SST-0118/e2e-validation-results-2026-07-05.md`
- `evidence/requests/CR-SST-0118/chrome-learning-auth-block-2026-07-05.png`
