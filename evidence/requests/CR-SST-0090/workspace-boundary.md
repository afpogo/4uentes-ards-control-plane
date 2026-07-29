# CR-SST-0090 - Boundary De LearningWorkspace

## Contexto

`CR-SST-0090` adopta `SST LearningWorkspace` como contenedor runtime de
aprendizaje gobernado por cuenta y usuario.

El modelo se apoya en requests existentes:

- `CR-SST-0030`: SST no crea un ARDS/SDD por usuario.
- `CR-SST-0031`: la memoria interna de usuario usa eventos, hechos,
  intenciones, propuestas y recall.
- `CR-SST-0088`: `CourseSource`, `WebArticleSource`, `KnowledgeDocument` y
  `ContentBlock`.
- `CR-SST-0089`: preview/import con persistencia `preview-only` por defecto.

## Decision De Modelo

`LearningWorkspace` vive bajo `SST user internal memory`.

No es `project ARDS/SDD` y no reemplaza el ARDS/SDD local de ningun repo. Es un
contenedor runtime inspirado por buenas practicas ARDS/SDD, pero no canonico.

## Diferencias

| Concepto | Autoridad | Proposito | No Debe Hacer |
| --- | --- | --- | --- |
| `project ARDS/SDD` | Repos y control-plane | Gobernar servicios, requests, specs, estado y evidencia de producto | Ser clonado por usuario |
| `SST user internal memory` | `sst-bend` | Persistir eventos, hechos, intenciones, propuestas y recall scoped | Redefinir catalogos o requests de proyecto |
| `LearningWorkspace` | `sst-bend` | Agrupar sources, documentos aceptados, assets, labs, specs de aprendizaje, warnings, progreso y memoria asociada | Llamarse "ARDS/SDD de usuario" |

## Scope

Cada workspace debe estar filtrado por:

- `tenant_id`
- `account_id`
- `user_id`

Estados:

- `active`
- `paused`
- `archived`

Creacion:

- preferida: workspace vacio al crear cuenta si existe hook estable;
- fallback: creacion lazy en primer uso.

## Contenido Permitido

`LearningWorkspace` puede contener referencias a:

- `LearningSource` aceptadas;
- `KnowledgeDocument` aceptados;
- `ContentBlock` aceptados;
- `AssetRef` para imagenes, scripts, installers y recursos auxiliares;
- `LabRef` para labs o proyectos como `springBoot-2`;
- `LearningSpec` como contrato de contenido de aprendizaje;
- warnings y provenance de import;
- `user_memory_event`;
- `user_memory_fact`;
- `user_memory_intention`.

## Regla Para Specs

`specs/*.yaml|yml` dentro de un curso se modela como `LearningSpec`.

Ese archivo es contrato del curso o contenido de aprendizaje. No es spec
canonica del repo funcional ni modifica el ARDS/SDD del proyecto.

## Prohibiciones

Este boundary no autoriza:

- llamar el modelo "ARDS/SDD de usuario";
- clonar `catalog/`, `requests/`, `state/` o `evidence/` por usuario;
- modificar `4uentes-ards-core`;
- modificar `sst-bend`, `sst-chatbot`, `sst-fend` o repos hijos desde este CR;
- persistir previews no aprobados en recall durable;
- crear `TagDefinition` automaticamente;
- ingerir `node_modules`, builds, caches, proyectos generados o configs como
  contenido pedagogico ciego.
