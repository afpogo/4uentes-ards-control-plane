# CR-SST-0125 - Implementation Analysis Start

## Contexto

`SST-53 / CR-SST-0124` quedo cerrado. El siguiente gap activo de
`learning-content-tags` es el parser/import backend que habia quedado separado
como follow-up inmediato.

## Hallazgo En sst-bend

El endpoint ya existe:

```text
POST /4uentes/v1/learning-workspaces/sources/preview
```

El DTO ya acepta:

- `sourceType`
- `sourceRef`
- `sourceText`
- `documentSelectors`
- `assetSelectors`
- `exclusionPolicy`
- `prefixAliasPolicy`
- `annotations[]`

El use case actual (`PreviewLearningSourceUseCase`) todavia reduce la entrada a
`sourceText`/`rawText` y delega en `PreviewTagPrefixesUseCase`.

## Decision Tecnica Inicial

El siguiente corte no debe crear otro endpoint. Debe fortalecer la normalizacion
del preview existente:

- aceptar `sourceText` como compatibilidad;
- aceptar payloads bounded de `CourseSource`/`WebArticleSource`;
- producir `sourceText` normalizado antes del parser de prefijos;
- generar `warnings[]` para paths excluidos, selectors no soportados y assets
  faltantes;
- conservar `persistenceMode=preview-only`;
- no crear `TagDefinition` automaticamente;
- no hacer crawler ni scraping masivo.

## Riesgo Principal

El riesgo no es parsear texto; el riesgo es mezclar preview/import con
persistencia o scraping. Por eso la primera implementacion debe ser warning
first y test-driven sobre el servicio puro antes de validar el endpoint.

## Proxima Accion

Crear/sincronizar Jira mirror como subtask de `SST-6` si el MCP/fallback lo
permite. Luego implementar en `sst-bend` con owner docs y checks obligatorios.
