# Preparación del pipeline de artículos — CR-SST-0224

Rol primario: plan de ejecución propuesto. Owner: control plane.
Estado: preparado para revisión; implementación owner pendiente.
Alcance: CR-SST-0224 y reconciliación documental posterior a PR #261.

## Fuentes y readback

- Lifecycle: `requests/running/CR-SST-0224-implement-article-processing-agent-pipeline.yaml`.
- Contrato: `evidence/requests/CR-SST-0220/article-agent-processing-contract-v1.yaml`.
- Mapa de gates y límites: [preview existente](execution-authorization-preview-2026-08-29.md).
- PR #261 fusionado: `a7ec111b2edd709e5b4d710d622ede2062679032`.
- Base de esta preparación: `d84d1f672efae0acfa94d1dab4626b8d2f85230a`.
- Se reutiliza el worktree limpio de 0224 con rama
  `agent/cr-sst-0224-owner-preparation`; se preserva la rama fusionada.

La corrección de la iniciativa restaura la mención del lote consumido
CR-SST-0233 / SST-125 que se perdió en el merge manual. No cambia Jira.

## Preflight actualizado

El 2026-09-07 se refrescó `sst-chatbot origin/develop`:
`5b96bbb4c08731785f007ecaabd9e8c03bc88283`. El checkout está limpio.
No hay rama 0224 en las refs locales consultadas ni módulo
`src/app/article_processing/` en el árbol canónico. El owner dispone de
prompts, proveedores, contratos y fakes reutilizables.

Jira Work respondió correctamente. La búsqueda exacta de CR-SST-0224 en
summary no encontró issues. La búsqueda amplia en texto encontró SST-123
como referencia histórica, no como identidad de 0224.
SST-122 es Tarea, En curso, bajo Epic SST-105. SST-123 está Finalizada,
resolución Listo. SST-125 es Subtask de SST-122, Tareas por hacer,
sin resolución. Ninguna escritura se ejecutó.

## Implementación propuesta

| Unidad | Superficie owner prevista | Verificación |
| --- | --- | --- |
| Contrato y documentación | specs del pipeline, docs técnicas, índices y mapas owner | revisión contra contrato V1 |
| Prompts | catálogo privado y snapshots inmutables | default abierto y mirada custom distinguibles |
| Ejecución | `src/app/article_processing/` | ambos modos, salida validada y límites |
| Recuperación | checkpoints y contexto acumulado acotado | fallo conserva último resultado confirmado |
| Seguridad | composición y frontera del proveedor | artículo/contexto no cambian guardrails; trazas sin contenido privado |
| Entrega | tests con fakes y `scripts/check.py` | checks owner y full check control plane |

En modo completo se rechaza exceso de tamaño antes de llamar al proveedor.
En modo secuencial se procesan índices ascendentes y sólo se agrega contexto
tras validar la derivación. Cambiar de prompt crea una ejecución distinguible.
No se adopta memoria automáticamente; Bend conserva persistencia y decisión
de aceptación. La integración durable con Bend pertenece a CR-SST-0225.

El runbook técnico de ejecución se concretará en el owner con sus specs.
Esta preparación define decisiones y criterios, no comandos de implementación.
Se reutiliza el mapa de gates enlazado; no se introduce otra arquitectura.

## Lote Jira preparado

Propuesta, todavía sin autorización de escritura:

1. Crear una Subtask bajo SST-122 con summary
   `[SST][CR-SST-0224] Implement governed article processing agent pipeline`.
2. Leer el resultado y verificar identidad, parent, tipo y estado inicial.
3. Consultar transiciones del issue creado y aplicar 21 hacia En curso sólo
   si sigue disponible con ese destino; de otro modo detener la transición.
4. Leer el estado final. No añadir comentarios ni otras mutaciones.

Descripción propuesta: implementar análisis completo y secuencial de artículos
con snapshots de prompt, contexto acotado, checkpoints y validación estricta;
publicar ARDS/SDD owner, mapas y tests con proveedor simulado. Excluye transporte
durable Bend, UX Fend, adopción automática de memoria y deployment.

## Publicación owner y QA

Se inspeccionó `sst-chatbot:.github/workflows/build-publish-development.yml`.
El evento pull_request hacia develop valida y construye sin publicar imagen.
El push a develop publica imagen e intenta actualizar el tag GitOps en Infra.
Por eso preparar/publicar el PR owner y fusionarlo tienen efectos diferentes;
la promoción debe considerar explícitamente imagen e Infra.

QA de esta unidad: revisión documental de identidad, alcance y estados.
QA de usuario permanece pendiente en CR-SST-0227 mediante Chrome DevTools,
después de integración y UX, con datos creados por interfaz.
Validación del conjunto el 2026-09-07: `npm.cmd run check` PASS, 794
lifecycles, 147 gates owner y 61 mapas, cero fallos. `git diff --check` PASS.
Warnings: excepción histórica congelada CR-SST-0016 y bindings locales
opcionales ausentes. La revisión documental confirma que el lote SST-125
consumido vuelve a figurar y que owner/Jira siguen pendientes de autorización.
