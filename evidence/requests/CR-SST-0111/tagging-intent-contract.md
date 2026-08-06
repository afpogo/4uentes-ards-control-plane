# CR-SST-0111 - Contrato De Intencion De Tags

## Objetivo

Separar claramente dos niveles de tags:

- `ArticleTag`: clasifica el articulo como pieza del archivo.
- `LearningContentTag`: clasifica fragmentos, bloques o intenciones dentro del
  contenido aceptado como contexto de aprendizaje.

Este CR no implementa runtime nuevo. Define el contrato de producto y
arquitectura que debe respetar el siguiente corte de implementacion.

## Modelo Mental

Un articulo representa una fuente o pieza editorial completa:

- titulo;
- referencia/origen;
- descripcion o cuerpo;
- tags generales del articulo.

`LearningWorkspace` representa contexto de aprendizaje derivado del contenido:

- `sourceRef` apunta al articulo, borrador o fuente;
- `sourceText` contiene el texto base;
- selectores indican linea, parrafo, bloque, documento, header, footer o
  seleccion;
- la relevancia indica el rol del fragmento: `clase`, `nota`, `recordar`,
  `ejemplo`, `definicion`, `image`, `docs`, `code`;
- solo el contenido aceptado queda disponible como contexto.

La relacion esperada es:

```text
Article
  |- ArticleTag[]                    clasificacion general del articulo
  |- LearningWorkspaceSourceRef?     enlace al texto/fuente usada
       |- LearningContentSelection[] fragmentos candidatos
            |- LearningContentTag[]  tags/relevancia de aprendizaje
            |- acceptance_state      draft | accepted | rejected
```

## Separacion Funcional

`ArticleTag` responde:

> De que trata este articulo como entidad del archivo?

Ejemplos:

- `java`
- `spring`
- `security`
- `backend`

`LearningContentTag` responde:

> Que fragmento del contenido es util, con que rol y en que alcance?

Ejemplos:

- parrafo 2 como `clase`;
- linea 8 como `recordar`;
- bloque 3 como `ejemplo`;
- header como tema principal;
- documento entero como contexto base.

## Contrato De `ArticleTag`

### Alcance

`ArticleTag` clasifica el articulo completo. No representa una seleccion de
texto ni debe depender de un rango, linea o parrafo.

### Semantica

- Es estable para busqueda, filtro y navegacion de articulos.
- Puede ser usada aunque el articulo no tenga contexto de aprendizaje aceptado.
- Puede coincidir nominalmente con un `LearningContentTag`, pero su significado
  sigue siendo de articulo completo.
- No expresa relevancia pedagogica; solo clasificacion general.

### Ejemplos Validos

- Articulo: "Spring Security JWT"
  - `ArticleTag`: `spring`, `security`, `jwt`, `backend`
- Articulo: "Notas de arquitectura SST"
  - `ArticleTag`: `sst`, `arquitectura`, `ards-sdd`

### Anti-Patrones

- Usar `ArticleTag` para marcar "parrafo importante".
- Cambiar tags generales cada vez que se selecciona una linea.
- Prometer que un filtro por `ArticleTag` devuelve fragmentos pedagogicos.

## Contrato De `LearningContentTag`

### Alcance

`LearningContentTag` clasifica contenido aceptado como contexto de aprendizaje.
Siempre debe poder responder:

- de que fuente viene;
- que fragmento cubre;
- con que rol o relevancia fue marcado;
- si ya fue aceptado para estar disponible como contexto.

### Ancla De Fuente

Cada seleccion debe tener una referencia trazable:

- `sourceRef`: articulo, borrador, URL, documento importado o fuente temporal;
- `sourceText`: texto materializado usado para preview;
- `selector`: alcance exacto del fragmento;
- `normalizedText`: texto normalizado que queda disponible para consulta;
- `acceptedAt` o estado equivalente cuando se promueve.

### Selectores Esperados

El siguiente runtime debe contemplar estos alcances, aunque puede implementar
una primera porcion incremental:

| Selector | Uso esperado |
| --- | --- |
| `line` | Una linea puntual |
| `line_range` | Varias lineas contiguas |
| `paragraph` | Un parrafo puntual |
| `paragraph_range` | Varios parrafos contiguos |
| `line_plus_paragraph` | Lineas seleccionadas con su parrafo contextual |
| `document` | Documento completo |
| `document_header` | Header o encabezado de documento |
| `document_footer` | Footer o cierre de documento |
| `semantic_block` | Bloque detectado o armado por el usuario |
| `manual_selection` | Seleccion libre dentro del texto |

### Relevancias Esperadas

La relevancia no reemplaza al tag. Describe el rol del fragmento:

| Relevancia | Intencion |
| --- | --- |
| `clase` | Contenido principal para estudiar |
| `nota` | Observacion complementaria |
| `recordar` | Dato puntual que conviene memorizar |
| `ejemplo` | Caso concreto o muestra |
| `definicion` | Definicion conceptual |
| `image` | Referencia visual o imagen asociada |
| `docs` | Referencia documental |
| `code` | Fragmento o explicacion de codigo |

### Semantica De Consulta

Una consulta por `LearningContentTag` debe devolver contexto aceptado, no solo
articulos. El resultado debe poder mostrar:

