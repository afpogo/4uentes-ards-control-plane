# CR-SST-0069 Phase Analysis And Plan

## Estado

- Fecha: 2026-06-12
- Request: CR-SST-0069
- Jira issue: SST-12
- Feature state: `sst-tag-prefix-engine`
- Estado actual: `runtime-partial`
- Repos funcionales modificados en este analisis: no

## Problema A Resolver

`CR-SST-0067` publico el endpoint backend preview-only:

```http
POST /4uentes/v1/tags/prefix-engine/preview
```

Pero aun falta introducirlo de forma segura en el resto del sistema. El punto
critico es no confundir preview con persistencia, ni transformar referencias
externas en tags locales.

## Concepto A Introducir

El runtime devuelve distintos tipos materializados:

- `ContentBlock`: bloque de contenido parseado.
- `TagValue`: clasificacion local del recurso.
- `TagOccurrence`: trazabilidad de que un prefijo aparecio en la fuente.
- `AssetRef`: referencia a imagen/archivo.
- `ExternalReference`: referencia a URL/documento externo.
- `ImportedReference`: referencia a otro scope SST, por ejemplo Diccionario o
  Articulos.

La regla importante:

```text
ImportedReference != TagValue local
```

Eso significa que una referencia cruzada debe viajar y renderizarse como
referencia externa/reference-chip, no como clasificacion propia del recurso.

## Orden De Introduccion

1. Backend live validation.
2. BFF pass-through.
3. Frontend read-only preview rendering.
4. Control-plane/Jira reconciliation.

## Gate 0: Backend Live Validation

Objetivo:

- ejecutar el endpoint con JWT real;
- confirmar status `200`;
- confirmar `contractVersion`;
- confirmar `persistenceMode=preview-only`;
- confirmar `persisted=false`.

Sin este gate no se debe avanzar a BFF/frontend.

## Gate 1: BFF Pass-through

Objetivo:

- exponer el endpoint desde `4uentes-auth`;
- reenviar JWT/account context;
- preservar shape completo:
  - `materialized.*`;
  - `issues`;
  - `definitions`;
  - `persistenceMode`;
  - `persisted`;
  - `contractVersion`.

Regla:

- no convertir `ImportedReference` en `TagValue`;
- no reducir la respuesta a `string[]`.

## Gate 2: Frontend Preview

Objetivo:

- UI read-only para pegar/escribir `sourceText`;
- seleccionar `scope`;
- ver preview materializado;
- mostrar warnings;
- mostrar referencias externas como chips/references.

Non-goals:

- no guardar resultado;
- no crear Learning Content;
- no crear Bitacoras;
- no crear TagDefinition.

## Gate 3: Cierre Operativo

Solo despues de evidencia backend+BFF+frontend:

- actualizar `state/features/sst-tag-prefix-engine.current.yaml`;
- decidir si pasa a `validated-live`;
- reconciliar Jira `SST-12`.

## Decision

Asignar esta fase a `CR-SST-0069`.

`CR-SST-0069` no implementa Learning Content. Introduce el preview del motor en
el sistema de forma controlada, manteniendo el modelo global de tags y evitando
persistencia prematura.
