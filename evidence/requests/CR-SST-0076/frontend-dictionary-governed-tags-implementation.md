# CR-SST-0076 - Implementacion frontend de tags gobernados en Diccionario

## Estado

- Fecha: 2026-06-24
- Repo: `sst-fend`
- Superficie: `/dictionary`, tab `Management`, `Entry Sheet`
- Request: `CR-SST-0076`
- Jira: `SST-24`

## Cambios implementados

- Se extendio `tagGovernanceService` con:
  - `PUT /api/tags/resources/:resourceType/:resourceId`
  - payload `sourceType`, `producer`, `tags`
- Se agregaron tipos frontend para `ReplaceResourceTagsRequest` y
  `ReplaceResourceTagValue`.
- `DictionaryEntrySheet` ahora acepta un editor de tags gobernados embebido.
- La pantalla Dictionary incorpora selector multiple de tags gobernados:
  - busca valores con `GET /api/tags/values`;
  - crea valores explicitamente con `POST /api/tags/values`;
  - usa `scope=diccionario`;
  - usa `resourceType=diccionario`;
  - usa `definitionKey=tema`;
  - usa `sourceType=dictionary-tag`;
  - usa `producer=frontend`.
- El guardado de entries conserva el flujo seguro:
  - primero persiste la entry por `/api/diccionario/entries`;
  - luego ejecuta `PUT /api/tags/resources/diccionario/:entryId`;
  - `tags: []` limpia todos los tags globales de la entry.

## Boundary preservado

- No se cambio el reader legacy de Diccionario.
- No se cambio el shape publico de entries de Diccionario.
- No se agregaron rutas nuevas.
- No se llamo directo a `sst-bend` desde frontend; todo pasa por `node-auth`.
- No se implemento CRUD publico de `TagDefinition`.

## UX

- El selector vive dentro de la `Entry Sheet` como una carta compacta del
  lenguaje visual de Diccionario.
- Se evito el borde azul default/fino de Ant Design usando estilos locales:
  paper, steel, blue mist y foco por inset lateral.
- Las opciones seleccionadas se muestran como tokens compactos dentro de la
  carta, no como tags flotantes fuera de contexto.

## Documentacion local actualizada

- `sst-fend/docs/34-dictionary-frontend.md`
- `sst-fend/specs/34-dictionary-frontend.yml`
- `sst-fend/specs/capabilities/inbound/node-auth--sst-tags-governance.yaml`
- `sst-fend/docs/capabilities/inbound/node-auth--sst-tags-governance.md`
- `sst-fend/specs/capabilities/inbound/00-index.yaml`
- `sst-fend/docs/capabilities/00-overview.md`

## Archivos runtime tocados

- `sst-fend/src/services/tagGovernanceService.ts`
- `sst-fend/src/services/types/tagGovernance.ts`
- `sst-fend/src/pages/Dictionary/index.tsx`
- `sst-fend/src/pages/Dictionary/components/DictionaryEntrySheet.tsx`
- `sst-fend/src/pages/Dictionary/styles.module.scss`
- `sst-fend/src/pages/Dictionary/styles.module.scss.d.ts`
- `sst-fend/src/pages/Dictionary/i18n/Dictionary.i18n.ts`

## Riesgo residual

- El bind global depende de que el create de entry devuelva `id`. Si el BF/SST
  cambia el wrapper de respuesta y no expone `id`, la UI muestra error y no
  silencia el fallo de binding.
- La QA protegida completa requiere JWT real en entorno runtime.
