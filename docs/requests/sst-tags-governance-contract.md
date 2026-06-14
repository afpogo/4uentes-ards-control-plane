# SST Tags Governance Contract

## Proposito

Este contrato define el modelo, reglas de unicidad y API canonica para tags en
SST en la transicion desde tags simples o legacy hacia tags gobernados y
reutilizables.

Esta fase fija decisiones de control-plane. No implementa runtime en repos
funcionales.

El alcance activo de la fase es:

- Diccionario
- Articulos

Los scopes `learning-content` y `bitacora` quedan reservados para requests
futuros y no bloquean este cierre contractual.

## Autoridad

- Feature state: `state/features/sst-tags-governance.current.yaml`
- Jira issue: `SST-4`
- Subtask Jira de este CR: `SST-19`
- Orden operativo: `evidence/requests/CR-SST-0063/sst-tags-governance-execution-order.md`
- Request gobernante inicial: `CR-SST-0071`

## Modelo persistido objetivo

La migracion introduce un modelo global por cuenta con compatibilidad temporal
de lectura y escritura durante la transicion:

- `tag_definitions`
- `tag_values`
- `tag_occurrences`

No se agregan tablas o columnas por dominio nuevo. La extensibilidad entra por
`scope`, `resourceType`, `sourceType` y `producer`.

### Separacion entre scope y resourceType

Esta fase no colapsa `scope` y `resourceType`. Cumplen funciones distintas:

- `scope`: agrupacion funcional o superficie de negocio. Valores activos:
  `articulos`, `diccionario`. Valores reservados: `learning-content`,
  `bitacora`.
- `resourceType`: tipo tecnico del recurso enlazable. Valores activos:
  `articulo`, `diccionario`. Valores reservados: `learning-content`,
  `bitacora`.

Regla: un `TagDefinition` puede declarar uno o mas `allowedResourceTypes`, pero
eso no cambia la unicidad de `TagValue`.

### TagDefinition

Responsabilidades:

- identidad estable (`id`);
- `key` estable y canonica;
- `label` visible;
- `scope`;
- `allowedResourceTypes`;
- `status`;
- `metadata`.

Ejemplos iniciales:

- `tema`
- `tecnologia`
- `fuente`
- `importancia`

Regla de ownership:

- `TagDefinition` es gobernado por sistema.
- No se crea por accion de usuario final.
- La carga inicial o ampliacion controlada queda para seed o registry de
  sistema en `CR-SST-0072`.

### TagValue

Responsabilidades:

- identidad estable (`id`);
- `definitionKey`;
- `label` visible;
- `slug` canonico;
- `status`;
- `metadata`.

Ejemplos:

- `AWS`
- `IAM`
- `seguridad`
- `importante`

Regla de unicidad:

- `TagValue` es reutilizable global por definicion, no por scope y no por
  recurso.
- La unicidad objetivo es `accountId + definitionKey + slug`.
- Un mismo `TagValue` puede reutilizarse en `articulos` y `diccionario` si la
  definicion y el slug coinciden.

Regla de normalizacion:

- `label` conserva la forma visible de presentacion.
- `slug` es la forma canonica para comparacion y deduplicacion.
- `slug` debe normalizarse a lowercase con separacion estable tipo hyphen.
- La deteccion de duplicados compara `definitionKey + slug`.

Regla de creacion:

- La creacion de `TagValue` es explicita.
- Si ya existe un valor equivalente para la misma cuenta y definicion, la API
  debe devolver conflicto (`409`) y no crear duplicado silencioso.

### TagOccurrence

Responsabilidades:

- vinculo entre un `TagValue` y un recurso SST;
- `tagValueId`;
- `resourceType`;
- `resourceId`;
- `sourceType`;
- `producer`;
- `status`;
- `metadata`.

Ejemplos de `resourceType` activos:

- `articulo`
- `diccionario`

Reglas:

- el binding se resuelve por `resourceType + resourceId`;
- no se agregan columnas por dominio como `article_id`, `entry_id`,
  `course_id`, `bitacora_id`;
- `sourceType` y `producer` son obligatorios en mutaciones.

## Mapeo legacy y compatibilidad temporal

Durante la transicion:

- `dictionary_tag_values` migra conceptualmente a `tag_values`;
- `dictionary_tag_occurrences.article_id` y `.entry_id` migran a
  `tag_occurrences.resourceType + resourceId`;
