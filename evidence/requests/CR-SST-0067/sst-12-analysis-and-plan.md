# SST-12 Analysis And Plan

## Estado

- Fecha: 2026-06-12
- Request: CR-SST-0067
- Jira issue: SST-12
- Feature state: `sst-tag-prefix-engine`
- Estado local actual: `implemented-local`
- Estado Jira observado: `En curso`
- Escritura Jira: no

## Lectura

`SST-12` representa la promocion del `sst-tag-prefix-engine` desde POC backend
a boundary runtime. No representa todavia la implementacion de
`learning-content-tags`.

El POC de `CR-SST-0016` ya define:

- scopes iniciales: `diccionario`, `articulos`, `learning-content`, `bitacora`;
- materializaciones: `ContentBlock`, `TagValue`, `TagOccurrence`, `AssetRef`,
  `ExternalReference`, `ImportedReference`;
- registry/engine backend sin endpoint HTTP, sin DB persistida y sin UI.

## Dependencias

Dependencias cerradas:

- `CR-SST-0016`: POC backend implementado.
- `CR-SST-0063`: orden de ejecucion definido.
- `CR-SST-0064`: `dictionary-tags` validado live.
- `CR-SST-0066`: `SST-10` reconciliado en Jira como `Listo`.

Dependencia activa:

- `CR-SST-0060`: `sst-tags-governance` / Articulos deja abierto el gap de
  prefix engine runtime como fase posterior. No bloquea iniciar `SST-12`,
  porque la semantica global ya esta documentada y Diccionario fue cerrado.

## Boundary De Fase

Incluido:

- backend `sst-bend`;
- endpoint o boundary runtime preview/import;
- contrato de request/response;
- decision de persistencia;
- tests backend y evidencia local.

Excluido:

- `SST-6` / Learning Content implementation;
- UI de reference chips;
- BFF/frontend salvo follow-up documentado;
- Bitacoras como implementacion.

## Plan

1. Revisar `sst-bend` bajo el request `CR-SST-0067`.
2. Ubicar entidades, registry, engine y pruebas del POC.
3. Definir contrato runtime:
   - input de preview/import;
   - scopes permitidos;
   - warnings;
   - output estructurado.
4. Implementar o adaptar boundary backend.
5. Agregar pruebas enfocadas:
   - prefix conocido;
   - prefix desconocido con warning;
   - aliases normalizados;
   - referencias externas/importadas;
   - scopes gobernados/reservados.
6. Ejecutar checks backend y control-plane.
7. Actualizar `state/features/sst-tag-prefix-engine.current.yaml` solo si hay
   evidencia runtime.
8. Reconciliar Jira `SST-12` solo despues de evidencia.

## Decision

El siguiente paso operativo es implementar `CR-SST-0067` en `sst-bend` como
runtime backend primero. `learning-content-tags` queda como consumidor posterior
de este boundary.
