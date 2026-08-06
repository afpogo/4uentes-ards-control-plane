# CR-SST-0113 - Analisis Previo A Implementacion

## Objetivo

Preparar la implementacion de la primera hoja editable en `sst-fend` respetando
el contrato UX de `CR-SST-0112`, la separacion `ArticleTag` /
`LearningContentTag` de `CR-SST-0111` y la politica de owner documentation.

## Alcance Permitido

`CR-SST-0113` puede modificar:

- UI runtime de `sst-fend` para la tab `Texto`;
- owner docs/specs de `sst-fend`;
- evidencia del control-plane.

No debe modificar:

- persistencia backend;
- `node-auth`;
- `sst-bend`;
- parser/import avanzado;
- tagging contextual sobre seleccion, salvo preparacion no funcional para el
  siguiente CR.

## Readiness Local Confirmado

- `sst-fend` existe en bindings locales.
- `sst-fend/AGENTS.md` existe.
- `sst-fend/docs/38-learning-workspace-frontend.md` existe.
- `sst-fend/specs/38-learning-workspace-frontend.yml` existe.
- `CR-SST-0113` declara `child_repo_mutation_allowed: true`.
- `CR-SST-0113` declara owner docs planificados.

## Riesgos Iniciales

- Implementar una hoja que siga pareciendo formulario.
- Mezclar tags del articulo con anotaciones de contenido.
- Introducir seleccion/tagging contextual antes de `CR-SST-0114`.
- Omitir owner docs en `sst-fend`.
- Cerrar con checks del hijo pero sin `npm.cmd run check` del control-plane.

## Gates Antes De Editar `sst-fend`

- Integrar hallazgos de subagentes.
- Confirmar rutas exactas de codigo y docs a tocar.
- Registrar plan de archivos.
- Validar que no se requiere modificar BFF/API.

## Hallazgo Subagente ARDS/SDD

El plan esta listo para implementar siempre que el corte se mantenga limitado a
hoja editable base y preparacion verificable para selecciones futuras. No debe
adelantar tagging contextual, DTOs granulares, persistencia backend ni render
Markdown/template.

## Hallazgo Subagente `sst-fend`

`sst-fend` esta preparado para el cambio. Ya existen `LearningWorkspace`,
capability inbound, ruta `/learning`, hoja reusable, cliente BFF, tipos y
adopcion en articulo `text`. La condicion principal es actualizar owner docs y
orchestrator links del hijo para `CR-SST-0113`, manteniendo `node-auth` como BFF
y dejando parser/import backend fuera de alcance.

## Gates De Cierre

- `sst-fend npm.cmd run check`.
- Owner docs/specs de `sst-fend` actualizados.
- Evidencia de cambios en control-plane.
- `4uentes-orchestor npm.cmd run check`.
