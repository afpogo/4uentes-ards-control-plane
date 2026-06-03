# CR-SST-0015 - Parser Boundary Recommendation

## Decision recomendada

La futura implementacion no debe comenzar con un parser generico de cualquier
archivo. Debe empezar con un parser gobernado para cursos SST.

## Contrato minimo propuesto

Entrada:

- ruta raiz del curso;
- nombre canonico del curso;
- politica de inclusion/exclusion;
- aliases de prefijos;
- modo de validacion: warning-first.

Salida:

- `CourseResource`;
- `LessonResource`;
- `ContentBlock`;
- `AssetRef`;
- `LabRef`;
- `AssessmentResource`;
- `TagOccurrence`.

## Reglas de parseo iniciales

- `docs/*.txt` es la fuente primaria de contenido.
- archivos numerados son `LessonResource`.
- archivos `bit_*.txt` son `BitacoraResource` o `ReferenceNote`.
- `Examen_*.txt` es `AssessmentResource`.
- `image: [id]` crea `AssetRef` hacia `images/<id>.*`.
- `archivo: [id]` crea `AssetRef` hacia `scripts/` u otro asset local.
- `docs: <url>` crea `ExternalReference`.
- `clase:`, `definicion:`, `ejemplo:`, `recordar:`, `nota:`, `code:` crean
  `ContentBlock` con tipo normalizado.

## Aliases y normalizacion

Normalizar sin perder evidencia original:

| Original | Canonico |
| --- | --- |
| `reacordar` | `recordar` |
| `recirdar` | `recordar` |
| `recordemos` | `recordar` |
| `ejmplo` | `ejemplo` |
| `comment` | `comments` |
| `sub` | `subt` |

Los prefijos Java como `@Embeddable`, `@Embedded` y `@EmbeddedId` no deben ser
tratados como tipos de bloque genericos. Deben mapearse como `technology-tag` o
`code-concept-tag`.

## Exclusiones iniciales

Excluir por defecto:

- `.gradle/`
- `.idea/`
- `build/`
- `postgres_data/`
- `*.class`
- `*.jar`
- caches, locks y archivos generados

Incluir como `LabRef`, no como contenido principal:

- `build.gradle`
- `docker-compose.yml`
- `src/main/**`
- `http-pruebas/*.http`

## Relacion con Articulos

Un curso puede producir articulos, pero no debe nacer como articulo plano.

La conversion correcta es:

- Curso completo: `CourseResource`.
- Cada archivo numerado: `LessonResource`.
- Cada bloque `clase:` o `ejemplo:`: `ContentBlock`.
- Una publicacion web derivada: `ArticleResource` generado desde uno o varios
  bloques.

Esto permite que SST use el mismo sistema de tags para buscar, procesar y
publicar contenido sin perder la estructura original del curso.

