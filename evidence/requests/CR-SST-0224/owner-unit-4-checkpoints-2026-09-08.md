# CR-SST-0224 — Unidad 4: recorrido secuencial y checkpoints

Rol: evidencia de implementación local. Owner: control-plane.
Estado: unidad validada con fakes; request completo permanece running.
Se continúa la autorización local vigente sin publicar, desplegar o escribir Jira.

## Recursos owner

- Nuevo `src/app/article_processing/sequential.py`: contratos de derivación y
  checkpoint, puerto de almacenamiento y ejecutor de prefijo secuencial.
- Nuevo `tests/test_article_processing_sequential.py`: 14 casos con store y
  proveedor simulados.
- Actualizados: spec/guía del pipeline y test de inventario documental.

## Decisiones y revisión manual

Cada párrafo usa el contexto confirmado anterior. El guardado debe comparar
versión y agregar una entrada atómicamente; su readback se verifica antes de
avanzar. Reintentar recarga el prefijo, incluso tras perder el acuse de un
guardado exitoso. No se duplica la derivación confirmada. Llamadas concurrentes
al modelo pueden repetirse: no se afirma ejecución exactamente una vez.

El binding fija request, scope, source, prompt y límites. Un cambio dentro del
mismo run se rechaza. No sustituye autorización de Bend. Política inicial
`context-prefix-bytes-v1`: conservar categorías completas y procedencia; al
exceder presupuesto detener antes de confirmar, sin truncar ni compactar.

El resultado es un checkpoint, no síntesis final, resultado canónico ni memoria.
Faltan compactación/tokens, estado autoritativo de pausa/cancelación, síntesis y
procedencia final. El store in-memory solo existe en tests; no prueba durabilidad.

## Validación

- `scripts/check.py` owner: PASS, 243 tests y tres smokes simulados.
- 14 pruebas nuevas: orden, contexto, reintento, pérdida de acuse, fallo de
  escritura/proveedor, binding, presupuesto, corrupción, readback y CAS del fake.
- Tres mapas Mermaid owner: render PASS con versiones fijadas.
- `git diff --check` owner: PASS.
- `npm.cmd run check` control-plane: PASS después de registrar evidencia,
  794 lifecycles y 65 mapas; advertencias conocidas de histórico y bindings opcionales.

QA manual de última revisión: coherencia del código/contrato/mapas, límites
explícitos y ausencia de claims de finalización. No se ejecutó QA de usuario:
permanece reservado a MCP Chrome DevTools y datos creados por interfaz en 0227.

Siguiente unidad local: síntesis final y envelope de procedencia para ambos
modos, conservando finalización y persistencia canónicas en Bend. Cambios locales
sin commit, sin proveedor real y sin modificación de infraestructura.
