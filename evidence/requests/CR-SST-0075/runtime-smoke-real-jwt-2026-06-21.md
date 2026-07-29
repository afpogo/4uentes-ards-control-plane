# CR-SST-0075 - Smoke runtime con JWT real

## Estado

- Fecha: 2026-06-21
- Request: `CR-SST-0075`
- Slice validado: `sst-fend` contra `sst-bend` BFF y runtime local
- Objetivo: verificar que el payload estructurado `tags` funciona end-to-end con
  autenticacion real y que el detach total conserva `tags: []`

## Entorno observado

- Frontend local disponible en `http://localhost:8088`
- BFF local disponible en `http://localhost:4000`
- Backend tags/BFF protegido disponible en `http://localhost:3005`

## Preparacion

- Se obtuvo un JWT real mediante `POST /api/auth/login` sobre el runtime local.
- Con ese JWT se consulto `GET /4uentes/v1/me` y se confirmo una cuenta activa
  utilizable para el smoke.
- Tambien se probo el helper local `.runtime/smoke-token.js` de `sst-bend`.
  Ese token no alcanzo para el slice del BFF por scope/cuenta y devolvio `403`.
  El smoke valido de este corte se ejecuto con JWT real de login.

## Flujo validado

1. `GET /4uentes/v1/me`
2. `GET /api/tags/definitions?resourceType=articulo&limit=5`
3. `POST /api/tags/values`
4. `POST /api/articulos`
5. `GET /api/articulos/:id?includeTags=true`
6. `PUT /api/articulos/:id` con `tags: []`
7. `DELETE /api/articulos/:id`

## Resultado

- `activeAccountId`: `3370467f-ce60-4a19-bbb4-db0c0767a1cd`
- `definitionsCount`: `1`
- `createdTagLabel`: `CR-SST-0075 Smoke 1782096129`
- `createdTagSlug`: `cr-sst-0075-smoke-1782096129`
- `createdArticleId`: `3e8aa432-d3a8-464b-a6d9-a57cce928717`
- `detailTagCount`: `1`
- `updatedTagCount`: `0`

## Lectura del resultado

- La creacion del `TagValue` gobernado respondio `201`.
- La creacion del articulo con `tags` estructurados respondio `201`.
- La lectura de detalle con `includeTags=true` devolvio `1` tag asociado.
- El update posterior con `tags: []` dejo el articulo con `0` tags.
- El contrato del BFF para `CR-SST-0075` queda validado con JWT real.

## Hallazgo de contrato

- El alta de `TagValue` no acepta `scope` en el body de `POST /api/tags/values`.
- El payload correcto para este slice usa:
  `definitionKey`, `label`, `slug`, `resourceType`, `metadata`.
- El fallo previo `400 "scope" is not allowed` fue deriva de un payload
  desalineado, no un defecto del runtime.

## Nota de UI

- Se observo una sesion autenticada activa en `http://localhost:8088`.
- La ruta `http://localhost:8088/artsst?page=1&mode=cards&view=create` abre el
  modal de creacion de articulos.
- La evidencia fuerte de este corte queda apoyada en el smoke runtime
  reproducible y en la implementacion ya registrada del selector gobernado.
