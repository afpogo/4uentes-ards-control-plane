# CR-SST-0224 — Unidad 5: síntesis final candidata

Rol: evidencia local del control-plane. Estado: implementado con fakes;
no es cierre del CR ni aceptación de un resultado canónico.

## Recursos owner

- Nuevo `src/app/article_processing/finalization.py`: síntesis y FinalCandidate.
- Nuevo `src/app/prompts/catalog/tasks/article_final_stage.yaml`: etapa privada
  versionada, sin copiar su cuerpo a evidencia ni Jira.
- Nuevo `tests/test_article_processing_finalization.py`: 12 pruebas.
- Actualizados provider, registro de prompts, spec, guía y test de inventario.

## Revisión manual y límites

Full document conserva contexto vacío versión 0 y referencia a fuente completa.
Secuencial requiere checkpoint completo y matching binding; sintetiza las
derivaciones confirmadas y verifica readback sin cambios después de la llamada.
La candidata incluye procedencia de run, artículo, fuente, prompt y párrafos.

Estados distintos de running se rechazan antes del proveedor. run_status es
entrada del owner confiable, no autorización del usuario. Bend debe verificar
estado y unicidad de aceptación atómicamente: la validación local no resuelve
cancelaciones concurrentes ni persistencia. Reintentos conservan candidate_id,
pero una nueva respuesta puede diferir; Bend debe detectar el conflicto.

No hay FINAL_DERIVATION canónica ni ARTICLE_PROCESSING_RESULT persistido,
aceptación de memoria, proveedor real, nueva escritura Jira o deployment.
Presupuesto de tokens, transporte real y ciclo de pausa/cancelación siguen
pendientes antes de declarar el pipeline completo. El store fake no es durable.

## Validación

- `scripts/check.py` owner: PASS, 255 tests y tres smokes simulados.
- 12 pruebas nuevas: modos, procedencia, identidad repetible, estados inválidos,
  checkpoint incompleto, respuesta inválida y cambio concurrente de checkpoint.
- Tres mapas owner renderizados: PASS con versiones fijadas.
- `git diff --check` owner: PASS.
- `npm.cmd run check` control-plane: PASS tras esta evidencia, 824 lifecycles,
  71 mapas y advertencias conocidas de histórico y bindings opcionales.

El QA de usuario sigue pendiente y reservado a MCP Chrome DevTools, sin seeders
ni DB scripts. Se continúa el alcance de implementación local aprobado.
