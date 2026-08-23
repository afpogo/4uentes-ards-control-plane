# Inicio de ejecucion de CR-SST-0206

## Autorizacion y dependencias

El usuario autorizo el 2026-08-23 actualizar Jira y avanzar al siguiente
lifecycle. El siguiente lifecycle declarado por `CR-SST-0205` y
`CR-SST-0211` es `CR-SST-0206`.

Las dependencias `CR-SST-0202`, `CR-SST-0204` y `CR-SST-0211` estan `done`.
La mutacion de `sst-fend` queda habilitada solamente despues de fusionar este
lifecycle `running`.

## Slice owner

- Owner unico: `sst-fend`.
- Ambiente: development.
- Consumir las operaciones HTTP de retencion exclusivamente mediante el facade
  de `4uentes-auth` publicado por `CR-SST-0211`.
- Mostrar estado Temporal / Guardada en SST y exigir una accion explicita para
  guardar.
- Separar limpiar este dispositivo, finalizar temporal y eliminar de SST.
- Mantener contenido en memoria de aplicacion y solamente una referencia opaca
  no sensible en estado de sesion.
- Validar teclado, labels accesibles y confirmaciones destructivas.

## Limites

No se autoriza deployment, produccion, Jira fuera del lote enumerado, mutacion
de otros repos ni habilitacion silenciosa de persistencia. Owner specs, docs y
tests son obligatorios; el checkout canonico sucio debe preservarse.
