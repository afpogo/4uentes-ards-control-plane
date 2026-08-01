# CR-SST-0103 - readiness del stack local actual

Fecha: 2026-07-23  
Estado: listo para retomar QA después de recargar la extensión

## Ruta elegida

El QA integrado usará el stack Compose local que monta directamente los
working trees actuales:

- frontend: `http://127.0.0.1:4090`;
- BFF: `http://127.0.0.1:4000`;
- backend: puerto local `3005`;
- Postgres local con `article_preview_resolutions` aplicada.

Se usa `127.0.0.1` para no mezclar cookies con el cluster anterior servido en
`http://localhost:8088`. No se modificó GitOps, kind ni se publicaron imágenes.

## Smokes sanitizados

- frontend actual: HTTP `200`;
- JWKS del BFF actual: HTTP `200`;
- rutas de sesión sin token: HTTP `401` esperado, directa y mediante el proxy;
- backend sin token: HTTP `401` esperado;
- tabla canónica `article_preview_resolutions`: presente.

Los contenedores usan bind mounts y watchers, por lo que no requieren una nueva
imagen para consumir el código owner actual.

## Checks

- `sst-bend`: `npm.cmd run check` terminó con código `0`; el harness declara
  cobertura protegida parcial porque no se inyectó `SMOKE_JWT` en consola.
- `sst-bend`: `npm.cmd run test:article-preview-resolution` PASS.
- `node-auth`: `npm.cmd run check` PASS.
- `sst-fend`: pendiente del check posterior a la corrección de normalización
  identificada bajo `CR-SST-0140`.
- `sst-extension`: pendiente del check posterior al cambio de permiso bajo
  `CR-SST-0121`.

La cobertura autenticada omitida por el check de backend será ejercitada por la
persona en Chrome; ningún JWT se copiará a evidencia o consola compartida.

## Límite de la evidencia

Esta ejecución valida la integración con el código local actual. No demuestra
que el despliegue canónico de `localhost:8088` haya adoptado esas versiones; esa
reconciliación queda para una acción posterior con owner de infraestructura.

Cambiar la base URL de la extensión limpia su sesión y colas anteriores por
diseño. La evidencia del caso previo ya quedó registrada antes del cambio.
