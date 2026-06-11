# Revision De Gaps Para SST Tags Governance

## Estado

- Fecha: 2026-06-08
- Request: CR-SST-0060
- Feature state: `sst-tags-governance`
- Jira issue: `SST-4`
- Estado local actual: `runtime-partial`
- Estado Jira observado por MCP: `En curso`

## Lectura Actual

`CR-SST-0057` cerro la toma operativa de `SST-4`, pero no cerro ningun gap de
implementacion. Por eso `sst-tags-governance` debe seguir en
`runtime-partial`.

La evidencia origen muestra que el runtime parcial mas concreto esta en
`article-tags`:

- `POST /articulos` y `PATCH /articulos/:id` aceptan `tags` opcionales.
- `GET /articulos` y `GET /articulos/:id` pueden usar `includeTags=true`.
- El backend sincroniza tags de articulos creando o reutilizando
  `DictionaryTagValue`.
- Las ocurrencias usan `DictionaryTagOccurrence` con `articleId` y
  `sourceType: article-tag`.
- La capability `article-tags` existe como outbound draft en `sst-bend`.

## Gaps Abiertos Clasificados

| Gap | Decision |
| --- | --- |
| Promover `article-tags` desde draft | Siguiente implementacion recomendada |
| Adoptar tags estructurados en BFF/frontend | Parte del mismo slice |
| Promover `sst-tag-prefix-engine` de POC a endpoint preview/import | Request posterior |
| Real-time transcription | Request separado, no bloquea tags |

## Decision

El siguiente avance debe concentrarse en:

`article-tags backend capability + BFF/auth boundary + frontend article create/update`

No conviene mezclar en el mismo CR:

- parser de cursos;
- transcripcion en tiempo real;
- writer generico de Jira;
- cierre total de todos los gaps de `sst-tags-governance`.

## Resultado Esperado

Despues de implementar `CR-SST-0060`, el estado podria avanzar solo si existe
evidencia de:

- capability `article-tags` promovida o gobernada;
- validacion backend para create/update/list/detail con tags;
- adopcion BFF/auth sin perdida de estructura;
- adopcion frontend en create/update;
- checks locales de repos afectados.

Hasta entonces, el estado correcto sigue siendo `runtime-partial`.
