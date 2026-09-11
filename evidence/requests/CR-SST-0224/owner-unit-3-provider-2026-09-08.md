# CR-SST-0224 — Unidad 3: frontera de proveedor

Rol: evidencia de implementación local. Owner: control-plane.
Estado: llamada aislada con fake validada, CR completo permanece running.
Continúa la aprobación local vigente, sin publicación, Jira o deployment.

## Recursos

Creados en sst-chatbot:
- `src/app/article_processing/provider.py`: puerto, mensajes inmutables,
  respuesta, límites y validación estricta de una llamada.
- `tests/test_article_processing_provider.py`: fake determinista y 27 pruebas.

Actualizados: spec `specs/architecture/article-processing-pipeline.yaml`, guía
`docs/architecture/article-processing-pipeline.md` y test de inventario owner.

## Resultado y revisión manual del contrato

La frontera devuelve AnalysisContent con hash del prompt. No devuelve run
completado, FINAL_DERIVATION, resultado persistido ni memoria aceptada.
Rechaza JSON inválido, múltiples objetos, claves duplicadas, versión ausente,
campos extra, tipos incompatibles, NaN y síntesis vacía. Arrays se normalizan
a tuplas, sin coerción de sus elementos. No hay reparación automática.

Estados truncated/refused y excepciones producen códigos saneados, sin exponer
detalles del proveedor ni reintentar. Se comprueba que una entrada inválida
no llama al fake. No se registran cuerpos de prompts o respuestas.

Límites explícitos: bytes de salida verificados tras recibir el texto; timeout
y tokens máximos de salida transmitidos al adaptador. El adaptador futuro debe
imponer esos límites en transporte. No se afirma cancelación de un adaptador
síncrono colgado, streaming acotado ni medición de tokens de entrada.

## Validación

- 27 tests nuevos: PASS.
- `scripts/check.py` owner: PASS, 229 tests y tres smokes simulados.
- Tres mapas owner renderizados: PASS con Mermaid 11.12.0 y jsdom 26.1.0.
- `git diff --check` owner: PASS.
- `npm.cmd run check` control-plane: PASS tras registrar evidencia, 794 lifecycles
  y 65 mapas; advertencias conocidas de excepción histórica y bindings opcionales.

No se ejecutó QA de usuario; sigue reservado a Chrome DevTools en CR-SST-0227.
No hubo proveedor real ni mutación de datos. Archivos locales sin commit.

## Continuidad

Siguiente unidad: contexto, checkpoints y recorrido secuencial con fakes,
presupuesto de entrada y procedencia. La llamada aislada no prueba recuperación
durable ni el procesamiento completo de artículos; Bend transport sigue en 0225.
