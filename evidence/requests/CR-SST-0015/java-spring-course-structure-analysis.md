# CR-SST-0015 - Java Spring Course Structure Analysis

## Alcance

Ruta revisada:

`C:/Users/andre/Desktop/4uentes/sst/cursos/javaSpringGraddle`

Esta muestra confirma que un curso SST completo tiene dos niveles de estructura:

- estructura de directorios y archivos;
- estructura interna de lineas guiadas por prefijos como `clase:`,
  `ejemplo:`, `recordar:`, `nota:`, `image:` y `docs:`.

## Estructura de directorios observada

| Directorio | Rol SST propuesto | Observacion |
| --- | --- | --- |
| `docs` | contenido pedagogico parseable | 25 archivos `.txt`, 99 KB aproximados |
| `images` | assets visuales referenciables | 15 imagenes |
| `scripts` | assets ejecutables de soporte | 2 scripts SQL |
| `installers` | assets descargables | 1 `.zip` |
| `labs` | espacio de labs | vacio en esta muestra |
| `springBoot-2` | lab/proyecto ejecutable | proyecto Spring Boot/Gradle con build, source, compose y postgres data |

## Tipos de recurso dentro de `docs`

| Patron | Interpretacion SST |
| --- | --- |
| `05-...txt` a `24-...txt` | lecciones ordenadas por numero |
| `bit_*.txt` | notas de bitacora o definiciones complementarias |
| `Examen_Curso_Spring.txt` | evaluacion/cuestionario |

Esta estructura no debe convertirse a un unico "articulo plano". El parser
necesita preservar jerarquia:

- `Course`: Java Spring Gradle.
- `Module` o `Section`: derivado del directorio o de rangos de lecciones.
- `Lesson`: cada archivo numerado.
- `ContentBlock`: cada linea o grupo de lineas iniciado por un prefijo.
- `Asset`: imagen, script, installer o archivo de soporte.
- `Lab`: proyecto ejecutable asociado al curso.
- `Assessment`: examen.

## Prefijos encontrados

Conteo de lineas con prefijo en `docs/*.txt`:

| Prefijo | Conteo | Lectura |
| --- | ---: | --- |
| `clase` | 289 | bloque narrativo principal; puede agruparse en uno o varios parrafos |
| `ejemplo` | 112 | ejemplo o snippet asociado a una explicacion |
| `recordar` | 47 | nota de memoria o repaso |
| `definicion` | 24 | definicion conceptual |
| `image` | 10 | referencia a asset visual |
| `subt` | 7 | subtitulo o seccion interna |
| `docs` | 7 | link externo de documentacion |
| `comments` | 5 | comentario o anotacion |
| `code` | 4 | bloque de codigo |
| `uso` | 3 | caso de uso |
| `nota` | 2 | nota importante; aparece poco pero es semantica valida |
| otros | varios | typos o prefijos especiales |

Prefijos especiales o variantes:

- `archivo`
- `comment`
- `response`
- `content-type`
- `@Embeddable`
- `@Embedded`
- `@EmbeddedId`
- typos: `reacordar`, `recirdar`, `recordemos`, `ejmplo`

## Lectura de negocio

El prefijo `clase:` no es solo un tag de clasificacion. Es un tag estructural:
indica que las lineas marcadas forman el cuerpo pedagogico de la clase y deben
agruparse como parrafos o bloques narrativos.

Lo mismo aplica a `nota:` y `recordar:`. No conviene modelarlos solamente como
etiquetas planas. Deben convertirse en tipos de bloque para renderizar:

- parrafos de clase;
- listas de notas;
- ejemplos;
- definiciones;
- referencias;
- imagenes;
- codigo;
- preguntas de examen.

## Assets y referencias

Se encontraron referencias `image: [nombre]` dentro de los textos. Casi todas
apuntan a archivos existentes en `images/`. Se observo una referencia sin asset
visible en la carpeta:

- `logica_dominio_ventajas`

Esto debe validarse como warning de importacion, no como fallo del analisis.

Los scripts SQL referenciados desde las clases deben tratarse como assets de
lab, no como contenido narrativo:

- `script_market4uentes.sql`
- `script_inserts_market4uentes.sql`

## Lab ejecutable

`springBoot-2` contiene un proyecto Spring Boot/Gradle de ejemplo:

- Java 11.
- Spring Boot 2.7.17.
- Spring Data JPA.
- PostgreSQL runtime.
- MapStruct.
- Swagger.
- HTTP requests de prueba.

Para SST esto es evidencia/lab asociado al curso. Un parser de cursos no debe
ingerir ciegamente carpetas como `.gradle`, `build`, `.idea`, `postgres_data` o
archivos `.class`.

## Conclusion

El curso Java Spring Gradle confirma que SST necesita un modelo
`learning-content` mas fuerte que `article-tags`. La unidad real no es solo
Articulo. Es un conjunto jerarquico:

`Course -> Lesson -> ContentBlock -> TagOccurrence -> Asset/Lab/Evidence`.

