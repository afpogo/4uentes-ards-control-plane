# CR-SST-0074 Validation Results

## Status

- Date: 2026-06-21
- Request: CR-SST-0074
- Jira issue: `SST-22`
- Runtime target: `4uentes-auth` facade for SST tags governance

## Checks

| Check | Result | Notes |
| --- | --- | --- |
| `4uentes-auth: npm run check` | PASS | ARDS check and TypeScript build passed after the shared tags proxy fix. |
| `4uentes-orchestor: npm run check` | PASS | Control-plane validation stayed green after wiring `SST-22` and BFF evidence. |
| `POST http://localhost:4000/api/auth/login` | PASS | Real JWT issued by `node-auth` for user `djotal@gmail.com`. |
| `GET http://localhost:3005/4uentes/v1/me` with login JWT | PASS | SST accepted the BF-issued JWT and resolved active account `3370467f-ce60-4a19-bbb4-db0c0767a1cd` with role `owner`. |
| `GET http://localhost:4000/api/tags/definitions?resourceType=articulo&limit=5` | PASS | `200 OK`, baseline facade revalidated with owner JWT and active account `3370467f-ce60-4a19-bbb4-db0c0767a1cd`; response returned `total=5` for the requested page size. |
| `POST /api/articles` | PASS | `201 Created`, temporary article created for governance binding smoke. |
| `POST http://localhost:4000/api/tags/values` | PASS | `201 Created`, TagValue created through BFF with real JWT. |
| duplicate `POST http://localhost:4000/api/tags/values` | PASS | `409 Conflict` preserved by BFF. This is the duplicate-create contract, not an auth failure. |
| `GET http://localhost:4000/api/tags/values?definitionKey=fuente&q=<slug>` | PASS | `200 OK`, created TagValue found with `total=1`. |
| `PUT http://localhost:4000/api/tags/resources/articulo/:articleId` | PASS | `200 OK`, resource binding replaced with `total=1`. |
| `PUT http://localhost:4000/api/tags/resources/articulo/:articleId` with `tags=[]` | PASS | `200 OK`, clear semantics preserved with `total=0`. |
| `DELETE /api/articles/:id` | PASS | `204 No Content`, cleanup succeeded. |
| `GET http://localhost:4000/api/tags/definitions` without JWT | PASS | `401 Unauthorized` preserved by BF auth boundary before the proxy call. |
| `POST http://localhost:4000/api/tags/values` with valid JWT and mismatched `x-active-account-id` | PASS | `403 Forbidden` preserved by the BFF when the owner JWT was paired with an out-of-scope account UUID outside the resolved SST scope. No `200`, `201`, `401`, `404` or `409` drift was observed. |

## Route Map

- Producer API in `sst-bend`: `http://localhost:3005/4uentes/v1/tags/*`
- BFF facade in `4uentes-auth`: `http://localhost:4000/api/tags/*`
- This evidence validates the facade surface. It does not rename the producer
  contract.

## Notes

- The smoke used a real JWT emitted by `node-auth` login, not the standalone `.runtime/smoke-token.js` helper used for direct SST-only flows.
- The local runtime had to be rehydrated on 2026-06-21 because `localhost:3005` and `localhost:4000` were initially down; `sst-bend` and `node-auth` were brought back through their local Docker stacks before rerunning the smoke.
- The BF facade correctly propagated the JWT to SST and preserved governance semantics for create, duplicate detection, bind and clear.
- `401` en este slice pertenece al boundary de autenticacion del BF cuando el bearer falta o es invalido.
- `403` viene de SST por account scope o autorizacion; el cierre tecnico final se valido con owner JWT real mas `x-active-account-id` inconsistente, sin depender de un `member` real. En esta corrida el body de error llego vacio al cliente PowerShell, pero el status `403` se preservo sin drift.
- `409` aplica solo a duplicate create semantics de `TagValue`; no forma parte del negative smoke de autorizacion.
- Transition ready: el gap tecnico pendiente de `CR-SST-0074` quedo cubierto con el smoke `403` autenticado sobre la fachada BFF.

## Comentario Tecnico Listo Para Jira

`SST-22` queda listo para transicion operativa con el siguiente resumen:

- la fachada BFF de governed tags en `4uentes-auth` fue validada con JWT real de `node-auth`;
- `GET /api/tags/definitions` preservo `200`;
- `GET /api/tags/definitions` sin bearer preservo `401` en el auth boundary del BF;
- `POST /api/tags/values` preservo `409` en duplicate create semantics;
- `POST /api/tags/values` preservo `403` cuando se uso owner JWT real con `x-active-account-id` inconsistente y fuera de scope;
- evidencia principal: `evidence/requests/CR-SST-0074/validation-results.md` y `evidence/requests/CR-SST-0074/execution-start-notes.md`.
