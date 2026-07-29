# CR-SST-0089 - Analisis De Fuente De Cursos

## Contexto

Se reviso en modo read-only la fuente local de cursos indicada por el usuario.
No se modifico contenido de cursos ni repos hijos. Esta evidencia existe para
decidir si el modelo `learning-content` cubre los tags necesarios y si la
direccion de crecimiento de la solucion es util.

## Radiografia

Resultado observado:

- 86.585 archivos totales bajo la fuente local de cursos.
- Dominio fuerte de artefactos tecnicos y vendor/build:
  - `.js`: 37.997
  - `.ts`: 19.853
  - `.map`: 11.612
  - `.json`: 3.619
  - archivos sin extension: 3.375
  - `.md`: 2.305
  - `.txt`: 777
- Luego de excluir carpetas generadas o no documentales como `node_modules`,
  `dist`, `build`, `target`, `.git`, `.svn`, `.gradle`, `.idea`, `coverage`,
  `tmp`, `vendor`, `test`, `bin` y `classes`, quedaron 398 documentos humanos
  candidatos en `.txt`, `.md` y `.markdown`.

Lectura: la solucion seria pobre si intenta ingerir todo el arbol como texto.
La solucion es util si trabaja con manifest/selectors, exclusiones fuertes y
modo warning-first.

## Estructura De Cursos

La fuente no usa una unica forma de curso.

Hay cursos con `docs` en la raiz, cursos con `docs` anidados y cursos con
documentos sueltos. Ejemplos de cantidad de carpetas `docs` anidadas por curso:

| Curso | Carpetas `docs` observadas |
| --- | ---: |
| `javascript` | 7 |
| `CSS-html` | 3 |
| `typescript` | 2 |
| `react` | 2 |
| `devops` | 2 |
| `DATABASE` | 2 |
| `java` | 2 |
| `Node` | 1 |
| `AI` | 1 |
| `administracionServer` | 1 |

Decision: `CourseSource` no debe depender de un unico `docsPath`. El runtime
debe aceptar `documentSelectors` o globs controlados, manteniendo `docsPath`
como atajo simple cuando aplique.

## Prefijos Pedagogicos Confirmados

Prefijos principales encontrados en documentos humanos filtrados:

| Prefijo | Conteo | Lectura |
| --- | ---: | --- |
| `clase` | 3.821 | bloque narrativo principal |
| `ejemplo` | 1.080 | ejemplo o snippet explicado |
| `definicion` | 632 | definicion conceptual |
| `recordar` | 514 | memoria, repaso o advertencia suave |
| `code` | 335 | bloque de codigo |
| `titulo` | 291 | titulo de documento o seccion |
| `importante` | 196 | advertencia o nota destacada |
| `docs` | 186 | referencia documental externa |
| `nota` | 106 | nota explicativa |
| `image` | 102 | referencia a asset visual |
| `subt` | 93 | subtitulo o seccion interna |
| `resumen` | 11 | resumen de cierre o sintesis |

El set inicial de `CR-SST-0088` cubre la columna vertebral:
`clase`, `nota`, `recordar`, `ejemplo`, `definicion`, `image`, `docs` y
`code`.

Faltan como bloques de primera clase o aliases normalizados:

- `titulo`
- `subt`
- `subtitulo`
- `importante`
- `resumen`

## Falsos Positivos Y Ruido

Tambien aparecen prefijos como `name`, `id`, `title`, `port`, `password`,
`host`, `services`, `database`, `options`, `type`, `loader`, `plugins`,
`margin`, `color`, `createdat`, `allowNull` y similares.

Lectura: esos valores no son tags pedagogicos. Suelen venir de ejemplos de
codigo, YAML, JSON, SQL, config o tablas. Deben permanecer dentro de bloques
`code` o generar advertencias de clasificacion, no convertirse en `ContentBlock`
semanticos ni `TagDefinition`.

## Aliases Y Typos

Se observaron variantes que deben normalizarse sin perder evidencia original:

- `calse` -> `clase`
- `ejemolo` -> `ejemplo`
- `ejemplo usando` -> `ejemplo`
- `doc` -> `docs`
- `ejemplos` -> `ejemplo` cuando el contexto sea pedagogico
- `subt` -> `subtitulo`

La normalizacion debe conservar `rawKey` o equivalente para auditoria.

## Ajuste Recomendado Al Modelo

Para que la solucion crezca bien, `CourseSource` deberia aceptar:

```yaml
sourceType: "course"
rootRef: "TODO"
docsPath: "docs"
documentSelectors:
  includeGlobs: []
  excludeGlobs: []
assetSelectors:
  includeGlobs: []
exclusionPolicy:
  generatedLabsExcludedByDefault: true
  ignoredPaths: []
prefixAliasPolicy:
  allowed: true
  aliases: []
```

`docsPath` queda como atajo simple. `documentSelectors` permite cursos con
documentacion anidada o distribuida.

## Decision De Direccion

La direccion actual es correcta si el producto se mantiene como:

- importador gobernado por manifest/selectors;
- preview antes de persistir;
- normalizador semantico de bloques;
- generador de sugerencias de tags, no creador automatico de taxonomia;
- motor warning-first para typos, assets faltantes y ruido tecnico.

La direccion seria pobre si se convierte en:

- parser generico de cualquier archivo;
- crawler de carpetas sin manifest;
- generador automatico de tags persistidos;
- ingestor de `node_modules`, builds, proyectos ejecutables y configs como si
  fueran contenido pedagogico.
