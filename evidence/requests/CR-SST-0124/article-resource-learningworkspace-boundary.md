# CR-SST-0124 - Article Resource vs LearningWorkspace Boundary

## Estado

- Fecha: 2026-07-07
- Request: `CR-SST-0124`
- Jira mirror: `SST-53`
- Iniciativa: `INIT-SST-0001`
- Tipo: analisis ARDS/SDD de producto y arquitectura
- Mutacion de repos hijos en este documento: no

## Intencion

Documentar la decision de producto: un `Articulo SST` es un recurso base y
puede existir sin procesamiento IA ni `LearningWorkspace`. `LearningWorkspace`
entra cuando SST necesita procesar, curar, aceptar y materializar contexto de
aprendizaje desde un documento, texto, PDF, HTML o resultado de agente.

## Separacion Conceptual

### Articulo SST

Un articulo es el recurso vivo base dentro de SST. Puede crearse de forma
simple y seguir siendo valido aunque no haya sido procesado por IA.

Puede contener:

- titulo;
- descripcion o cuerpo;
- URL externa opcional cuando existe fuente web real;
- tags generales de articulo (`ArticleTag`);
- payload `web`, `text` o `transcript`;
- documentos asociados cuando existan.

Crear un articulo no implica:

- ejecutar agentes IA;
- aceptar contexto de aprendizaje;
- generar `LearningContentTag`;
- procesar PDF;
- crear archivos derivados.

### LearningWorkspace

`LearningWorkspace` es la superficie de procesamiento y materializacion de
contexto. No reemplaza la creacion de articulos ni debe ser una dependencia
obligatoria para el CRUD base de articulos.

Debe entrar cuando existe una fuente a procesar, por ejemplo:

- PDF textual que representa una web;
- PDF visual que representa una web;
- HTML o texto extraido;
- documento cargado por el usuario;
- output de agente IA;
- texto nativo de articulo que el usuario decide transformar en contexto.

Su responsabilidad es:

- tomar una fuente o documento del articulo;
- generar preview de bloques, anotaciones, conceptos o relevancias;
- permitir revision del usuario;
- aceptar o rechazar contexto;
- materializar archivos, bloques o referencias SST visibles en la hoja del
  articulo.

## Flujo Base Sin IA

1. Usuario crea articulo con titulo, descripcion, URL opcional y tags.
2. SST persiste el articulo como recurso base.
3. El articulo puede abrirse en la app mediante URL runtime derivada por
   identidad de articulo.
4. No se invoca `LearningWorkspace`.
5. No se generan `LearningContentTag` ni archivos derivados.

Este flujo debe seguir siendo barato, directo y sin dependencias de agentes.

## Flujo Con Procesamiento

1. El articulo existe o se esta materializando desde una fuente.
2. SST obtiene o adjunta un documento fuente:
   - PDF textual;
   - PDF visual;
   - HTML;
   - texto extraido;
   - archivo cargado.
3. `LearningWorkspace` procesa esa fuente.
4. El usuario revisa preview de contexto.
5. El usuario acepta o rechaza.
6. Lo aceptado se materializa como archivo, bloque, anotacion o referencia SST
   asociada al articulo.
7. La hoja del articulo muestra el resultado materializado.

## Tags Y Contexto

La separacion definida por `CR-SST-0111` se mantiene:

- `ArticleTag` clasifica el articulo completo.
- `LearningContentTag` clasifica fragmentos o bloques aceptados dentro de
  contexto de aprendizaje.

Por lo tanto:

- crear articulo puede persistir `ArticleTag`;
- crear articulo no debe persistir automaticamente `LearningContentTag`;
- un preview de `LearningWorkspace` no contamina contexto consultable;
- aceptar contexto es una accion explicita y posterior.

## Relacion Con CR-SST-0124

`CR-SST-0124` debe resolver el MVP de articulo nativo:

- articulos `text` sin URL externa inventada;
- URL runtime/app derivada desde identidad y origen de SST;
- accion de abrir recurso hacia la hoja SST;
- separacion estricta entre URL externa de fuente y URL interna runtime.

Este CR no debe convertir `LearningWorkspace` en requisito para crear el
articulo. `LearningWorkspace` queda como procesamiento posterior o paralelo
cuando el usuario decide transformar documentos/texto en contexto SST.

## Relacion Con SST-50 / CR-SST-0120

`SST-50 / CR-SST-0120` trata preview image para articulos derivados de sesion.
Este documento no modifica ese alcance ni asume ownership de esa implementacion.

La conexion conceptual es limitada:

- si una sesion produce PDF textual/visual, ese artifact puede convertirse en
  documento fuente del articulo;
- preview visual y procesamiento de aprendizaje son responsabilidades
  distintas;
- la materializacion de contexto pertenece al track `learning-content-tags`,
  no al contrato visual de preview image.

## Riesgos

- Confundir URL externa con URL runtime interna y disparar scraping sobre rutas
  de la app.
- Bloquear creacion simple de articulos por exigir IA o `LearningWorkspace`.
- Persistir `LearningContentTag` al crear articulo sin aceptacion explicita.
- Mezclar `ArticleTag` con tags de fragmento en un mismo selector.
- Tratar PDF visual/textual como preview image cuando en realidad puede ser
  documento fuente de procesamiento.

## Decision

La direccion correcta es:

- Articulo primero como recurso SST base.
- LearningWorkspace despues como plataforma de procesamiento/materializacion.
- Documentos fuente como puente entre ambos mundos.
- Tags generales separados de contexto aceptado.
- Runtime URL interna separada de URL externa/sourceUrl.

## Owner Enforcement

Este analisis modifica solo control-plane. No requiere owner docs de repo hijo
en este corte documental.

Cuando `CR-SST-0124` avance a implementacion en `sst-fend`, debe actualizar
owner docs de `sst-fend` y ejecutar:

- checks locales del repo hijo;
- `npm.cmd run check` del control-plane;
- evidencia de owner documentation.
