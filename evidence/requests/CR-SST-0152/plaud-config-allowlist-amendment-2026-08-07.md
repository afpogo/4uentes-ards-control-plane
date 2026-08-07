# Enmienda De Configuracion Plaud

## Hallazgo

La recomposicion de `sst-bend` identifico que la convergencia Plaud usa dos
parametros nuevos: `PLAUD_PROCESSING_STALE_MS` y `PLAUD_MAX_ATTEMPTS`. El
manifiesto ya autorizaba el runtime, el repositorio, las pruebas y la
documentacion de esa entrega, pero omitia los dos archivos que exponen esos
parametros.

## Decision

Se agregan al `path_allowlist` de `sst-bend`:

- `.env.example`, para documentar las variables sin incluir valores privados;
- `config/index.js`, para leerlas con los defaults documentados de `300000`
  milisegundos y `5` intentos.

La enmienda no agrega una capacidad ni cambia el alcance funcional. Completa
la configuracion de `plaud-convergence` ya aprobada y mantiene todas las
exclusiones de preview, secretos, evidencia privada y workflows historicos.

## Gate

El merge de esta enmienda habilita esos dos paths para la recomposicion de
`sst-bend`. No autoriza el merge del repositorio hijo, que conserva su gate
humano independiente.
