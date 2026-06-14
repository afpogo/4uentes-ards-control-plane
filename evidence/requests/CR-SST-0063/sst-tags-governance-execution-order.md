# SST Tags Governance Execution Order

## Estado

- Fecha: 2026-06-11
- Request: CR-SST-0063
- Modo: control-plane planning
- Jira write ejecutado: no
- Repos funcionales modificados: no
- Fuente live Jira: `evidence/requests/CR-SST-0062/unified-jira-radar-live.md`

## Principio De Orden

El orden no debe seguir solo el numero de issue Jira. Debe seguir dependencias
de modelo:

1. cerrar deuda historica de requests;
2. fijar semantica global de tags;
3. cerrar Diccionario como dominio base validado;
4. cerrar Articulos como primer dominio SST nuevo gobernado;
5. promover el motor de prefijos como runtime reutilizable;
6. extender a Learning Content;
7. dejar Bitacoras y otros tipos como extension gobernada futura.

Jira es una superficie de visibilidad. La fuente canonica de estado sigue
siendo el control-plane ARDS/SDD con evidencia local.

## Modelo Canonico A Cerrar

La definicion global debe separar:

| Concepto | Responsabilidad | Bloquea |
|---|---|---|
| `TagDefinition` | Define tipos de tag, scope permitido, cardinalidad, aliases, normalizacion y ownership. | Diccionario, Articulos, Learning Content, Bitacoras |
| `TagValue` | Valor reusable dentro de una definition. Puede ser compartido o acotado por scope segun governance. | Diccionario, Articulos |
| `TagOccurrence` | Vinculo de un `TagValue` con un recurso especifico y `sourceType`. | Todos los tipos de recurso |
| `TagScope` | Recurso o contexto gobernado: `diccionario`, `articulos`, `learning-content`, `bitacora`, futuros. | Extensibilidad |
| `TagProducer` | UI, API, importador, parser o extension que produce tags. | BFF/frontend/extension |

La decision global debe permitir nuevos scopes sin reescribir el modelo base.
`bitacora` queda como scope reservado/futuro, no como implementacion obligatoria
del cierre actual.

## Orden Ejecutivo

### 0. Cierre De Prove­nance Historica

Objetivo: que los tickets activos no sigan arrastrando CRs historicos abiertos.

| CR | Estado recomendado | Motivo |
|---|---|---|
| `CR-SST-0002` | done retroactivo | Ya produjo evidencia de review de Diccionario/tags. |
| `CR-SST-0010` | done retroactivo / superseded | Fue absorbido por `CR-SST-0014`, `CR-SST-0057`, `CR-SST-0060` y este orden. |
| `CR-SST-0014` | done | Analisis profundo ya cerrado. |
| `CR-SST-0015` | done | Analisis de grammar learning ya cerrado. |
| `CR-SST-0016` | done | POC backend de prefix engine ya cerrado. |
| `CR-SST-0057` | done | Intake operativo de `SST-4` ya cerrado. |

Resultado esperado: solo quedan abiertos los CRs que representan trabajo real
pendiente, no investigacion historica.

### 1. Definicion Global De Gobierno De Tags

Ticket conductor: `SST-4` / `sst-tags-governance`.

Request recomendado: continuar bajo `CR-SST-0060` si se limita a Articulos, o
crear un CR posterior si se formaliza un spec global antes de tocar repos
funcionales.

Debe cerrar:

- contrato global `TagDefinition` / `TagValue` / `TagOccurrence`;
- regla de scopes permitidos y extensibles;
- ownership de `TagDefinition`: code registry, DB governance o transicion
  explicita entre ambos;
- regla para aliases y normalizacion;
- regla para producers (`frontend`, `BFF`, `backend`, `extension`, `parser`);
- criterio de compatibilidad con `diccionario`, `articulos`,
  `learning-content` y `bitacora` futura.

No debe implementar todo. Debe impedir que cada dominio invente su propio
modelo.

### 2. Cierre De Diccionario

Ticket conductor: `SST-10` / `dictionary-tags`.

Depende de: Paso 1.

Debe cerrar:

- validacion live o smoke endpoint de Diccionario;
- decision de `TagDefinition` como superficie gestionada o gap aceptado;
- separacion explicita: Diccionario puede quedar cerrado aunque Articulos,
  Learning Content o Bitacoras sigan como extensiones;
- estado final esperado para `dictionary-tags`: `validated-live` o `done`,
  segun evidencia runtime.

Motivo del orden: Diccionario es el dominio base ya implementado. Cerrarlo
primero estabiliza las reglas que Articulos reutiliza.

