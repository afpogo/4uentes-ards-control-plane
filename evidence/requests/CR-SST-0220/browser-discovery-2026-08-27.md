# Descubrimiento de navegador sanitizado — 2026-08-27

## Alcance

Exploración manual previa realizada con Chrome DevTools MCP sobre la instancia local, sin scripts de base, seeders ni escrituras directas. Esta evidencia describe el punto de partida; no constituye el QA final de `CR-SST-0220`.

## Observaciones

- La sesión autenticada llegó a la interfaz de SST.
- La creación de artículos reconoció correctamente un fixture sintético de tres párrafos antes de guardar.
- El intento de guardado realizado con autorización del usuario recibió `503` en `POST /api/articulos`; el artículo no quedó persistido y no se reintentó automáticamente.
- Las consultas del catálogo de artículos y tags mostraron respuestas `500`, `503` o `504` durante la sesión.
- La vista existente `SST Workspace` corresponde a un preview de contexto de Learning y no representa la superficie de procesamiento de artículos acordada.
- El preview de un párrafo respondió `500` en la ruta de Learning y la UI mostró un error recuperable.
- No se ejecutaron acciones de aceptar, rechazar ni adoptar memoria.

## Decisión derivada

La función debe ubicarse en el detalle de un artículo persistido mediante `Procesar con agente`, con selección explícita entre documento completo y lectura secuencial. El QA final no puede comenzar hasta que la creación y lectura de artículos estén saludables desde la UI.

## Privacidad

Este documento omite identidad, credenciales, tokens, cuerpos privados y capturas. Cualquier captura previa que pudiera mostrar un secreto queda excluida de la evidencia gobernada y no debe publicarse.
