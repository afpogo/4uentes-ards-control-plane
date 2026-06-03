# CR-SST-0014 - Course Tags Analysis

## Fuente

Ruta revisada:

`C:/Users/andre/Desktop/4uentes/sst/cursos/aws/fundamentos_aws/docs`

El material representa clases/notas tomadas durante un curso de AWS. La forma
actual es texto humano con marcadores semiestructurados.

## Gramatica observada

| Marcador actual | Interpretacion SST propuesta | Tipo de uso |
| --- | --- | --- |
| `AWS` | `TagValue` de tecnologia o curso | Clasificacion |
| `titulo` | titulo del recurso o seccion | Metadata |
| `subt` / `sub` | subtitulo o heading interno | Estructura |
| `definicion` | bloque de definicion | Contenido |
| `clase` | bloque narrativo de clase | Contenido |
| `ejemplo` | bloque de ejemplo | Contenido |
| `recordar` | recordatorio o punto de memoria | Contenido destacado |
| `importante` | prioridad o enfasis | Tag/metadata |
| `docs` | link/documentacion externa | Referencia |
| `referencias` | fuente externa | Referencia |
| `tecnologias` | lista de tecnologias mencionadas | TagValues |

## Lectura de dominio

Los tags del curso cumplen dos funciones distintas:

- Tags de clasificacion: describen el recurso y permiten encontrarlo o
  cruzarlo con otros recursos. Ejemplos: `AWS`, `IAM`, `S3`, `Route 53`.
- Tags estructurales: ordenan el contenido por tipo de bloque. Ejemplos:
  `definicion`, `ejemplo`, `recordar`, `importante`.

SST necesita conservar ambas funciones. Si todo se modela como un unico tag
plano, se pierde la diferencia entre "este articulo habla de IAM" y "este
bloque es una definicion".

## Propuesta de cierre conceptual

Para Articulos/Clases/Cursos conviene separar:

- `ContentResource`: recurso principal, por ejemplo articulo, clase o nota de
  curso.
- `ContentBlock`: bloque interno, por ejemplo definicion, ejemplo o recordar.
- `TagDefinition`: tipo de tag gobernado.
- `TagValue`: valor reutilizable.
- `TagOccurrence`: aplicacion del tag a un recurso o bloque.

El nombre visible puede seguir siendo "Clase" para el usuario si describe mejor
el flujo de estudio. El nombre tecnico recomendado para el contrato es
`learning-content` o `learning-resource`, porque permite incluir articulos,
clases, cursos y tutoriales sin forzar un unico formato de UI.

## Problemas detectados en el material

- Hay variantes de marcador: `subt`, `sub`, `recordaar`, `importtante`.
- Hay errores de tipeo: por ejemplo `Preticion`, `Secrect`, `Route 43`.
- Algunos archivos mezclan explicacion, comandos, links e imagenes sin un
  modelo de bloque explicito.
- El encoding observado en terminal muestra mojibake en algunos caracteres, por
  lo que el parser futuro debe normalizar texto antes de crear tags.

## Conclusion

El curso de AWS valida la necesidad de expandir tags. Tambien muestra que la
feature no debe cerrarse solamente como "tags de Diccionario": el siguiente
paso debe crear un contrato SST-level para `learning-content-tags` y luego
conectar Articulos, Cursos y Bitacora a ese contrato.

