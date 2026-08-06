# CR-SST-0113 - Resumen De Intencion

## Objetivo

Implementar en `sst-fend` la primera hoja editable real dentro de la creacion
de articulos de texto.

## Intencion Principal

- Reemplazar la experiencia de formulario/plumbing por una superficie de
  escritura usable.
- Mantener los tags generales del articulo en su propio control.
- Preparar el terreno para selecciones y anotaciones sin mezclar persistencia
  backend avanzada.

## Resultado Esperado

Un usuario puede escribir o pegar texto en una hoja central y crear el articulo
sin perder la separacion entre articulo y contexto de aprendizaje.
