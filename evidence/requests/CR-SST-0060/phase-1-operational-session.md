# Phase 1 Operational Session

## Estado

- Fecha: 2026-06-11
- Request gobernante: `CR-SST-0060`
- Jira issue: `SST-4`
- State id: `sst-tags-governance`
- Fase activa: `phase-1-global-tags-governance-and-article-tags`
- Jira write ejecutado: no
- Repos funcionales modificados en esta evidencia: si (`sst-bend`, `4uentes-auth`, `sst-fend`)
- Fuente de orden: `evidence/requests/CR-SST-0063/sst-tags-governance-execution-order.md`
- Contrato fase 1: `docs/requests/sst-tags-governance-contract.md`

## Decision De Sesion

La ejecucion de tags avanza por `SST-4 / sst-tags-governance`.

Esta fase debe cerrar primero el contrato global de gobierno de tags y despues
ejecutar el slice de Articulos bajo el mismo marco. Las fases posteriores quedan
documentadas como operativas consecutivas, pero no se ejecutan hasta que sus
gates de entrada esten cumplidos.

El contrato global queda publicado en:

```text
docs/requests/sst-tags-governance-contract.md
```

## Fase 1: SST-4 / SST Tags Governance

Objetivo:

- fijar la semantica global de tags;
- impedir modelos paralelos por dominio;
- cerrar Articulos como primer dominio nuevo gobernado por SST tags.

### 1.1 Contrato Global

Debe quedar definido antes de cambios funcionales amplios:

| Concepto | Decision requerida |
|---|---|
| `TagDefinition` | Tipo de tag, scope permitido, cardinalidad, aliases, normalizacion y ownership. |
| `TagValue` | Valor reusable, reglas de reuse cross-scope y normalizacion. |
| `TagOccurrence` | Vinculo entre `TagValue`, recurso, `sourceType`, producer y metadata de origen. |
| `TagScope` | Scopes activos: `diccionario`, `articulos`; scopes reservados: `learning-content`, `bitacora`, futuros. |
| `TagProducer` | Productores aceptados: backend, BFF, frontend, extension, parser/importer. |

Decision esperada:

- `diccionario` y `articulos` quedan como scopes activos del cierre base;
- `learning-content` queda como fase posterior;
- `bitacora` queda reservada como extension futura;
- no se requiere implementar todos los scopes para cerrar la fase 1.

### 1.2 Articulos

Secuencia interna:

1. `sst-bend`
   - promover o actualizar capability `article-tags`;
   - validar `POST /articulos` con tags;
   - validar `PATCH /articulos/:id` con tags;
   - validar `GET /articulos?includeTags=true`;
   - validar `GET /articulos/:id?includeTags=true`.

2. `4uentes-auth`
   - confirmar pass-through o transformacion del BFF;
   - evitar degradacion de tags estructurados a `string[]`;
   - validar el boundary autenticado de create/update/read.
   - estado 2026-06-11: runtime y ARDS local actualizados; `npm.cmd run check`
     y `npm.cmd run build` pasan con ejecucion elevada por lock/permiso sobre
     `dist`.

3. `sst-fend`
   - adoptar create/update con tags estructurados;
   - renderizar tags retornados desde `includeTags=true`;
   - mantener compatibilidad con representaciones existentes mientras se migra.
   - estado 2026-06-11: runtime y ARDS local actualizados; `npm.cmd run check`
     pasa con ejecucion elevada por lock/permiso sobre `dist`; quedan warnings
     existentes de hooks fuera del alcance.

4. `sst-extension`
   - revisar Quick Save solo como productor opcional;
   - dejarlo fuera del primer corte si no bloquea Articulos.

## Gates De Salida De Fase 1

La fase 1 puede considerarse cerrada solo si existe evidencia de:

- contrato global documentado;
- `article-tags` activo o gobernado, no solo draft/backend-partial;
- backend validado para create/update/list/detail con tags;
- BFF/auth sin perdida de estructura;
- frontend creando/editando/renderizando tags estructurados;
- checks locales por repo tocado;
- actualizacion posterior del control-plane sin marcar `done` por Jira solamente.

## Fases Operativas Consecutivas

### Fase 2: SST-10 / Dictionary Tags

Entrada:

- contrato global de fase 1 aprobado;
- Diccionario no depende de cambios pendientes de Articulos para cerrar su
  criterio propio.

Trabajo:

- ejecutar smoke/live endpoint de Diccionario;
- cerrar `TagDefinition` como superficie gestionada o gap aceptado;
- declarar explicitamente que Diccionario queda cerrado aunque Articulos,
  Learning Content o Bitacoras sigan evolucionando.

Salida:

- `dictionary-tags` pasa a `validated-live` o `done`, segun evidencia.

### Fase 3: SST-12 / Tag Prefix Engine

Entrada:

- contrato global aprobado;
- decisiones de `TagDefinition`, `TagValue`, `TagOccurrence` y `TagScope`
  estables.

Trabajo:

- promover POC a endpoint runtime preview/import;
- fijar contrato de respuesta para `ContentBlock`, `TagValue`,
  `TagOccurrence`, `AssetRef`, `ExternalReference` e `ImportedReference`;
- validar scopes iniciales, incluyendo `bitacora` solo como scope reservado si
  no hay UI/runtime de Bitacoras.

Salida:

- prefix engine deja de ser solo POC local o queda explicitamente diferido.

### Fase 4: SST-6 / Learning Content Tags

Entrada:

- contrato global aprobado;
- prefix engine runtime disponible o decision explicita de no requerirlo.

Trabajo:

- parser/import endpoint para cursos/clases;
- rendering frontend para bloques educativos;
- exclusion de artifacts de labs por defecto;
- uso del mismo modelo global, sin modelo paralelo.

Salida:

- `learning-content-tags` avanza con evidencia backend/frontend.

### Fase 5: Bitacoras Y Otros Tipos

Entrada:

- scope futuro aceptado por contrato global;
- request nuevo aprobado para Bitacoras u otro tipo.

Trabajo:

- definir recurso, productores, UI, permisos y persistencia;
- extender sin reescribir el modelo base.

Salida:

- nuevo feature ticket o backlog item, no deuda implicita de fase 1.

## Reglas De No Avance

- No ejecutar Fase 2 si Fase 1 no definio contrato global.
- No ejecutar Fase 3 si el prefix engine puede contradecir el contrato global.
- No ejecutar Fase 4 antes de resolver runtime/import del parser o registrar
  una excepcion explicita.
- No incluir Bitacoras dentro del cierre minimo de Articulos.
- No cambiar `state/features/*.yaml` a `done` por Jira status solamente.

## Proxima Accion Recomendada

Antes de tocar repos funcionales, crear o actualizar el artefacto de contrato
global de tags para que `sst-bend`, `4uentes-auth` y `sst-fend` implementen
contra la misma semantica.

Estado actual: contrato publicado; `sst-bend`, `4uentes-auth` y `sst-fend`
quedaron alineados en capacidades ARDS y runtime boundary. La siguiente accion
es completar QA runtime create/update/list/detail contra servicios levantados y
registrar si `sst-extension` queda como gap no bloqueante de fase 1.
