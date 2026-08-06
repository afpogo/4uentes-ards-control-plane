# CR-SST-0112 - Contrato UX De Entrada De Texto Anotable

## Proposito

Definir la experiencia de usuario que debe guiar la implementacion de la
entrada de texto anotable en SST. Este contrato existe para evitar que la
funcionalidad se reduzca a un formulario con tags. La intencion es una
superficie editorial donde el usuario escribe, selecciona, clasifica y convierte
texto en conocimiento estructurado.

## Propuesta De Valor

La plataforma debe permitir que un usuario transforme texto comun en material
de aprendizaje reutilizable sin cambiar de herramienta ni pensar en modelos
internos.

El valor diferencial es:

- escribir o importar texto en una hoja central;
- seleccionar fragmentos de forma natural;
- explicar por que un fragmento importa mediante tags y relevancia;
- previsualizar la intencion antes de aceptarla;
- generar una vista final legible sin perder la estructura semantica;
- consultar luego por articulo, tag, relevancia o fragmento aceptado.

## Principio UX

El texto es la interfaz principal.

Los controles deben aparecer alrededor del texto y de la seleccion activa, no
competir con la hoja. La experiencia debe sentirse mas cercana a un editor de
documentos que a un panel administrativo.

## Modelo De Pantalla

La primera implementacion debe organizarse en cuatro zonas:

| Zona | Funcion |
| --- | --- |
| Header de entrada | Titulo, estado del borrador y acciones principales |
| Hoja editable | Escritura, pegado, seleccion y marcas visuales |
| Panel lateral o inferior | Resumen de anotaciones, tags del articulo y preview |
| Barra contextual | Acciones sobre seleccion activa |

El foco visual debe estar en la hoja. Los tags del articulo pueden vivir en el
panel, pero no dentro del mismo control que los tags de contenido.

## Flujo Principal

1. El usuario elige crear una entrada de texto.
2. La tab `Texto` muestra una hoja editable vacia o con contenido importado.
3. El usuario escribe, pega o importa texto.
4. El usuario selecciona una linea, rango, parrafo, bloque o texto libre.
5. La UI muestra un menu flotante/contextual cerca de la seleccion.
6. El usuario aplica tags de contenido y relevancia.
7. La seleccion queda marcada visualmente como preview.
8. El panel de preview muestra que se aceptaria como contexto.
9. El usuario acepta o rechaza la intencion.
10. Al aceptar, el contenido pasa a contexto de aprendizaje y puede renderizarse
    como Markdown/template en un corte posterior.

## Superficie Editable

La hoja debe soportar como minimo:

- escribir texto libre;
- pegar texto largo;
- preservar saltos de linea y parrafos;
- mostrar una estructura escaneable;
- permitir seleccion de texto con mouse;
- mostrar marcas no destructivas sobre selecciones anotadas;
- mantener el cursor y la seleccion de forma predecible.

No se requiere en el primer corte:

- colaboracion en tiempo real;
- autocompletado inteligente;
- comentarios multiusuario;
- soporte completo de Markdown enriquecido;
- edicion mobile avanzada.

## Seleccion

El usuario debe poder seleccionar contenido con una interaccion natural.

Selectores esperados por prioridad:

| Prioridad | Selector | Motivo |
| --- | --- | --- |
| 1 | `manual_selection` | Permite validar el concepto con cualquier fragmento |
| 1 | `paragraph` | Es la unidad mas util para aprendizaje inicial |
| 2 | `line` | Util para notas tecnicas y codigo |
| 2 | `line_range` | Util para fragmentos multi-linea |
| 3 | `semantic_block` | Requiere deteccion o estructura adicional |
| 3 | `document` | Util para contexto base, pero menos granular |
| 4 | `document_header` / `document_footer` | Requiere convencion visual estable |

Para `CR-SST-0113`, alcanza con que la hoja preserve texto y seleccion. Para
`CR-SST-0114`, debe existir al menos `manual_selection` y preferentemente
`paragraph`.

## Menu Flotante O Contextual

Cuando existe una seleccion valida, la UI debe mostrar un control contextual.

Acciones minimas:

- aplicar tag de contenido;
- aplicar relevancia;
- limpiar anotacion;
- abrir detalle de configuracion;
- cerrar menu sin alterar el texto.

La interaccion principal recomendada es un popover flotante sobre seleccion.
El click derecho puede ser una mejora, pero no debe ser el unico camino porque
el navegador y mobile tienen comportamientos propios.

