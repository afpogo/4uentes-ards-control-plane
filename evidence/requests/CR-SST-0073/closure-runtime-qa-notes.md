# CR-SST-0073 Notas De Cierre De QA Runtime

## Estado

- Date: 2026-06-20
- Request: CR-SST-0073
- Jira issue: SST-21
- Scope: local authenticated QA follow-up plus reproducible `.http` correction

## Notas Observadas De Runtime Manual

- Se genero correctamente un owner token local con `.runtime/smoke-token.js`
  en `sst-bend` y fue aceptado por `GET /4uentes/v1/me`.
- El flujo gobernado `POST /tags/values` devolvio `201 Created` para un
  `definitionKey + slug` nuevo, en linea con el contrato.
- Durante la QA manual, el request duplicado esperado devolvio inicialmente
  `201` en lugar de `409`.

## Causa Raiz

La primera version reproducible de la coleccion `.http` todavia permitia drift
en la ruta del request duplicado porque el payload del tag dependia de valores
dinamicos que el cliente HTTP podia reevaluar.

Esto fue un problema del harness de QA, no evidencia de un defecto de
unicidad en backend.

## Correccion Aplicada

`httpPruebas/Tags-http/sst.tags-governance.http` se endurecio para que el
request duplicado ahora reutilice el `definitionKey`, `label` y `slug` reales
devueltos por `create_tag_value.response.body`, en lugar de reconstruirlos
desde placeholders dinamicos.

La guia de QA manual en `docs/api/24-sst-tags-governance-manual-qa.md` se
actualizo para documentar este comportamiento de forma explicita.

## Posicion De Contrato

El contrato de unicidad backend permanece:

- `accountId + definitionKey + slug` -> `409 Conflict` on duplicate create

El trabajo downstream permanece separado:

- `CR-SST-0074`: authenticated BFF facade in `4uentes-auth`
- `CR-SST-0075`: governed selector/autocomplete in `sst-fend`
- `CR-SST-0076`: dictionary adoption and closure