- fragmento o bloque marcado;
- articulo/fuente de origen;
- tags de contenido;
- relevancia;
- alcance del selector;
- estado de aceptacion.

## Regla De Disponibilidad

El contenido se vuelve util para aprendizaje solo despues de una aceptacion
explicita. `preview` permite evaluar, pero no debe contaminar el contexto
consultable.

Estados minimos:

- `draft`: existe como borrador o preview local;
- `previewed`: fue procesado para revisar;
- `accepted`: queda disponible como contexto;
- `rejected`: se descarta o queda fuera del contexto.

## Contrato UX Esperado

La tab `Texto` de creacion de articulo debe evolucionar a una hoja real:

- el texto es la superficie principal, no un formulario accesorio;
- el usuario puede escribir o importar texto;
- el usuario puede seleccionar lineas, parrafos, rangos, bloques, header,
  footer, documento entero o seleccion libre;
- el usuario puede aplicar tags/relevancia sobre fragmentos seleccionados;
- los tags generales del articulo permanecen en un selector separado;
- el preview muestra claramente que fragmentos se aceptaran;
- aceptar contexto no debe crear ni modificar el articulo sin una accion clara;
- crear articulo no debe aceptar contexto automaticamente si el usuario no lo
  pidio.

## Contrato Visual Minimo

La experiencia final debe permitir distinguir visualmente:

- tags generales del articulo;
- selecciones de contenido;
- relevancia aplicada a cada seleccion;
- estado de cada seleccion: borrador, preview, aceptada o rechazada;
- origen del contenido cuando proviene de URL/importacion.

No alcanza con mostrar un formulario de URL, descripcion, tags y pastillas de
relevancia. Eso valida conectividad, pero no materializa la intencion de hoja
editorial dinamica.

## Contrato API/BFF Esperado

El contrato actual de `LearningWorkspace` sirve como primer slice:

- `GET /api/learning-workspaces/me`
- `GET /api/learning-workspaces/context`
- `POST /api/learning-workspaces/sources/preview`
- `POST /api/learning-workspaces/sources/:previewId/accept`
- `POST /api/learning-workspaces/sources/:previewId/reject`

El siguiente corte debe evaluar si alcanza con extender los payloads actuales o
si hace falta introducir DTOs explicitos para:

- `sourceRef`;
- `sourceText`;
- `selector`;
- `selectionRange`;
- `relevance`;
- `contentTags`;
- `articleTags`;
- `acceptanceState`;
- `originArticleId`.

La regla de arquitectura se mantiene: `sst-fend` consume `node-auth` como BFF;
no llama directo a `sst-bend`.

## Estado Actual

CR-SST-0110 valida conectividad funcional:

- la tab `Texto` ya puede crear un articulo;
- el borrador de texto alimenta preview/accept/reject de `LearningWorkspace`;
- el flujo usa `node-auth` como BFF;
- crear articulo y aceptar contexto son acciones separadas.

Este estado no representa la experiencia final buscada. Es un corte tecnico de
plumbing.

## Intencion UX Pendiente

La siguiente implementacion debe convertir la tab `Texto` en una hoja real:

- escritura de texto como superficie principal;
- seleccion/relevancia por linea, parrafo, rango, bloque, documento,
  header/footer y seleccion manual;
- tags visuales sobre fragmentos del texto;
- preview contextual legible antes de aceptar;
- diferencia clara entre tags generales del articulo y tags de contenido;
- consulta posterior por articulo y por contexto de aprendizaje aceptado.

## Boundaries Para El Proximo CR

- No mezclar `ArticleTag` con `LearningContentTag` en un mismo selector.
- No promover preview a contexto sin aceptacion explicita.
- No crear `TagDefinition` automaticamente desde la UI.
- No llamar directo de `sst-fend` a `sst-bend`; mantener BFF `node-auth`.
- Definir primero el contrato de persistencia/query antes de prometer busqueda
  granular por tags.

## Criterios De Aceptacion Para El Siguiente CR

El proximo CR de implementacion deberia considerarse aceptable solo si:

- la tab `Texto` muestra una hoja editable o importable como superficie central;
- los tags generales del articulo siguen separados de los tags de contenido;
- existe al menos una seleccion granular verificable sobre texto;
- la seleccion tiene selector, relevancia y tags de contenido;
- el preview permite revisar el contexto antes de aceptar;
- accept/reject conserva la regla de disponibilidad;
- la UI deja claro que se esta marcando contenido, no solo clasificando el
  articulo;
- queda evidencia owner en los repos hijos modificados.

## Proximo Corte Recomendado

Abrir un CR de implementacion frontend/backend coordinado para:

1. definir DTOs de tagging granular si el contrato actual no alcanza;
2. ajustar la hoja de texto para tags visuales por fragmento;
3. preservar tags generales del articulo en su propio selector;
4. validar consulta o lectura diferenciada de articulo versus contexto aceptado.

## Decision De CR-SST-0111

CR-SST-0111 debe cerrar como contrato de intencion, no como implementacion
runtime. El siguiente CR debe mutar repos hijos y por lo tanto debe activar:

- politica de owner documentation;
- evidencia owner en `sst-fend`, `node-auth` y/o `sst-bend`, segun alcance;
- validacion de repo hijo;
- `npm.cmd run check` completo del control-plane antes del cierre.
