# CR-SST-0108 - Analisis de limite de payload para sesiones de extension

## Contexto

Durante QA manual de `CR-SST-0098` / `SST-30`, la extension logro capturar la
sesion localmente pero fallo al enviar la sesion a `node-auth`:

- endpoint observado: `POST /api/extension/sessions`;
- respuesta visible: `Internal Server Error.`;
- logs de Kubernetes en `node-auth`: `PayloadTooLargeError`;
- limite observado: `102400` bytes;
- tamanos observados sin contenido sensible: entre ~361 KB y ~618 KB.

No se preserva en evidencia el contenido de paginas privadas, snapshots PDF,
cookies, JWTs ni secretos.

## Decision tecnica

La mitigacion inmediata debe ser acotada al boundary afectado:

- mantener el limite default de Express para rutas generales del BF;
- agregar parser JSON con limite configurable solo para
  `/api/extension/sessions`;
- documentar el env `EXTENSION_SESSION_BODY_LIMIT`;
- mapear `entity.too.large` a `413 Request body too large`;
- no cambiar el contrato de `sst-bend` ni la persistencia de dominio SST.

Esta decision reduce superficie de abuso frente a subir el limite global de todo
el gateway.

## Escalabilidad

El envio JSON con `base64` de multiples PDFs es aceptable como mitigacion local
de corto plazo, pero no es la arquitectura final para sesiones grandes.

Follow-up recomendado:

- chunked upload, multipart o artifact storage;
- persistencia por tab/artifact con reintentos por item;
- error reporting por tab y no all-or-nothing;
- limite de tamano y conteo declarados por contrato.

## Subagentes

Se desplegaron subagentes de lectura acotada:

- `node-auth`: revisar configuracion de body parser, routes y capability owner.
- `sst-bend`: revisar contrato downstream y riesgos posteriores al BF.

La decision final queda en el agente principal por tocar ownership cross-repo y
contrato observable.
