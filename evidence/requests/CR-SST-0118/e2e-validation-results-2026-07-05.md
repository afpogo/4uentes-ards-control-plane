# CR-SST-0118 - Resultados de validacion e2e

## Contexto

- Fecha: 2026-07-05
- Jira mirror: SST-48
- Scope: validacion-first, sin mutacion de repos hijos.
- Politicas aplicadas: owner-documentation-authority-policy, agent-architecture-boundary-policy, human-doc-language.

## Gates ejecutados

- `4uentes-orchestor`: `npm.cmd run check` -> OK.
- `sst-fend`: `npm.cmd run check` -> OK, con warnings preexistentes de hooks/deprecations.
- `node-auth`: `npm.cmd run check` -> OK.
- `sst-bend`: `npm.cmd run check` -> OK. Reporto cobertura protegida parcial por falta de `SMOKE_JWT`, sin exit code de falla.

## Browser evidence

- Herramienta: Chrome DevTools MCP.
- URL intentada: `http://localhost:4090/learning`.
- Resultado observado: redireccion a portada publica `/` por falta de sesion autenticada.
- Se abrio el popover de login y se confirmo que el bloqueo es autenticacion interactiva, no caida de frontend.
- Screenshot: `evidence/requests/CR-SST-0118/chrome-learning-auth-block-2026-07-05.png`.

## Validacion BF/API

Se uso token smoke local emitido con `.runtime/smoke-token.js`, sin persistir el token en evidencia.

Primer hallazgo:

- Token smoke default con `sub=smoke-owner-4uentes@local` falla en `node-auth`.
- Error observado en logs: `Cast to ObjectId failed ... path "_id" for model "User"`.
- Causa: `node-auth` espera que `sub` sea `_id` Mongo real para resolver usuario.
- Reintento: se emitio token smoke con `SMOKE_SUBJECT` igual a un `_id` local QA valido.

Resultados con subject compatible:

- `GET /api/learning-workspaces/me` -> OK.
- `GET /api/learning-workspaces/context` -> OK, `contractVersion=sst-learning-workspace-context.v1`.
- `POST /api/learning-workspaces/sources/preview` con anotacion valida -> OK.
  - `persisted=false`
  - `previewStatePersisted=true`
  - `annotations=1`
  - `warnings=0`
- `POST /api/learning-workspaces/sources/:previewId/accept` sin `annotationIds` -> OK.
  - `accepted=true`
  - `idempotent=false`
  - `annotationIds=1`
- `GET /api/learning-workspaces/context` posterior -> OK.
  - `documents=1`
  - `annotations=1`
  - `contentBlocks=1`

## Defecto detectado

`accept` falla cuando el caller envia `annotationIds` con el `serverAnnotationId`
devuelto por preview.

Sintoma:

- `POST /api/learning-workspaces/sources/:previewId/accept` con `annotationIds=[serverAnnotationId]` -> 500.

Error observado en logs de `sst-bend`:

- `SequelizeDatabaseError`
- `invalid input syntax for type uuid`
- La query compara el hash `server_annotation_id` tambien contra la columna UUID `id`.

Impacto:

- El flujo completo puede aceptar todas las anotaciones del preview si omite `annotationIds`.
- El contrato documentado para aceptar selecciones especificas por `annotationIds` no esta completamente sano.
- No conviene cerrar SST-48 como Listo hasta corregir o formalizar este comportamiento.

## Decision local

SST-48 / CR-SST-0118 queda en progreso.

No se mutaron repos hijos porque el CR es validation-first y
`child_repo_mutation_allowed=false`. El defecto requiere un CR de implementacion
o una expansion explicita de alcance antes de tocar `sst-bend`.
