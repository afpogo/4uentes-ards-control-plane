# SST Tags And Dictionary - Business Intake

Fecha: 2026-05-18
Fuente: descarga mental / brainstorming del usuario
Estado: intake
Request relacionado: CR-SST-0002
Solucion: SST

## Proposito

Este documento captura una descarga mental inicial sobre Study Store Tag, tags,
diccionario, dictionary entries, dictionary sheets, translations, aliases,
seguridad y relacion con account.

## Intake Sin Procesar

Resumen organizado de la descarga mental inicial, agrupado por categorias y con
una vision general de los temas tratados.

## Resumen De La Descarga Mental

### Reflexiones

- El proposito de SST (Study Store Tag) es permitir que los usuarios aprovechen
  la plataforma para gestionar informacion sensible, importante o banal de forma
  segura.
- Al hacer de los `tags` una funcionalidad principal, la informacion etiquetada
  se convierte en un recurso vivo que la plataforma y el usuario pueden
  gestionar activamente.
- Se busca dar maxima seguridad al usuario, explorando opciones como servidores
  offline y cifrado para que la informacion no se filtre y pueda ser usada en
  aplicaciones externas con confianza.

### Ideas

- Proposito de los `tags`: convertir la informacion del usuario en recursos
  vivos y gestionables. El usuario podra visualizar y consumir informacion
  etiquetada en distintos paneles: informacion sensible, segura o general.
- Gramatica de los `tags`: se imagina un sistema de `keys`. Cada `key` existira
  dentro de un `scope` especifico. Por ejemplo, las `keys` del recurso
  diccionario seran distintas a las de articulos o bitacora. Para empezar, las
  `keys` de diccionario viviran solo en el scope del diccionario.
- Diferencia entre `Dictionary Entry` y `Dictionary Sheet`:
  - `Dictionary Entry`: entrada individual que se guarda en la aplicacion.
  - `Dictionary Sheet`: conjunto de `Dictionary Entries` agrupadas que definen
    un concepto mayor. La sheet contiene entradas junto con comentarios,
    indicaciones y contexto.
- Manejo de translations: para campos que requieren multiples idiomas, como en
  el diccionario de conceptos con ingles y espanol, se propone crear una tabla
  separada llamada `translations` o equivalente, referenciada desde la tabla
  principal del diccionario.

### Tareas

- Definir la entrada de informacion para SST en el contexto de construccion de
  un diccionario.
- Definir el proposito de Study Store Tag (SST).
- Establecer la gramatica minima de los tags.
- Definir que es una `Dictionary Sheet`.
- Definir que es una `Dictionary Entry`.
- Definir el manejo de translations y aliases.
- Pospuesto: definir reglas de seguridad y tamano.
- Pospuesto: definir la relacion con `account` y el `endpoint` previsto.

### Preguntas

- Como va a funcionar el sistema de tags en su totalidad? Hay una idea inicial,
  pero todavia no esta completamente cerrado.

### Bloqueos

- El funcionamiento detallado y completo del sistema de tags todavia no esta
  definido, por lo que esta sesion es un primer brainstorming.
- Los siguientes puntos quedan pendientes para una sesion futura:
  - reglas de seguridad y tamano
  - relacion con la cuenta (`account`)
  - endpoint previsto

## Vision General De Los Temas

El tema principal del monologo del 22 de abril de 2026 es la conceptualizacion
inicial del sistema Study Store Tag (SST), con foco especifico en su aplicacion
para construir un diccionario.

Puntos clave:

1. Proposito y filosofia de SST: crear un sistema donde los datos del usuario,
   organizados mediante `tags`, se conviertan en recursos dinamicos y seguros
   dentro de la plataforma. La seguridad y portabilidad de la informacion son
   fundamentales.
2. Estructura de datos del diccionario: definir jerarquia y entidades clave,
   diferenciando una entrada individual (`Dictionary Entry`) de una coleccion
   contextual (`Dictionary Sheet`) y proponiendo un manejo escalable de
   translations.
3. Arquitectura de tags: empezar a definir la gramatica de tags mediante `keys`
   que operan dentro de `scopes` especificos como diccionario, articulos u otros
   recursos, evitando colisiones de nombres entre dominios.

En resumen, este intake sienta bases de arquitectura y logica de negocio para
una funcionalidad central de SST, usando el diccionario como primer campo de
prueba.
