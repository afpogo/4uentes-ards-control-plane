# CR-SST-0073 Notas De Implementacion

## Estado

- Date: 2026-06-18
- Request: CR-SST-0073
- Jira issue: SST-21
- Local lifecycle status: in_progress
- Jira transition: blocked by external-write policy

## Alcance Iniciado

Se implemento el boundary runtime producer-side de `sst-bend` para SST Tags
Governance:

- `GET /4uentes/v1/tags/definitions`
- `GET /4uentes/v1/tags/values`
- `POST /4uentes/v1/tags/values`
- `PUT /4uentes/v1/tags/resources/:resourceType/:resourceId`

La implementacion conserva el modelo de coexistencia de `CR-SST-0072`: los
readers publicos de Diccionario y Articulos siguen sobre flujos legacy de tags
mientras el modelo global `tag_definitions`, `tag_values` y
`tag_occurrences` queda expuesto para los siguientes cortes de adopcion.

## Decisiones De Contrato

- `TagDefinition` solo se lista; no hay endpoint publico de create/update/delete.
- La creacion de `TagValue` es explicita y devuelve conflicto ante duplicado
  `accountId + definitionKey + slug`.
- El resource binding reemplaza ocurrencias globales por `resourceType + resourceId`.
- `tags: []` limpia todas las ocurrencias globales del recurso.
- El binding requiere `TagValue` existentes y no crea values implicitamente.
- Las mutaciones requieren owner role; las lecturas requieren JWT y contexto de cuenta.

## Transicion Externa

La transicion Jira a `En curso` se intento con aprobacion explicita del
usuario. La policy del entorno rechazo la escritura porque exportaria
metadata/evidence interna hacia Jira. En su lugar se avanzo el estado local de
ARDS/SDD.