## Tags Y Relevancia

Los tags de contenido describen de que trata el fragmento. La relevancia
describe para que sirve ese fragmento.

Ejemplo:

```text
Seleccion: "JWT expiration must be validated before accepting a token."
LearningContentTag: security, jwt
Relevancia: recordar
```

Esto no debe modificar los `ArticleTag` del articulo completo.

## Separacion De Controles

La pantalla debe distinguir:

- `ArticleTag`: clasificacion general del articulo;
- `LearningContentTag`: clasificacion de fragmentos seleccionados;
- relevancia: rol pedagogico del fragmento;
- preview: intencion no aceptada;
- accepted context: contenido promovido.

El usuario no deberia necesitar conocer esos nombres internos, pero la UI si
debe evitar que se mezclen conceptualmente.

## Estados UX

| Estado | Descripcion |
| --- | --- |
| `empty` | Hoja sin contenido |
| `draft` | Texto editable con cambios locales |
| `selection_active` | Hay texto seleccionado y acciones contextuales |
| `annotated_preview` | Hay anotaciones visibles aun no aceptadas |
| `preview_ready` | La intencion puede revisarse antes de aceptar |
| `accepted` | El contexto queda disponible para aprendizaje |
| `rejected` | La intencion se descarta o queda fuera del contexto |
| `error` | Fallo en preview/accept/reject sin perder borrador |

## Vista Previa

La preview debe responder tres preguntas:

- Que fragmentos se aceptaran?
- Con que tags y relevancia?
- De que articulo/fuente provienen?

La preview no debe confundirse con el articulo final ni con la persistencia
definitiva. Es una revision de intencion.

## Vista Final Esperada

Despues de aceptar, el contenido debe poder evolucionar a una vista estable:

- Markdown o Markdown-like;
- template visual por tema;
- bloques diferenciados por relevancia;
- lectura limpia para el usuario;
- trazabilidad hacia las selecciones originales.

Esta vista final pertenece a `CR-SST-0117`. `CR-SST-0112` solo define la
intencion.

## Accesibilidad Y Teclado

La primera implementacion debe conservar una ruta usable sin depender
exclusivamente del mouse:

- el texto debe ser navegable con teclado;
- una seleccion hecha con teclado debe poder abrir acciones desde toolbar;
- los controles contextuales deben tener labels accesibles;
- estados de error y preview deben ser legibles sin color como unica senal.

## Criterios De Aceptacion UX

Una implementacion respeta este contrato si:

- la tab `Texto` muestra una hoja editable como superficie principal;
- el usuario puede escribir o pegar texto sin pasar primero por un formulario de
  metadatos;
- los tags generales del articulo estan separados de las anotaciones de
  contenido;
- existe una ruta clara para seleccionar texto;
- existe un control contextual para anotar la seleccion;
- las anotaciones se ven como preview no destructiva;
- aceptar contexto es una accion explicita;
- el borrador no se pierde ante errores de preview o accept;
- la UI comunica valor de aprendizaje, no solo clasificacion.

## Anti-Patrones

- Un formulario de URL, descripcion y tags como experiencia principal.
- Un unico selector de tags para articulo y fragmentos.
- Aceptar contexto automaticamente al crear articulo.
- Guardar solo Markdown renderizado y perder selecciones.
- Depender solo de click derecho.
- Ocultar la preview detras de una accion tecnica.

## Borde Para CR-SST-0113

`CR-SST-0113` debe implementar la hoja editable base en `sst-fend`.

Debe incluir:

- superficie de escritura;
- persistencia local del borrador durante la edicion;
- separacion visual de tags del articulo;
- preparacion tecnica para selecciones futuras;
- owner docs en `sst-fend`;
- validacion local de `sst-fend` y control-plane.

No debe incluir:

- persistencia backend nueva;
- modelo final de selecciones;
- render Markdown/template final;
- parser/import avanzado.

## Borde Para CR-SST-0114

`CR-SST-0114` debe implementar la anotacion contextual sobre seleccion.

Debe incluir:

- seleccion manual o por parrafo;
- menu flotante/contextual;
- tags de contenido;
- relevancia;
- preview visual;
- separacion de `ArticleTag`;
- owner docs en `sst-fend`.

## Decision

La funcionalidad debe avanzar como editor anotable. La experiencia actual de
plumbing sirve para probar conectividad, pero no representa la propuesta de
valor final.