### 3. Cierre De Articulos

Ticket conductor: `SST-4` / `sst-tags-governance`.

Request activo: `CR-SST-0060`.

Depende de: Paso 1 y preferentemente Paso 2.

Secuencia interna:

1. `sst-bend`: capability `article-tags`, tests de create/update/list/detail
   con tags e `includeTags=true`.
2. `4uentes-auth`: BFF/auth boundary sin degradar tags estructurados a
   `string[]`.
3. `sst-fend`: create/update/rendering de tags estructurados en Articulos.
4. `sst-extension`: solo review o gap aceptado si Quick Save no entra en el
   primer corte.

Debe cerrar:

- `article-tags` deja de ser draft/backend-partial;
- Articulos queda como primer dominio nuevo que usa el gobierno SST de tags;
- `sst-tags-governance` puede avanzar desde `runtime-partial` solo si hay
  evidencia cross-repo suficiente.

### 4. Promocion Runtime Del Prefix Engine

Ticket conductor: `SST-12` / `sst-tag-prefix-engine`.

Depende de: Paso 1. Puede ejecutarse despues o en paralelo tardio con Paso 3,
pero no debe redisenar el contrato global.

Debe cerrar:

- endpoint runtime preview/import para el motor de prefijos;
- contrato de respuesta para `ContentBlock`, `TagValue`, `TagOccurrence`,
  `AssetRef`, `ExternalReference` e `ImportedReference`;
- persistencia o decision explicita de no persistencia;
- validacion de scopes iniciales: `diccionario`, `articulos`,
  `learning-content`, `bitacora`.

Motivo del orden: el POC ya existe, pero hacerlo runtime antes de cerrar
semantica global puede solidificar decisiones equivocadas.

### 5. Learning Content Tags

Ticket conductor: `SST-6` / `learning-content-tags`.

Depende de: Paso 1 y Paso 4.

Debe cerrar:

- parser/import endpoint para material de cursos/clases;
- rendering frontend para `clase`, `nota`, `recordar`, `ejemplo`, imagenes,
  docs y code blocks;
- regla para excluir artifacts de labs por defecto;
- uso del mismo modelo global, sin crear un modelo paralelo de course tags.

Motivo del orden: Learning Content necesita el prefix engine runtime y el
contrato global estable.

### 6. Bitacoras Y Otros Tipos

Ticket recomendado: nuevo backlog/feature ticket, no parte del cierre actual.

Depende de: Paso 1 y, si usa prefijos/import, Paso 4.

Decision:

- `bitacora` queda reservado como `TagScope` futuro;
- no bloquea cierre de Diccionario ni Articulos;
- debe entrar por request propio cuando existan reglas de recurso, UI y
  productores.

## Orden De Tickets Activos

| Orden | Jira | State id | Accion |
|---:|---|---|---|
| 1 | `SST-4` | `sst-tags-governance` | Cerrar definicion global y ejecutar `CR-SST-0060` para Articulos. |
| 2 | `SST-10` | `dictionary-tags` | Cerrar Diccionario como dominio base con criterio separado de extensiones. |
| 3 | `SST-12` | `sst-tag-prefix-engine` | Promover POC a runtime despues de fijar semantica global. |
| 4 | `SST-6` | `learning-content-tags` | Implementar parser/rendering sobre el modelo global y prefix runtime. |

Si el equipo quiere minimizar riesgo aun mas, invertir los pasos 2 y 3 solo es
valido si Diccionario no necesita el endpoint de prefix preview/import para su
cierre. En la evidencia actual, no lo necesita.

## No Hacer Todavia

- No abrir `SST-13` tooling backlog antes de cerrar el gobierno base de tags.
- No usar Jira status para marcar `state/features/*.yaml` como done.
- No meter Bitacoras en el primer cierre de Articulos.
- No cambiar `4uentes-core` desde este flujo.
- No tocar repos funcionales sin request activo, plan y evidencia.

## Criterio De Cierre Del Bloque Tags

El bloque minimo queda cerrado cuando:

- `CR-SST-0002`, `CR-SST-0010`, `CR-SST-0014`, `CR-SST-0015`,
  `CR-SST-0016` y `CR-SST-0057` estan cerrados como done/provenance;
- `SST-10` tiene Diccionario cerrado o validado live con gaps aceptados;
- `SST-4` tiene Articulos usando tags estructurados end-to-end;
- `SST-12` define si el prefix engine queda runtime o como extension posterior;
- `SST-6` queda explicitamente fuera del cierre base o entra despues de
  `SST-12`;
- `bitacora` queda documentado como scope futuro, no deuda implicita.
