# CR-SST-0224 — Unidad 2: prompt privado y composición

Rol: evidencia de implementación local. Owner: control-plane.
Fecha: 2026-09-08. Estado: composición implementada; pipeline completo pendiente.
Se continúa el plan local aprobado, en el mismo worktree y rama del owner.

## Entrega

- `src/app/prompts/catalog/tasks/article_analysis.yaml`: prompt draft registrado
  como `task.article_analysis@1`; perfil abierto `open-general-analysis@1`.
- `src/app/prompts/registry.py`: incorporación en la allowlist explícita.
- `src/app/article_processing/prompts.py`: composición de seis capas, validación
  del snapshot, selección de párrafo desde la secuencia y límites explícitos.
- `tests/test_article_processing_prompts.py`: 15 tests nuevos.
- Spec y guía owner del pipeline actualizadas, con mapa de composición y
  distinción entre comportamiento local implementado y ejecutores pendientes.
- Test de inventario owner actualizado al estado de composición implementada.

No se copian cuerpos de prompt ni datos privados a esta evidencia.
Las instrucciones del usuario y el contenido entran como JSON en mensajes
human. No se evalúan como plantilla ni crean mensajes privilegiados. El esquema
se deriva del contrato tipado y permanece bajo control del desarrollador.

## Límites y QA de última revisión

Revisión del código y contrato: versiones desconocidas rechazadas; sin defaults
silenciosos a versiones nuevas; instrucciones ligadas a su hash; modo completo
sin contexto previo; párrafo resuelto desde el snapshot; sin truncado de entrada.
Los límites obligatorios son bytes UTF-8, no presupuestos de tokens. Falta la
política de tokens del proveedor y la verificación del contexto vía checkpoint.

Tests focalizados de contratos, composición y motor existente: 44 PASS.
`scripts/check.py` owner: PASS, 202 tests y tres smokes con proveedores simulados.
La separación de roles se prueba determinísticamente, no se afirma inmunidad
universal a prompt injection ni exactitud factual de un modelo.

Render de los tres mapas owner: PASS, Mermaid 11.12.0 y jsdom 26.1.0.
Full `npm.cmd run check` del control-plane: PASS, 794 lifecycles y 65 mapas;
advertencias conocidas de CR-SST-0016 histórico y bindings locales opcionales.
`git diff --check` owner: PASS.
No hubo llamadas a proveedores reales, nueva persistencia, cambios HTTP, Jira,
publicación Git o despliegues. Los archivos permanecen locales sin commit.

## Evolución de agentes señalada por el usuario

Identidad, estilo, tarea, mirada y memoria pueden orientar un futuro modelo de
agentes SST. Esta observación no amplía CR-SST-0224: procesar un artículo crea
una ejecución acotada, no una identidad persistente de agente ni una personalidad
de `/chat`. La conversación completa no se incluye automáticamente en el prompt.

## Siguiente unidad

Adaptador y normalización de salida con proveedor falso, ejecución acotada,
presupuesto de tokens, contexto/checkpoints y procedencia. Siguen dentro del
plan local aprobado. La integración durable pertenece a CR-SST-0225 y el QA de
usuario posterior permanece exclusivamente con MCP Chrome DevTools.
