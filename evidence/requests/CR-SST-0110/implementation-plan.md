# CR-SST-0110 - Plan de implementacion

## Objetivo

Adoptar la hoja de `LearningWorkspace` dentro de la creacion de articulos en
`sst-fend` cuando el tipo seleccionado sea `Texto`.

La ruta independiente `/learning` queda como superficie de QA/laboratorio. El
camino de producto queda en Creacion de articulo -> tab Texto.

## Limite

- Modificar solamente UI, pruebas y ARDS/SDD owner de `sst-fend`.
- Modificar solamente request/evidencia del control-plane.
- No modificar `node-auth`; CR-SST-0109 ya expuso las rutas BFF.
- No modificar `sst-bend`; parser/import queda como request inmediato
  posterior.
- Mantener `LearningWorkspace` como preview-only hasta aceptacion explicita.
- Mantener la persistencia del articulo y el contexto aceptado de
  `LearningWorkspace` como acciones explicitas separadas.

## Pasos De Implementacion

1. Extraer el cuerpo de la hoja de `/learning` a un componente frontend
   reusable.
2. Mantener `/learning` respaldado por ese componente reusable.
3. Habilitar `ArticleCreateFlow` para `payloadKind === "text"`.
4. Renderizar el formulario de articulo de texto y el panel de
   `LearningWorkspace` dentro de la misma hoja de creacion Texto.
5. Hacer que el panel de `LearningWorkspace` consuma titulo, referencia y
   cuerpo desde el borrador del formulario de articulo.
6. Ajustar la validacion del origen de articulos Texto para borradores
   manuales.
7. Actualizar pruebas frontend enfocadas.
8. Actualizar docs/specs ARDS/SDD owner de `sst-fend`.
9. Ejecutar checks de `sst-fend` y enforcement del control-plane.

## Aplicacion De Politicas

- Politica de autoridad de documentacion owner: obligatoria. Las docs/specs
  owner de `sst-fend` deben actualizarse antes del cierre local.
- Politica de limite arquitectonico: no debe haber llamadas directas desde
  frontend a `sst-bend`; se usa solo el BFF de `node-auth` para
  `LearningWorkspace`.
- Politica de atomizacion/delegacion: no se despliegan subagentes para esta
  edicion de integracion porque el riesgo principal esta en alinear estado
  entre componentes. La validacion se refuerza con pruebas enfocadas y
  `npm.cmd run check`.

## Seguimiento Inmediato

Abrir un request separado para la expansion de parser/import en `sst-bend`
despues de validar esta adopcion frontend.
