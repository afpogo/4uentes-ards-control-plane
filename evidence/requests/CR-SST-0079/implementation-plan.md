# CR-SST-0079 - Plan De Implementacion

## Objetivo

Volver reproducible la validacion API de `SST-21` con una coleccion `.http`
versionada y documentacion orientada a operadores, manteniendo OpenAPI como
contrato formal.

## Decision

Usar un modelo hibrido de documentacion API:

- OpenAPI sigue siendo el contrato canonico para shape de endpoints y tooling
  futuro.
- Los archivos `.http` pasan a ser el harness ejecutable de QA local para
  validacion manual.
- JWTs, account IDs y runtime URLs deben venir de variables o configuracion
  local de entorno, nunca de ejemplos commiteados.

## Unidades De Implementacion

1. Agregar `docs/http/sst-tags-governance.http` en `sst-bend`.
2. Agregar una guia concisa de QA manual en `sst-bend` bajo `docs/api/`.
3. Registrar salida de validacion y evidencia de archivos modificados en esta carpeta del request.

## Flujo Esperado

La coleccion `.http` debe cubrir:

- auth/account sanity check;
- backend producer `GET /4uentes/v1/tags/definitions`;
- backend producer `POST /4uentes/v1/tags/values`;
- duplicate backend producer `POST /4uentes/v1/tags/values` returning `409`;
- backend producer `GET /4uentes/v1/tags/values` search;
- backend producer `PUT /4uentes/v1/tags/resources/{resourceType}/{resourceId}` bind;
- backend producer `PUT /4uentes/v1/tags/resources/{resourceType}/{resourceId}` clear with `tags: []`.

Cuando el mismo contrato se ejerce via facade BFF, la superficie equivalente es
`/api/tags/*` en `4uentes-auth`.

## Limites

- No hacer cambios de codigo runtime en este CR salvo que un gap documental
  exponga un defecto real de endpoint.
- No agregar Swagger UI o Postman como tooling requerido.
- No commitear secrets, JWTs ni URLs locales especificas de usuario.
- Los readers publicos siguen sobre el modelo legacy durante `CR-SST-0073`.

## Validacion

- Run `npm run check` in `4uentes-orchestor`.
- Run the lowest-cost syntax/check command available in `sst-bend`.
- Manual endpoint execution requires an operator-provided owner JWT.