- el shape legado `definitionKey`, `label`, `slug`, `value` puede mantenerse
  como compatibilidad de lectura mientras clientes y BFF migran.

La compatibilidad temporal se mantiene hasta que `CR-SST-0072..0076` cierren
el circuito de persistencia, API, BFF y frontend.

## Endpoints objetivo de fase

### Definitions

`GET /4uentes/v1/tags/definitions`

Devuelve `TagDefinition` gobernadas y activas.

### Values Search

`GET /4uentes/v1/tags/values`

Query:

- `scope`
- `resourceType`
- `definitionKey`
- `q`

Salida:

- lista de `TagValue` activas y normalizadas para autocomplete o reuso.

### Create Value

`POST /4uentes/v1/tags/values`

Reglas:

- crea un `TagValue` solo si no existe uno equivalente;
- no crea `TagDefinition`;
- responde `409` ante duplicado por `accountId + definitionKey + slug`.

### Bind or Unbind by resource

`PUT /4uentes/v1/tags/resources/:resourceType/:resourceId`

Reglas:

- reemplaza tags del recurso con el payload explicito recibido;
- `tags: []` elimina todas las ocurrencias del recurso;
- requiere `sourceType` y `producer`.

## Payload canonico recomendado

```json
{
  "definitionKey": "tecnologia",
  "label": "AWS",
  "slug": "aws",
  "scope": "articulos",
  "resourceType": "articulo",
  "resourceId": "123",
  "sourceType": "article-tag",
  "producer": "frontend"
}
```

## Scopes iniciales y reservados

### Diccionario

- scope activo;
- `resourceType` activo: `diccionario`;
- `sourceType` recomendado: `dictionary-tag`;
- comparte `tag_values` y `tag_occurrences` con el resto del modelo global.

### Articulos

- scope activo;
- `resourceType` activo: `articulo`;
- `sourceType` recomendado: `article-tag`;
- debe soportar search, autocomplete y create explicito de valores.

### learning-content

- scope reservado;
- `resourceType` reservado;
- `sourceType` recomendado futuro: `learning-content-tag`.

### bitacora

- scope reservado;
- `resourceType` reservado;
- `sourceType` recomendado futuro: `bitacora-tag`.

## Reglas contractuales

- Ningun dominio crea `TagDefinition` por accion de usuario.
- Ningun error tipografico crea definiciones o valores silenciosamente.
- `tags` viaja como estructura gobernada; no debe degradarse a `string[]`.
- `tags: []` es una operacion valida de detach total.
- `TagValue` se reutiliza entre dominios cuando coincide
  `accountId + definitionKey + slug`.
- `TagOccurrence` modela enlace por recurso y no redefine estructura por
  dominio.

## Boundary por capa

### Backend (`sst-bend`)

- persiste `TagDefinition`, `TagValue`, `TagOccurrence`;
- valida consistencia de `scope`, `resourceType` y definicion;
- expone search por `label` y `slug`;
- implementa attach y detach por recurso.

### BFF / Auth (`4uentes-auth`)

- actua como pass-through autenticado;
- preserva shape;
- propaga contexto JWT y cuenta;
- no crea `TagDefinition`.

### Frontend (`sst-fend`)

- usa selector gobernado con autocomplete;
- permite create explicito de `TagValue`;
- soporta `tags: []`;
- renderiza estructura canonica recibida del backend.

## Salida esperada para los CRs siguientes

- `CR-SST-0072`: implementar persistencia global, seeds iniciales y backfill
  desde tablas legacy.
- `CR-SST-0073`: publicar search, create y attach or detach por recurso en
  `sst-bend`.
- `CR-SST-0074`: exponer la fachada autenticada en `4uentes-auth`.
- `CR-SST-0075`: migrar Articulos a selector gobernado.
- `CR-SST-0076`: adoptar el mismo catalogo en Diccionario y reconciliar el
  cierre de `SST-4`.

## Criterio de cierre de etapa

El cierre de `sst-tags-governance` en este bloque requiere:

- modelo global definido (`CR-SST-0071`);
- persistencia y migracion iniciada (`CR-SST-0072`);
- API de busqueda y bind por recurso (`CR-SST-0073`);
- pass-through BFF (`CR-SST-0074`);
- UI gobernada en Articulos (`CR-SST-0075`);
- adopcion de Diccionario y reconciliacion `SST-4` (`CR-SST-0076`);
- `learning-content` y `bitacora` siguen como scopes no bloqueantes.
