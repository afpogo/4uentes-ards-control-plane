# QA Manual Caso 1: Preview Privada Desactivada

## Entrada

- Superficie: Chrome QA aislado con extension `.output/chrome-mv3` vigente.
- Accion: captura explicita de la ventana con el toggle de previews privadas
  desactivado y modo `auto`.
- Pestanas procesadas: `5`.
- Contenido, titulos y URLs: no registrados.

## Resultado Observado Por El Usuario

- Sesion guardada localmente: PASS.
- Reintento/envio al BFF: PASS.
- Diferencia guardado-envio: aproximadamente un segundo.
- Calidad: `0` capturas visuales; `5` fallbacks PDF textual.
- Advertencias sanitizadas observadas en todas las pestanas:
  `captura visual no disponible` y `fallback PDF textual`.

## Disposicion

- Preservacion de sesion y degradacion textual: PASS.
- Captura visual en modo `auto`: FAIL para esta pasada; requiere diagnostico.
- Preview privada desactivada en extension: no se genero candidato por contrato
  local. La persistencia canonica del estado no puede afirmarse aun.

## Hallazgo De Entorno

- El cluster responde y sus pods estan `Running`, pero usa imagenes de backend,
  BFF y frontend anteriores al programa de previews.
- La base desplegada no contiene `article_preview_resolutions`.
- Por lo tanto, el envio exitoso demuestra compatibilidad de la cola/sesion con
  el runtime anterior, pero no valida el contrato E2E de preview de
  `CR-SST-0137` a `CR-SST-0140`.
- Este hallazgo se clasifica como reconciliacion de deploy requerida, no como
  defecto de persistencia del codigo local.

## Siguiente Diagnostico Seguro

1. Obtener el error sanitizado de `captureVisibleTab` sin imprimir imagen,
   contenido o URL.
2. Reconciliar el runtime local con las implementaciones actuales antes de
   afirmar estados `unavailable`, `rejected` o `available` en backend/frontend.

## Diagnostico Completado

- Probe sanitizado: `captureVisibleTab` devolvio que requiere `<all_urls>` o
  `activeTab`.
- Causa: `activeTab` cubre la pestana invocada por el usuario, no todas las
  pestanas que la extension activa despues mediante codigo.
- Decision de permiso pendiente: ver
  `evidence/requests/CR-SST-0103/visual-capture-permission-gap-2026-07-19.md`.
