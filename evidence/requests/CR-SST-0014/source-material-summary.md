# CR-SST-0014 - Source Material Summary

## Alcance

Esta evidencia resume el material revisado para analizar el estado actual de
tags en SST y su expansion desde Diccionario hacia Articulos, Clases, Cursos y
Bitacora.

## Material de negocio

El documento del 30 de abril plantea que SST usa tags como mecanismo central
para organizar informacion. Los puntos principales son:

- Diccionario fue el primer contexto donde se modelo el sistema de tags.
- El mismo sistema debe expandirse a Bitacora y a una seccion de contenido
  estructurado, nombrada provisionalmente como Articulos, Clases o Cursos.
- La transcripcion en tiempo real es una idea futura de captura dinamica de
  informacion, pero no es bloqueante para cerrar el ciclo de tags de
  Diccionario.
- El bloqueo conceptual indicado era recordar la tercera pieza tecnica del
  sistema de tags.

## Material de curso revisado

Ruta revisada:

`C:/Users/andre/Desktop/4uentes/sst/cursos/aws/fundamentos_aws/docs`

Archivos de texto observados:

- `01-Que_es_la_computacion_en_la_nube.txt`
- `02-tipos_de_computo_IAAS_PAAS_SAAS.txt`
- `03-historia_aws.txt`
- `04-regiones_zonas_de_disponibilidad_aws.txt`
- `05-seguridad_identidad_aws.txt`
- `06-IAM_ilustrado_aws.txt`
- `07-Secrect-Manager_aws.txt`
- `aws_despliegueAppStatica.txt`
- `aws_despliegueAppStatica_completo.txt`

Tambien existen imagenes de soporte:

- `active_directory_aws.png`
- `Arq_BucketS3_route53_web_estatica.png`

## Lectura principal

Los archivos del curso no usan un formato final de `TagDefinition`,
`TagValue` y `TagOccurrence`, pero si contienen una gramatica humana de tags:

- `AWS`
- `titulo`
- `subt` / `sub`
- `definicion`
- `clase`
- `ejemplo`
- `recordar`
- `importante`
- `docs`
- `referencias`
- `tecnologias`

Esto confirma que el problema ya no es solo Diccionario. SST necesita una
gramatica de contenido gobernada por tags para recursos de aprendizaje y
articulos.

